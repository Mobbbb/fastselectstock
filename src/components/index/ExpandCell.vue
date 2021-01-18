<template>
    <div class="expand-selection-item" @click="clickItem">
        <div class="atom-item-wrap">
            <div class="selection-atom-item">{{item.label}}</div>
            <div class="right-arrow" v-if="showArrow"></div>
        </div>
        <div class="recommend-label" v-if="item.recommend">{{recommend}}</div>
        <RiseFallText v-else-if="item.fluctuation" :rate="item.fluctuation"></RiseFallText>
    </div>
</template>

<script>
import { MORE_TYPE } from '_c/config';
import { recordTrackPoint } from '_c/libs/trackPoint';
import RiseFallText from '_c/components/base/RiseFallText';

export default {
    name: 'expand-selection-item',
    props: {
        item: Object,
    },
    components: {
        RiseFallText,
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
        showArrow() {
            return MORE_TYPE.includes(this.item.type);
        },
    },
    methods: {
        clickItem() {
            recordTrackPoint({ id: this.item.trackpoint });
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
    .atom-item-wrap{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2px;
    }
    .selection-atom-item{
        height: 16px;
        line-height: 16px;
    }
    .right-arrow{
        width: 14px;
        height: 14px;
        background: url("//i.thsi.cn/iwencai/xuangu/images/right-arrow.png");
        background-size: 100%;
    }
    .recommend-label{
        height: 14px;
        line-height: 14px;
        font-size: 11px;
        color: #B3B3B3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 8px;
    }
</style>
