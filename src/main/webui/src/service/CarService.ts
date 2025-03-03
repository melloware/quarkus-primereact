/**
 * Generated by orval v7.6.0 🍺
 * Do not edit manually.
 * Quarkus PrimeReact Monorepo
 * Quarkus monorepo demonstrating Panache REST server with PrimeReact UI client
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import type {
	DataTag,
	DefinedInitialDataOptions,
	DefinedUseQueryResult,
	MutationFunction,
	QueryFunction,
	QueryKey,
	UndefinedInitialDataOptions,
	UseMutationOptions,
	UseMutationResult,
	UseQueryOptions,
	UseQueryResult
} from '@tanstack/react-query';

import { useCallback } from 'react';

import { useAxiosMutator } from './AxiosMutator';
import type { ErrorType } from './AxiosMutator';
/**
 * Entity that represents a car.
 */
export interface Car {
	id?: number;
	/**
	 * VIN number
	 * @pattern \S
	 */
	vin: string;
	/**
	 * Manufacturer
	 * @pattern \S
	 */
	make: string;
	/**
	 * Model Number
	 * @pattern \S
	 */
	model: string;
	/**
	 * Year of manufacture
	 * @minimum 1960
	 */
	year: number;
	/**
	 * HTML color of the car
	 * @pattern \S
	 */
	color: string;
	/**
	 * Price
	 * @minimum 0
	 */
	price: number;
	/** Modified time of the record */
	modifiedTime?: Instant;
}

export interface FilterConstraint {
	/** Value to filter this column by */
	value?: unknown;
	/** Filter match mode e.g. equals, notEquals, contains, notContains, gt, gte, lt, lte */
	matchMode?: string;
}

export type Instant = Date;

export interface MultiFilterMeta {
	/** Value to filter this column by */
	value?: unknown;
	/** Filter match mode e.g. equals, notEquals, contains, notContains, gt, gte, lt, lte */
	matchMode?: string;
	/** Filter operator either 'and' or 'or' */
	operator?: string;
	/** List of filter constraints for this filter */
	constraints?: FilterConstraint[];
}

export interface MultiSortMeta {
	/** Sort field for this multiple sort */
	field?: string;
	/** Sort order for this field either -1 desc, 0 none, 1 asc */
	order?: number;
}

/**
 * Map of columns being filtered and their filter criteria
 */
export type QueryRequestFilters = { [key: string]: MultiFilterMeta };

/**
 * Represents a PrimeReact query request from the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryRequest {
	/** First record */
	first?: number;
	/** Number of rows */
	rows?: number;
	/** Page number */
	page?: number;
	/** Sort field if single field sorting */
	sortField?: string;
	/** Sort order if single field sorting either -1 desc, 0 none, 1 asc */
	sortOrder?: number;
	/** Multiple sorting list of columns to sort and in which order */
	multiSortMeta?: MultiSortMeta[];
	/** Map of columns being filtered and their filter criteria */
	filters?: QueryRequestFilters;
}

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryResponse {
	/** Total records available by this query criteria */
	totalRecords?: number;
	/** Records for this set of pagination, sorting, filtering. */
	records?: unknown[];
}

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryResponseCar {
	/** Total records available by this query criteria */
	totalRecords?: number;
	/** Records for this set of pagination, sorting, filtering. */
	records?: Car[];
}

/**
 * WebSocket message
 */
export interface SocketMessage {
	/** Type of socket message */
	type: SocketMessageType;
	/** Optional message payload */
	message?: string;
}

export type SocketMessageType = (typeof SocketMessageType)[keyof typeof SocketMessageType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SocketMessageType = {
	REFRESH_DATA: 'REFRESH_DATA',
	NOTIFICATION: 'NOTIFICATION'
} as const;

export type GetEntityCarsParams = {
	request?: string;
};

export type PostSocketNotifyParams = {
	message?: string;
};

/**
 * Returns a paginated list of cars with optional filtering and sorting
 * @summary List cars
 */
export const useGetEntityCarsHook = () => {
	const getEntityCars = useAxiosMutator<QueryResponseCar>();

	return useCallback(
		(params?: GetEntityCarsParams, signal?: AbortSignal) => {
			return getEntityCars({ url: `/entity/cars`, method: 'GET', params, signal });
		},
		[getEntityCars]
	);
};

export const getGetEntityCarsQueryKey = (params?: GetEntityCarsParams) => {
	return [`/entity/cars`, ...(params ? [params] : [])] as const;
};

export const useGetEntityCarsQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError = ErrorType<void>>(
	params?: GetEntityCarsParams,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData>> }
) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetEntityCarsQueryKey(params);

	const getEntityCars = useGetEntityCarsHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>> = ({ signal }) => getEntityCars(params, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};
};

export type GetEntityCarsQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>>;
export type GetEntityCarsQueryError = ErrorType<void>;

export function useGetEntityCars<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError = ErrorType<void>>(
	params: undefined | GetEntityCarsParams,
	options: {
		query: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData>> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>,
					TError,
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>
				>,
				'initialData'
			>;
	}
): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetEntityCars<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError = ErrorType<void>>(
	params?: GetEntityCarsParams,
	options?: {
		query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData>> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>,
					TError,
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>
				>,
				'initialData'
			>;
	}
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetEntityCars<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError = ErrorType<void>>(
	params?: GetEntityCarsParams,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData>> }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
/**
 * @summary List cars
 */

export function useGetEntityCars<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError = ErrorType<void>>(
	params?: GetEntityCarsParams,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsHook>>>, TError, TData>> }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
	const queryOptions = useGetEntityCarsQueryOptions(params, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * Creates a new car entry
 * @summary Create a new car
 */
export const usePostEntityCarsHook = () => {
	const postEntityCars = useAxiosMutator<Car>();

	return useCallback(
		(car: Car, signal?: AbortSignal) => {
			return postEntityCars({ url: `/entity/cars`, method: 'POST', headers: { 'Content-Type': 'application/json' }, data: car, signal });
		},
		[postEntityCars]
	);
};

export const usePostEntityCarsMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext> => {
	const mutationKey = ['postEntityCars'];
	const { mutation: mutationOptions } = options
		? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey } };

	const postEntityCars = usePostEntityCarsHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, { data: Car }> = (props) => {
		const { data } = props ?? {};

		return postEntityCars(data);
	};

	return { mutationFn, ...mutationOptions };
};

export type PostEntityCarsMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>>;
export type PostEntityCarsMutationBody = Car;
export type PostEntityCarsMutationError = ErrorType<void>;

/**
 * @summary Create a new car
 */
export const usePostEntityCars = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext>;
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext> => {
	const mutationOptions = usePostEntityCarsMutationOptions(options);

	return useMutation(mutationOptions);
};

/**
 * Returns a list of distinct car manufacturers
 * @summary Get all manufacturers
 */
export const useGetEntityCarsManufacturersHook = () => {
	const getEntityCarsManufacturers = useAxiosMutator<string[]>();

	return useCallback(
		(signal?: AbortSignal) => {
			return getEntityCarsManufacturers({ url: `/entity/cars/manufacturers`, method: 'GET', signal });
		},
		[getEntityCarsManufacturers]
	);
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
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetEntityCarsManufacturersQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>>;
export type GetEntityCarsManufacturersQueryError = ErrorType<unknown>;

export function useGetEntityCarsManufacturers<
	TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
	TError = ErrorType<unknown>
>(options: {
	query: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>, TError, TData>> &
		Pick<
			DefinedInitialDataOptions<
				Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
				TError,
				Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>
			>,
			'initialData'
		>;
}): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetEntityCarsManufacturers<
	TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
	TError = ErrorType<unknown>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>, TError, TData>> &
		Pick<
			UndefinedInitialDataOptions<
				Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
				TError,
				Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>
			>,
			'initialData'
		>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetEntityCarsManufacturers<
	TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
	TError = ErrorType<unknown>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
/**
 * @summary Get all manufacturers
 */

export function useGetEntityCarsManufacturers<
	TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>,
	TError = ErrorType<unknown>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsManufacturersHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
	const queryOptions = useGetEntityCarsManufacturersQueryOptions(options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * Updates an existing car based on ID
 * @summary Update a car
 */
export const usePutEntityCarsIdHook = () => {
	const putEntityCarsId = useAxiosMutator<Car>();

	return useCallback(
		(id: number, car: Car) => {
			return putEntityCarsId({ url: `/entity/cars/${id}`, method: 'PUT', headers: { 'Content-Type': 'application/json' }, data: car });
		},
		[putEntityCarsId]
	);
};

export const usePutEntityCarsIdMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext> => {
	const mutationKey = ['putEntityCarsId'];
	const { mutation: mutationOptions } = options
		? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey } };

	const putEntityCarsId = usePutEntityCarsIdHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, { id: number; data: Car }> = (props) => {
		const { id, data } = props ?? {};

		return putEntityCarsId(id, data);
	};

	return { mutationFn, ...mutationOptions };
};

export type PutEntityCarsIdMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>>;
export type PutEntityCarsIdMutationBody = Car;
export type PutEntityCarsIdMutationError = ErrorType<void>;

/**
 * @summary Update a car
 */
export const usePutEntityCarsId = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext>;
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext> => {
	const mutationOptions = usePutEntityCarsIdMutationOptions(options);

	return useMutation(mutationOptions);
};

/**
 * Returns a car based on the provided ID
 * @summary Get a car by ID
 */
export const useGetEntityCarsIdHook = () => {
	const getEntityCarsId = useAxiosMutator<Car>();

	return useCallback(
		(id: number, signal?: AbortSignal) => {
			return getEntityCarsId({ url: `/entity/cars/${id}`, method: 'GET', signal });
		},
		[getEntityCarsId]
	);
};

export const getGetEntityCarsIdQueryKey = (id: number) => {
	return [`/entity/cars/${id}`] as const;
};

export const useGetEntityCarsIdQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError = ErrorType<void>>(
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
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetEntityCarsIdQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>>;
export type GetEntityCarsIdQueryError = ErrorType<void>;

export function useGetEntityCarsId<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError = ErrorType<void>>(
	id: number,
	options: {
		query: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError, TData>> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>,
					TError,
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>
				>,
				'initialData'
			>;
	}
): DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetEntityCarsId<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError = ErrorType<void>>(
	id: number,
	options?: {
		query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError, TData>> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>,
					TError,
					Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>
				>,
				'initialData'
			>;
	}
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
export function useGetEntityCarsId<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError = ErrorType<void>>(
	id: number,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError, TData>> }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };
/**
 * @summary Get a car by ID
 */

export function useGetEntityCarsId<TData = Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError = ErrorType<void>>(
	id: number,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEntityCarsIdHook>>>, TError, TData>> }
): UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {
	const queryOptions = useGetEntityCarsIdQueryOptions(id, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * Deletes a car based on ID
 * @summary Delete a car
 */
export const useDeleteEntityCarsIdHook = () => {
	const deleteEntityCarsId = useAxiosMutator<void>();

	return useCallback(
		(id: number) => {
			return deleteEntityCarsId({ url: `/entity/cars/${id}`, method: 'DELETE' });
		},
		[deleteEntityCarsId]
	);
};

export const useDeleteEntityCarsIdMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext> => {
	const mutationKey = ['deleteEntityCarsId'];
	const { mutation: mutationOptions } = options
		? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey } };

	const deleteEntityCarsId = useDeleteEntityCarsIdHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, { id: number }> = (props) => {
		const { id } = props ?? {};

		return deleteEntityCarsId(id);
	};

	return { mutationFn, ...mutationOptions };
};

export type DeleteEntityCarsIdMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>>;

export type DeleteEntityCarsIdMutationError = ErrorType<void>;

/**
 * @summary Delete a car
 */
export const useDeleteEntityCarsId = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext>;
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext> => {
	const mutationOptions = useDeleteEntityCarsIdMutationOptions(options);

	return useMutation(mutationOptions);
};

/**
 * Pushes a notification message to all connected clients
 * @summary Push notification message
 */
export const usePostSocketNotifyHook = () => {
	const postSocketNotify = useAxiosMutator<void>();

	return useCallback(
		(params?: PostSocketNotifyParams, signal?: AbortSignal) => {
			return postSocketNotify({ url: `/socket/notify`, method: 'POST', params, signal });
		},
		[postSocketNotify]
	);
};

export const usePostSocketNotifyMutationOptions = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostSocketNotifyHook>>>, TError, { params?: PostSocketNotifyParams }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostSocketNotifyHook>>>, TError, { params?: PostSocketNotifyParams }, TContext> => {
	const mutationKey = ['postSocketNotify'];
	const { mutation: mutationOptions } = options
		? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey } };

	const postSocketNotify = usePostSocketNotifyHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostSocketNotifyHook>>>, { params?: PostSocketNotifyParams }> = (props) => {
		const { params } = props ?? {};

		return postSocketNotify(params);
	};

	return { mutationFn, ...mutationOptions };
};

export type PostSocketNotifyMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostSocketNotifyHook>>>>;

export type PostSocketNotifyMutationError = ErrorType<void>;

/**
 * @summary Push notification message
 */
export const usePostSocketNotify = <TError = ErrorType<void>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostSocketNotifyHook>>>, TError, { params?: PostSocketNotifyParams }, TContext>;
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof usePostSocketNotifyHook>>>, TError, { params?: PostSocketNotifyParams }, TContext> => {
	const mutationOptions = usePostSocketNotifyMutationOptions(options);

	return useMutation(mutationOptions);
};

/**
 * Pushes a UI refresh signal to all connected clients
 * @summary Push a UI refresh signal
 */
export const usePostSocketRefreshHook = () => {
	const postSocketRefresh = useAxiosMutator<void>();

	return useCallback(
		(signal?: AbortSignal) => {
			return postSocketRefresh({ url: `/socket/refresh`, method: 'POST', signal });
		},
		[postSocketRefresh]
	);
};

export const usePostSocketRefreshMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostSocketRefreshHook>>>, TError, void, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostSocketRefreshHook>>>, TError, void, TContext> => {
	const mutationKey = ['postSocketRefresh'];
	const { mutation: mutationOptions } = options
		? options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey } };

	const postSocketRefresh = usePostSocketRefreshHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof usePostSocketRefreshHook>>>, void> = () => {
		return postSocketRefresh();
	};

	return { mutationFn, ...mutationOptions };
};

export type PostSocketRefreshMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof usePostSocketRefreshHook>>>>;

export type PostSocketRefreshMutationError = ErrorType<unknown>;

/**
 * @summary Push a UI refresh signal
 */
export const usePostSocketRefresh = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof usePostSocketRefreshHook>>>, TError, void, TContext>;
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof usePostSocketRefreshHook>>>, TError, void, TContext> => {
	const mutationOptions = usePostSocketRefreshMutationOptions(options);

	return useMutation(mutationOptions);
};
