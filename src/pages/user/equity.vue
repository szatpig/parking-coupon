<template>
    <div class="equity-container">
        <div class="equity-wrap">
            <p  @click="handlePicker">{{ search.plateNo }} <span>（{{ this.picker.columns[this.search.plateColor] }})<van-icon name="arrow-down" /></span></p>
            <p><span>余额</span><i>￥</i>{{ picker.income }}</p>
        </div>
        <van-tabs v-model="search.tabName" swipeable sticky @change="handleTab">
            <van-tab v-for="item in tabList" :title="item.label"></van-tab>
        </van-tabs>
        <van-list
                class="equity-list"
                v-model="loading"
                :finished="finished"
                offset="50"
                finished-text="没有更多了"
                @load="onLoad">
            <van-cell v-for="item in dataList"
                      :key="item.id"
                      :value="search.tabName==0 ? (' + ' +item.equityBalance.toFixed(2)):(' - ' + item.changeAmount.toFixed(2))"
                      is-link
                      @click="handleShow(item)">
                <template #title>
                    <div class="equity-income" v-if="search.tabName==0">
                        <p>{{ item.industryUser }}</p>
                        <p>{{ item.expirationTime }} 到期</p>
                    </div>
                    <div class="expenditure" v-else>
                        <p>{{ item.changeType == 6 ? (item.parkingName || '--'):typeList[item.changeType] }}</p>
                        <p>{{ item.changeTime }}</p>
                        <p>{{ item.industryUser }}</p>
                    </div>
                </template>
            </van-cell>
        </van-list>
        <van-popup class="popup-container" v-model="popup.show" position="right" >
            <div class="popup-equity" v-if="$route.query.type == 2">
                <div class="popup-title">
                    <p>{{ this.popup.data.parkingNames || '--' }}</p>
                    <p>+{{ this.popup.data.equityAmount.toFixed(2) }}</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">{{ this.popup.data.plateNo }}<i>{{ this.picker.columns[this.popup.data.plateColor] }}</i></van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">{{ this.popup.data.couponNo }}</van-col>
                        <van-col span="7">收入时间</van-col>
                        <van-col span="17">{{ this.popup.data.equityGrantTime }}</van-col>
                        <van-col span="7">截止时间</van-col>
                        <van-col span="17">{{ this.popup.data.expirationTime }}</van-col>
                        <van-col span="7">可用停车场</van-col>
                        <van-col span="17">{{ this.popup.data.parkingNames || '--' }}</van-col>
                    </van-row>
                </div>
            </div>
            <div class="popup-equity" v-else-if ="$route.query.type == 4">
                <div class="popup-title">
                    <p>过期作废</p>
                    <p>–{{ this.popup.data.verifyAmount.toFixed(2) }}</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">{{ this.popup.data.plateNo }}<i>{{ this.picker.columns[this.popup.data.plateColor] }}</i></van-col>
                        <van-col span="7">所属行业</van-col>
                        <van-col span="17">{{ this.popup.data.industryUser }}</van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">{{ this.popup.data.couponNo }}</van-col>
                        <van-col span="7">过期时间</van-col>
                        <van-col span="17">{{ this.popup.data.changeTime }}</van-col>
                        <van-col span="7">券码余额</van-col>
                        <van-col span="17">￥{{ this.popup.data.equityBalance }}</van-col>
                    </van-row>
                </div>
            </div>
            <div class="popup-equity" v-else-if ="$route.query.type == 8">
                <div class="popup-title">
                    <p>撤销收回</p>
                    <p>–{{ this.popup.data.verifyAmount.toFixed(2) }}</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">{{ this.popup.data.plateNo }}<i>{{ this.picker.columns[this.popup.data.plateColor] }}</i></van-col>
                        <van-col span="7">所属行业</van-col>
                        <van-col span="17">{{ this.popup.data.industryUser }}</van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">{{ this.popup.data.couponNo }}</van-col>
                        <van-col span="7">撤销时间</van-col>
                        <van-col span="17">{{ this.popup.data.changeTime }}</van-col>
                        <van-col span="7">券码余额</van-col>
                        <van-col span="17">￥{{ this.popup.data.equityBalance }}</van-col>
                    </van-row>
                </div>
            </div>
            <div class="popup-equity" v-else-if ="$route.query.type == 6">
                <div class="popup-title">
                    <p>{{ this.popup.data.parkingNames }}</p>
                    <p>-{{ this.popup.data.verifyAmount.toFixed(2) }}</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">{{ this.popup.data.plateNo }}<i>{{ this.picker.columns[this.popup.data.plateColor] }}</i></van-col>
                        <van-col span="7">所属行业</van-col>
                        <van-col span="17">{{ this.popup.data.industryUser }}</van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">{{ this.popup.data.couponNo }}</van-col>
                        <van-col span="7">停车日期</van-col>
                        <van-col span="17">{{ this.popup.data.entranceTime }} -- {{ this.popup.data.exportTime }}</van-col>
                        <van-col span="7">停车时长</van-col>
                        <van-col span="17">{{ this.popup.data.parkingTime }}</van-col>
                        <van-col span="7">停车费用</van-col>
                        <van-col span="17">￥{{ this.popup.data.parkingAmount }}</van-col>
                        <van-col span="7">权益金抵扣</van-col>
                        <van-col span="17">￥{{ this.popup.data.verifyAmount }}</van-col>
                        <van-col span="7">实际支付</van-col>
                        <van-col span="17">￥{{ this.popup.data.realAmount }}</van-col>
                        <van-col span="7">券码余额</van-col>
                        <van-col span="17">￥{{ this.popup.data.equityBalance }}</van-col>
                    </van-row>
                </div>
            </div>
        </van-popup>
        <van-popup class="popup-picker-container" v-model="picker.show" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="picker.carList"
                    confirm-button-text="确定"
                    @confirm="handleConfirm"
                    @cancel="picker.show = false"
            />
        </van-popup>
    </div>
</template>

<script>
    import { payList, payDetail, incomeList, incomeDetail } from '@/api/coupons-api'
    import { customerCarList } from '@/api/user-api'
    export default {
        name: "equity",
        data() {
            return {
                search:{
                    tabName:0,
                    plateNo:'',
                    plateColor:''
                },
                tabList:[
                    {
                        value:0,
                        label:'收入'
                    },
                    {
                        value:1,
                        label:'支出'
                    }
                ],
                picker:{
                    show:false,
                    columns:['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色'],
                    carList:[],
                    income:0
                },
                typeList:{
                    4:'权益金额到期返还',
                    6:'车主使用权益金',
                    8:'撤销权益金'
                },
                pageIndex:1,
                dataList: [],
                refreshing:false,
                loading: true,
                finished: false,
                popup:{
                    show:false,
                    data:'',
                }
            }
        },
        components: {},
        methods: {
            async handleShow(item){
                let data = '';
                try {
                    if(this.search.tabName){
                        data = await payDetail({ changeLogId:item.id })
                    }else{
                        data = await incomeDetail({ equityId:item.id })
                    }
                    this.popup.data = data.data;
                    this.$router.push({
                        query:{
                            type: this.search.tabName ? item.changeType : 2
                        }
                    });
                }catch (e) {

                }

            },
            handleTab(name){
                this.refreshing = true;
                this.search.tabName = name;
                this.onLoad();
            },
            handlePicker(){
                this.picker.show = true;
            },
            handleConfirm(val,index){
                console.log(val,index)
                this.search.plateNo = this.picker.carList[index].text;
                this.search.plateColor = this.picker.carList[index].color;
                this.picker.show = false;
                this.search.tabName = 0;
                this.refreshing = true;
                this.onLoad()
            },
            async onLoad() {
                if (this.refreshing) {
                    this.dataList = [];
                    this.refreshing = false;
                    this.pageIndex = 1
                }
                this.list(this.pageIndex)
            },
            async list(pageNum,pageSize = 8){
                let _data ={
                    plateNo:this.search.plateNo,
                    plateColor:this.search.plateColor,
                    pageNum,
                    pageSize
                }
                let data = [],total = 0

                try {
                    if(this.search.tabName){
                        data = await payList(_data)
                        this.dataList = [...this.dataList,...data.data.list];
                        total = data.data.total;
                    }else{
                        data = await incomeList(_data)
                        this.picker.income = data.data.equityBalanceSum
                        this.dataList = [...this.dataList,...data.data.pageInfo.list];
                        total = data.data.pageInfo.total;
                    }
                    this.pageIndex ++ ;
                    if(this.dataList.length >= total){
                        this.finished = true;
                    }else{
                        this.finished = false;
                    }
                    this.error = false;
                    this.loading = false;
                }catch (e) {
                    this.loading = false;
                    this.error = true;
                    this.finished = true;
                    console.log(e);
                }
            },
            init(){
                customerCarList().then(data => {
                    console.log(data.data)
                    this.picker.carList = data.data.map(item => ({
                        text:item.plateNo,
                        value:item.id,
                        color:item.plateColor
                    }));
                    this.search.plateNo = this.picker.carList[0].text;
                    this.search.plateColor = this.picker.carList[0].color;
                    this.loading=false;
                })
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(to)
                // 对路由变化作出响应...
                if(to.query.type){
                    this.popup.show = true;
                }else{
                    this.popup.show = false;
                }
            }
        },
        computed: {},
        created() {
            let { type } = this.$route.query;
            if(type){
                if(this.popup.data){
                    this.popup.show = true;
                }else{
                    this.popup.data = ''
                    this.$router.replace('/home/user/equity')
                }
            }else{
                this.popup.data = ''
                this.popup.show = false;
            }
            this.init();
        }
    }
</script>

<style lang="less">
    .equity-container{
        height: 100%;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        .equity-wrap{
            padding: 40px 0 56px;
            background: url("./../../images/user-bg.png") center top no-repeat;
            p{
                color: #fff;
                text-align: center;
                font-size: 32px;
                span{
                    font-size: 26px;
                    display: inline-flex;
                    align-items: center;
                    i{
                        margin-left: 8px;
                    }
                }
                &:last-child{
                    margin-top: 24px;
                    font-size: 40px;
                    span{
                        margin-right: 12px;
                        font-size: 24px;
                        color: #BDDAF9;
                    }
                    i{
                        margin-right: 2px;
                        font-size: 24px;
                    }
                }
            }
        }
        .van-tabs{
            flex: 0 0 90px;
            padding-top: 8px;
            background-color: #fff;
            .van-tabs__nav{
                background: transparent;
                .van-tab{
                    color:#57626D;
                }
                .van-tabs__line{
                    background: #2196F3;
                }
                .van-tab--active{
                    color: #2196F3;
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
        .equity-list{
            height: calc(100% - 392px);
            overflow: hidden auto;
            .van-cell{
                position: relative;
                border-radius: 8px;
                background:#fff;
                display: flex;
                align-items: center;
                .equity-income,.expenditure{
                    p{
                        font-size: 24px;
                        color: #909499;
                        &:first-child{
                            color: #293547;
                            font-size: 28px;
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
                    padding: 16px 0 8px;
                    .cell-bottom-left{
                        height: 30px;
                        overflow: hidden;
                    }
                    .van-icon{
                        margin-top: 6px;
                    }
                    p{
                        margin-top: 12px;
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