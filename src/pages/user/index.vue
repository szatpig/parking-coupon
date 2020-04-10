<template>
    <div class="user-container">
        <div class="head-wrap">
            <img :src="user.headImg" alt="用户头像">
            <div class="user-wrap">
                <p>{{ user.nickname }} <i>体验版</i></p>
                <p>{{ user.phoneNumber }}<i @click="handleQuit">切换</i></p>
            </div>
            <span class="icon icon-edit" @click="handleLinkFeedback">帮助与反馈</span>
        </div>
        <div class="type-wrap">
            <span @click="handleLink"><img src="./../../images/type-1.png" alt=""><i>接听记录</i></span>
            <span @click="handleLinkRefuse"><img src="./../../images/type-2.png" alt=""><i>拒绝场景</i></span>
            <span @click="handleLinkAssistant"><img src="./../../images/type-3.png" alt=""><i>我的助理</i></span>
        </div>
        <div class="switch-wrap">
            <div class="item-cell">
                <div class="switch-cell">
                    <p>遇忙转移</p>
                    <p>占线、挂机时转给AI助理</p>
                </div>
                <van-switch
                    :value="switchArr.transferOnBusy"
                    @input="handleSwitch('transferOnBusy',0)"
                    inactive-color="#979AA4"
                    active-color="#2E72F4"
                    size="20px" />
            </div>
            <div class="item-cell">
                <div class="switch-cell">
                    <p>无人接听转移</p>
                    <p>无人接听时转给AI助理</p>
                </div>
                <van-switch
                    :value="switchArr.transferOnNoReplay"
                    @input="handleSwitch('transferOnNoReplay',1)"
                    inactive-color="#979AA4"
                    active-color="#2E72F4"
                    size="20px" />
            </div>
            <div class="item-cell">
                <div class="switch-cell">
                    <p>无法接通转移</p>
                    <p>关机、无信号时转接给AI助理</p>
                </div>
                <van-switch
                    inactive-color="#979AA4"
                    active-color="#2E72F4"
                    :value="switchArr.transferOnUnreachable"
                    @input="handleSwitch('transferOnUnreachable',2)"
                    size="20px" />
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
                    phoneNumber:''
                },
                switchArr: {
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
                let _msg = this.switchArr[type] ?
                        `请点击下方号码，拨打后即可关闭<a class="dialog-tel" href="tel:${URLencode(this.callNumber)}">${this.callNumber}</a>`
                        :`请点击下方号码，拨打后即可开通<a class="dialog-tel" href="tel:${URLencode(this.callNumber)}">${this.callNumber}</a>`
                this.$dialog.confirm({
                    className:'switchDialog',
                    title:`${this.switchArr[type] ? '关闭':'开通'}${this.forwardTxt[type]}`,
                    message: _msg,
                    confirmButtonText:'我已拨打',
                    cancelButtonText:`暂不${this.switchArr[type] ? '关闭':'开通'}`
                }).then(()=>{
                    changeCallForwardSetting({
                        callFordType,
                        on:!this.switchArr[type]
                    }).then(()=>{
                        this.switchArr[type] = !this.switchArr[type];
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
                    if(!this.switchArr.transferOnBusy && !this.switchArr.transferOnNoReplay && !this.switchArr.transferOnUnreachable){
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
            handleLinkAssistant(){
                this.$router.push('/home/scene/audio/'+ (this.user.usedScrType == 1 ? 0 : this.user.usedScrid) +'/'+ this.user.usedSctid)
            },
            init(){
                userInfo().then(data => {
                    this.user.headImg = data.data.headImg;
                    this.user.nickname = data.data.nickname;
                    this.user.phoneNumber = data.data.phoneNumber;
                    this.user.usedScrid = data.data.usedScrid;
                    this.user.usedSctid = data.data.usedSctid;
                    this.user.usedScrType = data.data.usedScrType || 0
                });
                getForwardTelInfo().then(data => {
                    this.operator = data.data.operator;
                    this.callPhone = data.data.forwardIn;
                    sessionStorage.setItem('forwardIn',JSON.stringify(data.data));
                });
                getCallForwardSetting().then(data => {
                    this.switchArr =  data.data;
                })
            }
        },
        computed: {
            show(){
                return  this.user.unreadRecordCount
            },
            callNumber(){
                //运营商：0，移动；1，电信；2，联通；3，其他
                return this.forwardSetting[this.forwardType][this.operator][Number(!this.switchArr[this.forwardType])].replace(/tel/g,this.callPhone)
            }
        },
        created() {
            this.init();
        }
    }
</script>

<style lang="less">
    .user-container{
        position: relative;
        padding: 0 32px;
        .head-wrap{
            margin: 0 -32px;
            box-sizing: content-box;
            height: 108px;
            padding: 60px 32px 92px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            background: url("../../images/user-bg.png") center top no-repeat;
            z-index: 1;
            img{
                height: 108px;
                width: 108px;
                border-radius: 50%;
                margin-right: 42px;
            }
            .user-wrap{
                height: 108px;
                p{
                    color: #fff;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-start;
                    align-items: center;
                    &:first-child{
                        font-size: 40px;
                        i{
                            display: inline-block;
                            box-sizing: padding-box;
                            height: 40px;
                            line-height: 40px;
                            margin-left: 16px;
                            padding: 2px 14px;
                            text-align: center;
                            border-radius: 6px;
                            background-color: #5071ed;
                            color: #fff;
                            font-size: 20px;
                        }
                    }
                    &:last-child{
                        font-size: 28px;
                        margin-top: 16px;
                        i{
                            box-sizing: border-box;
                            display: inline-block;
                            width: 92px;
                            line-height: 20px;
                            margin-left: 16px;
                            border-radius: 40px;
                            border: 1.5px solid #fff;
                            padding: 8px 16px;
                            font-size: 20px;
                            text-align: center;
                        }
                    }
                }
            }
            .icon-edit{
                position: absolute;
                top:26px;
                right: 32px;
                font-size: 24px;
                color: #fff;
                &:before{
                    font-size: 26px;
                    color: #fff;
                    margin-right: 8px;
                }
            }
        }
        .type-wrap{
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            padding: 28px 56px;
            width: 100%;
            box-shadow:0px 4px 5px 0px rgba(0, 0, 0, 0.08);
            position: relative;
            top:-32px;
            border-radius: 8px;
            z-index: 5;
            background: #fff;
            span{
                width: 124px;
                text-align: center;
                img{
                    width: 112px;
                    height: 112px;
                }
                i{
                    font-size: 30px;
                    color: #303133;
                }
            }
        }
        .switch-wrap{
            box-shadow:0px 4px 5px 0px rgba(0, 0, 0, 0.08);
            padding: 32px 24px;
            .item-cell{
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 56px;
                &:last-child{
                    padding-bottom: 0;
                }
            }
            .switch-cell{
                p{
                    &:first-child{
                        font-size: 32px;
                        span{
                            color: #303133;
                            &.active{
                                color: #828282;
                            }
                        }
                    }
                    &:last-child{
                        margin-top: 16px;
                        font-size: 26px;
                        color: #979AA4;
                    }
                }

            }
        }
        .tips-wrap{
            padding: 32px 0;
            color: #979AA4;
            font-size: 26px;
            a{
                color: #3F8FFE;
            }
        }
        .ad-wrap{
            margin-bottom: 90px;
            margin-top: 50px;
            box-shadow:0px 4px 5px 0px rgba(0, 0, 0, 0.08);
            img{
                width: 100%;
                height: auto;
            }
        }
    }
</style>