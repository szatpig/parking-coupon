<template>
    <div class="user-container">
        <div class="head-wrap">
            <img :src="user.headImg" alt="用户头像">
            <div class="user-wrap">
                <p>
                    {{ user.nickname }}
                    <!--<i></i>-->
                </p>
                <p>
                    {{ mobile.replace(/(\d{3})(\d{4})(\d{4})/,'$1xxxx$2') }}
                    <!--<i @click="handleQuit"></i>-->
                </p>
            </div>
            <!--<span class="icon icon-edit" @click="handleLinkFeedback">帮助与反馈</span>-->
        </div>
        <div class="type-wrap">
            <span class="flex" @click="$router.push('/home/user/coupons')"><SvgComponent icon="coupon" /><i>停车券</i></span>
            <span class="flex" @click="$router.push('/home/user/equity')"><SvgComponent icon="equity" /><i>权益金</i></span>
        </div>
        <div class="switch-wrap">
            <van-cell title="我的车辆" is-link @click="handleLink" :value="user.car" />
            <van-cell title="联系客服" @click="handleCall" is-link  />
            <van-cell title="设置" is-link  to="/home/user/setting"/>
        </div>
    </div>
</template>

<script>
    import headImg from '@/images/head-img.png'
    import SvgComponent from '@/components/svg'
    import { customerCarList } from '@/api/user-api'
    import { URLencode } from  '@/utils/util'
    import { mapState } from  'vuex'
    export default {
        name: "account",
        data() {
            return {
                user:{
                    headImg:headImg,
                    nickname:'小意助理',
                    phoneNumber:'13511604618',
                    car:''
                },
                list:[],
                serviceNumber:888-88888888
            }
        },
        components: {
            SvgComponent
        },
        methods: {
            handleCall(){
                this.$dialog.confirm({
                    className:'call-dialog',
                    title:``,
                    message: `是否拨打客服电话${ this.serviceNumber }`,
                    confirmButtonText:'拨打',
                    cancelButtonText:`取消`
                }).then(()=>{
                    window.location.href = `tel:${ URLencode(this.serviceNumber) }` ;
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
                this.$router.push({
                    name:'car',
                    params:{
                        list:this.list
                    }
                })
            },
            init(){
                customerCarList().then(data => {
                    this.list = data.data;
                    this.user.car = this.list.length ? (this.list.length > 1 ? this.list.length + ' 辆' : this.list[0].plateNo) : ''
                });
            }
        },
        computed: {
            ...mapState({
                mobile: state => state.user.userInfo.name
                // menuList: state =>state.title.menuList
            }),
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
        background: #fff;
        .head-wrap{
            margin: 0 -32px;
            box-sizing: content-box;
            height: 108px;
            padding: 32px 32px 100px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            background: linear-gradient(90deg, #2196F3 0%, #2270E4 100%);
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
            justify-content: space-around;
            padding: 48px 56px;
            width: 100%;
            box-shadow:0px 4px 5px 0px rgba(0, 0, 0, 0.08);
            position: relative;
            top:-64px;
            border-radius: 8px;
            z-index: 5;
            background: #fff;
            span{
                width: 164px;
                text-align: center;
                .svg-icon{
                    width: 44px;
                    height: 44px;
                    margin-right: 24px;
                }
                i{
                    font-size: 30px;
                    color: #303133;
                }
            }
        }
        .switch-wrap{
            margin: -64px -16px 0;
            padding: 32px 24px 0;
            .van-cell{
                padding: 20px 0;
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
    }
    .call-dialog{
        .van-dialog__message{
            padding: 80px 24px;
        }
    }
</style>