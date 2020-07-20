<template>
    <div class="merchant-coupon-container">
        <div class="coupon-header">
            <p class="discount" v-if="coupon.couponType === 'DISCOUNT_DEDUCT'">8折停车券（上限{{ coupon.couponAmount }}元）</p>
            <p v-else>{{ coupon.couponAmount }} 元优惠券</p>
            <p class="amount-wrapper" @click="handleInput">停车总额 <i>{{ amount || '请输入金额' }}</i>  元</p>
        </div>
        <div class="popup-coupon">
            <div class="popup-content">
                <van-row>
                    <van-col span="7">车牌号码</van-col>
                    <van-col span="17">{{ coupon.plateNo || '--' }}<i>{{ columns[coupon.plateColor] }}</i></van-col>
                    <van-col span="7">停车券码</van-col>
                    <van-col span="17">{{coupon.couponNo || '--' }}</van-col>
                    <van-col span="7">可用停车场</van-col>
                    <van-col span="17" style="max-height: 150px;overflow-y: auto">{{ coupon.parkingNames || '--'}}</van-col>
                    <van-col span="7">核销金额</van-col>
                    <van-col span="17">{{ coupon.verifyAmount || '--'}} 元</van-col>
                    <van-col span="7">还需支付</van-col>
                    <van-col span="17">{{ coupon.actualPaidAmount || '--'}} 元</van-col>
                </van-row>
                <van-button
                        :disabled="amount - 0 < 1"
                        class="check-submit"
                        size="large"
                        round
                        @click="handleCheck">确认核销</van-button>
            </div>
        </div>
        <van-popup class="popup-container" v-model="popup.show" position="right" >
            <div class="popup-result">
                <p class="status" :class="result.status == true? 'success': 'fail'">
                    <van-icon :name="result.status == true? 'success': 'fail'" />
                </p>
                <p class="status-text">核销{{ result.status == true ? '成功':'失败' }}</p>
                <p class="status-tips">
                    <template  v-if="result.status == true">
                        <template v-if="coupon.couponType === 'FIX_DEDUCT'">
                            已核销{{ coupon.couponAmount }}元
                        </template>
                        <template v-else>
                            已核销{{ result.verifyAmount }}元，还需支付{{ result.actualPaidAmount }}元
                        </template>
                    </template>
                    <template v-else>
                        {{ result.msg }}
                    </template>
                </p>
                <p class="status-button">
                    <template v-if="result.status == true">
                        <van-button
                                class="check-submit"
                                size="large"
                                round
                                @click="$router.push('/merchant/scan')">完成</van-button>
                    </template>
                    <template v-else>
                        <van-button
                                class="check-submit"
                                size="large"
                                round
                                @click="handleScan">重新扫码</van-button>
                    </template>
                </p>
                <p class="status-back" v-if="result.status == false"><router-link to="/merchant/scan">返回首页</router-link></p>
            </div>
        </van-popup>
        <van-number-keyboard
                :show="show"
                theme="custom"
                extra-key="."
                close-button-text="完成"
                :maxlength="8"
                @blur="handleDone"
                v-model="amount"
        />
    </div>
</template>

<script>
    import { couponDetail, getHumanVerifyInfo, verifyCoupon } from '@/api/merchant-api'
    export default {
        name: "coupon",
        data() {
            return {
                show:false,
                amount: '',
                columns:['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色'],
                coupon:{
                    couponNo:'',
                    discount:'',
                    couponType:'',
                    plateNo:'',
                    plateColor:'',
                    couponAmount:'',
                    parkingNames:'',
                    verifyAmount:0,
                    actualPaidAmount:0
                },
                popup:{
                    show:false,
                    data:'',
                },
                result:{
                    status:'',
                    msg:'--',
                    verifyAmount:'',
                    actualPaidAmount:''
                }
            }
        },
        components: {},
        methods: {
            handleInput(){
                this.show = true;
            },
            handleDone() {
                this.show = false;
                if(parseInt(this.amount) > 0){
                    let _data ={
                        couponId:this.$route.params.couponId,
                        parkingAmount:this.amount
                    }
                    getHumanVerifyInfo(_data).then(data => {
                        this.coupon = {
                            ...this.coupon,
                            ...data.data
                        }
                    })
                }else{
                    this.amount = '';
                    this.coupon.verifyAmount = 0;
                    this.coupon.actualPaidAmount = 0
                }
            },
            handleCheck(){
                let _data ={
                    couponId:this.$route.params.couponId,
                    parkingAmount:this.amount
                }
                verifyCoupon(_data).then(data => {
                    this.result = {
                        ...this.result,
                        ...data.data,
                        status:true
                    }
                    this.$router.replace({
                        query:{
                            result: true
                        }
                    })
                }).catch((err)=>{
                    console.log(err)
                    this.result = {
                        ...this.result,
                        msg:err.msg,
                        status:false
                    }
                    this.$router.replace({
                        query:{
                            result: false
                        }
                    })
                })
            },
            getDetail(id){
                let _data ={
                    id
                }
                couponDetail(_data).then(data => {
                    this.coupon = {
                        ...this.coupon,
                        ...data.data
                    }
                })
            },
            handleScan(){
                // this.$router.replace({
                //     path:`/merchant/coupon/39194`
                // });
                // return false;
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: (data) => { // 当needResult 为 1 时，扫码返回的结果
                        this.$router.replace({
                            path:`/merchant/coupon/${ data.resultStr }`
                        });
                    }
                });
            },
        },
        watch: {
            '$route' (to, from) {
                // 对路由变化作出响应...
                if(to.query.result !== undefined){
                    document.title = 'ETC停车场 - 核销结果';
                    this.popup.show = true;
                }else{
                    document.title = 'ETC停车场 - 核销确认';
                    this.popup.show = false;
                }
            }
        },
        computed: {},
        created() {
            let { couponId } = this.$route.params;
            this.getDetail(couponId);
            if(this.$route.query.result !== undefined){
                this.popup.show = false;
                this.$router.replace('/merchant/coupon/' + couponId)
            }
        }
    }
</script>

<style lang="less">
    .merchant-coupon-container{
        height: 100%;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        background-color: #fff;
        .coupon-header{
            height: 200px;
            background: linear-gradient(90deg, #2196F3 0%, #2270E4 100%);
            text-align: center;
            color: #fff;
            position: relative;
            p{
                margin-top: 38px;
                font-size: 48px;
            }
            .amount-wrapper{
                position: absolute;
                left:50%;
                transform: translateX(-50%);
                height: 132px;
                width: 560px;
                line-height: 132px;
                box-shadow: 0 2px 8px rgba(13, 71, 161, 0.1);
                border-radius: 4px;
                background-color: #fff;
                font-size: 28px;
                color: #293547;
                i{
                    display: inline-block;
                    width: 200px;
                    color: #C0C6CC;
                    position: relative;
                    &:after{
                        content: '';
                        display: block;
                        height: 2px;
                        position: absolute;
                        left:16px;
                        right: 16px;
                        bottom: 36px;

                        background-color: #DDDEE1;
                    }
                }
            }
        }
        .popup-coupon{
            background-color: #fff;
            padding: 40px 48px;
            margin-top: 16px;
            .popup-title{
                padding-bottom: 40px;
                text-align: center;
                border-bottom: 1px solid #DDDEE1;
                p{
                    font-size: 28px;
                    color: #293547;
                    &:last-child{
                        margin-top: 24px;
                        font-size: 56px;
                        color: #000000;
                    }
                }
            }
            .popup-content{
                padding: 40px 32px 0;
                .van-col{
                    line-height: 60px;
                    font-size: 28px;
                    color: #293547;
                }
                .van-col--7{
                    color: #909499;
                }
                i{
                    margin-left: 16px;
                    font-size: 22px;
                    color: #909499;
                }
            }
        }
        .check-submit{
            line-height: 88px;
            height: 88px;
            margin-top: 48px;
            color: #fff;
            background-color: @primary-color;
            &[disabled]{
                background-color: #B2D2FF;
            }
        }
    }
    .popup-result{
        height: 100%;
        overflow: hidden;
        background-color: #fff;
        text-align: center;
        p{
            font-size: 28px;
            &.status{
                width: 176px;
                height: 176px;
                line-height: 176px;
                border-radius: 176px;
                margin: 80px auto 0;
                color: #fff;
                font-size: 88px;
                &.success{
                    background-color:#07C160 ;
                }
                &.fail{
                    background-color:#FA5151 ;
                }
            }
            &.status-text{
                margin-top: 48px;
                font-size: 40px;
            }
            &.status-tips{
                margin-top: 24px;
                color: #909499;
            }
            &.status-button{
                padding: 0 48px;
            }
            &.status-back{
                margin-top: 32px;
                a{
                    color: #2196F3;
                }
            }
        }
    }

</style>