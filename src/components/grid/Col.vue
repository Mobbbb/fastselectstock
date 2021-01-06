<!--24栅格系统，将区域进行24等分-->
<template>
    <div class="line-col" :class="widthClass" :style="styles">
    	<slot></slot>
    </div>
</template>

<script>
import { findComponentUpward } from '@/libs/util';
import "./style.config.css";

export default {
    name: 'Col',
    props: {
        span: {
        	default: 0,
        	type: Number,
        },
    },
    data () {
        return {
            gutter: 0,
        };
    },
    computed: {
        widthClass() {
            return `line-col-span-${this.span}`;
        },
        styles() {
            let style = {};
            if (this.gutter !== 0) {
                style = {
                    paddingLeft: this.gutter / 2 + 'px',
                    paddingRight: this.gutter / 2 + 'px'
                };
            }

            return style;
        },
    },
    methods: {
        updateGutter () {
            const Row = findComponentUpward(this, 'Row');
            if (Row) {
                Row.updateGutter(Row.gutter);
            }
        }
    },
    mounted () {
        this.updateGutter();
    },
    beforeDestroy () {
        this.updateGutter();
    }
}
</script>

<style scoped>
	.line-col{
        float: left;
        flex: 0 0 auto;
        box-sizing: border-box;
	}
</style>
