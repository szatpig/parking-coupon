// Created by szatpig at 2019/4/12.
import fetch from '@/utils/fetch'
import api from '@@/config'


// car
export const customerCarList = (params)=> fetch(api.api + '/customerCar/listByCustomerId',{
    type:'get',
    params
});

export const customerCarInsert = (data)=> fetch(api.api + '/customerCar/insert',{
    data
});

export const customerCarDelete = (data)=> fetch(api.api + '/customerCar/delete',{
    data
});

export const customerCarUpdate = (data)=> fetch(api.api + '/customerCar/update',{
    data
});

//setting
export const getByCustomerInfo = (params)=> fetch(api.api + '/equityVerifyPriority/getByCustomerId',{
    type:'get',
    params
});

export const getByCustomerInfoUpdate = (data)=> fetch(api.api + '/equityVerifyPriority/update',{
    data
});

export const listIndustryEquity = (params)=> fetch(api.api + '/equityVerifyPriority/listIndustryEquity',{
    type:'get',
    params
});

export const resetPassword = (data)=> fetch(api.api + '/resetPassword',{
    data
});

export const forgetPassword = (data)=> fetch(api.api + '/forgetPassword',{
    data
});

export const verificationCode = (data)=> fetch(api.api + '/verificationCode',{
    data
});