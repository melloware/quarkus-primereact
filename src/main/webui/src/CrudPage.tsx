import { AnyFieldApi, useForm } from '@tanstack/react-form';
import { useQueryClient } from '@tanstack/react-query';
import { FilterMatchMode, FilterOperator, SortOrder } from 'primereact/api';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ColorPicker } from 'primereact/colorpicker';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { z } from 'zod';
import { ErrorType } from './service/AxiosMutator';
import {
	Car,
	HttpProblem,
	SocketMessage,
	SocketMessageType,
	useDeleteEntityCarsId,
	useGetEntityCars,
	useGetEntityCarsManufacturers,
	usePostEntityCars,
	usePutEntityCarsId
} from './service/CarService';
import { postEntityCarsBody } from './service/CarService.zod';

type CarInput = z.infer<typeof postEntityCarsBody>;

/**
 * CRUD page demonstrating multiple TanStack Query and PrimeReact concepts such as lazy querying datable,
 * CRUD operations, React Hook Forms for validation etc.
 *
 * @returns the CrudPage
 */
const CrudPage = () => {
	// form
	let defaultValues = {
		id: undefined,
		vin: '',
		make: '',
		model: '',
		color: '',
		year: 2022,
		price: 0,
		modifiedTime: undefined
	} as CarInput;
	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			onChange: postEntityCarsBody
		},
		onSubmit: async ({ value }) => {
			onSubmit(value);
		}
	});

	// refs
	const toastRef = useRef<Toast>(null);
	const datatable = useRef<DataTable<Car[]>>(null);

	// state
	const [car, setCar] = useState<Car>(defaultValues);
	const [deleteCarDialog, setDeleteCarDialog] = useState(false);
	const [editCarDialog, setEditCarDialog] = useState(false);
	const [isMenuFilter, setMenuFilter] = useState(true);
	const [isMultipleSort, setMultipleSort] = useState(true);

	// socket
	const { lastJsonMessage } = useWebSocket(`${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/push/`);

	const menuFilters = {
		vin: { operator: FilterOperator.OR, constraints: [{ value: '', matchMode: FilterMatchMode.CONTAINS }] },
		make: { operator: FilterOperator.OR, constraints: [{ value: '', matchMode: FilterMatchMode.CONTAINS }] },
		model: { operator: FilterOperator.AND, constraints: [{ value: '', matchMode: FilterMatchMode.CONTAINS }] },
		color: { operator: FilterOperator.OR, constraints: [{ value: '', matchMode: FilterMatchMode.CONTAINS }] },
		year: { operator: FilterOperator.OR, constraints: [{ value: '', matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }] },
		modifiedTime: { operator: FilterOperator.OR, constraints: [{ value: '', matchMode: FilterMatchMode.DATE_AFTER }] }
	};

	const rowFilters = {
		vin: { value: '', matchMode: FilterMatchMode.CONTAINS },
		make: { value: '', matchMode: FilterMatchMode.CONTAINS },
		model: { value: '', matchMode: FilterMatchMode.CONTAINS },
		color: { value: '', matchMode: FilterMatchMode.CONTAINS },
		year: { value: '', matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
		modifiedTime: { value: '', matchMode: FilterMatchMode.DATE_AFTER }
	};

	const initialParams: DataTableStateEvent = {
		first: 0,
		rows: 5,
		page: 1,
		sortField: '', // single sort only
		sortOrder: SortOrder.UNSORTED, // single sort only
		multiSortMeta: [
			{ field: 'make', order: SortOrder.ASC },
			{ field: 'model', order: SortOrder.ASC }
		],
		filters: {}
	};

	const [tableParams, setTableParams] = useState<DataTableStateEvent>(initialParams);

	// queries
	const queryClient = useQueryClient();
	const deleteCarMutation = useDeleteEntityCarsId();
	const createCarMutation = usePostEntityCars();
	const updateCarMutation = usePutEntityCarsId();
	const queryCars = useGetEntityCars(
		{ request: JSON.stringify(tableParams) },
		{
			query: {
				queryKey: ['list-cars', tableParams],
				refetchOnWindowFocus: false,
				retry: false,
				gcTime: 0,
				staleTime: 0
			}
		}
	);
	const queryManufacturers = useGetEntityCarsManufacturers({
		query: {
			queryKey: ['unique-manufacturers'],
			refetchOnWindowFocus: false,
			retry: false,
			gcTime: Infinity,
			staleTime: Infinity
		}
	});

	// hooks
	useEffect(() => {
		const newParams = { ...initialParams };
		newParams.filters = isMenuFilter ? { ...menuFilters } : { ...rowFilters };
		if (!isMultipleSort) {
			newParams.sortField = 'make';
			newParams.sortOrder = SortOrder.ASC;
			newParams.multiSortMeta = [];
		}
		setTableParams(newParams);
	}, [isMenuFilter, isMultipleSort]);

	useEffect(() => {
		if (lastJsonMessage !== null) {
			console.log(lastJsonMessage);
			const socketMessage = lastJsonMessage as SocketMessage;
			switch (socketMessage.type) {
				case SocketMessageType.REFRESH_DATA:
					queryClient.invalidateQueries({ queryKey: ['list-cars'] });
					break;
				case SocketMessageType.NOTIFICATION:
					toast('warn', 'Notification', socketMessage.message);
					break;
			}
		}
	}, [lastJsonMessage]);

	const onPage = (event: DataTableStateEvent) => {
		setTableParams(event);
	};

	const onSort = (event: DataTableStateEvent) => {
		setTableParams(event);
	};

	const onFilter = (event: DataTableStateEvent) => {
		event['first'] = 0;
		setTableParams(event);
	};

	const exportCSV = () => {
		datatable.current?.exportCSV();
	};

	const toast = (severity?: 'success' | 'info' | 'warn' | 'error' | undefined, summary?: React.ReactNode, detail?: React.ReactNode) => {
		toastRef.current?.show({ severity: severity, summary: summary, detail: detail, life: 4000 });
	};

	const confirmDeleteCar = (item: Car) => {
		setCar(item);
		setDeleteCarDialog(true);
	};

	const hideDeleteCarDialog = () => {
		setDeleteCarDialog(false);
		onReset(defaultValues);
	};

	const hideEditDialog = () => {
		setEditCarDialog(false);
		onReset(defaultValues);
	};

	const onSubmit = (car: Car) => {
		if (car.id) {
			updateCarMutation.mutate(
				{ id: car.id!, data: car },
				{
					onSuccess: () => {
						hideEditDialog();
						toast('success', 'Successful', `${car.year} ${car.make} ${car.model} Updated`);
						queryClient.invalidateQueries({ queryKey: ['list-cars'] });
					},
					onError: (error: ErrorType<HttpProblem | void>) => {
						toast('error', 'Error', error.response?.data?.detail || error.response?.data?.title || 'An unknown error occurred');
					}
				}
			);
		} else {
			createCarMutation.mutate(
				{ data: car },
				{
					onSuccess: () => {
						hideEditDialog();
						toast('success', 'Successful', `${car.year} ${car.make} ${car.model} Created`);
						queryClient.invalidateQueries({ queryKey: ['list-cars'] });
					},
					onError: (error: ErrorType<HttpProblem | void>) => {
						toast('error', 'Error', error.response?.data?.detail || error.response?.data?.title || 'An unknown error occurred');
					}
				}
			);
		}
	};

	const onReset = (data: CarInput) => {
		setCar(data);
		form.reset(data, {
			keepDefaultValues: true
		});
	};

	const editCar = (car: Car) => {
		setEditCarDialog(true);
		onReset({ ...car });
	};

	const createCar = () => {
		setEditCarDialog(true);
		onReset(defaultValues);
	};

	const deleteCar = () => {
		deleteCarMutation.mutate(
			{ id: car.id! },
			{
				onSuccess: () => {
					hideDeleteCarDialog();
					toast('success', 'Successful', `${car.year} ${car.make} ${car.model} Deleted`);
					queryClient.invalidateQueries({ queryKey: ['list-cars'] });
				},
				onError: (error: ErrorType<HttpProblem | void>) => {
					toast('error', 'Error', error.response?.data?.detail || error.response?.data?.title || 'An unknown error occurred');
				}
			}
		);
	};

	const colorBodyTemplate = (item: Car) => {
		return (
			<div className="color-swatch" style={{ backgroundColor: `#${item.color}`, width: 'auto' }}>
				<span>{item.color}</span>
			</div>
		);
	};

	const priceBodyTemplate = (item: Car) => {
		return item.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	};

	const timeBodyTemplate = (item: Car) => {
		return new Date(item.modifiedTime!).toISOString().replace(/T/, ' ').replace(/\..+/, '');
	};

	const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
		return (
			<Calendar
				value={options.value}
				onChange={(e) => options.filterApplyCallback(e.value, options.index)}
				dateFormat="dd-M-yy"
				placeholder="dd-MMM-yy"
				monthNavigator
				yearNavigator
				yearRange="1960:2050"
			/>
		);
	};

	const actionBodyTemplate = (item: Car) => {
		const className = classNames('p-button-rounded action  mr-2');
		const editClassName = classNames(className, 'p-button-success');
		const deleteClassName = classNames(className, 'p-button-danger');
		return (
			<div>
				<Button
					icon="pi pi-pencil"
					className={editClassName}
					onClick={() => editCar(item)}
					data-pr-tooltip="Edit car"
					aria-label={`Edit ${item.make} ${item.model}`}
				/>
				<Button
					icon="pi pi-trash"
					className={deleteClassName}
					onClick={() => confirmDeleteCar(item)}
					data-pr-tooltip="Delete car"
					aria-label={`Delete ${item.make} ${item.model}`}
				/>
			</div>
		);
	};

	const deleteCarDialogFooter = (
		<div>
			<Button label="No" icon="pi pi-times" className="p-button-text p-button-info" onClick={hideDeleteCarDialog} autoFocus />
			<Button label="Yes" icon="pi pi-check" className="p-button-text p-button-danger" onClick={deleteCar} />
		</div>
	);

	const leftToolbarTemplate = (
		<div>
			<Button label="New" icon="pi pi-plus" className="p-button-success mr-2 action" onClick={createCar} data-pr-tooltip="Create new car" />
		</div>
	);
	const rightToolbarTemplate = (
		<div className="flex justify-content-between align-items-center">
			<label htmlFor="chkSortDisplay" className="font-semibold mr-2">
				Sort Multiple
			</label>
			<InputSwitch
				inputId="chkSortDisplay"
				className="mr-2"
				checked={isMultipleSort}
				aria-label="Switch sorting between multiple and single"
				tooltip={'Switch sorting between multiple and single'}
				tooltipOptions={{ position: 'top' }}
				onChange={(e) => {
					setTableParams({ ...initialParams });
					setMultipleSort(e.value!);
				}}
			/>
			<label htmlFor="chkFilterDisplay" className="font-semibold mr-2">
				Filter Display
			</label>
			<InputSwitch
				inputId="chkFilterDisplay"
				className="mr-2"
				checked={isMenuFilter}
				aria-label="Switch filter display between menu and row"
				tooltip={'Switch filter display between menu and row'}
				tooltipOptions={{ position: 'top' }}
				onChange={(e) => {
					setTableParams({ ...initialParams });
					setMenuFilter(e.value!);
				}}
			/>
			<Button label="Export" icon="pi pi-download" className="action" onClick={exportCSV} data-pr-tooltip="Export to CSV" />
		</div>
	);

	return (
		<div>
			<div className="card">
				<Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

				<DataTable
					ref={datatable}
					value={queryCars.data?.records}
					lazy
					dataKey="id"
					paginator
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="{first} to {last} of {totalRecords} cars"
					filterDisplay={isMenuFilter ? 'menu' : 'row'}
					filterDelay={500}
					rowsPerPageOptions={[5, 10, 25]}
					totalRecords={queryCars.data?.totalRecords}
					onPage={onPage}
					onSort={onSort}
					onFilter={onFilter}
					sortMode={isMultipleSort ? 'multiple' : 'single'}
					sortField={tableParams.sortField}
					sortOrder={tableParams.sortOrder}
					multiSortMeta={tableParams.multiSortMeta}
					filters={tableParams.filters}
					first={tableParams.first}
					rows={tableParams.rows}
					loading={queryCars.isFetching}
					exportFilename="cars"
				>
					<Column field="vin" header="VIN" sortable filter filterPlaceholder="VIN" />
					<Column field="year" header="Year" sortable filter dataType="numeric" />
					<Column field="make" header="Make" sortable filter filterPlaceholder="Make" />
					<Column field="model" header="Model" sortable filter filterPlaceholder="Model" />
					<Column field="color" header="Color" sortable filter body={colorBodyTemplate} align="center" style={{ width: '10rem' }} />
					<Column field="price" header="Price" sortable body={priceBodyTemplate} align="right" dataType="numeric" />
					<Column
						field="modifiedTime"
						header="Modified"
						sortable
						filter
						filterElement={dateFilterTemplate}
						body={timeBodyTemplate}
						dataType="date"
						style={{ width: '16rem' }}
					/>
					<Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }} align="right"></Column>
				</DataTable>
			</div>

			<Dialog visible={editCarDialog} style={{ width: '450px' }} header="Car Details" modal onHide={hideEditDialog}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="p-fluid"
				>
					<div className="field">
						<form.Field name="vin">
							{(field) => (
								<>
									<label htmlFor={field.name} className={classNames({ 'p-error': field.state.meta.errors.length > 0 })}>
										VIN*
									</label>
									<InputText
										id={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										className={classNames({ 'p-invalid': field.state.meta.errors.length > 0 })}
										autoComplete="off"
									/>
									<FieldInfo field={field} />
								</>
							)}
						</form.Field>
					</div>
					<div className="formgrid grid">
						<div className="field col">
							<form.Field name="make">
								{(field) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': field.state.meta.errors.length > 0 })}>
											Make*
										</label>
										<Dropdown
											id={field.name}
											options={queryManufacturers.data}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.value)}
											onBlur={field.handleBlur}
											className={classNames({ 'p-invalid': field.state.meta.errors.length > 0 })}
										/>
										<FieldInfo field={field} />
									</>
								)}
							</form.Field>
						</div>
						<div className="field col">
							<form.Field name="model">
								{(field) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': field.state.meta.errors.length > 0 })}>
											Model*
										</label>
										<InputText
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											className={classNames({ 'p-invalid': field.state.meta.errors.length > 0 })}
										/>
										<FieldInfo field={field} />
									</>
								)}
							</form.Field>
						</div>
					</div>
					<div className="formgrid grid">
						<div className="field col">
							<form.Field name="year">
								{(field) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': field.state.meta.errors.length > 0 })}>
											Year*
										</label>
										<Calendar
											dateFormat="yy"
											inputClassName={classNames({ 'p-invalid': field.state.meta.errors.length > 0 })}
											inputId={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.value?.getFullYear() ?? 0)}
											value={new Date(field.state.value, 1, 1)}
											view="year"
										/>
										<FieldInfo field={field} />
									</>
								)}
							</form.Field>
						</div>
						<div className="field col">
							<form.Field name="color">
								{(field) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': field.state.meta.errors.length > 0 })}>
											Color*
										</label>
										<ColorPicker
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.value as string)}
											onBlur={field.handleBlur}
											className={classNames({ 'p-invalid': field.state.meta.errors.length > 0 })}
											defaultColor="ffffff"
										/>
										<FieldInfo field={field} />
									</>
								)}
							</form.Field>
						</div>
					</div>

					<div className="field">
						<form.Field name="price">
							{(field) => (
								<>
									<label htmlFor={field.name} className={classNames({ 'p-error': field.state.meta.errors.length > 0 })}>
										Price*
									</label>
									<InputNumber
										id={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onValueChange={(e) => field.handleChange(e.value as number)}
										mode="currency"
										currency="USD"
										locale="en-US"
										inputClassName={classNames({ 'p-invalid': field.state.meta.errors.length > 0 })}
									/>
									<FieldInfo field={field} />
								</>
							)}
						</form.Field>
					</div>

					<div className="p-dialog-footer pb-0">
						<Button label="Cancel" type="reset" icon="pi pi-times" className="p-button-text p-button-info" onClick={hideEditDialog} />
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button
									label={isSubmitting ? '...' : 'Save'}
									disabled={!canSubmit}
									type="submit"
									icon="pi pi-check"
									className="p-button-text p-button-success"
									autoFocus
								/>
							)}
						/>
					</div>
				</form>
			</Dialog>

			<Dialog
				visible={deleteCarDialog}
				style={{ width: '550px' }}
				header="Confirm Delete"
				modal
				footer={deleteCarDialogFooter}
				onHide={hideDeleteCarDialog}
			>
				<div className="confirmation-content">
					<i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
					{car && (
						<span>
							Are you sure you want to delete{' '}
							<strong>
								{car.year} {car.make} {car.model}{' '}
							</strong>
							?
						</span>
					)}
				</div>
			</Dialog>

			<Toast ref={toastRef} />
			<Tooltip target={'.action'} position="top" />
		</div>
	);
};

function FieldInfo({ field }: { field: AnyFieldApi }) {
	if (!field || !field.state || !field.state.meta || !field.state.meta.errors.length) return null;
	const error = field.state.meta.errors[0];
	// Map error types to user-friendly messages
	let message = '';
	switch (error.code) {
		case 'invalid_string':
			message = `${error.path[0].charAt(0).toUpperCase() + error.path[0].slice(1)} is required`;
			break;
		default:
			message = error.message;
			break;
	}
	return (
		<>
			{field.state.meta.isTouched && field.state.meta.errors.length ? <small className="p-error">{message}</small> : null}
			{field.state.meta.isValidating ? 'Validating...' : null}
		</>
	);
}

export default React.memo(CrudPage);
