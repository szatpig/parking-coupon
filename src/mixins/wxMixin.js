// Created by szatpig at 2019/4/19.
import { getWechatSign } from '@/api/common-api'
// import wx from 'weixin-js-sdk'
export default {
    methods: {
        async getWxApi(){
            try {
                return await getWechatSign({
                    url:window.location.href
                });
            }catch (e) {
                return e;
            }
        },
        async wxShare(){
            let _data = await this.getWxApi();
            let { timestamp, nonceStr, appId, signature } = _data.data ;
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature, // 必填，签名
                jsApiList: [              //所有要调用的 API 都要加到这个列表中
                    //分享到朋友圈
                    'onMenuShareTimeline',
                    //发送给朋友
                    'onMenuShareAppMessage',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'onVoicePlayEnd',
                    'downloadVoice',
                    'uploadVoice',
                    'closeWindow',
                    'chooseImage',
                    'previewImage',
                    'uploadImage'
                ] // 必填，需要使用的JS接口列表
            });
            wx.ready(()=>{
                //这里调用api
                sessionStorage.setItem('wx',1);
                wx.hideAllNonBaseMenuItem();
            });
            wx.error((res) => {
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                let u = navigator.userAgent, app = navigator.appVersion;
                let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
                if(Number(sessionStorage.getItem('wx'))){
                    if(isAndroid){
                        this.wxShare();
                    }
                }
            });
        },
    },
    created() {
        let u = navigator.userAgent, app = navigator.appVersion;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        console.log(sessionStorage.getItem('wx'));
        if(Number(sessionStorage.getItem('wx'))){
           if(isAndroid){
               this.wxShare();
           }
        }else{
            this.wxShare();
        }

    }
}