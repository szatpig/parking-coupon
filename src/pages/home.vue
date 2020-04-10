<template>
    <div class="home-container">
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {}
        },
        components: {},
        methods: {},
        computed: {},
        mounted(){
            this.$route.query.openId &&(sessionStorage.setItem('openId',this.$route.query.openId));
        }
    }
</script>

<style lang="less"></style>