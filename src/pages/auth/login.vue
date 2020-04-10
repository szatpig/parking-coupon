<template>
    <div class="login-container">
        <p class="login-logo">
            <img src="../../images/logo.png" alt="logo">
        </p>
        <div class="login-form">
            <van-cell-group>
                <van-field
                    maxlength="11"
                    type="tel"
                    v-model.trim="user.phoneNumber"
                    placeholder="请输入您的手机号"
                    @input="handlePhoneChange"
                    @blur="handelPageAdjust" />
                <van-field
                    v-model.trim="user.code"
                    maxlength="6"
                    type="tel"
                    placeholder="请输入验证码"
                    @input="handleCodeChange"
                    @blur="handelPageAdjust">
                    <ynt-code slot="button" @handleSend="handleSend" :disabled="disabled" ref="timer" :second="second"></ynt-code>
                </van-field>
                <van-button
                    :disabled="!(checked && user.phoneNumber && user.code && user.phoneNumber.length == 11)"
                    class="login-submit"
                    size="large"
                    @click="handleLogin">马上体验</van-button>
                <p class="login-tips">
                    <van-checkbox v-model="checked"></van-checkbox>
                    <span class="login-tips-text">同意<router-link to="/serAgreement">《意电助理用户服务协议》</router-link></span>
                </p>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
    import { sendSms,userLogin } from '@/api/auth-api'
    import { mapActions } from  'vuex'
    import YntCode from '@/components/YntCode'
    // import { getCookie,delCookie } from  '@/utils/util'
    export default {
        name: "login",
        data() {
            return {
                user:{
                    phoneNumber:'',
                    code:'',
                    openId:''
                },
                checked:true,
                disabled: false,
                second: 60
            }
        },
        components: {
            YntCode
        },
        methods: {
            ...mapActions([
                'setUserToken',
                'setUserInfo'
            ]),
            handlePhoneChange(val){
                this.user.phoneNumber = val.replace(/[^\d]/g,'');

            },
            handleCodeChange(val){
                this.user.code = val.replace(/[^\d]/g,'');
            },
            handleSend(){
                // _czc.push(['_trackEvent', '验证码', '获取', '验证码获取','1','handleSend']);
                let reg = /^1[3456789]\d{9}$/;
                if(!reg.test(this.user.phoneNumber) || this.user.phoneNumber.length != 11){
                    this.$toast({
                        message: '请输入11位合法手机号',
                    });
                    return false;
                }

                let _data = {
                    phoneNumber: this.user.phoneNumber,
                    type:'wxmp'
                };
                sendSms(_data).then(data => {
                    this.disabled = true;
                    setTimeout(() =>{
                        this.$refs.timer.run();
                        this.disabled = false;
                    },200);
                })
            },
            handleLogin(){
                // _czc.push(['_trackEvent', '用户登录', '登录', '用户名、验证码登录','1','handleSend']);
                let reg = /^1[3456789]\d{9}$/;
                if(!reg.test(this.user.phoneNumber) || this.user.phoneNumber.length != 11){
                    this.$toast({
                        message: '请输入11位合法手机号',
                    });
                    return false;
                }
                if(!this.user.code){
                    this.$toast({
                        message: '验证码不能为空 >_<',
                    });
                    return false;
                }
                // this.user.openId = sessionStorage.getItem('openId')
                this.user.openId = this.$route.query.openId;
                this.$route.query.openId &&(sessionStorage.setItem('openId',this.$route.query.openId));
                userLogin(this.user).then((data) => {
                    // await this.setUserInfo(data.data);
                    // await this.setUserToken(getCookie('token'));
                    // this.$router.replace({
                    //     path:'/home/tel/setting'
                    // });
                    if(data.data.forwardSetting == '1'){
                        this.$router.replace({
                            path:'/home/tel/setting'
                        });
                    }else{
                        this.$router.replace({
                            path:'/home/account'
                        });
                    }
                })
            },

            //ios12 页面回弹底部空白 bug
            handelPageAdjust(){
                let ua = window.navigator.userAgent;
                if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                    setTimeout(()=>{
                        document.activeElement.scrollIntoViewIfNeeded(true);
                    },100)
                }
            }
        },
        computed: {},
        mounted(){
        },
        created() {
            //存储初始化
            let _openId = sessionStorage.getItem('openId');
            this.setUserInfo({});
            this.setUserToken(null);
            sessionStorage.clear();
            _openId &&(sessionStorage.setItem('openId',_openId))
        }
    }
</script>

<style lang="less">
    .login-container{
        background: url("../../images/logo-bg.png") center 100% no-repeat;
        background-size: contain;
        flex: 1;
        height: 100%;
        .login-logo{
            margin : 108px auto 80px;
            font-size: 50px;
            color: #3F8FFE;
            text-align: center;
            img{
                width: 204px;
                height: 172px;
            }
        }
        .login-form{
            margin: 0 72px;

            //vant样式更新
            .van-cell-group{
                background-color: transparent;
            }
            .van-hairline--top-bottom::after{
                border: 0;
            }
            .van-cell{
                padding: 24px 0;
                input[type=text],input[type=tel]{
                    font-size: 32px;
                }
                &:after{
                    content: '';
                    position: absolute;
                    pointer-events: none;
                    box-sizing: border-box;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    -webkit-transform: scaleY(.5);
                    transform: scaleY(.5);
                    border-bottom: 2.5px solid #ebedf0;

                }
            }
            .login-submit{
                line-height: 88px;
                height: 88px;
                margin-top: 80px;
                color: #fff;
                background-color: @primary-color;
                border-radius: 8px;
                &[disabled]{
                    background-color: #B2D2FF;
                }
            }
            .login-tips{
                margin-top: 32px;
                margin-bottom: 120px;
                font-size: 26px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                .van-checkbox{
                    margin-right: 10px;
                    flex-shrink: 0;
                    .van-checkbox__icon {
                        height: 34px;
                        line-height: 34px;
                        .van-icon{
                            width: 34px;
                            height: 34px;
                            border-radius: 999px;
                        }
                    }
                    .van-checkbox__label {
                        line-height: 34px;
                    }
                }
                .van-checkbox__icon--checked .van-icon{
                     color: @primary-color;
                     border-color: @primary-color;
                     background-color: transparent;
                }
                .van-checkbox__label{
                    a{
                        color: @primary-color;
                    }
                }
                .login-tips-text{
                    display: inline-block;
                    a{
                        color: @primary-color;
                    }
                }
            }
        }
    }
</style>