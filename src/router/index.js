
// Created by szatpig at 2019/4/8.
import Router from 'vue-router'
import store from '@/vuex'
import api from '@@/config'

//webpackChunkName 一定要写，是code split 后的命名 [ChunkName].[hash].js
const Home = () => import(/* webpackChunkName: "home" */ '@/pages/home');

const Coupon = () => import(/* webpackChunkName: "user'" */ '@/pages/coupon');

const Parking = () => import(/* webpackChunkName: "user'" */ '@/pages/parking');

const User = () => import(/* webpackChunkName: "user'" */ '@/pages/user');
const Car = () => import(/* webpackChunkName: "car'" */ '@/pages/user/car');
const Setting = () => import(/* webpackChunkName: "car'" */ '@/pages/user/setting');
const Coupons = () => import(/* webpackChunkName: "car'" */ '@/pages/user/coupons');
const Equity = () => import(/* webpackChunkName: "car'" */ '@/pages/user/equity');

// const Author = () => import(/* webpackChunkName: "auth" */ '@/pages/auth/auth');
const Login = () => import(/* webpackChunkName: "login" */ '@/pages/auth/login');
const Register = () => import(/* webpackChunkName: "login" */ '@/pages/auth/regist');

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
                path:'parking',
                component:Parking,
                name:'parking',
                meta:{
                    title:'领券中心'
                }
            },
            {
                path:'coupon',
                component:Coupon,
                name:'coupon',
                meta:{
                    title:'停车'
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
    // {
    //      path:'/author',
    //      component:Author,
    //      name:'author',
    //      meta:{
    //        title:'用户授权'
    //      }
    // },
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
                path: '/login'
            })
        }
    }
];

const router = new Router({
    mode: 'history',
    base:`/`,
    routes,
    scrollBehavior (to, from, position) {
        if (position) {
            return position
        } else {
            return { x: 0, y: 0 }
        }
    }
});


router.beforeEach((to, from, next) => {

    //url有token， 则存入sessionStorage
    if (to.query.token){
        store.dispatch('setUserToken', to.query.token)
    }
    if (to.meta.title) {
        document.title = to.meta.title + '- 停车券'
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