/**
 * Generated by orval v6.31.0 🍺
 * Do not edit manually.
 * Quarkus PrimeReact Monorepo
 * Quarkus monorepo demonstrating Panache REST server with PrimeReact UI client
 * OpenAPI spec version: 1.0.0
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import type { MutationFunction, QueryFunction, QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useAxiosMutator } from './AxiosMutator';
import type { ErrorType } from './AxiosMutator';
export type LoggingManagerUpdateBody = {
	loggerLevel?: LoggerLevel;
	loggerName?: unknown;
};

export type LoggingManagerGetAllParams = {
	loggerName?: string;
};

export type GetEntityCarsParams = {
	request?: string;
};

export type HealthCheckStatus = (typeof HealthCheckStatus)[keyof typeof HealthCheckStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const HealthCheckStatus = {
	DOWN: 'DOWN',
	UP: 'UP'
} as const;

/**
 * @nullable
 */
export type HealthCheckResponseData = { [key: string]: unknown } | null;

export interface HealthCheckResponse {
	/** @nullable */
	data?: HealthCheckResponseData;
	name?: string;
	status?: HealthCheckStatus;
}

export type LoggerLevel = (typeof LoggerLevel)[keyof typeof LoggerLevel];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const LoggerLevel = {
	OFF: 'OFF',
	SEVERE: 'SEVERE',
	ERROR: 'ERROR',
	FATAL: 'FATAL',
	WARNING: 'WARNING',
	WARN: 'WARN',
	INFO: 'INFO',
	DEBUG: 'DEBUG',
	TRACE: 'TRACE',
	CONFIG: 'CONFIG',
	FINE: 'FINE',
	FINER: 'FINER',
	FINEST: 'FINEST',
	ALL: 'ALL'
} as const;

export interface LoggerInfo {
	configuredLevel?: LoggerLevel;
	effectiveLevel?: LoggerLevel;
	name?: string;
}

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryResponseCar {
	/** Records for this set of pagination, sorting, filtering. */
	records?: Car[];
	/** Total records available by this query criteria */
	totalRecords?: number;
}

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.
 */
export interface QueryResponse {
	/** Records for this set of pagination, sorting, filtering. */
	records?: unknown[];
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

export interface MultiFilterMeta {
	/** List of filter constraints for this filter */
	constraints?: FilterConstraint[];
	/** Filter match mode e.g. equals, notEquals, contains, notContains, gt, gte, lt, lte */
	matchMode?: string;
	/** Filter operator either 'and' or 'or' */
	operator?: string;
	/** Value to filter this column by */
	value?: unknown;
}

export type Instant = Date;

export interface FilterConstraint {
	/** Filter match mode e.g. equals, notEquals, contains, notContains, gt, gte, lt, lte */
	matchMode?: string;
	/** Value to filter this column by */
	value?: unknown;
}

/**
 * Entity that represents a car.
 */
export interface Car {
	/**
	 * HTML color of the car
	 * @pattern \S
	 */
	color: string;
	id?: number;
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
	/** Modified time of the record */
	modifiedTime?: string;
	/**
	 * Price
	 * @minimum 0
	 */
	price: number;
	/**
	 * VIN number
	 * @pattern \S
	 */
	vin: string;
	/**
	 * Year of manufacture
	 * @minimum 1960
	 */
	year: number;
}

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

	return useCallback(
		(car: Car) => {
			return postEntityCars({ url: `/entity/cars`, method: 'POST', headers: { 'Content-Type': 'application/json' }, data: car });
		},
		[postEntityCars]
	);
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
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof usePostEntityCarsHook>>>, TError, { data: Car }, TContext> => {
	const mutationOptions = usePostEntityCarsMutationOptions(options);

	return useMutation(mutationOptions);
};

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

	return useCallback(
		(id: number, car: Car) => {
			return putEntityCarsId({ url: `/entity/cars/${id}`, method: 'PUT', headers: { 'Content-Type': 'application/json' }, data: car });
		},
		[putEntityCarsId]
	);
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
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof usePutEntityCarsIdHook>>>, TError, { id: number; data: Car }, TContext> => {
	const mutationOptions = usePutEntityCarsIdMutationOptions(options);

	return useMutation(mutationOptions);
};

export const useDeleteEntityCarsIdHook = () => {
	const deleteEntityCarsId = useAxiosMutator<void>();

	return useCallback(
		(id: number) => {
			return deleteEntityCarsId({ url: `/entity/cars/${id}`, method: 'DELETE' });
		},
		[deleteEntityCarsId]
	);
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
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof useDeleteEntityCarsIdHook>>>, TError, { id: number }, TContext> => {
	const mutationOptions = useDeleteEntityCarsIdMutationOptions(options);

	return useMutation(mutationOptions);
};

/**
 * Get information on all loggers or a specific logger.
 * @summary Information on Logger(s)
 */
export const useLoggingManagerGetAllHook = () => {
	const loggingManagerGetAll = useAxiosMutator<LoggerInfo[]>();

	return useCallback(
		(params?: LoggingManagerGetAllParams, signal?: AbortSignal) => {
			return loggingManagerGetAll({ url: `/q/logging-manager`, method: 'GET', params, signal });
		},
		[loggingManagerGetAll]
	);
};

export const getLoggingManagerGetAllQueryKey = (params?: LoggingManagerGetAllParams) => {
	return [`/q/logging-manager`, ...(params ? [params] : [])] as const;
};

export const useLoggingManagerGetAllQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useLoggingManagerGetAllHook>>>, TError = ErrorType<void>>(
	params?: LoggingManagerGetAllParams,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerGetAllHook>>>, TError, TData>> }
) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getLoggingManagerGetAllQueryKey(params);

	const loggingManagerGetAll = useLoggingManagerGetAllHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useLoggingManagerGetAllHook>>>> = ({ signal }) => loggingManagerGetAll(params, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerGetAllHook>>>, TError, TData> & {
		queryKey: QueryKey;
	};
};

export type LoggingManagerGetAllQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useLoggingManagerGetAllHook>>>>;
export type LoggingManagerGetAllQueryError = ErrorType<void>;

/**
 * @summary Information on Logger(s)
 */
export const useLoggingManagerGetAll = <TData = Awaited<ReturnType<ReturnType<typeof useLoggingManagerGetAllHook>>>, TError = ErrorType<void>>(
	params?: LoggingManagerGetAllParams,
	options?: { query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerGetAllHook>>>, TError, TData>> }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useLoggingManagerGetAllQueryOptions(params, options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

/**
 * Update a log level for a certain logger
 * @summary Update log level
 */
export const useLoggingManagerUpdateHook = () => {
	const loggingManagerUpdate = useAxiosMutator<void>();

	return useCallback(
		(loggingManagerUpdateBody: LoggingManagerUpdateBody) => {
			const formUrlEncoded = new URLSearchParams();
			if (loggingManagerUpdateBody.loggerName !== undefined) {
				formUrlEncoded.append('loggerName', loggingManagerUpdateBody.loggerName);
			}
			if (loggingManagerUpdateBody.loggerLevel !== undefined) {
				formUrlEncoded.append('loggerLevel', loggingManagerUpdateBody.loggerLevel);
			}

			return loggingManagerUpdate({
				url: `/q/logging-manager`,
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: formUrlEncoded
			});
		},
		[loggingManagerUpdate]
	);
};

export const useLoggingManagerUpdateMutationOptions = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerUpdateHook>>>, TError, { data: LoggingManagerUpdateBody }, TContext>;
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerUpdateHook>>>, TError, { data: LoggingManagerUpdateBody }, TContext> => {
	const { mutation: mutationOptions } = options ?? {};

	const loggingManagerUpdate = useLoggingManagerUpdateHook();

	const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useLoggingManagerUpdateHook>>>, { data: LoggingManagerUpdateBody }> = (props) => {
		const { data } = props ?? {};

		return loggingManagerUpdate(data);
	};

	return { mutationFn, ...mutationOptions };
};

export type LoggingManagerUpdateMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useLoggingManagerUpdateHook>>>>;
export type LoggingManagerUpdateMutationBody = LoggingManagerUpdateBody;
export type LoggingManagerUpdateMutationError = ErrorType<unknown>;

/**
 * @summary Update log level
 */
export const useLoggingManagerUpdate = <TError = ErrorType<unknown>, TContext = unknown>(options?: {
	mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerUpdateHook>>>, TError, { data: LoggingManagerUpdateBody }, TContext>;
}): UseMutationResult<Awaited<ReturnType<ReturnType<typeof useLoggingManagerUpdateHook>>>, TError, { data: LoggingManagerUpdateBody }, TContext> => {
	const mutationOptions = useLoggingManagerUpdateMutationOptions(options);

	return useMutation(mutationOptions);
};

/**
 * This returns all possible log levels
 * @summary Get all available levels
 */
export const useLoggingManagerLevelsHook = () => {
	const loggingManagerLevels = useAxiosMutator<LoggerLevel[]>();

	return useCallback(
		(signal?: AbortSignal) => {
			return loggingManagerLevels({ url: `/q/logging-manager/levels`, method: 'GET', signal });
		},
		[loggingManagerLevels]
	);
};

export const getLoggingManagerLevelsQueryKey = () => {
	return [`/q/logging-manager/levels`] as const;
};

export const useLoggingManagerLevelsQueryOptions = <
	TData = Awaited<ReturnType<ReturnType<typeof useLoggingManagerLevelsHook>>>,
	TError = ErrorType<unknown>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerLevelsHook>>>, TError, TData>>;
}) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getLoggingManagerLevelsQueryKey();

	const loggingManagerLevels = useLoggingManagerLevelsHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useLoggingManagerLevelsHook>>>> = ({ signal }) => loggingManagerLevels(signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerLevelsHook>>>, TError, TData> & {
		queryKey: QueryKey;
	};
};

export type LoggingManagerLevelsQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useLoggingManagerLevelsHook>>>>;
export type LoggingManagerLevelsQueryError = ErrorType<unknown>;

/**
 * @summary Get all available levels
 */
export const useLoggingManagerLevels = <TData = Awaited<ReturnType<ReturnType<typeof useLoggingManagerLevelsHook>>>, TError = ErrorType<unknown>>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useLoggingManagerLevelsHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useLoggingManagerLevelsQueryOptions(options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

/**
 * Check the health of the application
 * @summary An aggregated view of the Liveness, Readiness and Startup of this application
 */
export const useMicroprofileHealthRootHook = () => {
	const microprofileHealthRoot = useAxiosMutator<HealthCheckResponse>();

	return useCallback(
		(signal?: AbortSignal) => {
			return microprofileHealthRoot({ url: `/q/health`, method: 'GET', signal });
		},
		[microprofileHealthRoot]
	);
};

export const getMicroprofileHealthRootQueryKey = () => {
	return [`/q/health`] as const;
};

export const useMicroprofileHealthRootQueryOptions = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthRootHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthRootHook>>>, TError, TData>>;
}) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getMicroprofileHealthRootQueryKey();

	const microprofileHealthRoot = useMicroprofileHealthRootHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthRootHook>>>> = ({ signal }) => microprofileHealthRoot(signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthRootHook>>>, TError, TData> & {
		queryKey: QueryKey;
	};
};

export type MicroprofileHealthRootQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthRootHook>>>>;
export type MicroprofileHealthRootQueryError = ErrorType<HealthCheckResponse>;

/**
 * @summary An aggregated view of the Liveness, Readiness and Startup of this application
 */
export const useMicroprofileHealthRoot = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthRootHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthRootHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useMicroprofileHealthRootQueryOptions(options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

/**
 * Check the liveness of the application
 * @summary The Liveness check of this application
 */
export const useMicroprofileHealthLivenessHook = () => {
	const microprofileHealthLiveness = useAxiosMutator<HealthCheckResponse>();

	return useCallback(
		(signal?: AbortSignal) => {
			return microprofileHealthLiveness({ url: `/q/health/live`, method: 'GET', signal });
		},
		[microprofileHealthLiveness]
	);
};

export const getMicroprofileHealthLivenessQueryKey = () => {
	return [`/q/health/live`] as const;
};

export const useMicroprofileHealthLivenessQueryOptions = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthLivenessHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthLivenessHook>>>, TError, TData>>;
}) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getMicroprofileHealthLivenessQueryKey();

	const microprofileHealthLiveness = useMicroprofileHealthLivenessHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthLivenessHook>>>> = ({ signal }) =>
		microprofileHealthLiveness(signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthLivenessHook>>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type MicroprofileHealthLivenessQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthLivenessHook>>>>;
export type MicroprofileHealthLivenessQueryError = ErrorType<HealthCheckResponse>;

/**
 * @summary The Liveness check of this application
 */
export const useMicroprofileHealthLiveness = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthLivenessHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthLivenessHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useMicroprofileHealthLivenessQueryOptions(options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

/**
 * Check the readiness of the application
 * @summary The Readiness check of this application
 */
export const useMicroprofileHealthReadinessHook = () => {
	const microprofileHealthReadiness = useAxiosMutator<HealthCheckResponse>();

	return useCallback(
		(signal?: AbortSignal) => {
			return microprofileHealthReadiness({ url: `/q/health/ready`, method: 'GET', signal });
		},
		[microprofileHealthReadiness]
	);
};

export const getMicroprofileHealthReadinessQueryKey = () => {
	return [`/q/health/ready`] as const;
};

export const useMicroprofileHealthReadinessQueryOptions = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthReadinessHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthReadinessHook>>>, TError, TData>>;
}) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getMicroprofileHealthReadinessQueryKey();

	const microprofileHealthReadiness = useMicroprofileHealthReadinessHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthReadinessHook>>>> = ({ signal }) =>
		microprofileHealthReadiness(signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthReadinessHook>>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type MicroprofileHealthReadinessQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthReadinessHook>>>>;
export type MicroprofileHealthReadinessQueryError = ErrorType<HealthCheckResponse>;

/**
 * @summary The Readiness check of this application
 */
export const useMicroprofileHealthReadiness = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthReadinessHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthReadinessHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useMicroprofileHealthReadinessQueryOptions(options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};

/**
 * Check the startup of the application
 * @summary The Startup check of this application
 */
export const useMicroprofileHealthStartupHook = () => {
	const microprofileHealthStartup = useAxiosMutator<HealthCheckResponse>();

	return useCallback(
		(signal?: AbortSignal) => {
			return microprofileHealthStartup({ url: `/q/health/started`, method: 'GET', signal });
		},
		[microprofileHealthStartup]
	);
};

export const getMicroprofileHealthStartupQueryKey = () => {
	return [`/q/health/started`] as const;
};

export const useMicroprofileHealthStartupQueryOptions = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthStartupHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthStartupHook>>>, TError, TData>>;
}) => {
	const { query: queryOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getMicroprofileHealthStartupQueryKey();

	const microprofileHealthStartup = useMicroprofileHealthStartupHook();

	const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthStartupHook>>>> = ({ signal }) => microprofileHealthStartup(signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthStartupHook>>>,
		TError,
		TData
	> & { queryKey: QueryKey };
};

export type MicroprofileHealthStartupQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthStartupHook>>>>;
export type MicroprofileHealthStartupQueryError = ErrorType<HealthCheckResponse>;

/**
 * @summary The Startup check of this application
 */
export const useMicroprofileHealthStartup = <
	TData = Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthStartupHook>>>,
	TError = ErrorType<HealthCheckResponse>
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useMicroprofileHealthStartupHook>>>, TError, TData>>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
	const queryOptions = useMicroprofileHealthStartupQueryOptions(options);

	const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

	query.queryKey = queryOptions.queryKey;

	return query;
};
