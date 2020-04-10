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
let urlPrefix = location.pathname.replace(/^(\/?[\w\-]*)\/unicom\/wapwx.*/g,'$1');

const hostname = location.hostname.split('.')[0];
const localArray = ['10', '127', 'localhost'];

urlPrefix = localArray.includes(hostname) ? `/api${ urlPrefix }` : urlPrefix ;

const commonUrl = `${ urlPrefix }/YNT-UNICOM-DC/dc`;
const audioUrl =  `${ urlPrefix.replace(/\/api/g,'') }/`;

// 编译模式，自定义变量需以 VUE_APP_ 开头 具体见 .env 等文件
const version = process.env.VUE_APP_VERSION || 'release 1.0.0' ;
// 编译模式，自定义变量需以 VUE_APP_ 开头

if(process.env.NODE_ENV === 'production'){
    api_config={
        api:commonUrl,
        user:commonUrl,
        task:commonUrl,
        wex:commonUrl,
        authorUrl:commonUrl,
        // audioUrl,
        audioUrl: 'http://192.168.0.11:9000/audio/',        //dev 本地audio地址
        urlPrefix,
        version
    }
}else{
    api_config={
        api:'/api',
        user:'/user/helper',
        task:'/task/helper',
        wex:'/wex',
        authorUrl:'',
        audioUrl:'http://192.168.0.11:9000/audio/'+ audioUrl,
        urlPrefix,
        version
    };
}

export default api_config;