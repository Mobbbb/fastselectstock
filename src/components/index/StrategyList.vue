<template>
    <div class="strategy-list">
        <div class="strategy-list-wrap" @scroll="onScroll" ref="strategyListWrap">
            <Row ref="strategyRow"
                 :key="rowIndex"
                 :gutter="gutter"
                 :style="rowStyle(row.length, rowIndex)"
                 v-for="(row, rowIndex) in strategyLists" >
                <Col :span="24 / row.length" v-for="item in row" :key="item.simulate_id">
                    <div class="strategy-item-wrap" @click="clickStrategy(item)">
                        <div class="strategy-title">{{item.edit_name}}</div>
                        <div class="strategy-content">{{item.desc}}</div>
                    </div>
                </Col>
            </Row>
        </div>
        <div class="tool-bar-wrap" v-if="strategyLists.length > 1">
            <div class="tool-bar">
                <div class="active-toolbar" :style="toolbarStyle"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import { getRem } from '_c/libs/util';
import { STRATEGY_NUM_EACH_PAGE } from '_c/config';
import Row from '_c/components/grid/Row.vue';
import Col from '_c/components/grid/Col.vue';

export default {
    name: 'strategy-list',
    components: {
        Row,
        Col,
    },
    data() {
        return {
            barPosition: 0,
            gutter: 8,
        }
    },
    computed: {
        ...mapState([
            'strategyLists',
        ]),
        toolbarStyle() {
            return {
                left: this.barPosition + 'px',
            };
        },
        rowStyle() { // 一行未满的宽度需要特殊处理
            return function(length, index) {
                if (index > 0) {
                    let gap = this.gutter / 2;
                    if (length === STRATEGY_NUM_EACH_PAGE) gap = 0;
                    return {
                        width: `calc(${length * 100 / STRATEGY_NUM_EACH_PAGE}% - ${gap}px)`,
                        marginRight: `${this.gutter}px`,
                    };
                }

                return {
                    marginRight: `${this.gutter}px`,
                };
            };
        },
    },
    methods: {
        clickStrategy(item) { // 跳转策略详情页面
            const { query, simulate_id } = item;
            this.$router.push({
                name: 'StrategyDetail',
                query: {
                    query,
                    simulateId: simulate_id,
                }
            });
        },
        onScroll(e) {
            let rowsWrapWidth = 0; // 一行的总宽度
            const { offsetWidth } = this.$refs.strategyListWrap || {};
            const strategyRows = this.$refs.strategyRow || [];
            strategyRows.forEach(item => {
                rowsWrapWidth += item.$el.offsetWidth + this.gutter;
            });
            rowsWrapWidth -= this.gutter;

            // 计算当前的滚动距离占比
            const rate = e.target.scrollLeft / (rowsWrapWidth - offsetWidth);
            const barMaxOffset = 14;

            this.barPosition = barMaxOffset * getRem() * rate;
        },
    },
}
</script>

<style scoped>
    .strategy-list{
        margin: 0 12px;
        overflow-y: hidden;
    }
    .strategy-list-wrap{
        display: flex;
        flex-wrap: nowrap;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
        overflow-y: hidden;
        margin-bottom: -25px;
    }
    .strategy-list .line-row-wrap{
        flex-shrink: 0;
        width: 100%;
        padding-bottom: 25px;
        overflow: hidden;
    }
    .strategy-list .line-row-wrap:last-of-type{
        margin-right: 0;
    }
    .strategy-item-wrap{
        padding: 12px;
        box-sizing: border-box;
        background: #f7f8fa;
        border-radius: 4px;
    }
    .strategy-title{
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        word-break: break-word;
    }
    .strategy-content{
        height: 40px;
        line-height: 20px;
        font-size: 12px;
        color: #595959;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
    }
    .tool-bar-wrap{
        width: 100%;
        margin-top: 12px;
    }
    .tool-bar{
        width: 42px;
        height: 3px;
        background: #dedede;
        border-radius: 10px;
        margin: 0 auto;
        position: relative;
    }
    .active-toolbar{
        width: 28px;
        height: 3px;
        border-radius: 10px;
        position: absolute;
        background: #E93030;
    }
</style>
