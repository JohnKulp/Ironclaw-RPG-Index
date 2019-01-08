import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/';
import './registerServiceWorker';
// import ApiService from "./common/api.service";
import Vuetify from 'vuetify'

Vue.use(Vuetify)

Vue.config.productionTip = false;

if(store.state.auth.isAuthenticated){
	store.dispatch('checkAuth');
}

new Vue({
	router,
	store,
	render: function (h) { return h(App) }
}).$mount('#app')
