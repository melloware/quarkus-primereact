module.exports = {
  cars: {
    output: {
      target: 'src/main/webapp/app/service/CarService.ts',
      client: 'react-query',
      mock: false,
      prettier: false,
      override: {
        useDates: true,
        mutator: {
          path: './src/main/webapp/app/service/AxiosMutator.ts',
          name: 'useAxiosMutator',
        },
        query: {
          useQuery: true,
        }
      }
    },
    input: {
      target: './cars-openapi.yaml',
    },
  },
};