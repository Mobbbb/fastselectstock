<template>
    <div class="header-bar">
        <span>{{title}}</span>
        <div class="back-icon" @click="jumpBack"></div>
    </div>
</template>

<script>
import { nativeGoBack } from '_c/libs/util';

export default {
    name: 'header-bar',
    props: {
        title: {
            type: String,
            default: '',
        },
    },
    computed: {

    },
    methods: {
        jumpBack() {
            if (this.$route.name === 'index') {
                nativeGoBack();
            } else {
                this.$router.go(-1);
            }
        },
    },
}
</script>

<style scoped>
    .header-bar{
        height: 44px;
        line-height: 44px;
        text-align: center;
        font-weight: bold;
        color: white;
        font-size: 17px;
        position: relative;
        background: #e93030;
    }
    .back-icon{
        width: 22px;
        height: 22px;
        background: url("//i.thsi.cn/iwencai/wap/img/nav_back_new.png");
        background-size: 100%;
        position: absolute;
        left: 16px;
        top: 10px;
    }
</style>
