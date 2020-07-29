<template>
    <div class="merchant-scan-container">
        <p>扫一扫，核销优惠券</p>
        <p class="scan-wrapper">
            <img @click="handleScan" src="../../images/scan.png" />
        </p>
        <p @click="handleLink">核销记录</p>
    </div>
</template>

<script>
    import { couponDetail } from '@/api/merchant-api'
    export default {
        name: "scan",
        data() {
            return {}
        },
        components: {},
        methods: {
            handleScan(){
                // this.getDetail(30193)
                // return false;
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: (data) => { // 当needResult 为 1 时，扫码返回的结果
                        this.getDetail(data.resultStr)
                    }
                });
            },
            getDetail(id){
                let _data ={
                    id
                }
                couponDetail(_data).then(() => {
                    this.$router.push({
                        path:`coupon/${ id }`
                    });
                }).catch(e =>{

                })
            },
            handleLink(){
                this.$router.push('record')
            }

        },
        computed: {},
        created() {
        }
    }
</script>

<style lang="less">
    .merchant-scan-container{
        height: 100%;
        background-color: #fff;
        text-align: center;
        font-size: 32px;
        color: #909499;
        p{
            &:first-child{
                margin-top: 192px;
            }
            &.scan-wrapper{
                height: 240px;
                margin-top: 80px;
                img{
                    height: 100%;
                    width: auto;
                }
            }
            &:last-child{
                margin-top: 480px;
                color: #2196F3;
            }
        }
    }
</style>