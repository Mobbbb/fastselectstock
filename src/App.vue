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
        ]),
    },
    mounted() {
        this.initTreeData(list);
    },
}
</script>

<style scoped>
	#app{
        height: 100%;
    }
</style>
