<template>
    <div class="coupon-container">
        <div class="coupon-car-list">
            <div class="car-cell flex active">
                <div class="flex">
                    <img class="" src="../../images/car-active.png" alt="">
                    <div class="car-info">
                        <p>苏E8F2S8</p>
                        <p>4张新券待领</p>
                    </div>
                </div>
                <van-button round size="small" type="warning" @click="handleGet">立即领取</van-button>
            </div>
            <div class="car-cell flex">
                <div class="flex">
                    <img src="../../images/head-img.png" alt="">
                    <div class="car-info">
                        <p>苏E8F2S8</p>
                        <p>已有10张优惠券</p>
                    </div>
                </div>
                <van-button round size="small" @click="$router.push('/home/user/coupons')">查看全部<van-icon name="arrow" /></van-button>
            </div>
            <div class="car-cell flex">
                <div class="flex">
                    <img src="../../images/head-img.png" alt="">
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
                    <p>您的车辆苏E888U8获得3张优惠券！</p>
                    <div class="list-wrap">
                        <div class="flex">
                            <div class="list-txt">
                                <p>停车优惠券</p>
                                <p>2020–02–20 23:59到期</p>
                            </div>
                            <span>￥<i>4000</i></span>
                        </div>
                        <div class="flex">
                            <div class="list-txt">
                                <p>停车优惠券</p>
                                <p>2020–02–20 23:59到期</p>
                            </div>
                            <span>￥<i>4000</i></span>
                        </div>
                    </div>
                </div>
            </div>

        </van-overlay>
    </div>
</template>

<script>
    export default {
        name: "coupon",
        data() {
            return {
                overlay:{
                    show:false
                }
            }
        },
        components: {},
        methods: {
            handleGet(){
                this.overlay.show = true;
            }
        },
        computed: {},
        created() {
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