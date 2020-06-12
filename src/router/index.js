
// Created by szatpig at 2019/4/8.
import Router from 'vue-router'
import store from '@/vuex'

import wxShare from '@/utils/wechat'

//webpackChunkName 一定要写，是code split 后的命名 [ChunkName].[hash].js
const Home = () => import(/* webpackChunkName: "home" */ '@/pages/home');

const Coupon = () => import(/* webpackChunkName: "user" */ '@/pages/coupon');

const Parking = () => import(/* webpackChunkName: "user" */ '@/pages/parking');
const Search = () => import(/* webpackChunkName: "user" */ '@/pages/parking/search');

const User = () => import(/* webpackChunkName: "user" */ '@/pages/user');
const Car = () => import(/* webpackChunkName: "car" */ '@/pages/user/car');
const Setting = () => import(/* webpackChunkName: "car" */ '@/pages/user/setting');
const Coupons = () => import(/* webpackChunkName: "car" */ '@/pages/user/coupons');
const Equity = () => import(/* webpackChunkName: "car" */ '@/pages/user/equity');

const Author = () => import(/* webpackChunkName: "auth" */ '@/pages/auth/auth');
const Login = () => import(/* webpackChunkName: "login" */ '@/pages/auth/login');
const Register = () => import(/* webpackChunkName: "login" */ '@/pages/auth/regist');

const routes =[
    {
        path:'/home',
        component:Home,
        name:'home',
        meta:{
            requireAuth:true,
            keepAlive:false
        },
        children:[
            {
                path:'parking/search',
                component:Search,
                name:'search',
                meta:{
                    title:'ETC停车场'
                }
            },
            {
                path:'parking',
                component:Parking,
                name:'parking',
                meta:{
                    title:'停车场搜索'
                }
            },
            {
                path:'coupon',
                component:Coupon,
                name:'coupon',
                meta:{
                    title:'领券'
                }
            },
            {
                path:'user',
                component:User,
                name:'user',
                meta:{
                    title:'用户中心'
                }
            },
            {
                path:'user/car',
                component:Car,
                name:'car',
                meta:{
                    title:'我的车辆'
                }
            },
            {
                path:'user/setting',
                component:Setting,
                name:'setting',
                meta:{
                    title:'设置'
                }
            },
            {
                path:'user/coupons',
                component:Coupons,
                name:'coupons',
                meta:{
                    title:'我的停车券'
                }
            },
            {
                path:'user/equity',
                component:Equity,
                name:'equity',
                meta:{
                    title:'我的权益金'
                }
            },
        ]
    },
    {
         path:'/author',
         component:Author,
         name:'author',
         meta:{
           title:'用户授权'
         }
    },
    {
        path:'/register',
        component:Register,
        name:'register',
        meta:{
            title:'用户注册',
            keepAlive:false
        }
    },
    {
        path:'/login',
        component:Login,
        name:'login',
        meta:{
           title:'用户登录',
            keepAlive:false
        }
    },
    {
        path: '*',
        component: ()=>{
            router.push({
                path: '/login',
                query:{
                    openId: store.state.user.openId || ''
                }
            })
        }
    }
];

const router = new Router({
    mode: 'history',
    base: process.env.VUE_APP_ROOT,
    routes,
    scrollBehavior (to, from, position) {
        if (position) {
            return position
        } else {
            return { x: 0, y: 0 }
        }
    }
});


let ua = window.navigator.userAgent.toLowerCase();

router.beforeEach((to, from, next) => {
    console.log(location.href)
    if (to.meta.title) {
        document.title = 'ETC停车场 - ' + to.meta.title
    }

    // if(ua.match(/MicroMessenger/i) !== 'micromessenger'&& process.env.NODE_ENV === 'production'){
    //     location.href='https://w.url.cn/s/A02CPn0';
    //     location.href='https://w.url.cn/s/A02CPn0';
    // }

    if(ua.match(/MicroMessenger/i) !== 'micromessenger' && to.path.indexOf('author') === -1 && to.path.indexOf('login') === -1 && to.path.indexOf('register') === -1){
        console.log(2)
        if (!store.state.user.openId){
            console.log(4)
            next({
                path: '/author',
                query: { redirect: to.fullPath }
            });
        }else{
            if (to.matched.some(r => r.meta.requireAuth)) {
                if(store.state.user.userToken){
                    console.log(7)
                    next();
                }else{
                    console.log(6)
                    next({
                        path: '/login',
                        query: {
                            openId:sessionStorage.getItem('openId'),
                            redirect: to.fullPath
                        }
                    });
                }
            }else{
                next();
            }
        }
    }else {
        console.log(1)
        next()
    }

});

router.afterEach((to, from)=>{
    let u = navigator.userAgent,
        isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    if (to.matched.some(r => r.meta.requireAuth) && store.state.user.openId){
        if(Number(sessionStorage.getItem('wx'))){
            if(isAndroid){
                setTimeout(()=>{
                    wxShare();
                },100)
            }
        }else{
            setTimeout(()=>{
                wxShare();
            },100)
        }
    }

});


export default router