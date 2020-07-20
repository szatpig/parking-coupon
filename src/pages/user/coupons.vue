<template>
    <div class="coupons-container">
        <van-tabs v-model="tabName" swipeable sticky @change="handleTab">
            <van-tab v-for="item in tabList" :title="item.label" :key="item.value" :name="item.value"></van-tab>
        </van-tabs>
        <van-list
                class="coupons-list"
                :class="{ filter:tabName != 1 }"
                v-model="loading"
                :finished="finished"
                offset="50"
                finished-text="没有更多停车券了"
                @load="onLoad">
            <van-cell v-for="item in dataList" :key="item.id" :class="{ used:tabName==2,expired:tabName==3,cancel:item.couponStatus === 4 }">
                <template #title>
                    <div class="cell-top flex">
                        <div class="flex">
                            <span class="discount" v-if="item.couponType === 'DISCOUNT_DEDUCT'">
                                8<i>折</i>
                                <em>上限 {{ item.couponAmount }} 元</em>
                            </span>
                            <span v-else>￥<i>{{ item.couponAmount }}</i></span>
                            <div class="cell-txt">
                                <p>{{ item.plateNo }} <i>{{ picker.columns[item.plateColor] }}</i></p>
                                <p>{{ item.expirationTime }} 到期</p>
                            </div>
                        </div>
                        <van-icon class="qr-code" v-if="tabName == 1" name="qr" @click="handleQrCode(item)" />
                        <van-button v-if="tabName == 2" round size="mini" @click="handlePicker(item.id)">停车记录<van-icon name="arrow" /></van-button>
                    </div>
                    <div class="cell-bottom flex" @click.stop="handleCollapse(item.id)">
                        <div class="cell-bottom-left" :class="{ active: tempIndex == item.id }">
                            <div class="bottom-content">可用于：{{ item.parkingNames || '--' }}</div>
                            <p>券码：{{ item.couponNo }}</p>
                        </div>
                        <van-icon :name=" tempIndex == item.id ? 'arrow-down' : 'arrow-up' "/>
                    </div>
                </template>
            </van-cell>
        </van-list>
        <van-popup class="popup-container" v-model="picker.show" position="right" >
            <div class="popup-equity" v-if="picker.data && picker.data.id">
                <div class="popup-title">
                    <p>{{ this.picker.data.parkingName }}</p>
                    <p>– {{ this.picker.data.parkingAmount }}</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">{{ this.picker.data.plateNo }}<i>{{ this.picker.columns[picker.data.plateColor] }}</i></van-col>
                        <van-col span="7">停车券码</van-col>
                        <van-col span="17">{{ this.picker.data.couponNo }}</van-col>
                        <van-col span="7">停车日期</van-col>
                        <van-col span="17">{{ this.picker.data.entranceTime + ' -- '+ this.picker.data.exportTime }}</van-col>
                        <van-col span="7">停车时长</van-col>
                        <van-col span="17">{{ this.picker.data.parkingTime }}</van-col>
                        <van-col span="7">停车费用</van-col>
                        <van-col span="17">￥{{ this.picker.data.parkingAmount }}</van-col>
                        <van-col span="7">停车券抵扣</van-col>
                        <van-col span="17">￥{{ this.picker.data.verifyAmount }}</van-col>
                        <van-col span="7">实际支付</van-col>
                        <van-col span="17">￥{{ this.picker.data.realAmount }}</van-col>
                    </van-row>
                </div>
            </div>
        </van-popup>
        <van-popup class="popup-container" v-model="qrCode.show" position="right" >
            <div class="popup-equity">
                <div class="popup-header">
                    <p>{{ qrCode.data.plateNo }}</p>
                    <p v-if="qrCode.data.couponType === 'DISCOUNT_DEDUCT'">8折停车券 <i>（上限{{ qrCode.data.couponAmount }} 元）</i></p>
                    <p v-else>{{ qrCode.data.couponAmount }} 元优惠券</p>
                    <p><img :src="`${ imgUrl }/customerCouponUseDetails/getCouponQrCodeImage?token=${ userToken }&couponType=${ qrCode.data.couponType }&couponId=${ qrCode.data.id }`" /></p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">停车券码</van-col>
                        <van-col span="17">{{ qrCode.data.couponNo }}</van-col>
                        <van-col span="7">可用停车场</van-col>
                        <van-col span="17">{{ qrCode.data.parkingNames }}</van-col>
                    </van-row>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import config from '@@/config'
    import { mapState } from  'vuex'
    import { couponList,couponUseRecord, loopStatus } from '@/api/coupons-api'
    export default {
        name: "coupons",
        data() {
            return {
                tabName:1,
                tabList:[
                    {
                        value:1,
                        label:'未使用'
                    },
                    {
                        value:2,
                        label:'已使用'
                    },
                    {
                        value:3,
                        label:'已过期'
                    }
                ],
                picker:{
                    show:false,
                    columns:['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色'],
                    data:''
                },
                qrCode:{
                    show:false,
                    columns:['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色'],
                    data:''
                },
                imgUrl:config.api,
                pageIndex:1,
                dataList: [],
                tempIndex:-1,
                refreshing:false,
                loading: false,
                finished: false,
                timeInstance:null
            }
        },
        components: {},
        methods: {
            handleTab(){
                this.refreshing = true;
                // this.finished = false;
                this.onLoad();
            },
            handleCollapse(id){
                if(this.tempIndex == id ){
                    this.tempIndex = -1
                    return;
                }
                this.tempIndex = id
            },
            handleQrCode(item){
                this.qrCode.data = {
                        ...item
                }
                this.$router.push({
                    query:{
                        result:item.couponType
                    }
                });

               this.timeInstance =  setInterval(() => {
                    this.loopCheckStatus(item.id)
                },5000)

                    // FIX_DEDUCT:'固定抵扣金额券',
                    // DISCOUNT_DEDUCT:'按比例折扣',
                    // TIME_DEDUCT:'次数抵扣',
            },
            loopCheckStatus(couponId){
                let _data ={
                    couponId
                }
                loopStatus(_data).then(data => {
                    if(data.data.couponStatus === 2){
                        clearInterval(this.timeInstance);
                        this.$toast.success('核销成功');
                        this.$router.replace('/home/user/coupons')
                    }
                }).catch(()=>{
                    clearInterval(this.timeInstance);
                })

            },
            handlePicker(customerCouponId){
                let _data ={
                    customerCouponId
                }
                couponUseRecord(_data).then(data => {
                    this.picker.data = data.data;
                    if(data.data.id){
                        this.picker.show = true;
                        this.$router.push({
                            query:{
                                type:customerCouponId
                            }
                        });
                    }
                })
            },
            onLoad() {
                if (this.refreshing) {
                    this.dataList = [];
                    this.refreshing = false;
                    this.pageIndex = 1
                }
                this.list(this.pageIndex)
            },
            list(pageNum,pageSize = 8){
                let _data ={
                    couponStatus:this.tabName,
                    plateNo:this.$route.query.plateNo || '',
                    plateColor:this.$route.query.plateColor || '',
                    pageNum,
                    pageSize
                }
                couponList(_data).then(data => {
                    this.pageIndex ++;
                    this.dataList = [...this.dataList,...data.data.list];
                    if(this.dataList.length >= data.data.total){
                        this.finished = true;
                    }else{
                        this.finished = false;
                    }
                    this.error = false;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                    this.error = true;
                    this.finished = true;
                })
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(to)
                // 对路由变化作出响应...
                if(to.query.type){
                    this.picker.show = true;
                }else if(to.query.result){
                    this.qrCode.show = true;
                }else{
                    clearInterval(this.timeInstance);
                    this.picker.show = false;
                    this.qrCode.show = false;
                }
            }
        },
        computed: {
            ...mapState({
                userToken: state => state.user.userToken
                // menuList: state =>state.title.menuList
            }),
        },
        created() {
            let { type,result } = this.$route.query;
            if(type){
                if(this.picker.data){
                    this.picker.show = true;
                }else{
                    this.picker.data = ''
                    this.$router.replace('/home/user/coupons')
                }
            }else if(result){
                if(this.qrCode.data){
                    this.qrCode.show = true;
                }else{
                    this.qrCode.data = ''
                    this.$router.replace('/home/user/coupons')
                }
            }else{
                this.picker.data = ''
                this.picker.show = false;
                this.qrCode.data = ''
                this.qrCode.show = false;
            }
        }
    }
</script>

<style lang="less">
    .coupons-container{
        height: 100%;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        .van-tabs{
            flex: 0 0 90px;
            padding-top: 8px;
            background: linear-gradient(90deg, #2196F3 0%, #2270E4 100%);
            .van-tabs__nav{
                background: transparent;
                .van-tab{
                    color: #BDDAF9;
                }
                .van-tabs__line{
                    background: #fff;
                }
                .van-tab--active{
                    color: #fff;
                }
                .van-tabs__line{
                    height: 4px;
                }
                &.van-tabs__nav--line{
                    padding-bottom: 20px;
                }
            }
            .van-hairline--top-bottom{
                &:after{
                    border: none !important;
                }
            }

        }
        .coupons-list{
            height: calc(100% - 200px);
            overflow: hidden auto;
            padding: 16px;
            &.filter{
                filter: grayscale(1);
                .cell-txt{
                    p{
                        color: #909499 !important;
                    }
                }
            }
            .van-cell{
                position: relative;
                margin-bottom: 16px;
                padding: 32px 24px 16px;
                border-radius: 8px;
                background:
                        radial-gradient(circle at 0 140px, transparent 14px, #fff 0) top left / 50% 100% no-repeat,
                        radial-gradient(circle at right 140px, transparent 14px, #fff 0) bottom right /51% 100% no-repeat;
                &.used{
                     &:before{
                         content: '';
                         display: block;
                         position: absolute;
                         top:0;
                         left: 0;
                         width: 62px;
                         height: 62px;
                         background: url("../../images/used.png") top left no-repeat ;
                         background-size: cover;
                     }
                 }
                &.expired{
                    &:before{
                        content: '';
                        display: block;
                        position: absolute;
                        top:0;
                        left: 0;
                        width: 62px;
                        height: 62px;
                        background: url("../../images/expired.png") top left no-repeat ;
                        background-size: cover;
                    }
                    &.cancel{
                        &:before{
                            content: '';
                            display: block;
                            position: absolute;
                            top:0;
                            left: 0;
                            width: 62px;
                            height: 62px;
                            background: url("../../images/cancel.png") top left no-repeat ;
                            background-size: cover;
                        }
                    }
                }


                .cell-top{
                    padding-bottom: 28px;
                    border-bottom: 2px dashed #DDDEE1;
                    justify-content: space-between;
                    .flex{
                        & > span{
                            color: #FF9800;
                            font-size: 32px;
                            font-weight: bold;
                            padding-right: 32px;
                            min-width: 140px;
                            &.discount{
                                text-align: center;
                                font-size: 48px;
                                i{
                                    font-size: 20px;
                                    margin-left: 2px;
                                }
                            }
                            i{
                                margin-left: 4px;
                                font-size: 48px;
                            }
                            em{
                                display: block;
                                width: 100%;
                                font-size: 22px;
                                color: #909499;
                                font-weight: normal;
                            }
                        }
                    }
                    .qr-code{
                        position: absolute;
                        top:32px;
                        right: 26px;
                        font-size: 32px;
                    }
                    .cell-txt{
                        p{
                            font-size: 32px;
                            color: #293547;
                            line-height: 40px;
                            white-space: nowrap;
                            i{
                                margin-left: 16px;
                                font-size: 20px;
                                color: #C0C6CC;
                            }
                            &:last-child{
                                font-size: 28px;
                                color: #909499;
                            }
                        }
                    }
                    .van-button{
                        padding: 0px 8px 0 16px;
                        line-height: 32px;
                        background: #F2F4F6;
                        width:auto;
                        white-space: nowrap;
                        color: #909499;
                        .van-button__text{
                            display: flex;
                            align-items: center;
                        }
                    }
                }
                .cell-bottom{
                    align-items: flex-start;
                    font-size: 20px;
                    color: #909499;
                    line-height: 36px;
                    padding: 16px 0 0px;
                    .cell-bottom-left{
                        height: 30px;
                        overflow: hidden;
                        &.active{
                            height: auto;
                        }
                        .bottom-content{
                            width: 646px;
                        }
                    }
                    .van-icon{
                        margin-top: 6px;
                    }
                    p{
                        margin-top: 8px;
                    }
                }
            }
        }
    }
    .popup-equity{
        background-color: #fff;
        padding: 40px 48px;
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
        .popup-header{
            text-align: center;
            color: #293547;
            p{
                &:nth-child(1){
                    font-size: 28px;
                    margin-top: 40px;
                }
                &:nth-child(2){
                    font-size: 48px;
                    margin-top: 24px;
                    i{
                        color: #9ea1a6;
                        font-size: 28px;
                    }
                }
                &:nth-child(3){
                    margin-top: 40px;
                    height: 368px;
                    padding-bottom: 40px;
                    text-align: center;
                    border-bottom: 1px solid #DDDEE1;
                    img{
                        height: 100%;
                        width: auto;
                    }
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
</style>