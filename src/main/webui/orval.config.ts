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