<template>
    <div class="pop-view">
        <div class="layer-mask" @touchmove.prevent></div>
        <div class="layer-content-wrap" :style="layerContentWidth">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    name: 'pop-view',
    props: {
        bottomOffset: {
            default: 50,
            type: Number,
        },
        widthType: {
            default: 'gap',
            type: String,
        },
        widthNum: {
            default: 24,
            type: Number,
        },
    },
    computed: {
        layerContentWidth() {
            let style = {};
            if (this.widthType === 'gap') {
                style = {
                    left: `${this.widthNum}px`,
                    right: `${this.widthNum}px`,
                };
            } else if (this.widthType === 'width') {
                style = {
                    width: `${this.widthNum}px`,
                    margin: 'auto',
                    left: 0,
                    right: 0,
                }
            }
            style.paddingBottom = `${this.bottomOffset}px`;
            return style;
        },
    },
    methods: {

    },
}
</script>

<style scoped>
    .pop-view{
        z-index: 100;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }
    .layer-mask{
        background-color: rgba(0, 0, 0, 0.4);
        width: 100%;
        height: 100%;
    }
    .layer-content-wrap{
        position: fixed;
        top: 50%;
        transform: translate(0, -50%);
    }
</style>
