import Axios, { AxiosError, RawAxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: process.env.VITE_REACT_APP_API_SERVER! });

export const useAxiosMutator = <T>(): ((config: RawAxiosRequestConfig) => Promise<T>) => {
	return (config: RawAxiosRequestConfig) => {
		const promise = AXIOS_INSTANCE({ ...config }).then(({ data }) => data);

		return promise;
	};
};

export default useAxiosMutator;

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<HttpProblem> = AxiosError<HttpProblem>;
