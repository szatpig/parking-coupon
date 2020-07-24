import Vue from 'vue'
import router from './router'
import store from './vuex'

// import { Vue2Dragula } from 'vue2-dragula'

import 'lib-flexible'

import '@/sass/app.less'
import App from './App.vue'

Vue.config.productionTip = false
// Vue.use(Vue2Dragula, {
//     logging: {
//         service: false // to only log methods in service (DragulaService)
//     }
// });

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
