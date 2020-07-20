// Created by szatpig at 2019/4/9.
import Vue from 'vue'
import axios from 'axios'
import store from '@/vuex'
import router from '@/router'
import { stringify } from 'qs'
import api from '@@/config'


// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';

// http request 拦截器
axios.interceptors.request.use(
        config => {
            if (store.state.user.userToken) {
                config.headers.token = store.state.user.userToken
            }
            config.headers.userAgent = navigator.appVersion + ' LANGUAGE/'  + navigator.language + ' VERSION/' + process.env.VUE_APP_VERSION;
            //取消loading可在传参数里加入 { _loading:true }即可取消loading
            !config.data._loading && Vue.prototype.$toast({
                type:'loading',
                duration: 30000,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                loadingType: 'spinner',
                message: '加载中...'
            })
            config.data._loading && (delete config.data['_loading']);
            return config;
        },
        err => {
            Vue.prototype.$toast.clear();
            return Promise.reject(err);
        });

// http response 拦截器
axios.interceptors.response.use(
        response => {
            Vue.prototype.$toast.clear();
            return response;
        },
        error => {
            Vue.prototype.$toast.clear();
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        // 401 清除token信息并跳转到登录页面
                        Vue.prototype.$toast({
                            message: error.response.data.data.msg
                        });
                        location.href = 'https://w.url.cn/s/A02CPn0'
                        break;
                    case 403:
                        break;
                    case 500:
                    case 502:
                    case 503:
                    case 504:
                        console.log(api.urlPrefix);
                        // let _url =
                        location.href = api.urlPrefix.indexOf('/api') == -1 ? `${ api.urlPrefix.replace(/\/api/g,'')}/wapwx/wx/502.html `:'/502.html';
                        break;
                    case 404:
                        location.href = api.urlPrefix.indexOf('/api') == -1 ? `${ api.urlPrefix.replace(/\/api/g,'')}/wapwx/wx/404.html `:'/404.html';
                        break;
                    default:
                        Vue.prototype.$toast({
                            message: '程序员罢工了,哄哄她去'
                        });
                }
            }
            return Promise.reject(error.response)
        });

// 封装请求
export default function fetch (url, options) {
    var opt = options || {}
    return new Promise((resolve, reject) => {
        axios({
            method: opt.type || 'post',
            url: url,
            params: opt.params || {},
            // 判断是否有自定义头部，以对参数进行序列化。不定义头部，默认对参数序列化为查询字符串。

            data: (opt.headers && opt.headers['Content-Type'].indexOf('x-www-form-urlencoded') > 0 ? stringify(opt.data) : opt.data) || {},
            responseType: opt.dataType || 'json',
            // 设置默认请求头
            headers: opt.headers || {'Content-Type': 'application/json; charset=UTF-8'},
            //设置超时时间
            timeout: opt.timeout || 30000
        }).then(response => {
            if (response.data.status === 1000) {
                resolve(response.data)
            }else if(response.data.status === 0){
                resolve(response.result)
            } else {
                switch (response.data.status) {
                    case 1001:
                        if(Number(sessionStorage.getItem('code_2001'))){
                            reject(response.data);
                        }else{
                            sessionStorage.setItem('code_2001',1);
                            Vue.prototype.$dialog.alert({
                                message: '账号过期',
                                className:'err-dialog'
                            }).then(() => {
                                // on close
                                sessionStorage.setItem('code_2001',0);
                                location.href.indexOf('/merchant') > -1 ?
                                router.push({
                                    path: '/merchant/login'
                                }) :
                                router.push({
                                    path: '/login',
                                    query:{
                                        openId:store.state.user.openId
                                    }
                                })
                                // wx.closeWindow();
                            });
                        }
                        reject(response.data);
                        break;
                    case 8005:
                        if(Number(sessionStorage.getItem('code_2001'))){
                            reject(response.data);
                        }else{
                            sessionStorage.setItem('code_2001',1);
                            Vue.prototype.$dialog.alert({
                                message: '账号已在其他设备登录',
                                className:'err-dialog'
                            }).then(() => {
                                // on close
                                sessionStorage.setItem('code_2001',0);
                                wx.closeWindow();
                            });
                        }
                        reject(response.data);
                        break;
                    case 9003:
                        if(Number(sessionStorage.getItem('code_2001'))){
                            reject(response.data);
                        }else{
                            sessionStorage.setItem('code_2001',1);
                            Vue.prototype.$dialog.alert({
                                message: '未绑定，无权限查看该账号接听记录',
                                className:'err-dialog'
                            }).then(() => {
                                // on close
                                sessionStorage.setItem('code_2001',0);
                                wx.closeWindow();
                            });
                        }
                        reject(response.data);
                        break;
                    default:
                        Vue.prototype.$toast({
                            message: response.data.msg || '什么都没有留下'
                        });
                        reject(response.data);
                }
            }
        }).catch(error => {
            reject(error)
        })
    })
}
