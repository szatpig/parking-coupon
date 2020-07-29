// Created by szatpig at 2019/4/9.
import fetch from '@/utils/fetch'
import api from '@@/config'

//核销列表
export const recordList = (data)=> fetch(api.api + '/equityVerifyRecord/list',{
    data
});

export const couponDetail = (params)=> fetch(api.api + `/customerCouponUseDetails/detail/${ params.id }`,{
    type:'get'
});

export const getHumanVerifyInfo = (data)=> fetch(api.api + '/equityVerifyRecord/getHumanVerifyInfo',{
    data
});

export const verifyCoupon = (data)=> fetch(api.api + '/equityVerifyRecord/verify',{
    data
});

//商户登录
export const merchantLogin = (data)=> fetch(api.api+ `/commercialLogin`,{
    data
});
