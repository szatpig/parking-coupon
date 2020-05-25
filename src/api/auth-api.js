// Created by szatpig at 2019/4/9.
import fetch from '@/utils/fetch'
import api from '@@/config'

//用户登录
export const userLogin = (data)=> fetch(api.api + '/loginByPassword',{
    data
});
//验证码登录
export const userLoginByCode= (data)=> fetch(api.api + '/loginByCode',{
    data
});

//用户注册
export const userRegister = (data)=> fetch(api.api + '/register',{
    data
});

//发送验证码
export const sendSms = (data)=> fetch(api.api+ `/sendCode`,{
    data
});

//设置呼叫转移状态
export const userLogout = (data)=> fetch(api.api+ `/logout`,{
    type:'get'
});
