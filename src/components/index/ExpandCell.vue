<template>
    <div class="expand-selection-item">
        <div class="selection-atom-item" @click="clickItem">{{item.label}}</div>
        <div class="recommend-label" v-if="item.recommend">{{recommend}}</div>
    </div>
</template>

<script>

export default {
    name: 'expand-selection-item',
    props: {
        item: Object,
    },
    components: {

    },
    data() {
        return {

        };
    },
    computed: {
        recommend() {
            let recommend = this.item.recommend;
            recommend = recommend.split('|') || [''];
            recommend = recommend[0].replace('：', ':');

            return recommend;
        },
    },
    methods: {
        clickItem() {
            this.$emit('on-click', this.item);
        },
    },
}
</script>

<style scoped>
    .expand-selection-item{
        height: 46px;
        background: white;
        border-radius: 2px;
        text-align: center;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .selection-atom-item{
        height: 16px;
        line-height: 16px;
    }
    .recommend-label{
        height: 14px;
        line-height: 14px;
        font-size: 12px;
        margin-top: 2px;
        color: #B3B3B3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 8px;
    }
</style>
