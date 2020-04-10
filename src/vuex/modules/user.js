// Created by szatpig at 2019/4/8.
import { SET_USER_TOKEN,SET_USER_INFO,SET_OPNEID } from  './../type';

const state = {
    userToken: sessionStorage.getItem('userToken') || '' ,
    openId:sessionStorage.getItem('openId') || '',
    userInfo:JSON.parse(sessionStorage.getItem('userInfo')) || {}
};

const getters = {

};

const mutations = {
    [SET_USER_TOKEN](state,res){
        sessionStorage.setItem('userToken',res);
        state.userToken = res ;
    },
    [SET_USER_INFO](state,res){
        let _userInfo = {...state.userInfo, ...res};
        sessionStorage.setItem('userInfo',JSON.stringify(_userInfo));
        state.userInfo = _userInfo;
    },
    [SET_OPNEID](state,res){
        sessionStorage.setItem('openId',res);
        state.openId = res;
    }
};

const actions = {
    setUserToken({commit},res){
        commit(SET_USER_TOKEN,res);
    },
    setUserInfo({commit},res){
        commit(SET_USER_INFO,res);
    },
    setOpenId({commit},res){
        commit(SET_OPNEID,res)
    }
};

export default {
    state,
    getters,
    mutations,
    actions
}