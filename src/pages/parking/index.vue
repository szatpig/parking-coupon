<template>
    <div class="parking-container">
        <div class="parking-wrapper" id="parking-wrapper" />
        <div class="parking-location">
            <van-search
                    v-model="value"
                    shape="round"
                    background="transparent"
                    placeholder="搜索停车场"
                    readonly
                    @click="$router.push('/home/parking/search')"
            />
            <div class="location-ex" v-show="!!!active">
                <div class="location-item flex">
                    <div class="location-txt">
                        <p class="flex"><van-tag>最近</van-tag>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
            </div>
            <div class="location-nav" :class="{ active:active }" @click="handleMore">
                <SvgComponent icon="pull" class="icon-pull" />
                <p>附近有10个合作停车场</p>
            </div>
            <div class="location-list" :class="{ active:active }">
                <div class="location-item flex">
                    <div class="location-txt">
                        <p><van-tag>最近</van-tag>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p><van-tag v-if="index == 0">最近</van-tag>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
                <div class="location-item flex">
                    <div class="location-txt">
                        <p>苏州纳米生物纳米技术与… <van-tag type="warning">券</van-tag><van-tag type="success">金</van-tag></p>
                        <p>苏州工业园区独墅湖高教区若水路388…</p>
                    </div>
                    <div class="location-path">
                        <SvgComponent icon="daohang" />
                        导航
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import WxMixin from '@/mixins/wxMixin'
    import SvgComponent from '@/components/svg'
    export default {
        name: "parking",
        data() {
            return {
                active:false,
                mapInstance:null
            }
        },
        components: {
            SvgComponent
        },
        mixins:[WxMixin],
        methods: {
            init() {
                this.mapInstance = new qq.maps.Map(document.getElementById("parking-wrapper"), {
                    // 地图的中心地理坐标。
                    center: new qq.maps.LatLng(39.916527, 116.397128),
                    zoom: 13,
                    scaleControl: false,
                    zoomControl: false,
                    panControl: false,
                    mapTypeControl:false
                });
            },
            handleMore(){
                this.active = !this.active
            }
        },
        computed: {},
        mounted(){
            this.init();
        },
        created() {

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
            .van-search{
                padding: 10px 16px 24px;
                .van-search__content{
                    background-color: #fff;
                }
                .van-cell{
                    height: 80px;
                    line-height: 60px;
                }
            }
            .location-ex{
                padding:  0 16px 24px ;
                .location-item{
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