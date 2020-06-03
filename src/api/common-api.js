// Created by szatpig at 2019/4/9.
import fetch from '@/utils/fetch'
import api from '@@/config'

export const getWechatSign = (data)=> fetch(api.api + '/wechat/getSignature',{
    data
});

export const getAuthorize = (params)=> fetch(api.api + '/wechat/getAuthorize',{
    type:'get',
    params
});

export const listPlateColorType = (params)=> fetch(api.api + '/customerCar/listPlateColorType',{
    type:'get',
    params
});

export const geocoder = (data)=> fetch(api.api + '/wechat/location',{
    data
});