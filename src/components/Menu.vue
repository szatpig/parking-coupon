<template>
    <van-tabbar route class="menu-container">
        <van-tabbar-item replace to="/home/parking" icon="logistics">
            停车
        </van-tabbar-item>
        <van-tabbar-item replace to="/home/coupon" icon="debit-pay">
            领券
        </van-tabbar-item>
        <van-tabbar-item replace to="/home/user" icon="contact">
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