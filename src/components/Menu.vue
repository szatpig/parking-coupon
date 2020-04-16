<template>
    <van-tabbar route class="menu-container">
        <van-tabbar-item replace to="/home/parking" icon="home-o">
            停车
        </van-tabbar-item>
        <van-tabbar-item replace to="/home/coupon" icon="search">
            领券
        </van-tabbar-item>
        <van-tabbar-item replace to="/home/user" icon="search">
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

<style lang="scss"></style>