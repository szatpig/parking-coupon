<template>
    <div class="coupon-container">
        <div class="coupon-car-list">
            <div class="car-cell flex">
                <div class="flex">
                    <img src="../../images/head-img.png" alt="">
                    <div class="car-info">
                        <p>苏E8F2S8</p>
                        <p>4张新券待领</p>
                    </div>
                </div>
                <van-button round size="small" type="warning">立即领取</van-button>
            </div>
            <div class="car-cell flex">
                <div class="flex">
                    <img src="../../images/head-img.png" alt="">
                    <div class="car-info">
                        <p>苏E8F2S8</p>
                        <p>已有10张优惠券</p>
                    </div>
                </div>
                <van-button round size="small">查看全部<van-icon name="arrow" /></van-button>
            </div>
            <div class="car-cell flex">
                <div class="flex">
                    <img src="../../images/head-img.png" alt="">
                    <div class="car-info">
                        <p>+新增车辆</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {}
        },
        components: {},
        methods: {},
        computed: {},
        created() {
        }
    }
</script>

<style lang="less">
    .coupon-container{
        background: radial-gradient( circle at 0 360px,#2E72F4 240px , #2E72F4 0 ) top center / 100% 240px no-repeat;
        padding-top: 176px;
        .coupon-car-list{
            padding: 0 32px;
        }
        .car-cell{
            padding: 48px 32px;
            border-radius: 8px;
            box-shadow: 0 0 5px #eee;
            background: #fff;
            margin-bottom: 16px;
            justify-content: space-between;
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
                        margin-bottom: 16px;
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