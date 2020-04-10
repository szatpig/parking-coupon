<template>
    <div class="account-container common-container">
        <div class="info-wrap">
            <img :src="user.headImg" alt="用户头像">
            <div class="user-wrap">
                <p>{{ user.nickname }}</p>
                <p><i>体验版</i></p>
            </div>
            <span class="icon icon-edit" @click="handleLinkFeedback">帮助与反馈</span>
        </div>
        <div class="call-wrap">
            <div class="list-wrap border-top-bottom-32" @click="handleQuit">
                <span>手机号码：{{ user.phoneNumber }}</span>
                <span class="change-account">切换账号</span>
            </div>
            <div class="list-wrap" @click="handleLink">
                <span :class="{ active: this.show }">接听记录</span>
                <span>{{ user.unreadRecordCount ? `未读${ user.unreadRecordCount }` : `共${ user.recordCount }` }}条 <van-icon name="arrow" /></span>
            </div>
            <div class="list-wrap" @click="handleLinkRefuse">
                <span>拒绝场景</span>
                <span>{{ user.refuseCount }}个<van-icon name="arrow" /></span>
            </div>
            <div class="list-wrap scene" @click="handleLinkTo">
                <span>话术配置</span>
                <span><van-icon name="arrow" /></span>
            </div>
            <div class="list-wrap">
                <div class="switch-wrap">
                    <p>遇忙转移 <span :class="{ active: !this.switch.transferOnBusy }">({{ this.switch.transferOnBusy ? '已开启':'关闭' }})</span></p>
                    <p>占线、挂机时转给AI助理</p>
                </div>
                <van-button size="small" :class ="{ active:!this.switch.transferOnBusy }" @click="handleSwitch('transferOnBusy',0)">
                    {{ this.switch.transferOnBusy ? '关闭':'开启'}}
                </van-button>
            </div>
            <div class="list-wrap">
                <div class="switch-wrap">
                    <p>无人接听转移 <span :class="{ active: !this.switch.transferOnNoReplay }">({{ this.switch.transferOnNoReplay ? '已开启':'关闭' }})</span></p>
                    <p>无人接听时转给AI助理</p>
                </div>
                <van-button size="small" :class ="{ active:!this.switch.transferOnNoReplay }" @click="handleSwitch('transferOnNoReplay',1)">
                    {{ this.switch.transferOnNoReplay ? '关闭':'开启'}}
                </van-button>
            </div>
            <div class="list-wrap">
                <div class="switch-wrap">
                    <p>无法接通转移 <span :class="{ active: !this.switch.transferOnUnreachable }">({{ this.switch.transferOnUnreachable ? '已开启':'关闭' }})</span></p>
                    <p>关机、无信号时转接给AI助理</p>
                </div>
                <van-button size="small" :class ="{ active:!this.switch.transferOnUnreachable }" @click="handleSwitch('transferOnUnreachable',2)">
                    {{ this.switch.transferOnUnreachable ? '关闭':'开启'}}
                </van-button>
            </div>
        </div>
        <p class="tips-wrap">
            未设置成功？您可以试试<router-link to="/home/operation">手动设置</router-link>
        </p>
        <p class="ad-wrap">
            <a href="https://assistant.ynt.ai/app_download_page/index.html?random=201904291905">
                <img src="../../images/ad.png" alt="">
            </a>
        </p>
    </div>
</template>

<script>
    import headImg from '@/images/head-img.png'
    import { userInfo,getForwardTelInfo,getCallForwardSetting,changeCallForwardSetting } from '@/api/user-api'
    import { URLencode } from  '@/utils/util'
    export default {
        name: "account",
        data() {
            return {
                user:{
                    headImg:headImg,
                    nickname:'小意助理',
                    phoneNumber:'',
                    recordCount:0,
                    unreadRecordCount:0,
                    refuseCount:0
                },
                switch: {
                    transferOnAllCalls: false,
                    transferOnBusy: false,
                    transferOnNoReplay: false,
                    transferOnUnreachable: false
                },
                callPhone:'',
                operator:'0',
                forwardSetting:{
                    transferOnAllCalls:[
                        ['#21#','*21*tel#'],
                        ['*720','*72tel'],
                        ['##21#','**21*tel#']
                    ],
                    transferOnBusy:[
                        ['#67#','*67*tel#'],
                        ['*900','*90tel'],
                        ['##67#','**67*tel#']
                    ],
                    transferOnNoReplay:[
                        ['#61#','*61*tel#'],
                        ['*920','*92tel'],
                        ['##61#','**61*tel#']
                    ],
                    transferOnUnreachable:[
                        ['#62#','*62*tel#'],
                        ['*680','*68tel'],
                        ['##62#','**62*tel#']
                    ]
                },
                forwardType:'transferOnAllCalls',
                forwardTxt:{
                    transferOnAllCalls:'',
                    transferOnBusy:'遇忙转移',
                    transferOnNoReplay:'无人接听转移',
                    transferOnUnreachable:'无法接通转移'
                }
            }
        },
        components: {},
        methods: {
            handleSwitch(type,callFordType){
                this.forwardType = type;
                let _msg = this.switch[type] ?
                        `请点击下方号码，拨打后即可关闭<a class="dialog-tel" href="tel:${URLencode(this.callNumber)}">${this.callNumber}</a>`
                        :`请点击下方号码，拨打后即可开通<a class="dialog-tel" href="tel:${URLencode(this.callNumber)}">${this.callNumber}</a>`
                this.$dialog.confirm({
                    className:'switchDialog',
                    title:`${this.switch[type] ? '关闭':'开通'}${this.forwardTxt[type]}`,
                    message: _msg,
                    confirmButtonText:'我已拨打',
                    cancelButtonText:`暂不${this.switch[type] ? '关闭':'开通'}`
                }).then(()=>{
                    changeCallForwardSetting({
                        callFordType,
                        on:!this.switch[type]
                    }).then(()=>{
                        this.switch[type] = !this.switch[type];
                        this.forwardType = ''
                    });
                }).catch(err=>{

                });
            },
            handleQuit(){
                this.$dialog.confirm({
                    className:'quitDialog',
                    title:``,
                    message: '切换绑定账号后，将无法接收当前账号的通话记录推送，确定切换吗？',
                    confirmButtonText:'切换',
                    cancelButtonText:`取消`
                }).then(()=>{
                    if(!this.switch.transferOnBusy && !this.switch.transferOnNoReplay && !this.switch.transferOnUnreachable){
                        this.$router.replace({
                            path:'/login',
                            query:{
                                openId:sessionStorage.getItem('openId')
                            }
                        });
                        return false
                    }
                    setTimeout(()=>{
                        this.$dialog.confirm({
                            className:'sceneDialog',
                            title:``,
                            message: '建议先关闭全部转呼再切换',
                            confirmButtonText:'直接切换',
                            cancelButtonText:`关闭`
                        }).then(()=>{
                            this.$router.push({
                                path:'/login',
                                query:{
                                    openId:sessionStorage.getItem('openId')
                                }
                            })
                        }).catch(err=>{

                        })
                    },500);
                }).catch(err=>{

                });
            },
            handleLink(){
                this.$router.push('/home/call')
            },
            handleLinkTo(){
                this.$router.push('/home/scene/config')
            },
            handleLinkFeedback(){
                this.$router.push('/home/feedback/qa')
            },
            handleLinkRefuse(){
                this.$router.push('/home/refuse')
            },
            init(){
                userInfo().then(data => {
                    this.user.headImg = data.data.headImg;
                    this.user.nickname = data.data.nickname;
                    this.user.phoneNumber = data.data.phoneNumber;
                    this.user.recordCount = data.data.recordCount;
                    this.user.unreadRecordCount = data.data.unreadRecordCount;
                    this.user.refuseCount = data.data.refuseCount;
                });
                getForwardTelInfo().then(data => {
                    this.operator = data.data.operator;
                    this.callPhone = data.data.forwardIn;
                    sessionStorage.setItem('forwardIn',JSON.stringify(data.data));
                });
                getCallForwardSetting().then(data => {
                    this.switch =  data.data;
                })
            }
        },
        computed: {
            show(){
                return  this.user.unreadRecordCount
            },
            callNumber(){
                 //运营商：0，移动；1，电信；2，联通；3，其他
                 return this.forwardSetting[this.forwardType][this.operator][Number(!this.switch[this.forwardType])].replace(/tel/g,this.callPhone)
            }
        },
        created() {
            this.init();
        }
    }
</script>

<style lang="less">
    .account-container{
        background-color: #f4f4f4;
        &.common-container{
            padding: 0;
        }
        .info-wrap{
            height: 274px;
            padding: 72px 32px 105px 32px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            background: url("../../images/head.png") center center no-repeat;
            background-size: cover;
            position: relative;
            img{
                height: 108px;
                width: 108px;
                border-radius: 50%;
                margin-right: 32px;
            }
            .user-wrap{
                display: flex;
                flex-flow: column nowrap;
                justify-content: space-between;
                height: 96px;
                p{
                    color: #fff;
                    &:first-child{
                       font-size: 40px;
                    }
                    &:last-child{
                        font-size: 30px;
                        i{
                            box-sizing: border-box;
                            display: inline-block;
                            /*margin-left: 32px;*/
                            margin-top: 12px;
                            border-radius: 40px;
                            border: 1.5px solid #fff;
                            padding: 2px 24px;
                            font-size: 22px;
                        }
                    }
                }
            }
            .icon-edit{
                position: absolute;
                top:26px;
                right: 32px;
                font-size: 30px;
                color: #fff;
                &:before{
                    font-size: 28px;
                    color: #fff;
                    margin-right: 8px;
                }
            }
        }
        .call-wrap{
            background-color: #fff;
            .list-wrap{
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                padding: 40px 32px;
                &:not(:last-child){
                   border-bottom: 1.5px solid #E8E8E8;
                }
                &.scene{
                    border-bottom: 32px solid #E8E8E8;
                }
                &>span{
                    font-size: 34px;
                    &:first-child{
                        color: #101010;
                        &.active{
                            position: relative;
                            &:after{
                                content:'';
                                display: block;
                                width: 16px;
                                height: 16px;
                                background-color: #ff4949;
                                border-radius: 32px;
                                position: absolute;
                                right: -25px;
                                top: 0px;
                            }
                        }
                    }
                    &:last-child{
                        color: #828282;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        i{
                            vertical-align: text-bottom;
                            font-size: 32px;
                            margin-left: 8px;
                            color: #999;
                        }
                    }

                }
                .switch-wrap{
                    p{
                        &:first-child{
                            font-size: 34px;
                            span{
                                color: #09BB07;
                                &.active{
                                    color: #828282;
                                }
                            }
                        }
                        &:last-child{
                            margin-top: 16px;
                            font-size: 26px;
                            color: #828282;
                        }
                    }

                }
                button{
                    width: 120px;
                    height: 60px;
                    line-height: 58px;
                    border-radius: 6px;
                    background-color: #F7F7F7;
                    font-size: 28px;
                    &.active{
                        background-color: #3F8FFE;
                        color: #fff;
                        border-radius: 6px;
                        border: 1px solid #3F8FFE;
                    }
                }
                &.border-top-bottom-32{
                    border-bottom: 32px solid #E8E8E8;
                    border-top: 32px solid #E8E8E8;
                    span{
                        color: #828282;
                    }
                }
                .change-account{
                    box-sizing: border-box;
                    height: 50px;
                    width: 150px;
                    font-size: 20px;
                    color: #3f8ffe !important;
                    border-radius: 6px;
                    border: 2px solid #3f8ffe;
                }
            }
        }
        .tips-wrap{
            padding: 24px 32px;
            color: #828282;
            font-size: 26px;
            a{
                color: #3F8FFE;
            }
        }
        .ad-wrap{
            margin-top: 78px;
            margin-bottom: 90px;
            padding: 0 32px;
            img{
                width: 100%;
                height: auto;
            }
        }


    }
    .switchDialog{
        transform: translate3d(-50%,-74%,0);
        .van-dialog__header{
            font-size: 36px;
        }
        .van-dialog__cancel{
            color: #828282;
        }
        .van-dialog__message--has-title{
            padding-top: 38px;
            font-size: 32px;
            color: #101010;
            line-height: 1;
        }
    }
</style>