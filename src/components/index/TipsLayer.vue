<template>
    <PopView>
        <div class="tips-layer">
            <div>{{tipsConfig}}</div>
            <div @click="closeLayer">我知道了</div>
        </div>
    </PopView>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import PopView from '@/components/base/PopView.vue';

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
    },
    methods: {
        ...mapMutations([
            'changeTipsLayerShowStatus',
        ]),
        closeLayer() {
            this.changeTipsLayerShowStatus(false);
        },
    },
}
</script>

<style scoped>
    .tips-layer{
        background: white;
    }
</style>
