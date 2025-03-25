module.exports = {
	cars: {
		output: {
			target: 'src/service/CarService.ts',
			client: 'react-query',
			mock: false,
			prettier: false,
			override: {
				useDates: true,
				mutator: {
					path: 'src/service/AxiosMutator.ts',
					name: 'useAxiosMutator'
				},
				query: {
					useQuery: true
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
						response: ['date'],
						body: ['date']
					}
				}
			}
		},
		input: {
			target: './openapi.yaml'
		}
	}
};
