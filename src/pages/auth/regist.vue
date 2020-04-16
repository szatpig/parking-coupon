<template>
    <div class="register-container">
        <p class="register-logo">
            欢迎使用九州ETC
        </p>
        <div class="register-form">
            <van-cell-group>
                <van-field
                    label="车牌号"
                    v-model.trim="user.plateNo"
                    placeholder="请输入您的车牌号"
                    @input="handlePlateNoChange"
                    @blur="handelPageAdjust" />
                <van-field
                    label="手机号"
                    maxlength="11"
                    type="tel"
                    v-model.trim="user.phoneNo"
                    placeholder="请输入您的手机号"
                    @input="handlePhoneChange"
                    @blur="handelPageAdjust" />
                <van-field
                    label="验证码"
                    v-model.trim="user.code"
                    maxlength="6"
                    type="tel"
                    placeholder="请输入验证码"
                    @input="handleCodeChange"
                    @blur="handelPageAdjust">
                    <ynt-code slot="button" @handleSend="handleSend" :disabled="disabled" ref="timer" :second="second"></ynt-code>
                </van-field>
                <van-field
                        v-model.trim="user.password"
                        type="password"
                        placeholder="请输入6-12密码"
                        maxlength="12"
                        label="密码"
                        @input="handleCodeChange"
                        @blur="handelPageAdjust" />
                <van-button
                    :disabled="!(checked && user.phoneNo && user.code && user.phoneNo.length == 11)"
                    class="register-submit"
                    size="large"
                    round
                    type="info"
                    @click="handleLogin">注册</van-button>
                <p class="register-tips">
                    已有账号？<router-link class="register-tips-text" to="/login">点击登录</router-link>
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
        name: "register",
        data() {
            return {
                user:{
                    plateColor:'',
                    plateNo:'',
                    phoneNo:'',
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
                'setUserInfo'
            ]),
            handlePhoneChange(val){
                this.user.phoneNo = val.replace(/[^\d]/g,'');
            },
            handlePlateNoChange(val){
                // this.user.plateNo = val.replace(/[^\d]/g,'');
            },
            handleCodeChange(val){
                this.user.code = val.replace(/[^\d]/g,'');
            },
            handleSend(){
                // _czc.push(['_trackEvent', '验证码', '获取', '验证码获取','1','handleSend']);
                let reg = /^1[3-9]\d{9}$/;
                if(!reg.test(this.user.plateNo) || this.user.plateNo.length != 11){
                    this.$toast({
                        message: '请输入11位合法手机号',
                    });
                    return false;
                }

                let _data = {
                    plateNo: this.user.plateNo,
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
                let reg = /^1[3-9]\d{9}$/;
                if(!reg.test(this.user.plateNo) || this.user.plateNo.length != 11){
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
    .register-container{
        background: url("") center 100% no-repeat;
        background-size: contain;
        flex: 1;
        height: 100%;
        .register-logo{
            background: #3F8FFE;
            padding : 120px 32px 40px;
            font-size: 50px;
            color: #fff;
            text-align: left;
        }
        .register-form{
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
                input[type=text],input[type=tel],input[type=password]{
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
            }
            .register-submit{
                line-height: 88px;
                height: 88px;
                margin-top: 80px;
                color: #fff;
                background-color: @primary-color;
                &[disabled]{
                    background-color: #B2D2FF;
                }
            }
            .register-tips{
                margin-top: 32px;
                margin-bottom: 120px;
                font-size: 28px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                .register-tips-text{
                    color: @primary-color;
                }
            }
        }
    }
</style>