import { useQueryClient } from '@tanstack/react-query';
import { FilterMatchMode, SortOrder } from 'primereact/api';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { Column } from 'primereact/column';
import { DataTable, DataTablePFSEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast, ToastSeverityType } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, ControllerFieldState, useForm } from 'react-hook-form';
import { ErrorType } from './service/AxiosMutator';
import { Car, useDeleteEntityCarsId, useGetEntityCars, useGetEntityCarsManufacturers, usePostEntityCars, usePutEntityCarsId } from './service/CarService';

/**
 * CRUD page demonstrating multiple TanStack Query and PrimeReact concepts such as lazy querying datable,
 * CRUD operations, React Hook Forms for validation etc.
 *
 * @returns the CrudPage
 */
const CrudPage = () => {
	// form
	const defaultValues = {
		vin: '',
		make: '',
		model: '',
		color: '',
		year: 2022,
		price: 0
	} as Car;
	const form = useForm({ defaultValues: defaultValues });
	const errors = form.formState.errors;

	// refs
	const toastRef = useRef<Toast>(null);
	const datatable = useRef<DataTable>(null);

	// state
	const [cars, setCars] = useState<Car[]>([]);
	const [car, setCar] = useState<Car>(defaultValues);
	const [manufacturers, setManufacturers] = useState<string[]>([]);
	const [deleteCarDialog, setDeleteCarDialog] = useState(false);
	const [editCarDialog, setEditCarDialog] = useState(false);
	const [totalRecords, setTotalRecords] = useState(0);
	const [tableParams, setTableParams] = useState<DataTablePFSEvent>({
		first: 0,
		rows: 5,
		page: 1,
		sortField: '', // single sort only
		sortOrder: SortOrder.UNSORTED, // single sort only
		multiSortMeta: [
			{ field: 'make', order: SortOrder.ASC },
			{ field: 'model', order: SortOrder.ASC }
		],
		filters: {
			vin: { value: '', matchMode: FilterMatchMode.CONTAINS },
			make: { value: '', matchMode: FilterMatchMode.CONTAINS },
			model: { value: '', matchMode: FilterMatchMode.CONTAINS },
			color: { value: '', matchMode: FilterMatchMode.CONTAINS },
			year: { value: '', matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }
		}
	});

	// queries
	const queryClient = useQueryClient();
	const deleteCarMutation = useDeleteEntityCarsId();
	const createCarMutation = usePostEntityCars();
	const updateCarMutation = usePutEntityCarsId();
	const queryList = useGetEntityCars(
		{ request: JSON.stringify(tableParams) },
		{
			query: {
				queryKey: ['list-cars', tableParams],
				refetchOnWindowFocus: false,
				retry: false,
				cacheTime: 0
			}
		}
	);
	const queryManufacturers = useGetEntityCarsManufacturers({
		query: {
			queryKey: ['unique-manufacturers'],
			refetchOnWindowFocus: false,
			retry: false,
			cacheTime: Infinity,
			staleTime: Infinity
		}
	});

	// hooks
	useEffect(() => {
		if (queryList.isError) {
			setCars([]);
			setTotalRecords(0);
		}
		if (queryList.isSuccess) {
			const results = queryList.data;
			setTotalRecords(results.totalRecords!);
			setCars(results.records!);
		}
	}, [queryList.data]);

	useEffect(() => {
		if (queryManufacturers.isError) {
			setManufacturers([]);
		}
		if (queryManufacturers.isSuccess) {
			setManufacturers(queryManufacturers.data);
		}
	}, [queryManufacturers.data]);

	const onPage = (event: DataTablePFSEvent) => {
		setTableParams(event);
	};

	const onSort = (event: DataTablePFSEvent) => {
		setTableParams(event);
	};

	const onFilter = (event: DataTablePFSEvent) => {
		event['first'] = 0;
		setTableParams(event);
	};

	const exportCSV = () => {
		datatable.current?.exportCSV();
	};

	const toast = (severity?: ToastSeverityType, summary?: React.ReactNode, detail?: React.ReactNode) => {
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

	const getFormErrorMessage = (fieldState: ControllerFieldState, fieldName?: string, max?: number, min?: number): JSX.Element | null => {
		if (!fieldState || !fieldState.error) {
			return null;
		}
		const name = fieldName ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1) : '';
		const error = fieldState.error;
		let message;
		switch (error.type) {
			case 'required':
				message = `${name} is required`;
				break;
			case 'min':
				message = `${name} less than minimum allowed value of ${min}`;
				break;
			case 'max':
				message = `${name} more than maximum allowed value of ${max}`;
				break;
			case 'maxLength':
				message = `${name} more than maximum ${max} allowed characters`;
				break;
			default:
				break;
		}
		return <small className="p-error">{message}</small>;
	};

	const onSubmit = (car: Car) => {
		if (car.id) {
			updateCarMutation.mutate(
				{ id: car.id!, data: car },
				{
					onSuccess: () => {
						hideEditDialog();
						toast('success', 'Successful', `${car.year} ${car.make} ${car.model} Updated`);
						queryClient.invalidateQueries(['list-cars']);
					},
					onError: (error: ErrorType<unknown>) => {
						toast('error', 'Error', JSON.stringify(error.response?.data));
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
						queryClient.invalidateQueries(['list-cars']);
					},
					onError: (error: ErrorType<unknown>) => {
						toast('error', 'Error', JSON.stringify(error.response?.data));
					}
				}
			);
		}
	};

	const onReset = (data: Car) => {
		setCar(data);
		form.reset(data, {
			keepErrors: false,
			keepDirty: false,
			keepIsSubmitted: false,
			keepTouched: false,
			keepIsValid: false,
			keepSubmitCount: false
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
					queryClient.invalidateQueries(['list-cars']);
				},
				onError: (error: ErrorType<unknown>) => {
					toast('error', 'Error', JSON.stringify(error.response?.data));
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

	const actionBodyTemplate = (item: Car) => {
		const className = classNames('p-button-rounded action  mr-2');
		const editClassName = classNames(className, 'p-button-success');
		const deleteClassName = classNames(className, 'p-button-danger');
		return (
			<div>
				<Button icon="pi pi-pencil" className={editClassName} onClick={() => editCar(item)} data-pr-tooltip="Edit car" />
				<Button icon="pi pi-trash" className={deleteClassName} onClick={() => confirmDeleteCar(item)} data-pr-tooltip="Delete car" />
			</div>
		);
	};

	const deleteCarDialogFooter = (
		<div>
			<Button label="No" icon="pi pi-times" className="p-button-text p-button-info" onClick={hideDeleteCarDialog} />
			<Button label="Yes" icon="pi pi-check" className="p-button-text p-button-danger" onClick={deleteCar} />
		</div>
	);

	const leftToolbarTemplate = (
		<Button label="New" icon="pi pi-plus" className="p-button-success mr-2 action" onClick={createCar} data-pr-tooltip="Create new car" />
	);
	const rightToolbarTemplate = <Button label="Export" icon="pi pi-download" className="action" onClick={exportCSV} data-pr-tooltip="Export to CSV" />;

	return (
		<div>
			<div className="card">
				<Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

				<DataTable
					ref={datatable}
					value={cars}
					lazy
					dataKey="id"
					paginator
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					currentPageReportTemplate="{first} to {last} of {totalRecords} cars"
					responsiveLayout="stack"
					breakpoint="768px"
					filterDisplay="row"
					filterDelay={500}
					rowsPerPageOptions={[5, 10, 25]}
					totalRecords={totalRecords}
					onPage={onPage}
					onSort={onSort}
					onFilter={onFilter}
					sortMode="multiple"
					multiSortMeta={tableParams.multiSortMeta}
					filters={tableParams.filters}
					first={tableParams.first}
					rows={tableParams.rows}
					loading={queryList.isFetching}
					exportFilename="cars"
				>
					<Column field="vin" header="VIN" sortable filter filterPlaceholder="VIN" />
					<Column field="year" header="Year" sortable dataType="numeric" filter />
					<Column field="make" header="Make" sortable filter filterPlaceholder="Make" />
					<Column field="model" header="Model" sortable filter filterPlaceholder="Model" />
					<Column field="color" header="Color" sortable filter body={colorBodyTemplate} align="center" style={{ width: '10rem' }} />
					<Column field="price" header="Price" sortable body={priceBodyTemplate} align="right" dataType="numeric" />
					<Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }} align="right"></Column>
				</DataTable>
			</div>

			<Dialog visible={editCarDialog} style={{ width: '450px' }} header="Car Details" modal onHide={hideEditDialog}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="p-fluid">
					<div className="field">
						<Controller
							name="vin"
							control={form.control}
							rules={{ required: 'VIN is required.', maxLength: 17 }}
							render={({ field, fieldState }) => (
								<>
									<label htmlFor={field.name} className={classNames({ 'p-error': errors.vin })}>
										VIN*
									</label>
									<InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
									{getFormErrorMessage(fieldState, field.name, 17)}
								</>
							)}
						/>
					</div>
					<div className="formgrid grid">
						<div className="field col">
							<Controller
								name="make"
								control={form.control}
								rules={{ required: 'Make is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': errors.make })}>
											Make*
										</label>
										<Dropdown
											id={field.name}
											options={manufacturers}
											className={classNames({ 'p-invalid': fieldState.error })}
											{...field}
										/>
										{getFormErrorMessage(fieldState, field.name)}
									</>
								)}
							/>
						</div>
						<div className="field col">
							<Controller
								name="model"
								control={form.control}
								rules={{ required: 'Model is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': errors.model })}>
											Model*
										</label>
										<InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
										{getFormErrorMessage(fieldState, field.name)}
									</>
								)}
							/>
						</div>
					</div>
					<div className="formgrid grid">
						<div className="field col">
							<Controller
								name="year"
								control={form.control}
								rules={{ required: 'Year is required.', min: 1960, max: 2050 }}
								render={({ field, fieldState }) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': errors.year })}>
											Year*
										</label>
										<InputNumber
											id={field.name}
											ref={field.ref}
											value={field.value}
											onBlur={field.onBlur}
											onValueChange={(e) => field.onChange(e)}
											useGrouping={false}
											inputClassName={classNames({ 'p-invalid': fieldState.error })}
										/>
										{getFormErrorMessage(fieldState, field.name, 2050, 1960)}
									</>
								)}
							/>
						</div>
						<div className="field col">
							<Controller
								name="color"
								control={form.control}
								rules={{ required: 'Color is required.' }}
								render={({ field, fieldState }) => (
									<>
										<label htmlFor={field.name} className={classNames({ 'p-error': errors.color })}>
											Color*
										</label>
										<ColorPicker
											id={field.name}
											{...field}
											className={classNames({ 'p-invalid': fieldState.error })}
											defaultColor="ffffff"
										/>
										{getFormErrorMessage(fieldState, field.name)}
									</>
								)}
							/>
						</div>
					</div>

					<div className="field">
						<Controller
							name="price"
							control={form.control}
							rules={{ required: 'Price is required.', min: 0, max: 250000 }}
							render={({ field, fieldState }) => (
								<>
									<label htmlFor={field.name} className={classNames({ 'p-error': errors.price })}>
										Price*
									</label>
									<InputNumber
										id={field.name}
										ref={field.ref}
										value={field.value}
										onBlur={field.onBlur}
										onValueChange={(e) => field.onChange(e)}
										mode="currency"
										currency="USD"
										locale="en-US"
										inputClassName={classNames({ 'p-invalid': fieldState.error })}
									/>
									{getFormErrorMessage(fieldState, field.name, 250000, 0)}
								</>
							)}
						/>
					</div>

					<div className="p-dialog-footer pb-0">
						<Button label="Cancel" type="reset" icon="pi pi-times" className="p-button-text p-button-info" onClick={hideEditDialog} />
						<Button label="Save" type="submit" icon="pi pi-check" className="p-button-text p-button-success" />
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

export default React.memo(CrudPage);
