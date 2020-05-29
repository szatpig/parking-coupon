<template>
    <div class="search-container">
        <div class="search-header flex">
            <span class="search-location-txt"><i>苏州</i><van-icon name="arrow-down" /></span>
            <van-search
                    v-model="key"
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
            <div class="location-item flex" v-for="(item,index) in dataList">
                <div class="location-txt">
                    <p class="flex">
                        <van-tag v-if="index == 0">最近</van-tag>
                        <span class="location-name">{{ item.parkingName }} </span>
                        <van-tag type="warning" v-show="item.haveCoupon">券</van-tag>
                        <van-tag type="success" v-show="item.haveEquity">金</van-tag>
                    </p>
                    <p class="flex">
                        <span class="location-distance"> {{(dataList[0].distance/1000).toFixed(2) }}公里</span>
                        <span class="location-adr">{{ item.location }}</span>
                    </p>
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
    import { parkingList } from '@/api/parking-api'
    import SvgComponent from '@/components/svg'
    export default {
        name: "search",
        data() {
            return {
                key:'',
                pageIndex:0,
                dataList: [],
                refreshing:false,
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
                if (this.refreshing) {
                    this.dataList = [];
                    this.refreshing = false;
                    this.pageIndex = 0
                }
                this.list(this.pageIndex)
            },
            list(page,pageSize = 8){
                let { longitude,latitude } = this.$route.query || ''
                console.log(this.$router,latitude,longitude)
                let _data ={
                    key:this.key,
                    longitude,
                    latitude
                }
                parkingList(_data).then(data => {
                    this.pageIndex ++;
                    this.dataList = [...this.dataList,...data.data];
                    this.finished = true;
                    this.error = false;
                    this.loading = false;
                }).catch(err => {
                    this.loading = false;
                    this.error = true;
                    this.finished = true;
                })
            }
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
                &:first-child{
                    .location-txt{
                        .location-name{
                            width: 65%;
                        }
                    }
                }
                .location-txt{
                    width: 88%;
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
                    .location-adr{
                        max-width: 62%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                    .location-name{
                        width: 78%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 12px;
                    }
                    .location-distance{
                        font-size: 28px;
                        color: #57626D;
                        padding-right: 20px;
                        margin-right: 20px;
                        position: relative;
                        &:after{
                            content: '';
                            height: 24px;
                            width: 2px;
                            background-color: #DDDEE1 ;
                            transform: translateY(-50%);
                            position: absolute;
                            top: 50%;
                            right: 0;
                        }
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