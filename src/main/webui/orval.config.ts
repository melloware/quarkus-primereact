module.exports = {
	cars: {
		output: {
			target: 'src/service/CarService.ts',
			client: 'react-query',
			httpClient: 'axios',
			mock: false,
			prettier: false,
			override: {
				useDates: true,
				mutator: {
					path: 'src/service/AxiosMutator.ts',
					name: 'useAxiosMutator'
				}
			}
		},
		input: {
			target: './openapi.yaml'
		}
	},
	carsZod: {
		output: {
			client: 'zod',
			target: 'src/service/CarService.zod.ts',
			override: {
				useDates: true,
				zod: {
					coerce: {
						response: true,
						query: true,
						param: true,
						header: true,
						body: true
					},
					generateReusableSchemas: true,
				}
			}
		},
		input: {
			target: './openapi.yaml'
		}
	}
};
