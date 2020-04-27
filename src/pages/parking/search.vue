<template>
    <div class="search-container">
        <div class="search-header flex">
            <span class="search-location-txt"><i>苏州</i><van-icon name="arrow-down" /></span>
            <van-search
                    v-model="value"
                    shape="round"
                    show-action
                    left-icon=""
                    placeholder="搜索停车场"
                    @search="onSearch"
                    @cancel="onCancel"
            />
        </div>
        <van-list
                v-model="loading"
                :finished="finished"
                class="search-list"
                finished-text="没有更多了"
                @load="onLoad"
        >
            <div class="location-item flex" v-for="(item,index) in list">
                <div class="location-txt">
                    <p class="flex"><van-tag v-if="index == 0">最近</van-tag>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                    <p>苏州工业园区独墅湖高教区若水路388…</p>
                </div>
                <div class="location-path">
                    <SvgComponent icon="daohang" />
                    导航
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
    import SvgComponent from '@/components/svg'
    export default {
        name: "search",
        data() {
            return {
                list: [],
                loading: false,
                finished: false,
            }
        },
        components: {
            SvgComponent
        },
        methods: {
            onSearch(){

            },
            onCancel(){

            },
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
    .search-container{
        height: 100%;
        .search-header{
            background-color: #fff;
            padding: 0 0 0 24px;
            .van-search{
                width: 635px;
            }
            .search-location-txt{
                .van-icon{
                    margin-left: 6px;
                }
            }
            .van-cell{
                padding: 10px 16px 10px 10px;
                font-size: 24px;
            }
            .van-search__action{
                color: #909499;
                font-size: 24px;
            }
        }
        .search-list{
            height: calc(100% - 210px);
            overflow-y: auto;
            .location-item{
                &.flex{
                    justify-content: space-between;
                }
                background: #fff;
                padding: 36px 24px;
                position: relative;
                &:not(:last-child):after{
                    content: '';
                    position: absolute;
                    bottom:0;
                    left:24px;
                    right: 24px;
                    display: block;
                    height: 2px;
                    background-color: #EEF1F5;
                }
                .location-txt{
                    font-size: 32px;
                    color: #293547;
                    .van-tag{
                        margin-right: 12px;
                    }
                    p:last-child{
                        margin-top: 20px;
                        font-size: 24px;
                        color: #909499;

                    }
                }
                .location-path{
                    font-size: 22px;
                    color: #909499;
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: space-around;
                    .svg-icon{
                        margin-bottom: 4px;
                    }
                }
            }
        }
    }
</style>