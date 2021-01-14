<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import { list } from '_c/config';

export default {
    name: 'App',
    data() {
    	return {
    		
    	}
    },
    computed: {
    	
    },
    methods: {
        ...mapActions([
            'initTreeData',
            'getStrategyLists',
        ]),
    },
    mounted() {
        this.initTreeData(list);
        this.getStrategyLists();
    },
}
</script>

<style scoped>
	#app{
        height: 100%;
    }
</style>
