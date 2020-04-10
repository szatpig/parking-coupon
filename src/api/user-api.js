// Created by szatpig at 2019/4/12.
import fetch from '@/utils/fetch'
import api from '@@/config'

//用户信息
export const userInfo = (data)=> fetch(api.api + '/user/wxHome',{
    type:'get'
});

//用户信息
export const getForwardTelInfo = (data)=> fetch(api.api + '/user/getForwardTelInfo',{
    type:'get'
});

// 获取呼叫转移设置（APP/公众号使用）
export const getCallForwardSetting = (data)=> fetch(api.api + '/user/getCallForwardSetting',{
    type:'get'
});

// 更改呼叫转移设置（APP/公众号使用）
export const changeCallForwardSetting = (data)=> fetch(api.api + '/user/changeCallForwardSetting',{
    data
});

// 完成引导（APP用）
export const completeGuide = (params)=> fetch(api.api + '/user/completeGuide',{
    type:'get'
});

// 添加或者修改反馈意见
export const feedbackSave = (data)=> fetch(api.api + '/feedback/save',{
    data
});

//山东联通 - 获取用户推送方式
export const getPushSetting = (data) => fetch(api.api + `/phoneUser/getPushSetting`, {
    type: 'get'
})

//山东联通 - 切换用户推送方式
export const changePushSetting = (data) => fetch(api.api + `/phoneUser/changePushSetting`, {
    data
})