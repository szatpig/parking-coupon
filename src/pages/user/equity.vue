<template>
    <div class="equity-container">
        <div class="equity-wrap">
            <p>苏E8F2S8 <span>（蓝牌)<van-icon name="arrow-down" /></span></p>
            <p><span>余额</span><i>￥</i>768.00</p>
        </div>
        <van-tabs v-model="tabName" swipeable sticky>
            <van-tab v-for="item in tabList" :title="item.label"></van-tab>
        </van-tabs>
        <van-list
                class="equity-list"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
            <van-cell v-for="item in list" :key="item" :title="item" :value="item" is-link @click="handleShow(item)">
                <template #title>
                    <div class="equity-income" v-if="tabName==0">
                        <p>工商银行苏州分行</p>
                        <p>2020–02–14  12:24:24到期</p>
                    </div>
                    <div class="expenditure" v-else>
                        <p>苏州工业大学纳姆科技园停车场</p>
                        <p>2020–02–14  12:24:24</p>
                        <p>工商银行苏州分行权益金</p>
                    </div>
                </template>
            </van-cell>
        </van-list>
        <van-popup class="popup-container" v-model="popup.show" position="right" >
            <div class="popup-equity">
                   <div class="popup-title">
                       <p>苏州工业大学纳姆科技园停车场</p>
                       <p>–15.00</p>
                   </div>
                   <div class="popup-content">
                       <van-row>
                           <van-col span="7">车牌号码</van-col>
                           <van-col span="17">苏E98GH6</van-col>
                           <van-col span="7">停车券码</van-col>
                           <van-col span="17">877661ge267765abf222</van-col>
                           <van-col span="7">停车日期</van-col>
                           <van-col span="17">2020–02–24 12:22:34 至 2020–02–24 16:54:24</van-col>
                           <van-col span="7">停车时长</van-col>
                           <van-col span="17">3小时18分40秒</van-col>
                           <van-col span="7">停车费用</van-col>
                           <van-col span="17">￥20</van-col>
                           <van-col span="7">停车券抵扣</van-col>
                           <van-col span="17">￥5</van-col>
                           <van-col span="7">实际支付</van-col>
                           <van-col span="17">￥15</van-col>
                       </van-row>
                   </div>
               </div>
            <div class="popup-equity">
                <div class="popup-title">
                    <p>过期作废</p>
                    <p>–150.00</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">苏E98GH6</van-col>
                        <van-col span="7">所属行业</van-col>
                        <van-col span="17">工商银行苏州分行</van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">877661ge267765abf222</van-col>
                        <van-col span="7">过期时间</van-col>
                        <van-col span="17">2020–02–24 12:22:34</van-col>
                        <van-col span="7">券码余额</van-col>
                        <van-col span="17">￥0.00</van-col>
                    </van-row>
                </div>
            </div>
            <div class="popup-equity">
                <div class="popup-title">
                    <p>撤销收回</p>
                    <p>–150.00</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">苏E98GH6</van-col>
                        <van-col span="7">所属行业</van-col>
                        <van-col span="17">工商银行苏州分行</van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">877661ge267765abf222</van-col>
                        <van-col span="7">撤销时间</van-col>
                        <van-col span="17">2020–02–24 12:22:34</van-col>
                        <van-col span="7">券码余额</van-col>
                        <van-col span="17">￥0.00</van-col>
                    </van-row>
                </div>
            </div>
            <div class="popup-equity">
                <div class="popup-title">
                    <p>工商银行苏州分行</p>
                    <p>+1520.00</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">苏E98GH6<i>蓝牌</i></van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">877661ge267765abf222</van-col>
                        <van-col span="7">收入时间</van-col>
                        <van-col span="17">2020–02–24 12:22:34</van-col>
                        <van-col span="7">截止时间</van-col>
                        <van-col span="17">2020–02–24 16:54:24</van-col>
                        <van-col span="7">可用停车场</van-col>
                        <van-col span="17">苏州工业园区纳米大学产业园停车场、苏州生命之源停车场、苏州湾停车场，苏州中心停车场，苏州园区地园区、苏州北站停车场</van-col>
                    </van-row>
                </div>
            </div>
            <div class="popup-equity">
                <div class="popup-title">
                    <p>苏州工业大学纳姆科技园停车场</p>
                    <p>-150.00</p>
                </div>
                <div class="popup-content">
                    <van-row>
                        <van-col span="7">车牌号码</van-col>
                        <van-col span="17">苏E98GH6 <i>蓝牌</i></van-col>
                        <van-col span="7">所属行业</van-col>
                        <van-col span="17">工商银行苏州分行</van-col>
                        <van-col span="7">权益金券码</van-col>
                        <van-col span="17">877661ge267765abf222</van-col>
                        <van-col span="7">停车日期</van-col>
                        <van-col span="17">2020–02–24 12:22:34 至 2020–02–24 16:54:24</van-col>
                        <van-col span="7">停车时长</van-col>
                        <van-col span="17">3小时18分40秒</van-col>
                        <van-col span="7">停车费用</van-col>
                        <van-col span="17">￥20</van-col>
                        <van-col span="7">权益金抵扣</van-col>
                        <van-col span="17">￥5</van-col>
                        <van-col span="7">实际支付</van-col>
                        <van-col span="17">￥15</van-col>
                        <van-col span="7">券码余额</van-col>
                        <van-col span="17">￥15</van-col>
                    </van-row>
                </div>
            </div>

        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "equity",
        data() {
            return {
                tabName:0,
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
                list: [],
                loading: false,
                finished: false,
                popup:{
                    show:false,
                    data:'',
                }
            }
        },
        components: {},
        methods: {
            onLoad() {
                // 异步更新数据
                // setTimeout 仅做示例，真实场景中一般为 ajax 请求
                setTimeout(() => {
                    for (let i = 0; i < 10; i++) {
                        this.list.push(this.list.length + 1);
                    }

                    // 加载状态结束
                    this.loading = false;

                    // 数据全部加载完成
                    if (this.list.length >= 40) {
                        this.finished = true;
                    }
                }, 1000);
            },
            handleShow(item){
                this.$router.push({
                    query:{
                        type:item
                    }
                });
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
                this.popup.show = true;
            }else{
                this.popup.show = false;
            }
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