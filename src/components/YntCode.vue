<template>
    <div class="ynt-code">
      <van-button size="small" :disabled="disabled || time > 0" @click="sendEmit">
        <span>{{ text }}</span>
      </van-button>
    </div>
</template>

<script>
    export default {
        name: 'yntCode',
        data () {
            return {
              time: 0
            }
        },
        props:{
            disabled:{
                type:Boolean ,
                default:false
            },
            second:{
                type:Number,
                default:60
            },
        },
        components: {},
        methods: {
            run: function () {
                this.time = this.second;
                this.timer()
            },
            timer: function () {
                if (this.time > 0) {
                  this.time--;
                  setTimeout(this.timer, 1000);
                }
            },
            sendEmit(){
                this.$emit('handleSend');
            }
        },
        computed: {
            text: function () {
                return this.time > 0 ? this.time + 's 后重新获取' : '获取验证码';
            }
        },
        created() {

        }
    }
</script>

<style lang="less">
    .ynt-code{
        display: inline-block;
        button {
            width:100%;
            height: 26px;
            line-height: 26px;
            font-size: 28px;
            color: #3F8FFE;
            text-align: center;
            border: none;
            &[disabled]{
                color: #ccc;
            }
        }
    }
</style>
