<template>
    <div class="number-input">
        <input class="value-input"
               ref="precisionCursor"
               autocomplete="off"
               @focus="focus"
               @blur="blur"
               @input="change"
               @mouseup="preventDefault"
               :name="name"
               :style="paddingRight"
               :value="precisionValue"
               :placeholder="placeholder">
        <span class="input-unit" v-if="unit">{{unit}}</span>
    </div>
</template>

<script>

export default {
    name: 'number-input',
    props: {
        unit: {
            type: String,
            default: '',
        },
        max: {
            type: Number,
            default: Infinity,
        },
        min: {
            type: Number,
            default: -Infinity,
        },
        value: {
            type: Number,
            default: 1,
        },
        name: {
            type: String,
        },
        precision: {
            type: Number,
        },
        placeholder: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            currentValue: this.value,
        }
    },
    computed: {
        precisionValue () { // 小数精度处理
            if (!this.currentValue) return this.currentValue;
            return this.precision ? this.currentValue.toFixed(this.precision) : this.currentValue;
        },
        paddingRight() {
            const fontSize = 14;
            const padding = 8;
            return {
                paddingRight: `${this.unit.length * fontSize + padding * 3}px`,
            };
        },
    },
    methods: {
        preventDefault(e) {
            e.preventDefault();
        },
        focus(event) {
            this.$emit('on-focus', event);
        },
        blur() {
            this.$emit('on-blur');
        },
        change(event) {
            // 空值处理
            let val = event.target.value.trim();
            const isEmptyString = val.length === 0;
            if(isEmptyString){
                this.setValue(null);
                return;
            }

            // 数字化处理
            let cacheVal = this.currentValue;
            val = Number(val);
            if (!isNaN(val)) {
                this.currentValue = val;
                this.setValue(val);
            } else {
                event.target.value = cacheVal;
            }
        },
        setValue(val) {
            // 精度处理
            if (val && !isNaN(this.precision)) val = Number(Number(val).toFixed(this.precision));

            // 阈值处理
            const { min, max } = this;
            if (val !== null) {
                if (val > max) {
                    val = max;
                } else if (val < min) {
                    val = min;
                }
            }

            // 赋值处理
            this.$nextTick(() => {
                this.currentValue = val;
                this.$emit('input', val);
                this.$emit('on-change', val);
            });
        },
    },
    watch: {
        value(val) {
            this.currentValue = val;
        },
    },
}
</script>

<style scoped>
    .number-input{
        position: relative;
    }
    .value-input{
        width: 105px;
        height: 36px;
        line-height: 36px;
        padding: 8px;
        border-radius: 4px;
        border: 1px solid #ebebeb;
        box-sizing: border-box;
        outline: none;
        font-size: 14px;

        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        -moz-user-focus: unset;
        -webkit-appearance: none;
        -webkit-user-select: text!important;
    }
    .input-unit{
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        line-height: 36px;
        padding: 0 8px;
    }
    .input-unit::-webkit-input-placeholder{
        color: #b3b3b3;
    }
    .input-unit::-moz-placeholder{
        color: #b3b3b3;
    }
    .input-unit:-moz-placeholder{
        color: #b3b3b3;
    }
    .input-unit:-ms-input-placeholder{
        color: #b3b3b3;
    }
    .input-unit:before{
        position: absolute;
        top: 8px;
        left: 0;
        content: "";
        width: 1px;
        height: calc(100% - 16px);
        transform: scaleX(.5);
        transform-origin: 0 0;
        background: #ebebeb;
    }
</style>
