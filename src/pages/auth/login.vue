<template>
    <div class="login-container">
        <p class="login-logo">
            欢迎使用九州ETC
        </p>
        <div class="login-form">
            <van-cell-group>
                <van-field
                    label="手机号"
                    maxlength="11"
                    type="number"
                    v-model.trim="user.phone"
                    placeholder="请输入您的手机号"
                    @input="handlePhoneChange"
                    @blur="handelPageAdjust" />
                <van-field
                        v-if="loginType"
                    label="密码"
                    v-model.trim="user.password"
                    maxlength="12"
                    placeholder="请输入密码"
                    @input="handleCodeChange"
                    @blur="handelPageAdjust">
                </van-field>
                <van-field
                        v-else
                        label="验证码"
                        v-model.trim="user.code"
                        maxlength="6"
                        type="tel"
                        placeholder="请输入验证码"
                        @input="handleCodeChange"
                        @blur="handelPageAdjust">
                    <ynt-code slot="button" @handleSend="handleSend" :disabled="disabled" ref="timer" :second="second"></ynt-code>
                </van-field>
                <van-button
                    :disabled="!(checked && user.phone && user.password && user.phone.length == 11)"
                    class="login-submit"
                    size="large"
                    round
                    @click="handleLogin">登录</van-button>
                <p class="flex">
                    <span class="register-link" @click="loginType = !loginType">{{ loginType ?  '使用验证码登录' : '使用密码登录'}}</span>
                    <router-link class="register-link" to="/register">新用户注册</router-link>
                </p>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
    import { userLogin, userCodeLogin, sendSms } from '@/api/auth-api'
    import { mapActions } from  'vuex'
    import YntCode from '@/components/YntCode'
    export default {
        name: "login",
        data() {
            return {
                loginType:true,
                user:{
                    phone:'',
                    code:'',
                    password:'',
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
                'setUserInfo',
                'setOpenId',
            ]),
            handlePhoneChange(val){
                this.user.phone = val.replace(/[^\d]/g,'');

            },
            handleCodeChange(val){
                this.user.password = this.user.code = val.replace(/[\s]/g,'');
            },
            handleSend(){
                let reg = /^1[3456789]\d{9}$/;
                if(!reg.test(this.user.phone) || this.user.phone.length != 11){
                    this.$toast({
                        message: '请输入11位合法手机号',
                    });
                    return false;
                }

                let _data = {
                    phone: this.user.phone,
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
            async handleLogin(){
                let reg = /^1[3456789]\d{9}$/;

                if(!reg.test(this.user.phone) || this.user.phone.length != 11){
                    this.$toast({
                        message: '请输入11位合法手机号',
                    });
                    return false;
                }
                if(this.loginType){
                    if(!this.user.password){
                        this.$toast({
                            message: '密码不能为空 >_<',
                        });
                        return false;
                    }
                }else{
                    if(!this.user.code){
                        this.$toast({
                            message: '验证码不能为空 >_<',
                        });
                        return false;
                    }
                }

                this.user.openId = this.$route.query.openId;
                this.$route.query.openId &&(sessionStorage.setItem('openId',this.$route.query.openId));

                let { phone,code,password,openId } =  this.user,data;
                try {
                    if(this.loginType){
                        data = await userLogin({
                            phone,password,openId
                        })
                    }else{
                        data = await userCodeLogin({
                            phone,code,openId
                        })
                    }
                    this.setUserInfo(data.data);
                    this.setUserToken(data.data.token);
                    this.$router.replace({
                        path:'/home/user'
                    });
                }catch (e) {

                }
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
            _openId && this.setOpenId(_openId || '');

        }
    }
</script>

<style lang="less">
    .login-container{
        flex: 1;
        height: 100%;
        .login-logo{
            background: url("./../../images/auth-bg.png") center 100% no-repeat;
            background-size: cover;
            padding : 120px 32px 40px;
            font-size: 50px;
            color: #fff;
            text-align: left;
        }
        .login-form{
            margin: 24px 32px 0;

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
                    font-size: 28px;
                    height: 48px;
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
                .van-field__label{
                    font-size: 28px;
                }
            }
            .login-submit{
                line-height: 88px;
                height: 88px;
                margin-top: 48px;
                color: #fff;
                background-color: @primary-color;
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
            .flex{
                justify-content: center;
                .register-link{
                    flex: 1;
                    padding: 0 70px;
                    text-align: center;
                    position: relative;
                    color: #909499;
                    font-size: 28px;
                    &:first-child:before{
                        content: '';
                        display: block;
                        position: absolute;
                        top:45%;
                        right: 0;
                        width: 2px;
                        height: 28px;
                        transform: translateY(-50%);
                        background-color: #dddeee;
                    }
                }
            }
        }
        .register-link{
            display: block;
            margin-top: 24px;
            height: 64px;
            line-height: 64px;
            font-size: 24px;
            color: #2196F3;
        }
    }
</style>