import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { ColorPicker } from 'primereact/colorpicker';
import { Column } from 'primereact/column';
import { DataTable, DataTablePFSEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast, ToastSeverityType } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useEffect, useRef, useState } from 'react';
import { Controller, ControllerFieldState, useForm } from 'react-hook-form';
import { ErrorType } from '../service/AxiosMutator';
import { CarEntity, useDeleteEntityCarsId, useGetEntityCars, usePostEntityCars, usePutEntityCarsId } from '../service/CarService';


const Crud = () => {
    // form
    const defaultValues = {
        vin: '',
        make: '',
        model: '',
        color: '',
        year: 2022,
        price: 0
    } as CarEntity;
    const form = useForm({ defaultValues: defaultValues });
    const errors = form.formState.errors;

    // models
    const [cars, setCars] = useState<CarEntity[]>([]);
    const [car, setCar] = useState<CarEntity>(defaultValues);
    const [deleteCarDialog, setDeleteCarDialog] = useState(false);
    const [editCarDialog, setEditCarDialog] = useState(false);
    const toastRef = useRef<Toast>(null);
    const datatable = useRef<DataTable>(null);

    // lazy table
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyParams, setLazyParams] = useState<DataTablePFSEvent>({
        first: 0,
        rows: 5,
        page: 1,
        sortField: '',
        sortOrder: 1,
        multiSortMeta: [],
        filters: {
            'vin': { value: '', matchMode: 'contains' },
            'make': { value: '', matchMode: 'contains' },
            'model': { value: '', matchMode: 'contains' },
            'color': { value: '', matchMode: 'contains' }
        }
    });

    // queries
    const queryClient = useQueryClient();
    const queryList = useGetEntityCars(
        { request: JSON.stringify(lazyParams) },
        {
            query: {
                queryKey: ["list-cars", lazyParams],
                refetchOnWindowFocus: false,
                retry: false,
                cacheTime: 0
            }
        }
    );
    const deleteCarMutation = useDeleteEntityCarsId();
    const createCarMutation = usePostEntityCars();
    const updateCarMutation = usePutEntityCarsId();

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
    }, [queryList.data]); // eslint-disable-line react-hooks/exhaustive-deps

    const onPage = (event: DataTablePFSEvent) => {
        setLazyParams(event);
    }

    const onSort = (event: DataTablePFSEvent) => {
        setLazyParams(event);
    }

    const onFilter = (event: DataTablePFSEvent) => {
        event['first'] = 0;
        setLazyParams(event);
    }

    const exportCSV = () => {
        datatable.current?.exportCSV();
    }

    const toast = (severity?: ToastSeverityType, summary?: React.ReactNode, detail?: React.ReactNode,) => {
        toastRef.current?.show({ severity: severity, summary: summary, detail: detail, life: 4000 });
    }

    const getFormErrorMessage = (fieldState: ControllerFieldState, fieldName?: string) => {
        if (!fieldState || !fieldState.error) {
            return null;
        }
        const name = fieldName ? fieldName.charAt(0).toUpperCase() + fieldName.slice(1) : '';
        const error = fieldState.error;
        let message;
        switch (error.type) {
            case "required":
                message = fieldState.error.message
                break;
            case "min":
                message = `${name} less than minimum allowed value`;
                break;
            case "max":
                message = `${name} more than maximum allowed value`;
                break;
            default:
                break;
        }
        return <small className="p-error">{message}</small>
    };

    const confirmDeleteCar = (item: CarEntity) => {
        setCar(item);
        setDeleteCarDialog(true);
    }

    const hideDeleteCarDialog = () => {
        setDeleteCarDialog(false);
        handleReset(defaultValues);
    }

    const hideEditDialog = () => {
        setEditCarDialog(false);
        handleReset(defaultValues);
    }

    const deleteCar = () => {
        deleteCarMutation.mutate(
            { id: car.id! },
            {
                onSuccess: () => {
                    hideDeleteCarDialog();
                    toast('success', 'Successful', `${car.year} ${car.make} ${car.model} Deleted`);
                    queryClient.invalidateQueries(["list-cars"]);
                },
                onError: (error: ErrorType<unknown>) => {
                    toast('error', 'Error', JSON.stringify(error.response?.data));
                }
            }
        );
    }

    const handleReset = (data: CarEntity) => {
        setCar(data);
        form.reset(data, {
            keepErrors: false,
            keepDirty: false,
            keepIsSubmitted: false,
            keepTouched: false,
            keepIsValid: false,
            keepSubmitCount: false,
        });
    }

    const onSubmit = (car: CarEntity) => {
        if (car.id) {
            updateCarMutation.mutate(
                { id: car.id!, data: car },
                {
                    onSuccess: () => {
                        hideEditDialog();
                        toast('success', 'Successful', `${car.year} ${car.make} ${car.model} Updated`);
                        queryClient.invalidateQueries(["list-cars"]);
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
                        queryClient.invalidateQueries(["list-cars"]);
                    },
                    onError: (error: ErrorType<unknown>) => {
                        toast('error', 'Error', JSON.stringify(error.response?.data));
                    }
                }
            );
        }
    };

    const editCar = (car: CarEntity) => {
        setEditCarDialog(true);
        handleReset({...car});
    }

    const createCar = () => {
        setEditCarDialog(true);
        handleReset(defaultValues);
    }

    const colorBodyTemplate = (item: CarEntity) => {
        return <div className='color-swatch' style={{ backgroundColor: `#${item.color}`, color: `#${item.color}`, width: 'auto' }}><p>#{item.color}</p></div>;
    }

    const priceBodyTemplate = (item: CarEntity) => {
        return item.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    const actionBodyTemplate = (item: CarEntity) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editCar(item)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteCar(item)} />
            </>
        );
    }

    const deleteCarDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text p-button-info" onClick={hideDeleteCarDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text p-button-danger" onClick={deleteCar} />
        </>
    );

    const leftToolbarTemplate = () => {
        return (
            <>
                <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={createCar} />
            </>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <>
                <Button label="Export" icon="pi pi-download" onClick={exportCSV} />
            </>
        )
    }

    return (
        <div>
            <div className="card">
                <Toast ref={toastRef} />

                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                <DataTable ref={datatable} value={cars} lazy filterDisplay="row" filterDelay={500} responsiveLayout="scroll" dataKey="id"
                    paginator paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="{first} to {last} of {totalRecords} cars"
                    first={lazyParams.first} rows={lazyParams.rows} rowsPerPageOptions={[5, 10, 25]} totalRecords={totalRecords}
                    onPage={onPage}
                    onSort={onSort} sortMode="multiple" multiSortMeta={lazyParams.multiSortMeta}
                    onFilter={onFilter} filters={lazyParams.filters} loading={queryList.isFetching} exportFilename="cars">
                    <Column field="vin" header="VIN" sortable filter filterPlaceholder="VIN" />
                    <Column field="year" header="Year" sortable />
                    <Column field="make" header="Make" sortable filter filterPlaceholder="Make" />
                    <Column field="model" header="Model" sortable filter filterPlaceholder="Model" />
                    <Column field="color" header="Color" sortable filter filterPlaceholder="Color" body={colorBodyTemplate} align='center' style={{ maxWidth: '8rem' }} />
                    <Column field="price" header="Price" sortable body={priceBodyTemplate} align='right' />
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }} align='right'></Column>
                </DataTable>
            </div>

            <Dialog visible={editCarDialog} style={{ width: '450px' }} header="Car Details" modal onHide={hideEditDialog}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-fluid">
                    <div className="field">
                        <Controller name="vin" control={form.control} rules={{ required: 'VIN is required.' }} render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.vin })}>VIN*</label>
                                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} />
                                {getFormErrorMessage(fieldState, field.name)}
                            </>
                        )} />
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <Controller name="make" control={form.control} rules={{ required: 'Make is required.' }} render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.make })}>Make*</label>
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(fieldState, field.name)}
                                </>
                            )} />
                        </div>
                        <div className="field col">
                            <Controller name="model" control={form.control} rules={{ required: 'Model is required.' }} render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.model })}>Model*</label>
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(fieldState, field.name)}
                                </>
                            )} />
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <Controller name="year" control={form.control} rules={{ required: 'Year is required.', min: 1960, max: 2050 }} render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.year })}>Year*</label>
                                    <InputNumber id={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} onValueChange={(e) => field.onChange(e)} useGrouping={false} inputClassName={classNames({ 'p-invalid': fieldState.error })} />
                                    {getFormErrorMessage(fieldState, field.name)}
                                </>
                            )} />
                        </div>
                        <div className="field col">
                            <Controller name="color" control={form.control} rules={{ required: 'Color is required.' }} render={({ field, fieldState }) => (
                                <>
                                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.color })}>Color*</label>
                                    <ColorPicker id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.error })} defaultColor="ffffff"/>
                                    {getFormErrorMessage(fieldState, field.name)}
                                </>
                            )} />
                        </div>
                    </div>

                    <div className="field">
                        <Controller name="price" control={form.control} rules={{ required: 'Price is required.', min: 0, max: 250000 }} render={({ field, fieldState }) => (
                            <>
                                <label htmlFor={field.name} className={classNames({ 'p-error': errors.price })}>Price*</label>
                                <InputNumber id={field.name} ref={field.ref} value={field.value} onBlur={field.onBlur} onValueChange={(e) => field.onChange(e)} mode="currency" currency="USD" locale="en-US" inputClassName={classNames({ 'p-invalid': fieldState.error })} />
                                {getFormErrorMessage(fieldState, field.name)}
                            </>
                        )} />
                    </div>

                    <div className="p-dialog-footer pb-0">
                        <Button label="Cancel" type="reset" icon="pi pi-times" className="p-button-text p-button-info" onClick={hideEditDialog} />
                        <Button label="Save" type="submit" icon="pi pi-check" className="p-button-text p-button-success" />
                    </div>
                </form>
            </Dialog>

            <Dialog visible={deleteCarDialog} style={{ width: '550px' }} header="Confirm Delete" modal footer={deleteCarDialogFooter} onHide={hideDeleteCarDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {car && <span>Are you sure you want to delete <b>{car.year} {car.make} {car.model}</b>?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default Crud;
