<template>
    <div class="auth-container"></div>
</template>

<script>
    import { URLencode } from '@/utils/util'
    import { mapActions } from  'vuex'
    import { openIdLogin } from '@/api/auth-api'
    import { getCookie } from  '@/utils/util'
    export default {
        name: "auth",
        data() {
            return {
                webUrl:'www.ynt.ai'
            }
        },
        components: {},
        methods: {
            ...mapActions([
                'setOpenId',
                'setUserToken',
                'setUserInfo'
            ]),
            turnTo(){
                if(this.$route.query.redirect
                        && this.$route.query.redirect.indexOf('/login') < 0
                        && this.$route.query.redirect !='/'){
                    this.$router.push({ path: this.$route.query.redirect });
                }else{
                    this.$router.push({ path:'/home/account'});
                }
            },
            async handleOpenIdLogin(){
                await this.setOpenId(this.$route.query.auth_openId);
                let _data = {
                    openId:this.$route.query.auth_openId
                };
                openIdLogin(_data).then( async (data) =>{
                    await this.userInfo(data.data);
                    await this.userToken(data.data.token);
                    this.turnTo();
                }).catch( err => {
                    this.$router.push({ path:'/login' });
                })
            }
        },
        computed: {},
        created() {
            if(!!!this.$store.state.user.openId
                    && !!!this.$route.query.auth_openId){
                let ua = window.navigator.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i) == 'micromessenger'){// 跳转到微信授权页面
                    window.location.href = this.webUrl + '/weixin/auth/getOpenId?url='+ URLencode(api_config.authorUrl + this.$router.currentRoute.fullPath) + '&type=1'
                }else {
                    this.$router.push('/login')
                }
            }else{// 如果有token 但是vuex中没有用户登录信息则做登录操作
                this.handleOpenIdLogin()
            }
        }
    }
</script>

<style lang="less"></style>