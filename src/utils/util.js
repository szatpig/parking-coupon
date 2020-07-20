// Created by szatpig at 2019/4/9.

const URLencode = function(str) {
    return escape(str).
    replace(/\+/g, '%2B').
    replace(/\"/g, '%22').
    replace(/\'/g, '%27').
    replace(/\//g, '%2F');
};

const getCookie = function(name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
};

const setCookie = function(name, value, exdays) {
    delCookie(name);
    let date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + escape(value) + "; " + "expires=" + date.toUTCString() + ';path=/';
};

const delCookie = function (name){
    let  exp = new Date();
    exp.setTime(exp.getTime() - 1);

    let cval = getCookie(name);
    console.log(name,cval);
    if(cval!=null)  document.cookie= name + "="+cval+";expires="+exp.toGMTString();
};

export function transDate(timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let mstr = `0${month}`.slice(-2);
    let day = date.getDate();
    let dstr =  `0${day}`.slice(-2) ;
    console.log('date4',date,timestamp,`${year}-${mstr}-${dstr}`)
    return `${year}-${mstr}-${dstr}`;
}

export function transTime(timestamp) {
    let date = new Date(timestamp);
    let hour = date.getHours();
    let minute = date.getMinutes();
    let sec = date.getSeconds();
    function format(params) {
        return `0${params}`.slice(-2) ;
    }
    return `${format(hour)}:${format(minute)}:${format(sec)}`;
}

export function callRecordListTime(callRecordTimestamp) {
    let now = transDate(new Date().getTime());
    let time = transDate(callRecordTimestamp);
    if (now === time) { // 今天呼入
        return transTime(callRecordTimestamp).slice(0, 5);
    } else {
        // 昨天零点时间戳
        let yestoday = new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000;
        console.log(yestoday);
        // let today = new Date(yestoday).getTime();
        if (callRecordTimestamp >= yestoday) {
            return '昨天'
        } else {
            return transDate(callRecordTimestamp).slice(5);
        }
    }
}
export function callRecordTime(callRecordTimestamp) {
    let now = transDate(new Date().getTime());
    let time = transDate(callRecordTimestamp);
    if (now === time) { // 今天呼入
        return ['今天',transTime(callRecordTimestamp).slice(0, 8)];
    } else {
        // 昨天零点时间戳
        let yestoday = new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000;
        // let today = new Date(yestoday).getTime();
        if (callRecordTimestamp >= yestoday) {
            return ['昨天', transTime(callRecordTimestamp).slice(0, 8)]
        } else {
            return [transDate(callRecordTimestamp), transTime(callRecordTimestamp).slice(0, 8)];
        }
    }
}
export {
    URLencode,
    getCookie,
    setCookie,
    delCookie
}