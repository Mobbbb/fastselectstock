<template>
    <PopView :widthNum="48">
        <div class="tips-layer">
            <div class="tips-title">{{tipsConfig.title}}</div>
            <div class="tips-content-wrap" @touchmove="touchmove">
                <div class="tips-scroll-wrap" ref="tipsScrollWrap">
                    <div class="tips-content">{{tipsConfig.content}}</div>
                    <template v-if="subTips.length">
                        <div class="sub-tips-wrap" v-for="item in subTips">
                            <div class="sub-tips-title"><span class="tips-point">·</span>{{item.label}}</div>
                            <div class="sub-tips-content">{{item.remark}}</div>
                        </div>
                    </template>
                </div>
            </div>
            <div class="bottom-btn" @click="closeLayer">我知道了</div>
        </div>
    </PopView>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getRem } from '_c/libs/util';
import PopView from '_c/components/base/PopView.vue';

export default {
    name: 'tips-layer',
    components: {
        PopView,
    },
    data() {
        return {

        };
    },
    computed: {
        ...mapState([
            'tipsConfig',
        ]),
        subTips() {
            let subTips = [];
            this.tipsConfig.subTips.forEach(rowTips => {
                rowTips.forEach(item => {
                    if (item.remark && item.type !== 'input') {
                        subTips.push(item);
                    }
                });
            });
            return subTips;
        },
    },
    methods: {
        ...mapMutations([
            'changeTipsLayerShowStatus',
        ]),
        closeLayer() {
            this.changeTipsLayerShowStatus(false);
        },
        touchmove(e) {
            const contentMaxHeight = 240 * getRem();
            const tipsScrollWrap = this.$refs.tipsScrollWrap || {};
            // 若弹框内未出现滚动条，阻止滚动穿透
            if (tipsScrollWrap.offsetHeight < contentMaxHeight) {
                e.preventDefault();
            }
        },
    },
}
</script>

<style scoped>
    .tips-layer{
        background: white;
        font-size: 14px;
        padding: 16px 8px 0 8px;
        border-radius: 4px;
    }
    .tips-title{
        font-size: 18px;
        font-weight: bold;
        height: 25px;
        line-height: 25px;
        text-align: center;
    }
    .tips-content-wrap{
        padding: 8px 12px 16px 12px;
        line-height: 24px;
        max-height: 240px;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .tips-content{
        color: #595959;
    }
    .sub-tips-wrap{

    }
    .sub-tips-title{
        font-weight: bold;
        position: relative;
        padding-left: 5px;
    }
    .tips-point{
        font-weight: normal;
        position: absolute;
        left: 0;
    }
    .sub-tips-content{
        color: #595959;
    }
    .bottom-btn{
        width: 100%;
        height: 50px;
        line-height: 50px;
        position: relative;
        font-size: 17px;
        color: #E93030;
        text-align: center;
        padding: 0 8px;
        margin-left: -8px;
    }
    .bottom-btn:before{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        content: '';
        width: 100%;
        height: 1PX;
        transform: scaleY(0.5);
        transform-origin: 0 0;
        background: #ebebeb;
    }
</style>
