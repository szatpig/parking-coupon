<template>
    <div class="car-container">
        <div class="car-list">
            <van-cell is-link @click="handleShow">
                <template #title>
                    <img src="../../images/head-img.png" alt="">
                    <span class="custom-title">苏E8F2S8</span>
                </template>
            </van-cell>
            <van-cell is-link >
                <template #title>
                    <img src="../../images/head-img.png" alt="">
                    <span class="custom-title">苏E8F2S8</span>
                </template>
            </van-cell>
        </div>
        <div class="car-btn">
            <van-button
                    class="car-link"
                    size="large"
                    round
                    @click="handleAdd">+ 新增车辆</van-button>
        </div>
        <van-popup class="popup-container" v-model="popup.show" position="right" >
            <van-cell-group>
                <van-field
                        label="车牌号"
                        maxlength="11"
                        type="tel"
                        v-model.trim="popup.data.plateNo"
                        placeholder="请输入您的车牌号"
                        @input="handlePhoneChange"
                        @blur="handelPageAdjust" />
            </van-cell-group>
            <div class="popup-btn">
                <van-button
                        :disabled="!popup.data.plateNo"
                        class="car-submit"
                        size="large"
                        round
                        type="info"
                        @click="handleLogin">保存</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
    export default {
        name: "car",
        data() {
            return {
                popup:{
                    show:false,
                    data:{
                        plateNo:'',
                    }
                }
            }
        },
        components: {},
        methods: {
            handleShow(){
                this.popup.show = true;
            },
            handleAdd(){

            },
            handleDelete(){
                this.$dialog.confirm({
                    className:'call-dialog',
                    title:``,
                    message: `确认删除该车辆？`,
                    confirmButtonText:'删除',
                    confirmButtonColor:'#F44336',
                    cancelButtonText:`取消`
                }).then(()=>{

                }).catch(err=>{

                });
            },

            //ios12 页面回弹底部空白 bug
            handelPageAdjust(){
                let ua = window.navigator.userAgent;
                if(!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                    setTimeout(()=>{
                        document.activeElement.scrollIntoViewIfNeeded(true);
                    },100)
                }
            }
        },
        computed: {},
        created() {
        }
    }
</script>

<style lang="scss">
    .car-container{
        .car-btn{
            padding: 0 32px;
            .car-link{
                margin: 48px auto;
            }
        }

        .van-cell{
            .van-cell__title{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                img{
                    width: 80px;
                    height: 80px;
                    border-radius: 80px;
                }
                .custom-title{
                    margin-left: 20px;
                }
            }
            .van-cell__right-icon{
                height: 80px;
                line-height: 80px;
            }
            input[type=text],input[type=tel],input[type=password]{
                font-size: 28px;
                height: 48px;
            }
        }
    }
</style>