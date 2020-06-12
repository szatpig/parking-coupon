<template>
    <div class="car-container">
        <div class="car-list">
            <van-swipe-cell v-for="item in carList" :key="item.id">
                <van-cell center  @click="handleShow(item)" >
                    <template #title>
                        <img :src="require('./../../images/car-head.png')" alt="">
                        <div class="custom-title">
                            <span class="custom-plat">{{ item.plateNo }}</span>
                            <span class="custom-color">{{ picker.columns[item.plateColor] }}</span>
                        </div>
                    </template>
                </van-cell>
                <template #right>
                    <van-button square type="danger" @click="handleDelete(item.id)" text="删除" />
                </template>
            </van-swipe-cell>
        </div>
        <div class="car-btn">
            <van-button
                    class="car-link"
                    size="large"
                    round
                    @click="handleShow(0)">+ 新增车辆</van-button>
        </div>
        <van-popup class="popup-container" v-model="popup.show" position="right" >
            <van-cell-group>
                <van-field
                        label="车牌号"
                        maxlength="11"
                        v-model.trim="popup.data.plateNo"
                        placeholder="请输入您的车牌号"
                        @input="handlePlateNoChange"
                        @blur="handelPageAdjust" />
                <van-field
                        readonly
                        clickable
                        :value="picker.columns[popup.data.plateColor]"
                        right-icon="arrow"
                        label="车牌颜色"
                        placeholder="请选择车牌颜色"
                        @click="handlePicker"
                />
            </van-cell-group>
            <div class="popup-btn">
                <van-button
                        :disabled="!popup.data.plateNo"
                        class="car-submit"
                        size="large"
                        round
                        type="info"
                        @click="handleSubmit">保存</van-button>
            </div>
        </van-popup>
        <van-popup class="popup-picker-container" v-model="picker.show" position="bottom">
            <van-picker
                    show-toolbar
                    :columns="picker.columns"
                    confirm-button-text="确定"
                    @confirm="handleConfirm"
                    @cancel="picker.show = false"
            />
        </van-popup>
    </div>
</template>

<script>
    import { customerCarList,customerCarInsert,customerCarDelete,customerCarUpdate } from '@/api/user-api'
    import headImg from '@/images/head-img.png'
    export default {
        name: "car",
        data() {
            return {
                popup:{
                    show:false,
                    data:{
                        plateNo:'',
                        plateColor:'',
                    }
                },
                carList:[],
                picker:{
                    show:false,
                    columns:['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色']
                },
            }
        },
        components: {},
        watch: {
            '$route' (to, from) {
                console.log(to)
                // 对路由变化作出响应...
                if(to.query.type){
                    this.popup.show = true;
                }else{
                    this.popup.show = false;
                }
            }
        },
        methods: {
            handleShow(item){
                this.$router.push({
                    query:{
                        type: item ? 'edit' : 'add'
                    }
                });
                if(item){
                    this.popup.data = JSON.parse(JSON.stringify(item));
                }else{
                    this.popup.data = {
                        plateNo:'',
                        plateColor:'',
                    }
                }
            },
            handleSubmit(){
                let reg = /^([京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][1-9DF][1-9ABCDEFGHJKLMNPQRSTUVWXYZ]\d{3}[1-9DF]|[京津晋冀蒙辽吉黑沪苏浙皖闽赣鲁豫鄂湘粤桂琼渝川贵云藏陕甘青宁新][ABCDEFGHJKLMNPQRSTUVWXY][\dABCDEFGHJKLNMxPQRSTUVWXYZ]{5})$/
                if(!!!reg.test(this.popup.data.plateNo)){
                    this.$toast('请输入合法车牌');
                    return false;
                }
                if(this.popup.data.id){
                    let { id,plateNo,plateColor } = this.popup.data
                    customerCarUpdate({ id,plateNo,plateColor }).then(()=>{
                        this.$toast('车牌信息更新成功');
                        this.list();
                        this.$router.go(-1);
                    })
                }else{
                    customerCarInsert(this.popup.data).then(()=>{
                        this.$toast('车牌信息添加成功');
                        this.list();
                        this.$router.go(-1);
                    })
                }

            },
            handleDelete(id){
                this.$dialog.confirm({
                    className:'call-dialog',
                    title:``,
                    message: `确认删除该车辆？`,
                    confirmButtonText:'删除',
                    confirmButtonColor:'#F44336',
                    cancelButtonText:`取消`
                }).then(()=>{
                    customerCarDelete({id}).then(data =>{
                        this.$toast('车牌信息删除成功');
                        this.list();
                    })
                }).catch(err=>{

                });
            },

            handlePlateNoChange(val){
                this.popup.data.plateNo = val.replace(/[\s]/g,'').toUpperCase();
            },
            handlePicker(){
                this.picker.show = true;
            },
            handleConfirm(val,index){
                console.log(val,index)
                this.popup.data.plateColor = index;
                this.picker.show = false;
            },

            list(){
                customerCarList({}).then(data => {
                    this.carList = data.data;
                })
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
            let { type } = this.$route.query;
            if(type){
                this.popup.show = true;
            }else{
                this.popup.show = false;
            }
            this.list();
        }
    }
</script>

<style lang="scss">
    .car-container{
        height: 100%;
        overflow: auto;
        margin-bottom: 100px;
        .car-btn{
            padding: 0 32px;
            .car-link{
                margin: 48px auto;
            }
        }
        .van-swipe-cell{
            .van-swipe-cell__right{
                button{
                    height: 100%;
                }
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
                    display: flex;
                    flex-flow: column nowrap;
                    justify-content: center;
                    align-items: flex-start;
                    margin-left: 20px;
                    .custom-color{
                        color: #969799;
                        font-size: 24px;
                    }
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