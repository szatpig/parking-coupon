<template>
    <div class="auth-container"></div>
</template>

<script>
    import { URLencode,getCookie } from '@/utils/util'
    import { mapActions } from  'vuex'
    import { openIdLogin } from '@/api/auth-api'
    import { getAuthorize } from '@/api/common-api'
    import site from '@@/config'
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
                    && this.$route.query.redirect !='/'
                    && this.$route.query.redirect.indexOf('/register') < 0){
                    this.$router.push({ path: this.$route.query.redirect });
                }else{
                    this.$router.push({ path:'/home/coupon'});
                }
            },
            async handleOpenIdLogin(){
                let _data = {
                    openId:this.$route.query.openId
                };
                try {
                    await this.setOpenId(this.$route.query.openId || '');
                    const data = await openIdLogin(_data);
                    await this.setUserInfo(data.data);
                    await this.setUserToken(data.data.token);
                    this.turnTo();
                }catch (e) {
                    if(e.status === 5011){
                        if(this.$route.query.redirect.indexOf('/register') > -1){
                            this.$router.replace({ path: this.$route.query.redirect });
                        }else{
                            this.$router.replace({
                                path:'/register',
                                query:{
                                    openId:this.$route.query.openId
                                }
                            })
                        }
                    }else if(e.status === 5012){
                        this.$router.replace({
                            path:'/login',
                            query:{
                                openId:this.$route.query.openId
                            }
                        })
                    }
                }
            },
            getAuthorize(){

            }
        },
        computed: {},
        created() {
            console.log(this.$store.state.user.openId , this.$route.query.openId)
            if(!!!this.$store.state.user.openId && !!!this.$route.query.openId){
                // 跳转到微信授权页面
                let _data ={
                    url:'/wx/mp/etc/wechat/getAuthorize?url='+ URLencode(location.origin + location.pathname + '?redirect='+ this.$route.query.redirect)
                }
                // getAuthorize(_data)
                console.log(location.origin + _data.url);
                window.location.href = location.origin + _data.url

            }else{// 如果有token 但是vuex中没有用户登录信息则做登录操作
                this.handleOpenIdLogin()
            }
        }
    }
</script>

<style lang="less"></style>