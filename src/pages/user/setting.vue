<template>
    <div class="setting-container">
        <div class="setting-wrap">
            <van-cell title="修改密码" is-link @click="handleShow('password')" />
            <van-cell :title="`优先使用${ priority ? '停车券':'权益金' }`">
                <template>
                    <van-switch :active-value="0" :inactive-value="1" v-model="priority" @change="setCustomer" size="20px" />
                </template>
            </van-cell>
            <van-cell title="优先使用日期较近的权益金">
                <template>
                    <van-switch :active-value="0" :inactive-value="1" v-model="equityPriority" @change="handleSwitch" size="20px" />
                </template>
            </van-cell>
            <p v-show="!!equityPriority && listIndustry.length" class="setting-tips">请拖动权益金扣款顺序</p>
            <van-cell-group v-show="!!equityPriority" class="drag-container" >
                <van-cell center
                          v-for="(item,index) in listIndustry"
                          :title="item.industryUserName"
                          :label="item.expirationTime + ':00 到期'"
                          :key="item.industryUserId"
                          @click="handleDragClick">
                    <template #right-icon>
                        <van-icon name="ascending" v-if="index !== 0" @click="handleDragClick(index,$event)"/>
                    </template>
                </van-cell>
            </van-cell-group>
            <van-button type="default" block class="login-out" @click="handleLoginOut">退出登录</van-button>
        </div>
        <van-popup class="popup-container popup-password" v-model="popup.show" position="right" >
            <van-form @submit="handleSubmit" :show-error="false">
                <van-field
                    v-if="$route.query.type == 'password'"
                    type="password"
                    label="原密码"
                    name="oldPassword"
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
                    name="affirmPassword"
                    v-model.trim="popup.data.confirmPassword"
                    placeholder="请再次输入新的密码"
                    :rules="[
                        { required: true, message: '请再次输入新的密码' },
                        { pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{6,12})$/, message: '6-12位，至少包含字母和数字'}
                    ]"
                    @blur="handelPageAdjust" />
                <p class="popup-flex">
                    <span>密码为6-12位字符，包含字母和数字</span>
                    <span @click="handleShow('code')" v-if="$route.query.type == 'password'">忘记密码？</span>
                </p>
                <div class="popup-btn">
                    <van-button round size="large" type="info" :disabled="!!!popup.data.confirmPassword" native-type="submit">确定</van-button>
                </div>
            </van-form>
        </van-popup>
        <van-popup class="popup-container popup-code" v-model="popupCode.show" position="right" >
            <van-form @submit="handleReset" :show-error="false">
                <p class="code-tips">发送验证码到您的手机</p>
                <p class="code-phone">{{ phoneNo.replace(/(\d{3})(\d{4})(\d{4})/,'$1xxxx$3') }}</p>
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
    import md5 from "md5"
    import { sendSms,userLogout } from '@/api/auth-api'
    import {
        getByCustomerInfo,
        getByCustomerInfoUpdate,
        listIndustryEquity,
        resetPassword,
        verificationCode,
        forgetPassword  } from '@/api/user-api'
    import YntCode from '@/components/YntCode'
    import { mapState } from  'vuex'

    export default {
        name: "setting",
        data() {
            return {
                id:0,
                equityPriority:0,
                priority:0,
                listIndustry:[],
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
            handleShow(val){
                this.popup.data ={
                    password:'',
                    newPassword:'',
                    confirmPassword:''
                }
                this.$router.push({
                    query:{
                        type:val
                    }
                });
            },
            async handleSwitch(val){
                console.log(val)
                val == 1 && (await this.getIndustryList())
                setTimeout(()=>{
                    this.setCustomer()
                },500)

            },
            handleSubmit(val){
                if(this.$route.query.type == 'reset'){
                    const { phone,code } = this.$route.query;
                    const { newPassword, affirmPassword } = val;
                    forgetPassword({
                        phone,
                        code,
                        newPassword:md5(newPassword),
                        affirmPassword:md5(affirmPassword)
                    }).then(() => {
                        this.$toast('密码修改成功')
                        this.$router.replace('/home/user/setting');
                    }).catch(err => {
                        if(err.status == 9002 || err.status == 2003){
                            setTimeout(()=>{
                                this.popupCode.data.code = ''
                                this.$toast(err.msg)
                            },100)
                            this.$router.replace({
                                path:'/home/user/setting',
                                query:{
                                    type:'code'
                                }
                            });
                        }
                    })
                }else{
                    const { oldPassword, newPassword, affirmPassword } = val
                    resetPassword({
                        oldPassword:md5(oldPassword),
                        newPassword:md5(newPassword),
                        affirmPassword:md5(affirmPassword)
                    }).then(() => {
                        this.$toast('密码修改成功')
                        this.$router.replace('/home/user/setting');
                    })
                }
                console.log(val)
            },
            handleSend(){
                let _data = {
                    phone: this.phoneNo,
                    type:'wx_password'
                };
                sendSms(_data).then(data => {
                    this.disabled = true;
                    setTimeout(() =>{
                        this.$refs.timer.run();
                        this.disabled = false;
                    },200);
                })
            },
            handleReset(val){
                this.popup.data ={
                    password:'',
                    newPassword:'',
                    confirmPassword:''
                }
                this.$router.replace({
                    query:{
                        type:'reset',
                        phone:this.phoneNo,
                        ...val
                    }
                });
            },
            handleLoginOut(){
                userLogout().then(data => {
                    this.$router.replace({
                        path:'/login',
                        query:{
                            openId:this.openId
                        }
                    })
                })
            },

            handleDragClick(index,e){
                e.stopPropagation();
                e.preventDefault();
                let _tempList = JSON.parse(JSON.stringify(this.listIndustry))
                console.log('dragend: ', index,0,this.listIndustry)

                let _temp = _tempList.splice(index,1)
                _tempList.splice(0,0,_temp[0]);

                this.listIndustry = [];
                this.$nextTick(()=>{
                    this.listIndustry = _tempList;
                    this.setCustomer();
                })
            },

            setCustomer(){
                let _data ={
                    id:this.id,
                    priority:this.priority,
                    equityPriority:this.equityPriority,
                    equityPriorityOrder:this.listIndustry.length && this.listIndustry.map(item => item.industryUserId).join(',') || ''
                }
                getByCustomerInfoUpdate(_data).then(data => {
                    this.$toast('设置成功')
                })
            },
            getByCustomer(){
                getByCustomerInfo().then(data => {
                    this.priority = data.data.priority;
                    this.equityPriority = data.data.equityPriority;
                    this.listIndustry = data.data.list || [];
                    this.id = data.data.id
                })
            },
            getIndustryList(){
                listIndustryEquity().then(data => {
                    this.listIndustry = data.data;
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
        computed: {
            ...mapState({
                phoneNo: state => state.user.userInfo.phoneNo,
                openId: state => state.user.openId
            }),
        },
        mounted(){
            // Dragula([document.getElementById('drag-container')])
            // this.$Dragula.options('equity-bag', {
            //     direction: 'vertical'
            // })

        },
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
            this.getByCustomer();
            // const service = this.$dragula.$service
            //
            // service.options( 'first', { direction: 'vertical' })
            // service.eventBus.$on(
            //     'drag', (drake, el, container) => {
            //             document.documentElement.classList.add('disabled-scroll')
            //             document.body.classList.add('disabled-scroll')
            //             document.querySelector('.setting-container').classList.add('disabled-scroll')
            //             document.querySelector('.setting-wrap').classList.add('disabled-scroll')
            //     }
            // )
            // service.eventBus.$on(
            //         'drop', (drake, el, container) => {
            //             document.documentElement.classList.remove('disabled-scroll')
            //             document.body.classList.remove('disabled-scroll')
            //             document.querySelector('.setting-container').classList.remove('disabled-scroll')
            //             document.querySelector('.setting-wrap').classList.add('disabled-scroll')
            //         }
            // )
            // service.eventBus.$on('dropModel', ({ dragIndex,dropIndex }) => {
            //
            //     let _tempList = JSON.parse(JSON.stringify(this.listIndustry))
            //     console.log('dragend: ', dragIndex,dropIndex,this.listIndustry)
            //
            //     let _temp = _tempList.splice(dragIndex,1)
            //     _tempList.splice(dropIndex,0,_temp[0]);
            //
            //     this.listIndustry = [];
            //     this.$nextTick(()=>{
            //         this.listIndustry = _tempList;
            //         this.setCustomer();
            //     })
            // })

        }
    }
</script>

<style lang="less">
    .disabled-scroll{
        overflow: hidden;
    }
    .setting-container{
        -webkit-touch-callout:none;
        -webkit-user-select:none;
        -khtml-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none;
        touch-action: pan-y;
        flex: 1;
        height: 100%;
        overflow: auto;
        input[type=text],input[type=tel],input[type=password]{
            font-size: 28px;
            height: 48px;
        }
        .setting-wrap{
            padding-bottom: 100px;
            .van-cell{
                .van-cell__title{
                    flex: 1.5;
                }

            }
        }
        .setting-tips{
            margin-top: 8px;
            height:78px;
            line-height: 78px;
            padding: 0 32px;
            background-color: #fff;
            font-size: 26px;
            color: #909499;
        }
        .drag-container{
            .van-icon-ascending{
                /*background-color: #EEF1F5;*/
                /*width: 64px;*/
                /*height: 64px;*/
                /*line-height: 64px;*/
                /*text-align: center;*/
                /*border-radius: 64px;*/
                font-size: 40px;
                color: #909499;
                /*transform: rotate(180deg);*/
            }
        }
        .login-out{
            margin-top: 50px;
            margin-bottom: 50px;
            border: none;
            color: #f44336;
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