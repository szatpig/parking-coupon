// Created by szatpig at 2019/4/9.
import fetch from '@/utils/fetch'
import api from '@@/config'

//用户登录
export const userLogin = (data)=> fetch(api.api + '/user/bindPhoneNumberForWxMp',{
    data
});

//发送验证码
export const sendSms = (params)=> fetch(api.api+ `/user/getCode/${ params.phoneNumber }`,{
    type:'get',
    params
});

//设置呼叫转移状态
export const changeStatus = (data)=> fetch(api.api+ `/user/changeStatus/${data.flag}`,{
    type:'get'
});
