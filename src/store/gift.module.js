import { GiftsService } from "@/common/api.service";


const state = {
	tags: [],
	gifts: [],
	isLoading: true,
	giftsCount: 0
};

const getters = {
	giftsCount(state) {
		return state.giftsCount;
	},
	gifts(state) {
		return state.gifts;
	},
	isLoading(state) {
		return state.isLoading;
	},
	tags(state) {
		return state.tags;
	}
};

const actions = {
	fetchGifts({ commit }) {
		commit('setGiftsLoading');
		return GiftsService.get()
			.then(( data ) => {
				commit('setGifts', data);
			})
			.catch(error => {
				throw new Error(error);
			});
	},
	// fetchTags({ commit }) {
	// 	return TagsService.get()
	// 		.then(( data ) => {
	// 			commit('setTags', data.tags);
	// 		})
	// 		.catch(error => {
	// 			throw new Error(error);
	// 		});
	// }
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
	setGiftsLoading(state) {
		state.isLoading = true;
	},
	setGifts(state, { gifts, giftsCount }) {
		state.gifts = gifts;
		state.giftsCount = giftsCount;
		state.isLoading = false;
	},
	setTags(state, tags) {
		state.tags = tags;
	},
	updateGiftInList(state, data) {
		state.gifts = state.gifts.map(gift => {
			if (gift.id !== data.id) {
				return gift;
			}
			// We could just return data, but it seems dangerous to
			// mix the results of different api calls, so we
			// protect ourselves by copying the information.
			gift.favorited = data.favorited;
			gift.favoritesCount = data.favoritesCount;
			gift.name = data.name;
			gift.type = data.type;
			gift.exhaust = data.exhaust;
			gift.summary = data.summary;
			gift.gift_req_string = data.gift_req_string;
			gift.book_name = data.book_name;
			gift.page = data.page;
			return gift;
		});
	},
	addGift(state, data) {
		return GiftsService.put(data)
			.then(( result ) => {
				data.id = result.id;
				state.gifts.push(data);
			})
			.catch(error => {
				throw new Error(error);
			});
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};