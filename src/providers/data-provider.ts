import type { DataProvider } from "@refinedev/core";

const API_URL = "https://api.fake-rest.refine.dev";

export const dataProvider: DataProvider = {

	create: async ({ resource, variables, /*meta*/ }) => {
		const response = await fetch(`${API_URL}/${resource}`, {
			method: "POST",
			body: JSON.stringify(variables),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return { data };
	},

	update: async ({ resource, id, variables, /*meta*/ }) => {
		const response = await fetch(`${API_URL}/${resource}/${id}`, {
			method: "PATCH",
			body: JSON.stringify(variables),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return { data };
	},

	getList: async ({ resource, pagination, sorters, filters, /*meta*/ }) => {
		const params = new URLSearchParams();

		if (pagination && pagination.current !== undefined && pagination.pageSize !== undefined) {
			params.append("_start", String((pagination.current - 1) * pagination.pageSize));
			params.append("_end", String(pagination.current * pagination.pageSize));
		}

		if (sorters && sorters.length > 0) {
			params.append("_sort", sorters.map((sorter) => sorter.field).join(","));
			params.append("_order", sorters.map((sorter) => sorter.order).join(","));
		}

		if (filters && filters.length > 0) {
			filters.forEach((filter) => {
				if ("field" in filter && filter.operator === "eq") {
					// Our fake API supports "eq" operator by simply appending the field name and value to the query string.
					params.append(filter.field, filter.value);
				}
			});
		}

		const response = await fetch(`${API_URL}/${resource}?${params.toString()}`);

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return {
			data,
			total: 0
		};
	},

	getOne: async ({ resource, id, /*meta*/ }) => {
		const response = await fetch(`${API_URL}/${resource}/${id}`);

		if (response.status < 200 || response.status > 299) throw response;

		const data = await response.json();

		return { data };
	},
};