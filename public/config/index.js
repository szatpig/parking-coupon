// Created by szatpig at 2019/4/9.

let api_config ={ };

// 生产：
// url访问 assistant.ynt.ai/wapwx/wx/*
// api接口 assistant.ynt.ai/YNT-AEGIS-CORE/core/
// qa：
// url访问  test-assistant.ynt.ai/qa/wapwx/wx/*
// api接口  test-assistant.ynt.ai/qa/YNT-AEGIS-CORE/core/
// dev：
// url访问 test-assistant.ynt.ai/dev/wapwx/wx/*
// api接口 test-assistant.ynt.ai/dev/YNT-AEGIS-CORE/core/

//把这个包放在文件外，只是为了好配置，但是配置后一定要重新打包给运维，不然并没有毛用
//因为import 机制，此文件还是会被打包进app.js里，并非动态会加载

// 编译模式，自定义变量需以 VUE_APP_ 开头 具体见 .env 等文件
// process.env.VUE_APP_VERSION
// 编译模式，自定义变量需以 VUE_APP_ 开头

if(process.env.NODE_ENV === 'production'){
    api_config={
        api:'' + process.env.VUE_APP_PREFIX,
        wex:'',
        authorUrl:'',
        audioUrl: 'http://192.168.0.11:9000/audio/',        //dev 本地audio地址
    }
}else{
    api_config={
        api:'/api'+ process.env.VUE_APP_PREFIX,
        wex:'/wex',
        authorUrl:'',
        audioUrl:'http://192.168.0.11:9000/audio/'
    };
}

export default api_config;