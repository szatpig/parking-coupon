<template>
    <div class="parking-container">
        <div class="parking-wrapper" id="parking-wrapper" />
        <div class="parking-location">
            <SvgComponent v-if="!!!active" class="location-svg" icon="location" @on-click="mapRelocation" />
            <van-search
                    shape="round"
                    background="transparent"
                    placeholder="搜索停车场"
                    readonly
                    @click="handleSearch"
            />
            <div class="location-ex" v-if="!!!active && locationData">
                <div class="location-item flex">
                    <div class="location-txt">
                        <p class="flex">
                            <van-tag v-show="flag">最近</van-tag>
                            <span class="location-name">{{ locationData.parkingName }}</span>
                            <van-tag type="warning" v-show="locationData.haveCoupon">券</van-tag>
                            <van-tag type="success" v-show="locationData.haveEquity">金</van-tag></p>
                        <p class="flex">
                            <span class="location-distance"> {{(locationData.distance/1000).toFixed(2) }}公里</span>
                            <span class="location-adr">{{ locationData.location }}</span>
                        </p>
                    </div>
                    <div class="location-path" @click="handleShowSheet(locationData,$event)">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
            </div>
            <div class="location-nav" :class="{ active:active }" @click="handleMore">
                <SvgComponent icon="pull" class="icon-pull" v-show="dataList.length" />
                <p v-if="dataList.length">附近有 {{ dataList.length }} 个合作停车场</p>
                <p v-else>附近未找到合作停车场，您可以尝试搜索其他停车场</p>
            </div>
            <div class="location-list" :class="{ active:active }">
                <div class="location-item flex" @click="handleSelectParking(item)" v-for="(item,index) in dataList">
                    <div class="location-txt">
                        <p class="flex">
                            <van-tag v-if="index == 0">最近</van-tag>
                            <span class="location-name">{{ item.parkingName }}</span>
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
            </div>
        </div>
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
    import SvgComponent from '@/components/svg'
    import { parkingList } from '@/api/parking-api'
    import { geocoder } from '@/api/common-api'
    export default {
        name: "parking",
        data() {
            return {
                active:false,
                mapInstance:null,
                mapIcon:null,
                flag:true,
                locationData:'',
                dataList: [],
                longitude:120.735161,
                latitude:31.258961,
                locationCity:'',
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
            async init() {
                this.mapInstance = new qq.maps.Map(document.getElementById("parking-wrapper"), {
                    // 地图的中心地理坐标。
                    center: new qq.maps.LatLng((this.latitude - 0.005), this.longitude),
                    zoom: 15,
                    scaleControl: false,
                    zoomControl: false,
                    panControl: false,
                    mapTypeControl:false
                });
                //初始化marker 地图标注图标
                let anchor = new qq.maps.Point(20, 22),
                size = new qq.maps.Size(97, 97),
                origin = new qq.maps.Point(0, 0),
                scaleSize = new qq.maps.Size(40 , 45);
                this.mapIcon = new qq.maps.MarkerImage('/images/point.png', size, origin, anchor,scaleSize);
                new qq.maps.Marker({
                    icon: new qq.maps.MarkerImage('/images/location.png', size, origin, anchor,new qq.maps.Size(60 , 60)),
                    map: this.mapInstance,
                    position:new qq.maps.LatLng((this.latitude), this.longitude),
                });
                await this.mapGetCity();
                await this.list();
            },

            handleSelectParking({ latitude,longitude }){
                this.flag = true;
                this.locationData = arguments[0];
                this.mapMoveTo({ latitude,longitude })
            },
            wxGetLocation(){
                // this.mapMoveTo({
                //     longitude:120.735161,
                //     latitude:31.258961
                // });
                wx.getLocation({
                    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success:  (data) => {
                        this.latitude = data.latitude; // 纬度，浮点数，范围为90 ~ -90
                        this.longitude = data.longitude; // 经度，浮点数，范围为180 ~ -180。
                        this.mapMoveTo(data);
                    }
                });
            },
            mapRelocation(){ //定位
                this.wxGetLocation();
            },
            mapMoveTo({ latitude,longitude }){
                this.mapInstance.panTo(new qq.maps.LatLng(latitude - 0.005, longitude));
            },
            mapMarker(latlng,item){
                let marker = new qq.maps.Marker({
                    icon: this.mapIcon,
                    map: this.mapInstance,
                    position:latlng
                });
                qq.maps.event.addListener(marker, 'click', () => {
                    this.flag = false;
                    this.locationData = item;
                });
            },
            mapBaiduTranslateQQ({ latitude,longitude }){
                return new Promise((resolve, reject) => {
                    qq.maps.convertor.translate(new qq.maps.LatLng(latitude,longitude), 3, data => {
                        resolve(data[0])
                    })
                })
            },
            async mapGetCity(){
                let _data ={
                    latitude:this.latitude,
                    longitude:this.longitude
                }
                try {
                    let data = await geocoder(_data)
                    this.locationCity = data.data.message.result.address_component.city.replace(/市/,'')
                }catch (e) {

                }
            },
            handleSearch(){
                this.$router.push({
                    path:'/home/parking/search',
                    query:{
                        latitude:this.latitude,
                        longitude:this.longitude,
                        city:this.locationCity
                    }
                })
            },
            handleMore(){
                if(!!!this.dataList.length) return;
                this.active = !this.active
            },
            async list(page,pageSize = 8){
                let _data ={
                    key:'',
                    longitude:this.longitude,
                    latitude:this.latitude,
                    cityName:this.locationCity,
                    page,pageSize
                }
                try {
                    let data = await parkingList(_data)
                    this.dataList = data.data;
                    this.locationData = this.dataList[0]
                    data.data.map( async item => {
                        let location = await this.mapBaiduTranslateQQ({
                            latitude:item.latitude,
                            longitude:item.longitude
                        })
                        this.mapMarker(location,item)
                        item.latitude = location.lat
                        item.longitude=location.lng
                        return item;
                    })
                }catch(e){

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
                window.location.href = this.sheet.url[index]
            }
        },
        computed: {},
        mounted(){

        },
        created() {
            console.log('beforeMount')
            wx.ready(()=>{
                console.log('beforeMount222')
                //这里调用api
                setTimeout(()=>{
                    wx.getLocation({
                        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success:  (data) => {
                            this.latitude = data.latitude; // 纬度，浮点数，范围为90 ~ -90
                            this.longitude = data.longitude; // 经度，浮点数，范围为180 ~ -180。
                            this.init();
                        }
                    });
                },400)
            });
        }
    }
</script>

<style lang="less">
    .parking-container{
        flex: 1;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        height: 100%;
        .parking-wrapper{
            flex: 1;
            height: calc(100% - 100px);
        }
        .parking-location{
            position: fixed;
            left:0;
            right: 0;
            bottom: 100px;
            .location-svg{
                position: absolute;
                right: 12px ;
                top:-80px;
                width: 84px;
                height: 84px;
            }
            .van-search{
                padding: 10px 16px 24px;
                .van-search__content{
                    background-color: #fff;
                    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
                }
                .van-cell{
                    height: 80px;
                    line-height: 60px;
                }
            }
            .location-ex{
                padding:  0 16px 24px ;
                .location-item{
                    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.06);
                    border-radius: 12px;
                }
            }
            .location-nav{
                height: 100px;
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-items: center;
                background: #fff;
                color: #909499;
                border-bottom: 1px solid #DDDEE1;
                .icon-pull{
                    height: 10px ;
                    width: 80px;
                    margin-bottom: 16px;
                }
                &.active{
                    .icon-pull{
                        height: 10px ;
                        width: 80px;
                        margin-bottom: 16px;
                        transform: rotate(180deg);
                    }
                }
            }
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
                    .location-name{
                        max-width: 78%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        margin-right: 12px;
                        white-space: nowrap;
                    }
                    .location-adr{
                        max-width: 46%;
                        overflow: hidden;
                        text-overflow: ellipsis;
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
            .location-list{
                height: 0;
                transition: height 0.3s;
                &.active{
                    height:780px;
                    overflow-y: auto;
                }
            }
        }

    }
</style>