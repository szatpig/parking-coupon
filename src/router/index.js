
// Created by szatpig at 2019/4/8.
import Router from 'vue-router'
import store from '@/vuex'
import api from '@@/config'

//webpackChunkName 一定要写，是code split 后的命名 [ChunkName].[hash].js
const Home = () => import(/* webpackChunkName: "home" */ '@/pages/home');

const Account = () => import(/* webpackChunkName: "account" */ '@/pages/user/account');
const User = () => import(/* webpackChunkName: "user'" */ '@/pages/user');
const Union = () => import(/* webpackChunkName: "user'" */ '@/pages/user/union');

// const Author = () => import(/* webpackChunkName: "auth" */ '@/pages/auth/auth');
const Login = () => import(/* webpackChunkName: "login" */ '@/pages/auth/login');

const CallList = () => import(/* webpackChunkName: "list" */ '@/pages/call/list');
const CallDetail = () => import(/* webpackChunkName: "listDetail" */ '@/pages/call/detail');
const Called = () => import(/* webpackChunkName: "called" */ '@/pages/call/called');

const Refuse = () => import(/* webpackChunkName: "listDetail" */ '@/pages/refuse/refuseScene');
const Scene = () => import(/* webpackChunkName: "configure" */ '@/pages/scene');
const Configure = () => import(/* webpackChunkName: "configure" */ '@/pages/scene/configure');
const Config = () => import(/* webpackChunkName: "configure" */ '@/pages/scene/sceneConfig');
const Audio = () => import(/* webpackChunkName: "selectAudio" */ '@/pages/scene/selectAudio');

const CallSetting = () => import(/* webpackChunkName: "setting" */ '@/pages/callsetting/setting');
const CallTest = () => import(/* webpackChunkName: "test" */ '@/pages/callsetting/test');


const Operation = () =>import(/* webpackChunkName: "operation" */ '@/pages/operation/operation');
const SerAgreement = () =>import(/* webpackChunkName: "operation" */ '@/pages/operation/serviceAgreement');

const Feedback = () =>import(/* webpackChunkName: "feedback" */ '@/pages/feedback');
const QA = () =>import(/* webpackChunkName: "feedback" */ '@/pages/feedback/qa');

const routes =[
    {
        path:'/home',
        component:Home,
        name:'home',
        meta:{
            // requireAuth:true
            keepAlive:false
        },
        children:[
            {
                path:'account',
                component:User,
                name:'account',
                meta:{
                    title:'用户中心',
                    keepAlive:false
                }
            },
            {
                path:'user',
                component:User,
                name:'user',
                meta:{
                    title:'用户中心',
                    keepAlive:false
                }
            },
            {
                path:'union',
                component:Union,
                name:'user',
                meta:{
                    title:'用户中心',
                    keepAlive:false
                }
            },
            //通话记录模块
            {
                path:'call',
                component:CallList,
                name:'call',
                meta:{
                    title:'接听记录',
                    keepAlive:true,
                    isUseCache:false
                }
            }, {
                path: 'call/:id',
                component: CallDetail,
                name: 'callDetail',
                meta: {
                    title: '通话详情',
                    keepAlive:false
                }
            }, {
                path: 'called/:calledType',
                component: Called,
                name: 'Called',
                meta: {
                    title: '名单',
                    keepAlive:false
                }
            },
            // 拒绝场景模块
            {
                path: 'refuse',
                component: Refuse,
                name: 'Refuse',
                meta: {
                    title: '拒绝场景',
                    keepAlive:false
                }
            },
            //通话记录模块结束

            //话术配置
            {
                path:'scene',
                component:Scene,
                name:'scene',
                meta:{
                    title:'话术配置',
                    keepAlive:false
                }
            },
            {
                path:'scene/audio/:scrid/:sctid',
                component:Audio,
                name:'audio',
                meta:{
                    title:'我的助理',
                    keepAlive:false
                }
            },
            {
                path:'scene/configure',
                component:Configure,
                name:'configure',
                meta:{
                    title:'话术配置',
                    keepAlive:false
                }
            },
            //话术配置
            {
                path:'scene/config',
                component:Config,
                name:'sceneConfig',
                meta:{
                    title:'话术配置',
                    keepAlive:false
                }
            },
            //话术配置结束
            //呼叫设置模块
            {
                path:'tel/setting',
                component:CallSetting,
                name:'callSetting',
                meta:{
                    title:'步骤一',
                    keepAlive:false
                }
            },{
                path:'tel/test',
                component:CallTest,
                name:'callTest',
                meta:{
                    title:'步骤二',
                    keepAlive:false
                }
            },
            //呼叫设置模块结束
            //操作说明
            {
                path:'operation',
                component: Operation,
                name:'operation',
                meta:{
                    title:'操作说明',
                keepAlive:false
                }
            },
            //用户反馈
            {
                path:'feedback',
                component: Feedback,
                name:'feedback',
                meta:{
                    title:'用户反馈',
                    keepAlive:false
                }
            },{//常见问题
                path:'feedback/qa',
                component: QA,
                name:'qa',
                meta:{
                    title:'常见问题',
                    keepAlive:false
                }
            }
        ]
    }, {
        path:'/serAgreement',
        component: SerAgreement,
        name:'serAgreement',
        meta:{
            title:'用户服务协议',
            keepAlive:false
        }
    },
    // {
    //      path:'/author',
    //      component:Author,
    //      name:'author',
    //      meta:{
    //        title:'用户授权'
    //      }
    // },
    {
        path:'/login',
        component:Login,
        name:'name',
        meta:{
           title:'用户登录',
            keepAlive:false
        }
    },
    {
        path: '*',
        component: ()=>{
            router.push({
                path: '/home/union'
            })
        }
    }
];

const router = new Router({
    mode: 'history',
    base:`${ api.urlPrefix.replace(/\/api/g,'')}/unicom/wapwx/wx/`,
    routes,
    scrollBehavior (to, from, position) {
        if (position) {
            return position
        } else {
            return { x: 0, y: 0 }
        }
    }
});

const ua = window.navigator.userAgent.toLowerCase();

router.beforeEach((to, from, next) => {

    //url有token， 则存入sessionStorage
    if (to.query.token){
        store.dispatch('setUserToken', to.query.token)
    }
    if (to.meta.title) {
        document.title = to.meta.title + '- 山东联通防骚扰'
    }
    next();

    // if(ua.match(/MicroMessenger/i) !== 'micromessenger'&& process.env.NODE_ENV === 'production'){
    //     location.href='https://w.url.cn/s/A02CPn0';
    // }

    // if(ua.match(/MicroMessenger/i) == 'micromessenger'){
    //     if(getCookie()){
    //         next();
    //     }else{
    //         //跳转分享页
    //         location.href='http://wwww.ynt.ai';
    //     }
    // }else{
    //     //跳转分享页
    //     location.href='http://wwww.ynt.ai';
    // }

    // if (!store.state.user.openId
    //         && ua.match(/MicroMessenger/i) == 'micromessenger'
    //         && to.path.indexOf('author') < 0 ) {
    //     next({
    //         path: '/author',
    //         query: { redirect: to.path == '/'? '/home/account' : to.fullPath }
    //     });
    // }else {
    //     if (to.matched.some(r => r.meta.requireAuth)) {
    //         if(store.state.user.userToken){
    //             next();
    //         }else{
    //             next({
    //                 path: '/login',
    //                 query: { redirect: to.fullPath }
    //             });
    //         }
    //     }else{
    //         next();
    //     }
    // }
});


export default router