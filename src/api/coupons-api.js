// Created by szatpig at 2019/4/12.
import fetch from '@/utils/fetch'
import api from '@@/config'

export const couponList = (data)=> fetch(api.api + '/customerCouponUseDetails/ownerCouponList',{
    data
});
export const couponUseRecord = (data)=> fetch(api.api + '/customerCouponUseDetails/getOwnerParkingRecord',{
    data
});

export const customerCarsAndEquity = (params)=> fetch(api.api + '/customerEquityUseDetails/queryOwnerEquity',{
    type:'get',
    params
});

export const payList = (data)=> fetch(api.api + '/customerEquityUseDetails/queryExpensesEquity',{
    data
});

export const payDetail = (data)=> fetch(api.api + '/customerEquityUseDetails/queryExpensesEquityDetail',{
    data
});

export const incomeList = (data)=> fetch(api.api + '/customerEquityUseDetails/queryIncomeEquity',{
    data
});

export const incomeDetail = (data)=> fetch(api.api + '/customerEquityUseDetails/queryIncomeEquityDetail',{
    data
});
