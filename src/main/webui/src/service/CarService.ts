/**
 * Generated by orval v6.19.1 🍺
 * Do not edit manually.
 * Quarkus React Monorepo
 * Quarkus monorepo demonstrating Panache REST server with PrimeReact UI client
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import type { MutationFunction, QueryFunction, QueryKey, UseMutationOptions, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useAxiosMutator } from './AxiosMutator';
import type { ErrorType } from './AxiosMutator';
export type GetEntityCarsParams = {
	request?: string;
};

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryResponseCar {
	/** Records for this set of pagination, sorting, filtering. */
	records?: Car[];
	/** Total records available by this query criteria */
	totalRecords?: number;
}

export type QueryResponseRecordsItem = { [key: string]: any };

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryResponse {
	/** Records for this set of pagination, sorting, filtering. */
	records?: QueryResponseRecordsItem[];
	/** Total records available by this query criteria */
	totalRecords?: number;
}

/**
 * Map of columns being filtered and their filter criteria
 */
export type QueryRequestFilters = { [key: string]: MultiFilterMeta };

export interface MultiSortMeta {
	/** Sort field for this multiple sort */
	field?: string;
	/** Sort order for this field either -1 desc, 0 none, 1 asc */
	order?: number;
}

/**
 * Represents a PrimeReact query request from the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryRequest {
	/** Map of columns being filtered and their filter criteria */
	filters?: QueryRequestFilters;
	/** First record */
	first?: number;
	/** Multiple sorting list of columns to sort and in which order */
	multiSortMeta?: MultiSortMeta[];
	/** Page number */
	page?: number;
	/** Number of rows */
	rows?: number;
	/** Sort field if single field sorting */
	sortField?: string;
	/** Sort order if single field sorting either -1 desc, 0 none, 1 asc */
	sortOrder?: number;
}

/**
 * Value to filter this column by
 */
export type MultiFilterMetaValue = { [key: string]: any };

export interface MultiFilterMeta {
	/** Filter match mode e.g. equals, notEquals, contains, notContains, gt, gte, lt, lte */
	matchMode?: string;
	/** Value to filter this column by */
	value?: MultiFilterMetaValue;
}

export type Instant = Date;

export type CarModifiedTime = Instant & unknown;

/**
 * Entity that represents a car.
 */
export interface Car {
	/** HTML color of the car */
	color: string;
	id?: number;
	/** Manufacturer */
	make: string;
	/** Model Number */
	model: string;
	modifiedTime?: CarModifiedTime;
	/** Price */
	price: number;
	/** VIN number */
	vin: string;
	/** Year of manufacture */
	year: number;
}

export const useGetEntityCarsHook = () => {
	const getEntityCars = useAxiosMutator<QueryResponseCar>();

	return (params?: GetEntityCarsParams, signal?: AbortSignal) => {
		return getEntityCars({ url: `/entity/cars`, method: 'get', params, signal });
	};
};

export const getGetEntityCarsQueryKey = (params?: GetEntityCarsParams) => {
	return [`/entity/cars`, ...(params ? [params] : [])] as const;
};

export const useGetEntityCarsQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError = ErrorType<unknown>>(
	params?: GetEntityCarsParams,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData>> }
) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetEntityCarsQueryKey(params);

	const getEntityCars = useGetEntityCarsHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>> = ({ signal }) => getEntityCars(params, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData> & {
		queryKey: QueryKey;
	};
};

export type GetEntityCarsQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>>;
export type GetEntityCarsQueryError = ErrorType<unknown>;

export const useGetEntityCars = <TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError = ErrorType<unknown>>(
	params?: GetEntityCarsParams,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData>> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useGetEntityCarsQueryOptions(params, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

export const usePostEntityCarsHook = () => {
	const postEntityCars = useAxiosMutator<void>();

	return (car: Car) => {
		return postEntityCars({ url: `/entity/cars`, method: 'post', headers: { 'Content-Type': 'application/json' }, data: car });
	};
};

export const usePostEntityCarsMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext> => {
	const { mutation: mutationOptions } = options ?? {};

	const postEntityCars = usePostEntityCarsHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, { data: Car }> = (props) => {
		const { data } = props ?? {};

		return postEntityCars(data);
	};

	return { mutationFn, ...mutationOptions };
};

export type PostEntityCarsMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>>;
export type PostEntityCarsMutationBody = Car;
export type PostEntityCarsMutationError = ErrorType<unknown>;

export const usePostEntityCars = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext>;
}) => {
	const mutationOptions = usePostEntityCarsMutationOptions(options);

	return useMutation(mutationOptions);
};

export const useGetEntityCarsManufacturersHook = () => {
	const getEntityCarsManufacturers = useAxiosMutator<string[]>();

	return (signal?: AbortSignal) => {
		return getEntityCarsManufacturers({ url: `/entity/cars/manufacturers`, method: 'get', signal });
	};
};

export const getGetEntityCarsManufacturersQueryKey = () => {
	return [`/entity/cars/manufacturers`] as const;
};

export const useGetEntityCarsManufacturersQueryOptions = <
	TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
	TError = ErrorType<unknown>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>, TError, TData>>;
}) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetEntityCarsManufacturersQueryKey();

	const getEntityCarsManufacturers = useGetEntityCarsManufacturersHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>> = ({ signal }) =>
		getEntityCarsManufacturers(signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type GetEntityCarsManufacturersQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>>;
export type GetEntityCarsManufacturersQueryError = ErrorType<unknown>;

export const useGetEntityCarsManufacturers = <
	TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
	TError = ErrorType<unknown>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useGetEntityCarsManufacturersQueryOptions(options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

export const useGetEntityCarsIdHook = () => {
	const getEntityCarsId = useAxiosMutator<Car>();

	return (id: number, signal?: AbortSignal) => {
		return getEntityCarsId({ url: `/entity/cars/${id}`, method: 'get', signal });
	};
};

export const getGetEntityCarsIdQueryKey = (id: number) => {
	return [`/entity/cars/${id}`] as const;
};

export const useGetEntityCarsIdQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError = ErrorType<unknown>>(
	id: number,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError, TData>> }
) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetEntityCarsIdQueryKey(id);

	const getEntityCarsId = useGetEntityCarsIdHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>> = ({ signal }) => getEntityCarsId(id, signal);

	return { queryKey, queryFn, enabled: !!id, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type GetEntityCarsIdQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>>;
export type GetEntityCarsIdQueryError = ErrorType<unknown>;

export const useGetEntityCarsId = <TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError = ErrorType<unknown>>(
	id: number,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError, TData>> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useGetEntityCarsIdQueryOptions(id, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

export const usePutEntityCarsIdHook = () => {
	const putEntityCarsId = useAxiosMutator<Car>();

	return (id: number, car: Car) => {
		return putEntityCarsId({ url: `/entity/cars/${id}`, method: 'put', headers: { 'Content-Type': 'application/json' }, data: car });
	};
};

export const usePutEntityCarsIdMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext> => {
	const { mutation: mutationOptions } = options ?? {};

	const putEntityCarsId = usePutEntityCarsIdHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, { id: number; data: Car }> = (props) => {
		const { id, data } = props ?? {};

		return putEntityCarsId(id, data);
	};

	return { mutationFn, ...mutationOptions };
};

export type PutEntityCarsIdMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>>;
export type PutEntityCarsIdMutationBody = Car;
export type PutEntityCarsIdMutationError = ErrorType<unknown>;

export const usePutEntityCarsId = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext>;
}) => {
	const mutationOptions = usePutEntityCarsIdMutationOptions(options);

	return useMutation(mutationOptions);
};

export const useDeleteEntityCarsIdHook = () => {
	const deleteEntityCarsId = useAxiosMutator<void>();

	return (id: number) => {
		return deleteEntityCarsId({ url: `/entity/cars/${id}`, method: 'delete' });
	};
};

export const useDeleteEntityCarsIdMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext> => {
	const { mutation: mutationOptions } = options ?? {};

	const deleteEntityCarsId = useDeleteEntityCarsIdHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, { id: number }> = (props) => {
		const { id } = props ?? {};

		return deleteEntityCarsId(id);
	};

	return { mutationFn, ...mutationOptions };
};

export type DeleteEntityCarsIdMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>>;

export type DeleteEntityCarsIdMutationError = ErrorType<unknown>;

export const useDeleteEntityCarsId = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext>;
}) => {
	const mutationOptions = useDeleteEntityCarsIdMutationOptions(options);

	return useMutation(mutationOptions);
};
