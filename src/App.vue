<template>
    <div id="app">
        <HeaderBar :title="headerTitle"></HeaderBar>
        <div class="app-body-wrap">
            <keep-alive>
                <router-view/>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import HeaderBar from '_c/components/base/HeaderBar.vue';

export default {
    name: 'App',
    components: {
        HeaderBar,
    },
    data() {
    	return {
    		
    	}
    },
    computed: {
    	headerTitle() {
    	    const { parentTitle } = this.$route.query;
            return this.$route.meta.title || parentTitle;
        },
    },
    methods: {
        ...mapActions([
            'getConditionLists',
            'getStrategyLists',
        ]),
    },
    mounted() {
        this.getConditionLists();
        this.getStrategyLists();
    },
}
</script>

<style scoped>
	#app{
        height: 100%;
    }
    .app-body-wrap{
        height: calc(100% - 44px);
    }
</style>
