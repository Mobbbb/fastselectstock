import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './styles/index.css';
import { setRem } from "./libs/util";

Vue.config.productionTip = false;

setRem();
window.onresize = () => setRem();

Vue.use(window.jgyLib);

new Vue({
  	router,
  	store,
  	render: h => h(App),
}).$mount('#app');
