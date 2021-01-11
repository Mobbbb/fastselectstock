<template>
    <span class="rise-fall-text" :class="fallClass">{{rate}}%</span>
</template>

<script>

export default {
    name: 'rise-fall-text',
    props: {
        rate: {
            type: String,
            default: '',
        },
    },
    computed: {
        fallClass () { // 涨跌幅颜色设置
            if (Number(this.rate) < 0) return 'fall-color';
            return '';
        },
    },
    methods: {

    },
}
</script>

<style scoped>
    .rise-fall-text{
        height: 14px;
        line-height: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 8px;
        color: #e93030;
        font-size: 12px;
    }
    .fall-color{
        color: #269932;
    }
</style>
