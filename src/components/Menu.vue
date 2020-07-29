<template>
    <van-tabbar :value="$route.path.match(/^\/home\/(\w+)(\/.*)?$/)[1]" class="menu-container">
        <van-tabbar-item name="parking" replace to="/home/parking" icon="logistics">
            停车
        </van-tabbar-item>
        <van-tabbar-item name="coupon" replace to="/home/coupon" icon="debit-pay">
            领券
        </van-tabbar-item>
        <van-tabbar-item name="user" replace to="/home/user" icon="contact">
            我的
        </van-tabbar-item>
    </van-tabbar>
</template>

<script>
    export default {
        name: "Menu",
        data() {
            return {}
        },
        components: {},
        methods: {},
        computed: {},
        created() {
        }
    }
</script>

<style lang="less">
    .van-tabbar{
        height: 100px;
    }
</style>