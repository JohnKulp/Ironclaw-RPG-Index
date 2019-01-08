import Vue from 'vue'
import Vuex from 'vuex'

import gifts from "./gift.module";
import auth from "./auth.module";

Vue.use(Vuex)

export default new Vuex.Store({
	modules:{
		gifts,
		auth,
	}
})
