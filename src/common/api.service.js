import JwtService from "@/common/jwt.service";

let headers = {
	"Content-Type": 'application/json'
};

export async function callAPI(url, method, payload){
	let fetchOpts = {
		// ...options,
		headers: headers
	}
	console.log(url, method, payload);
	fetchOpts.method = method;
	fetchOpts.body = JSON.stringify(payload);
	
	const response = await fetch(process.env.VUE_APP_API_URL + url, fetchOpts);
	const body = await response.json();
	if (response.ok) {
		return body;
	}
	else {
		throw { response: response, body: body };
	}
}


const ApiService = {

	setHeader() {
		headers.Authorization = `Token ${JwtService.getToken()}`;
	},

	query(resource, params) {
		return callAPI(resource, 'get', params).catch(error => {
			throw new Error(`[RWV] ApiService ${error}`);
		});
	},

	get(resource, slug = "") {
		return callAPI(`${resource}/${slug}`, 'get').catch(error => {
			throw new Error(`[RWV] ApiService ${error}`);
		});
	},

	post(resource, params) {
		return callAPI(`${resource}`, 'post', params);
	},

	update(resource, slug, params) {
		return callAPI(`${resource}/${slug}`, 'update', params);
	},

	put(resource, params) {
		return callAPI(`${resource}`, 'put', params);
	},

	delete(resource) {
		return callAPI(resource, 'delete').catch(error => {
			throw new Error(`[RWV] ApiService ${error}`);
		});
	}
};

export default ApiService;

export const TagsService = {
	get() {
		return ApiService.get("tags");
	}
};

export const GiftsService = {
	query(type, params) {
		return ApiService.query("gifts", {
			params: params
		});
	},
	get(slug) {
		return ApiService.get("gifts", slug);
	},
	put(resource, params) {
		return ApiService.put(`gifts`, { gift: params });
	},
	create(params) {
		return ApiService.post("gifts", { gift: params });
	},
	update(slug, params) {
		return ApiService.update("gifts", slug, { gift: params });
	},
	destroy(slug) {
		return ApiService.delete(`gifts/${slug}`);
	}
};