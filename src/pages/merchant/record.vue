<template>
    <div class="merchant-record-container">
        <div class="coupon-header">
            <p>核销记录</p>
            <div class="coupon-time flex">
                <span @click="handlePicker('start')">{{ search.start || '开始时间' }}</span>
                <i>至</i>
                <span @click="handlePicker('end')">{{ search.end || '结束时间' }}</span>
            </div>
        </div>
        <div class="coupon-list">
            <van-index-bar :index-list="[]">
                <van-index-anchor index="2019" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00"  @click="handleShow({ id: 1 })"/>
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" /><van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />



                <van-index-anchor index="2020" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
                <van-cell center title="苏E8F2S8" label="今天  14:22:21" value="20.00" />
            </van-index-bar>
        </div>
        <van-popup class="popup-container" v-model="popup.show" position="right" >
            <div class="popup-record">
                <div class="popup-title">
                    <span>核销金额</span>
                    <p>{{ popup.data.industryUser || '--' }}</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">{{ popup.data.plateNo }}<i>{{ picker.columns[popup.data.plateColor] }}</i></van-col>
                        <van-col span="7">停车券码</van-col>
                        <van-col span="17">{{ popup.data.couponNo }}</van-col>
                        <van-col span="7">停车券类型</van-col>
                        <van-col span="17">{{ popup.data.equityGrantTime }}</van-col>
                        <van-col span="7">核销时间</van-col>
                        <van-col span="17">{{ popup.data.expirationTime }}</van-col>
                    </van-row>
                </div>
            </div>
        </van-popup>
        <van-popup class="popup-picker-container" v-model="picker.show" position="bottom">
            <van-datetime-picker
                    v-model="picker.date"
                    type="date"
                    title="选择年月日"
                    :min-date="picker.minDate"
                    :max-date="picker.maxDate"
                    @confirm="handleConfirm"
                    @cancel="picker.show = false"
            />
        </van-popup>
    </div>
</template>

<script>
    import { transDate } from '@/utils/util'
    export default {
        name: "record",
        data() {
            return {
                search:{
                    start:'',
                    end:''
                },
                picker:{
                    show:false,
                    type:'start',
                    columns:['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色'],
                    minDate: new Date(2018, 0, 1),
                    maxDate: new Date(),
                    date:new Date()
                },
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
                    this.popup.data = item;
                    this.$router.push({
                        query:{
                            id:item.id
                        }
                    });
                }catch (e) {

                }

            },
            handlePicker(val){
                this.picker.type = val;
                this.picker.show = true;
                if( this.picker.type === 'end'){
                    this.picker.minDate = this.search.start ? new Date(this.search.start) : new Date(2018, 0, 1)
                    this.picker.maxDate = new Date()
                }else{
                    this.picker.minDate = new Date(2018, 0, 1),
                    this.picker.maxDate = this.search.end ? new Date(this.search.end) : new Date()
                }
            },
            handleConfirm(val,index){
                console.log(val,index)
                this.picker.show = false;
                this.search[this.picker.type] = transDate(val) ;
            }
        },
        watch: {
            '$route' (to, from) {
                console.log(to,from)
                // 对路由变化作出响应...
                if(to.query.id > 0){
                    document.title = 'ETC停车场 - 核销金额';
                    this.popup.show = true;
                }else{
                    document.title = 'ETC停车场 - 核销记录';
                    this.popup.show = false;
                }
            }
        },
        computed: {},
        created() {
            if(this.$route.query.id > 0){
                if(this.popup.data){
                    this.$route.meta.title = '核销金额';
                    this.popup.show = true;
                }else{
                    this.popup.data = '';
                    this.$router.push('/merchant/record')
                }
            }else{
                this.$route.meta.title = '核销记录';
                this.popup.data = '';
                this.popup.show = false;
            }
        }
    }
</script>

<style lang="less">
    .merchant-record-container{
        height: 100%;
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        .coupon-header{
            height: 200px;
            background: linear-gradient(90deg, #2196F3 0%, #2270E4 100%);
            color: #fff;
            text-align: center;
            font-size: 32px;
            p{
                margin: 26px 0 40px;
            }
            .coupon-time{
                justify-content: space-evenly;
                span{
                    width: 200px ;
                    font-size: 28px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(189, 218, 249, 0.5);;
                }
                i{
                    padding-bottom: 12px;
                }
            }
        }
        .coupon-list{
            height:calc(100% - 200px);
            position: relative;
            overflow-y: auto;
        }
    }
    .popup-record{
        background-color: #fff;
        padding: 40px 48px;
        height: 100%;
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