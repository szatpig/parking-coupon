<template>
    <div class="coupons-container">
        <van-tabs v-model="tabName" swipeable sticky>
            <van-tab v-for="item in tabList" :title="item.label"></van-tab>
        </van-tabs>
        <van-list
                class="coupons-list"
                :class="{ filter:tabName != 0 }"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
            <van-cell v-for="item in list" :key="item" :title="item" :class="{ used:tabName==1,expired:tabName==2 }">
                <template #title>
                    <div class="cell-top flex">
                        <div class="flex">
                            <span>￥<i>4000</i></span>
                            <div class="cell-txt">
                                <p>苏E8F2S8 <i>蓝牌</i></p>
                                <p>2020–02–20 23:59到期</p>
                            </div>
                        </div>
                        <van-button v-if="tabName == 1" round size="mini">停车记录<van-icon name="arrow" /></van-button>
                    </div>
                    <div class="cell-bottom flex">
                        <div class="cell-bottom-left">
                            <div class="bottom-content">可用于：苏州工业园区纳米大学产业园停车场、苏州生命之源停
                                车场、苏州湾停车场，苏州中心停车场，苏州园区地园区、苏州
                                北站停车场</div>
                            <p>券码：209887671htuhbse2688999113</p>
                        </div>
                        <van-icon name="arrow-up" />
                    </div>
                </template>
            </van-cell>
        </van-list>
    </div>
</template>

<script>
    export default {
        name: "coupons",
        data() {
            return {
                tabName:0,
                tabList:[
                    {
                        value:0,
                        label:'未使用'
                    },
                    {
                        value:1,
                        label:'已使用'
                    },
                    {
                        value:2,
                        label:'已过期'
                    }
                ],
                list: [],
                loading: false,
                finished: false,
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
        },
        computed: {},
        created() {
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
            background: url("./../../images/user-bg.png") center top no-repeat;
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
</style>