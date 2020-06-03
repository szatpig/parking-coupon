<template>
    <div class="search-container">
        <div class="search-header flex">
            <span class="search-location-txt"><i>{{ this.$route.query.city }}</i><van-icon name="arrow-down" /></span>
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
                        <span class="location-distance"> {{(item.distance/1000).toFixed(2) }}公里</span>
                        <span class="location-adr">{{ item.location }}</span>
                    </p>
                </div>
                <div class="location-path" @click="handleShowSheet(item,$event)">
                    <SvgComponent icon="daohang" />
                    导航
                </div>
            </div>
        </van-list>
        <van-action-sheet
                class="sheet-popover"
                v-model="sheet.show"
                :actions="sheet.data"
                cancel-text="取消"
                @cancel="sheet.show = false"
                @select="handleSelect"
        />
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
                sheet:{
                    show:false,
                    temp:'',
                    url:[],
                    data:[
                        {name:"腾讯地图"},{name:"高德地图"},{name:"百度地图"}
                    ]
                }
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
                    latitude,
                    cityName:this.$route.query.city
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
            },
            initUrl({ longitude,latitude,location }){
                let u = navigator.userAgent, app = navigator.appVersion;
                let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
                if (isAndroid) {
                    // 百度地图uri api
                    this.sheet.url[0] = "bdapp://map/navi?location=" + latitude + "," + longitude + "&query=" + location;
                    // 高德地图uri api
                    this.sheet.url[1] = "androidamap://navi?sourceApplication=xlwx&poiname=" + location + "&latitude=" + latitude + "&lon=" + longitude + "&dev=1&style=2";
                    // 腾讯地图uri api
                    this.sheet.url[2] = "qqmap://map/marker?marker=coord:" + latitude + "," + longitude + ";title:" + location + "&referer=xlwx";
                } else {
                    // 百度地图uri api
                    this.sheet.url[0] = "baidumap://map/navi?location=" + latitude + "," + longitude + "&query="+ location;
                    // 高德地图uri api
                    this.sheet.url[1] = "iosamap://navi?sourceApplication=xlwx&poiname=" + location + "&lat=" + latitude + "&lon=" + longitude + "&dev=1&style=2";
                    // 腾讯地图uri api
                    this.sheet.url[2] = "qqmap://map/marker?marker=coord:" + latitude + "," + longitude + ";title:" + location + "&referer=xlwx";
                }
            },
            handleShowSheet({ latitude,longitude,parkingName,location },e) {
                e.stopPropagation();
                e.preventDefault();
                wx.openLocation({
                    latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
                    longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
                    name: parkingName, // 位置名
                    address: location, // 地址详情说明
                    scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
                    infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
                });
            },
            handleSelect(action,index){
                location.href = this.sheet.url[index]
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
                            max-width: 65%;
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
                        max-width: 78%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 12px;
                        white-space: nowrap;
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