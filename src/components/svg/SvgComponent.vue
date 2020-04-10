<template>
    <svg :class="svgClass" @click="handleClick" aria-hidden="true">
        <use :xlink:href="iconName"/>
    </svg>
</template>

<script>
    export default {
        name: 'SvgIcon',
        props: {
            icon: {
                type: String,
                required: true
            },
            className: {
                type: String,
                default: ''
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.icon}`
            },
            svgClass() {
                if (this.className) {
                    return 'svg-icon ' + this.className
                } else {
                    return 'svg-icon'
                }
            }
        },
        methods:{
            handleClick(e){
                this.$emit('on-click',e)
            }
        }
    }
</script>

<style lang="less">
    .svg-icon {
        width: 56px;
        height: 56px;
        fill: currentColor;
        overflow: hidden;
    }
</style>