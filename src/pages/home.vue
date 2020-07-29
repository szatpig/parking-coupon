<template>
    <div class="home-container">
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
        <MenuLayout />
    </div>
</template>

<script>
    import MenuLayout from '@/components/Menu'
    // import WxMixin from '@/mixins/wxMixin'
    export default {
        name: "home",
        data() {
            return {}
        },
        components: {
            MenuLayout
        },
        // mixins:[WxMixin],
        methods: {},
        computed: {},
        mounted(){
            this.$route.query.openId &&(sessionStorage.setItem('openId',this.$route.query.openId));
        }
    }
</script>

<style lang="less"></style>