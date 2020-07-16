// Created by szatpig at 2020/7/14.
const Login = () => import(/* webpackChunkName: "login" */ '@/pages/merchant/login');

const Merchant = () => import(/* webpackChunkName: "login" */ '@/pages/merchant');
const Scan = () => import(/* webpackChunkName: "login" */ '@/pages/merchant/scan');
const Record = () => import(/* webpackChunkName: "login" */ '@/pages/merchant/record');
const Coupon = () => import(/* webpackChunkName: "login" */ '@/pages/merchant/coupon');
const Result = () => import(/* webpackChunkName: "login" */ '@/pages/merchant/result');


const merchantRoutes = [
    {
        path:'/merchant',
        component:Merchant,
        name:'merchant',
        meta:{
            requireAuth:true,
            keepAlive:false
        },
        children:[
            {
                path:'scan',
                component:Scan,
                name:'scan',
                meta:{
                    title:'扫一扫'
                }
            },
            {
                path:'record',
                component:Record,
                name:'record',
                meta:{
                    title:'核销记录'
                }
            },
            {
                path:'coupon/:couponType/:couponId',
                component:Coupon,
                name:'coupon',
                meta:{
                    title:'优惠券'
                }
            },
            {
                path:'result',
                component:Result,
                name:'result',
                meta:{
                    title:'核销结果'
                }
            },
        ]
    },
    {
        path:'/merchant/login',
        component:Login,
        name:'merchantLogin',
        meta:{
            title:'商户登录',
            keepAlive:false
        }
    },
]

export default merchantRoutes