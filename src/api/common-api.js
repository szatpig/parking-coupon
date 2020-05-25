// Created by szatpig at 2019/4/9.
import fetch from '@/utils/fetch'
import api from '@@/config'

export const getWechatSign = (params)=> fetch(api.api + '/wx/jsSdk/jsapiSignature',{
    type:'get',
    params
});

export const listPlateColorType = (params)=> fetch(api.api + '/customerCar/listPlateColorType',{
    type:'get',
    params
});