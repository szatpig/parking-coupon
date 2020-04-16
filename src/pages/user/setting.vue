<template>
    <div class="setting-container">
        <div class="setting-wrap">
            <van-cell title="修改密码" is-link @click="handleShow" />
            <van-cell title="优先使用权益金">
                <template>
                    <van-switch v-model="priority" size="20px" />
                </template>
            </van-cell>
            <van-cell title="优先使用日期较近的权益金">
                <template>
                    <van-switch v-model="equityPriority" size="20px" />
                </template>
            </van-cell>
        </div>
        <van-popup class="popup-container popup-password" v-model="popup.show" position="right" >
            <van-form @submit="handleSubmit">
                <van-field
                    v-if="$route.query.type == 'password'"
                    type="password"
                    label="原密码"
                    name="password"
                    maxlength="12"
                    v-model.trim="popup.data.password"
                    placeholder="请输入当前使用的密码"
                    :rules="[
                        { required: true, message: '请输入当前使用的密码' },
                        { pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,12})$/, message: '6-12位，至少包含字母和数字'}
                    ]"
                    @blur="handelPageAdjust" />
                <van-field
                    label="新密码"
                    maxlength="12"
                    type="password"
                    name="newPassword"
                    v-model.trim="popup.data.newPassword"
                    placeholder="请输入新的密码"
                    :rules="[
                        { required: true, message: '请输入新的密码' },
                        { pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,12})$/, message: '6-12位，至少包含字母和数字'}
                    ]"
                    @blur="handelPageAdjust" />
                <van-field
                    label="确认密码"
                    maxlength="12"
                    type="password"
                    name="confirmPassword"
                    v-model.trim="popup.data.confirmPassword"
                    placeholder="请再次输入新的密码"
                    :rules="[
                        { required: true, message: '请再次输入新的密码' },
                        { pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,12})$/, message: '6-12位，至少包含字母和数字'}
                    ]"
                    @blur="handelPageAdjust" />
                <p class="popup-flex">
                    <span>密码为6-12位字符</span>
                    <span @click="handleShowReset" v-if="$route.query.type == 'password'">忘记密码？</span>
                </p>
                <div class="popup-btn">
                    <van-button round size="large" type="info" :disabled="!!!popup.data.confirmPassword" native-type="submit">确定</van-button>
                </div>
            </van-form>
        </van-popup>
        <van-popup class="popup-container popup-code" v-model="popupCode.show" position="right" >
            <van-form @submit="handleReset">
                <p class="code-tips">已发送验证码到您的手机</p>
                <p class="code-phone">188xxxx9876</p>
                <van-field
                        v-model.trim="popupCode.data.code"
                        type="tel"
                        name="code"
                        label="验证码"
                        maxlength="6"
                        placeholder="请输入验证码"
                        :rules="[
                            { required: true, message: '请输入验证码' },
                            { pattern: /^[\d]{6}$/, message: '请输入6位数字验证码'}
                        ]"
                        @blur="handelPageAdjust">
                    <ynt-code slot="button" @handleSend="handleSend" :disabled="disabled" ref="timer" :second="second"></ynt-code>
                </van-field>
                <div class="popup-btn">
                    <van-button round size="large" type="info" :disabled="!!!popupCode.data.code" native-type="submit">确定</van-button>
                </div>
            </van-form>
        </van-popup>
    </div>
</template>

<script>
    import { sendSms,userLogin } from '@/api/auth-api'
    import YntCode from '@/components/YntCode'
    export default {
        name: "setting",
        data() {
            return {
                equityPriority:false,
                priority:false,
                popup:{
                    show:false,
                    data:{
                        password:'',
                        newPassword:'',
                        confirmPassword:''
                    }
                },
                popupCode:{
                    show:false,
                    data:{
                        code:''
                    }
                },
                username:'',
                password:'',
                checked:true,
                disabled: false,
                second: 60
            }
        },
        components: {
            YntCode
        },
        methods: {
            handleShow(){
                this.$router.push({
                    query:{
                        type:'password'
                    }
                });

            },
            handleShowReset(){
                this.$router.replace({
                    query:{
                        type:'code'
                    }
                });
            },
            handleSubmit(val){
                if(this.$route.query.type == 'reset'){
                    this.$router.replace('/home/user/setting');
                }else{

                }
                console.log(val)
            },
            handleSend(){
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
            handleReset(){
                this.$router.replace({
                    query:{
                        type:'reset'
                    }
                });
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
        watch: {
            '$route' (to, from) {
                console.log(to)
                // 对路由变化作出响应...
                if(to.query.type== 'password' || to.query.type== 'reset'){
                    this.popup.show = true;
                    this.popupCode.show = false;
                }else if(to.query.type== 'code'){
                    this.popupCode.show = true;
                }else{
                    this.popup.show = false;
                    this.popupCode.show = false;
                }
            }
        },
        computed: {},
        created() {
            let { type } = this.$route.query;
            if(type== 'password' || type=='reset'){
                this.popup.show = true;
                this.popupCode.show = false;
            }else if(type== 'code'){
                this.popupCode.show = true;
            }else{
                this.popup.show = false;
                this.popupCode.show = false;
            }
        }
    }
</script>

<style lang="less">
    .setting-container{
        input[type=text],input[type=tel],input[type=password]{
            font-size: 28px;
            height: 48px;
        }
        .setting-wrap{
            .van-cell{
                .van-cell__title{
                    flex: 1.5;
                }

            }
        }
    }
    .popup-password{
        .popup-flex{
            margin-top: 24px;
            padding: 0 32px;
            line-height: 32px;
            font-size: 24px;
            span{
                &:last-child{
                    color: @primary-color;
                }
            }
        }
    }
    .popup-code{
        .code-tips{
            font-size: 28px;
            line-height: 36px;
            padding-top: 64px;
            color: #57626D;
            background: #fff;
            text-align: center;
        }
        .code-phone{
            font-size: 56px;
            line-height: 74px;
            padding-top: 24px;
            padding-bottom: 80px;
            color: #293547;
            background: #fff;
            text-align: center;
        }
    }
</style>