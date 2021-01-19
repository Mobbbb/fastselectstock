<template>
    <PopView :widthNum="48">
        <div class="input-layer" @touchmove.prevent>
            <div class="content-wrap">
                <div class="content-title">自定义条件</div>
                <div class="content-recommend" :class="index ? '' : 'black-font'" v-for="(item, index) in recommendList">
                    {{item}}
                </div>
                <div class="input-wrap">
                    <NumberInput @on-blur="onBlur"
                                 placeholder="请输入"
                                 v-model="value1"
                                 :unit="rangeInputConfig.unit"
                                 ref="numberInput">
                    </NumberInput>
                    <span>到</span>
                    <NumberInput @on-blur="onBlur"
                                 placeholder="请输入"
                                 v-model="value2"
                                 :unit="rangeInputConfig.unit">
                    </NumberInput>
                </div>
                <div class="content-tips">{{rangeInputConfig.remark}}</div>
            </div>
            <div class="bottom-btn-wrap">
                <div class="bottom-btn" @click="cancelBtnClick">取消</div>
                <div class="bottom-btn" :class="clickAble ? 'click-able' : 'disabled'" @click="confirmBtnClick">确定</div>
            </div>
        </div>
    </PopView>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { getDeviceType } from "_c/libs/util";
import PopView from '_c/components/base/PopView.vue';
import NumberInput from '_c/components/base/NumberInput.vue';

export default {
    name: 'input-layer',
    components: {
        PopView,
        NumberInput,
    },
    data() {
        return {
            value1: '',
            value2: '',
        };
    },
    computed: {
        ...mapState([
            'rangeInputConfig',
        ]),
        recommendList() {
            let recommendList = [''];
            if (this.rangeInputConfig.recommend) {
                // 多条推荐语句由|分隔
                recommendList = this.rangeInputConfig.recommend.split('|') || [''];
            }
            if (recommendList[0]) {
                // 第一条推荐语句增加父标题
                recommendList[0] = this.rangeInputConfig.parentTitle + recommendList[0];
            }
            return recommendList;
        },
        clickAble() {
            return this.value1 && this.value2;
        },
    },
    methods: {
        ...mapMutations([
            'hideRangeInput',
        ]),
        cancelBtnClick() {
            this.hideRangeInput();
        },
        confirmBtnClick() {
            if (this.clickAble) {
                if (typeof this.rangeInputConfig.confirmCallback === 'function') {
                    this.rangeInputConfig.confirmCallback(this.value1, this.value2);
                }
                this.hideRangeInput();
            }
        },
        onBlur() {
            if (getDeviceType() === 'iPhone') {
                this.$refs.numberInput.$el.scrollIntoView({
                    block: 'end',
                    behavior: 'auto',
                });
            }
        },
    },
}
</script>

<style scoped>
    .input-layer{
        background: white;
        border-radius: 4px;
    }
    .content-wrap{
        padding: 20px 20px 16px;
    }
    .content-title{
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }
    .content-recommend{
        color: #595959;
        margin-top: 8px;
        word-break: break-all;
    }
    .black-font{
        color: #262626;
    }
    .input-wrap{
        display: flex;
        margin: 12px 0;
        align-items: center;
        justify-content: space-between;
    }
    .content-tips{
        font-size: 12px;
        color: #b3b3b3;
    }
    .bottom-btn-wrap{
        height: 50px;
        display: flex;
        flex-direction: row;
        position: relative;
    }
    .bottom-btn-wrap:before{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        content: "";
        width: 100%;
        height: 1px;
        transform: scaleY(.5);
        transform-origin: 0 0;
        background: #ebebeb;
    }
    .bottom-btn{
        flex: 1;
        line-height: 49px;
        height: 49px;
        font-size: 17px;
        text-align: center;
        color: #262626;
        position: relative;
    }
    .disabled{
        color: #b3b3b3;
    }
    .click-able{
        color: #e93030;
    }
    .bottom-btn:last-child:before{
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        width: 1px;
        height: 100%;
        transform: scaleX(.5);
        transform-origin: 0 0;
        background: #ebebeb;
    }
</style>
