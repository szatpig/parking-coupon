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
            <van-cell v-for="item in dataList" :key="item.id" :class="{ used:tabName==2,expired:tabName==3 }">
                <template #title>
                    <div class="cell-top flex">
                        <div class="flex">
                            <span>￥<i>{{ item.couponAmount }}</i></span>
                            <div class="cell-txt">
                                <p>{{ item.plateNo }} <i>{{ picker.columns[item.plateColor] }}</i></p>
                                <p>{{ item.expirationTime }} 到期</p>
                            </div>
                        </div>
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
            <div class="popup-equity" v-if="this.picker.data && this.picker.data.id">
                <div class="popup-title">
                    <p>{{ this.picker.data.parkingName }}</p>
                    <p>– {{ this.picker.data.realAmount.toFixed(2) }}</p>
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
    </div>
</template>

<script>
    import { couponList,couponUseRecord } from '@/api/coupons-api'
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
                pageIndex:1,
                dataList: [],
                tempIndex:-1,
                refreshing:false,
                loading: false,
                finished: false,
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
                this.tempIndex = id
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
                }else{
                    this.picker.show = false;
                }
            }
        },
        computed: {},
        created() {
            let { type } = this.$route.query;
            if(type){
                if(this.picker.data){
                    this.picker.show = true;
                }else{
                    this.picker.data = ''
                    this.$router.replace('/home/user/coupons')
                }
            }else{
                this.picker.data = ''
                this.picker.show = false;
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
                            i{
                                margin-left: 4px;
                                font-size: 48px;
                            }
                        }
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