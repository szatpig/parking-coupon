<template>
    <div class="coupon-container">
        <div class="coupon-car-list">
            <template v-for="item in carList">
                <div class="car-cell flex" :class="{ active: item.unReceivedCount }">
                    <div class="flex">
                        <img v-if="item.unReceivedCount" src="../../images/car-active.png" alt="">
                        <img  v-else src="../../images/car-head.png" alt="">
                        <div class="car-info">
                            <p>{{ item.plateNo }}</p>
                            <p>{{ item.unReceivedCount ? `${ item.unReceivedCount } 张新券待领`:`已有 ${ item.unUsedCount } 张优惠券` }}</p>
                        </div>
                    </div>
                    <van-button v-if="item.unReceivedCount" round size="small" type="warning" @click="handleGet(item)">立即领取</van-button>
                    <van-button v-else round size="small" @click="$router.push('/home/user/coupons')">查看全部<van-icon name="arrow" /></van-button>
                </div>
            </template>

            <div class="car-cell flex">
                <div class="flex">
                    <img src="../../images/car-head.png" alt="">
                    <div class="car-info">
                        <p @click="$router.push('/home/user/car?type=add')">+新增车辆</p>
                    </div>
                </div>
            </div>
        </div>
        <van-overlay class="overlay-container" :show="overlay.show" >
            <div class="overlay-wrapper">
                <div class="header-wrap">
                    <van-icon name="close" size="28" @click="overlay.show = false"/>
                </div>
                <div class="bottom-wrap">
                    <p>您的车辆苏E888U8获得 {{ couponList.length }} 张优惠券！</p>
                    <div class="list-wrap">
                        <div class="flex" v-for="item in couponList" :key="item.id">
                            <div class="list-txt">
                                <p>停车优惠券</p>
                                <p>{{ item.expirationTime }} 到期</p>
                            </div>
                            <span>￥<i>{{ item.couponAmount }} </i></span>
                        </div>
                    </div>
                </div>
            </div>

        </van-overlay>
    </div>
</template>

<script>
    import { customerCarCouponList, receiveCoupons } from '@/api/user-api'
    import WxMixin from '@/mixins/wxMixin'
    export default {
        name: "coupon",
        data() {
            return {
                overlay:{
                    show:false
                },
                carList:[],
                couponList:[]
            }
        },
        components: {},
        mixins:[WxMixin],
        methods: {
            handleGet({ id, plateNo ,plateColor }){
                receiveCoupons({
                    id, plateNo ,plateColor
                }).then(data => {
                    this.couponList = data.data
                    this.overlay.show = true;
                })
            },
            list(){
                customerCarCouponList().then(data => {
                    this.carList = data.data;
                })
            }
        },
        computed: {},
        created() {
            this.list();
        }
    }
</script>

<style lang="less">
    .coupon-container{
        background:url("../../images/coupon-bg.png") top center / 100% 240px no-repeat; //radial-gradient( circle at 0 360px,#2E72F4 240px , #2E72F4 0 ) top center / 100% 240px no-repeat;
        padding-top: 176px;
        .coupon-car-list{
            padding: 0 32px;
        }
        .car-cell{
            padding: 48px 32px;
            border-radius: 8px;
            box-shadow: 0 0 5px #eee;
            margin-bottom: 16px;
            justify-content: space-between;
            background: #fff url("../../images/car-bg.png") bottom right / contain no-repeat;
            &.active{
                padding: 16px 32px;
                img{
                        height: 144px;
                        width: 144px;
                    margin-left: -12px;
                }
            }
            img{
                height: 96px;
                width: 96px;
            }
            .car-info{
                margin-left: 32px;
                p{
                    font-size: 24px;
                    color: #909499;
                    &:first-child{
                        font-size: 32px;
                        color: #57626D;
                        margin-bottom: 12px;
                    }
                }
            }
            .van-button{
                padding: 0 20px;
                &.van-button--default{
                    padding:  0 12px 0 20px;
                    .van-button__text{
                        display: flex;
                        align-items: center;
                    }
                }
            }
        }
    }
</style>