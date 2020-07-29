<template>
    <div class="login-container">
        <p class="login-logo">
            欢迎使用九州ETC - 商户端
        </p>
        <div class="login-form">
            <van-cell-group>
                <van-field
                    label="用户名"
                    maxlength="20"
                    v-model.trim="user.account"
                    placeholder="请输入用户名"
                    @input="handlePhoneChange"
                    @blur="handelPageAdjust" />
                <van-field
                    label="密码"
                    type="password"
                    v-model.trim="user.password"
                    maxlength="12"
                    placeholder="请输入密码"
                    @input="handlePasswordChange"
                    @blur="handelPageAdjust">
                </van-field>
                <van-button
                    :disabled="!(user.account && user.password )"
                    class="login-submit"
                    size="large"
                    round
                    @click="handleLogin">登录</van-button>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
    import md5 from "md5"
    import { merchantLogin } from '@/api/auth-api'
    import { mapActions } from  'vuex'
    export default {
        name: "login",
        data() {
            return {
                user:{
                    account:'',
                    password:''
                }
            }
        },
        components: {},
        methods: {
            ...mapActions([
                'setUserToken'
            ]),
            handlePhoneChange(val){
                this.user.account = val.replace(/[^\w]/g,'');
            },
            handlePasswordChange(val){
                this.user.password = val.replace(/[\s]/g,'');
            },
            async handleLogin(){
                let reg = /^[a-zA-Z]+[\w]{2,19}$/;

                if(!reg.test(this.user.account)){
                    this.$toast({
                        message: '请输入合法用户名',
                    });
                    return false;
                }

                if(!this.user.password){
                    this.$toast({
                        message: '密码不能为空 >_<',
                    });
                    return false;
                }
                reg =/^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,12})$/
                if(!reg.test(this.user.password)){
                    this.$toast({
                        message: '密码至少包含字母和数字 >_<',
                    });
                    return false;
                }

                let { account,password } =  this.user,data;
                try {
                    data = await merchantLogin({
                        account,
                        password:md5(password)
                    })
                    this.setUserToken(data.data.token);
                    this.$router.replace({
                        path:'scan'
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
            this.setUserToken(null);
            sessionStorage.clear();
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