// Created by szatpig at 2019/4/12.
import fetch from '@/utils/fetch'
import api from '@@/config'


// car
export const parkingList = (data)=> fetch(api.api + '/parking/list',{
    data
});
