import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";

const state = {
	errors: null,
	user: {},
	isAuthenticated: !!JwtService.getToken()
};

const getters = {
	currentUser(state) {
		return state.user;
	},
	isAuthenticated(state) {
		return state.isAuthenticated;
	}
};

const actions = {
	login(context, credentials) {
		console.log('logging in');
		return new Promise(resolve => {
			ApiService.post("users/login", { user: credentials })
				.then(( data ) => {
					context.commit("setUser", data.user);
					resolve(data);
				})
				.catch(( response ) => {
					context.commit("setError", response.data.errors);
				});
		});
	},
	logout(context) {
		context.commit("logout");
	},
	register(context, credentials) {
		return new Promise((resolve, reject) => {
			ApiService.post("users", { user: credentials })
				.then(( data ) => {
					context.commit("setUser", data.user);
					resolve(data);
				})
				.catch(( response ) => {
					context.commit("setError", response.data.errors);
					reject(response);
				});
		});
	},
	checkAuth(context) {
		if (JwtService.getToken()) {
			ApiService.setHeader();
			ApiService.get("user")
				.then(( data ) => {
					context.commit("setUser", data.user);
				})
				.catch(() => {
					context.commit("logout");
				});
		} else {
			context.commit("logout");
		}
	}
};

const mutations = {
	setError(state, error) {
		state.errors = error;
	},
	setUser(state, user) {
		state.isAuthenticated = true;
		state.user = user;
		state.errors = {};
		JwtService.saveToken(state.user.token);
	},
	logout(state) {
		state.isAuthenticated = false;
		state.user = {};
		state.errors = {};
		JwtService.destroyToken();
	}
};

export default {
	state,
	actions,
	mutations,
	getters
};