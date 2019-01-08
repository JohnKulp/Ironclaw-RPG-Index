import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Admin from './components/Admin';
import Gifts from './views/Gifts';
import store from './store/';

Vue.use(Router);

let router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home
		},
		{
			path: '/login',
			name: 'login',
			component: () => import("@/views/Login"),
			meta: { 
				requiresLoggedOut : true
			}
		},
		{
			path: '/logout',
			name: 'logout',
			meta: { 
				requiresAuth : true
			}
		},
		{
			path: '/admin',
			name: 'admin',
			component: Admin,
			meta: { 
				requiresAuth: true,
				requiresAdmin : true
			}
		},
		{
			path: '/gifts',
			name: 'gifts',
			component: Gifts
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (about.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: function () { 
				return import(/* webpackChunkName: "about" */ './views/About.vue')
			}
		},
	]
});

router.beforeEach((to, from, next) => {

	//see if we're logging out 

	if(to.matched.some( record => record.path === '/logout') && store.state.auth.isAuthenticated ){

		store.commit('logout');
		return next('/');
	}

	return next();
})


export default router;