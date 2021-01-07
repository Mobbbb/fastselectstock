<template>
    <div class="line-row-wrap">
    	<div class="line-row" :style="styles">
    		<slot></slot>
    	</div>
    	<slot name="extend-slot"></slot>
    </div>
</template>

<script>
import { findComponentDownward, findBrothersComponents } from '_c/libs/util';

export default {
    name: 'Row',
    props: {
        gutter: {
            default: 0,
            type: Number,
        },
    },
    computed: {
        styles () {
            let style = {};
            if (this.gutter !== 0) {
                style = {
                    marginLeft: this.gutter / -2 + 'px',
                    marginRight: this.gutter / -2 + 'px'
                };
            }

            return style;
        },
    },
    methods: {
        updateGutter (val) {
            // 这里会嵌套寻找，把 Col 里的 Row 里的 Col 也找到，所以用 兄弟找
            const Col = findComponentDownward(this, 'Col');
            const Cols = findBrothersComponents(Col, 'Col', false);
            if (Cols.length) {
                Cols.forEach((child) => {
                    if (val !== 0) {
                        child.gutter = val;
                    }
                });
            }
        },
    },
    watch: {
        gutter (val) {
            this.updateGutter(val);
        }
    }
}
</script>

<style scoped>
	.line-row{
		position: relative;
	    height: auto;
	    zoom: 1;
	    box-sizing: border-box;
	}
	.line-row:before, .line-row:after{
		content: "";
    	display: table;
    	box-sizing: border-box;
	}
	.line-row:after {
	    clear: both;
	    visibility: hidden;
	    font-size: 0;
	    height: 0;
	}
</style>
