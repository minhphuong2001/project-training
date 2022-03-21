import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/system'
import InputField from '../../../components/FormField/InputField'
import { useForm, Controller } from 'react-hook-form'
import {
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    FormControl,
    InputAdornment,
    FilledInput,
    TextField,
    Button,
    Select as MuiSelect,
    MenuItem,
    CardMedia,
    Badge,
} from '@mui/material';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import '../components/product.scss'
import { SelectField } from '../../../components/FormField/SelectField';
import UploadImage from '../../../components/UploadImage/UploadImage';
import CustomToggle from '../../../components/FormField/CustomToggle/CustomToggle';
import { IProductDetail, IShipping } from '../../../models/product';
import { fileToBase64String, numberFormat } from '../../../utils/common';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
import EditDocument from '../../../components/EditDocument';
import Select from 'react-select'
import { IBrandData, IBrandDetail } from '../../../models/brand';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { Close } from '@mui/icons-material';
import { FileUploader } from 'react-drag-drop-files';

export interface ProductDetailProps {
    product: IProductDetail;
    brand: IBrandData[];
    onUpdateProduct: (data: any, files: Array<File>) => void;
}

const fileTypes = ['JPG', 'PNG', 'GIF', 'JPEG'];
interface IFileImage {
  file: File;
  base64Src: string;
}

const initialValues = {
    vendor_id: '',
    name: '',
    brand: '',
    condition: '',
    sku: '',
    categories: [],
    description: '',
    memberships: '',
    meta: '',
    meta_description: '',
    meta_keywords: '',
    tax_exempt: 0,
    product_page_title: '',
    quantity: '',
    price: '',
    sale_price: '',
    arriveDate: new Date(),
    shipping: [],
    facebook_marketing_enabled: false,
    google_feed_enabled: false,
    imagesOrder: [],
    deleted_images: []
}


function ProductDetail({ product, brand, onUpdateProduct }: ProductDetailProps) {  
    const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
    const { control, handleSubmit, setValue, getValues } = useForm({
        defaultValues: initialValues,
        mode: 'all'
    });
    const { categories } = useSelector((state: AppState) => state.category);
    // const { shippings } = useSelector((state: AppState) => state.shipping);
    const [showSaleCheckbox, setShowSaleCheckbox] = useState(false);
    const [brandDetail, setBrandDetail] = useState<IBrandDetail>();
    // const [selectImage, setSelectImage] = useState([]);
    // const [shippingList, setShippingList] = useState<IShipping[]>([]);
    const [files, setFiles] = useState<IFileImage[]>([]);

    const handleChangeSaleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked === true) {
            setShowSaleCheckbox(true);
        } else {
            setShowSaleCheckbox(false);
        }
    }

    useEffect(() => {
        const getBrandDetail = async () => {
            const response = await dispatch(fetchThunk(`${API_PATHS.brand}/detail`, 'post', { id: product?.brand_id }));
            if (response?.success === true) {
                setBrandDetail(response?.data);
            }
        }

        getBrandDetail();
    }, [dispatch, product])

    const cateValueOptions: any = product?.categories.map(item => {
        return { value: item.category_id, label: item.name }
    })

    const brandValueOptions: any = useMemo(() => {
        return { value: brandDetail?.id, label: brandDetail?.name }
    }, [brandDetail])

    // const handleAddShipping = (item: IShipping) => {
    //     setShippingList([...shippingList, item]);
    // }

    // const handleRemoveShipping = (index: number) => {
    //     shippingList.splice(index, 1);
    //     setShippingList([...shippingList]);
    // }

    const shippingValues: any = product?.shipping.map((item) => {
        return {id: item.id, zone_name: item.zone_name, price: numberFormat(item.price)};
    })

    // const newImage = product?.images ? product.images.concat(selectImage) : selectImage;

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         const fileArr = Array.from(e.target.files).map(file => URL.createObjectURL(file));

    //         setSelectImage(prev => prev.concat(fileArr as any));

    //         Array.from(e.target.files).map(file => URL.createObjectURL(file));
    //     }
    //     //{ thumbs: [URL.createObjectURL(file)], file: URL.createObjectURL(file), id: Math.floor(Math.random() * 1000) }
    // }
    
    // const handleRemoveImage = (index: number) => {
    //     selectImage.splice(index, 1);
    //     setSelectImage([...selectImage]);
    // }

    const addFile = useCallback(async (file: File) => {
        const base64String = await fileToBase64String(file);
        const fileArray = [...files].find((item) => item.base64Src === base64String);
        if (fileArray) {
            return;
        }
        setFiles((prev) => {
            const newFiles = [...prev].filter(item => item.base64Src !== base64String);
            newFiles.push({ file, base64Src: base64String });
            return newFiles;
        })
    }, [files]);

    const removeFile = (base64Src: string) => {
        setFiles((prev) => {
            const newFiles = [...prev].filter((item) => item.base64Src !== base64Src);
            return newFiles;
        })
    }

    const handleAddFiles = (files: FileList) => {
        Array.from(files).map((file) => addFile(file));
    }

    const isDeletedImage = (id: string) => {
        return [...getValues("deleted_images")].some((item) => item === id);
    }
    
    const handleRemoveImage = useCallback((id: string) => {
        const image = [...product?.images].find((item) => item.id === id);
        if (!image) {
            return;
        }
        const newImagesOrder = [...getValues("imagesOrder")].filter((item) => item !== image.file);
        const newDeletedImage = [...getValues("deleted_images"), id];

        setValue('deleted_images', newDeletedImage as never[]);
        setValue('imagesOrder', newImagesOrder);
    }, [setValue, getValues, product?.images])

    const categoryOptions: any = categories.map(function (cate) {
        return { value: cate.id, label: cate.name }
    });
    const colourStyles = {
        control: (styles: any) => ({ ...styles, backgroundColor: '#323259', flex: 1}),
    };
    const brandOptions: any = brand.map(function (item) {
        return { value: item?.id, label: item?.name }
    })

    const onSubmit = (data: any) => {
        onUpdateProduct(data, files.map((item) => item.file));
    }

    const newImagesOrder = product?.images.map(item => item.file).concat(files.map(item => item.file.name));

    useEffect(() => {
        setValue('vendor_id', product?.vendor_id);
        setValue('name', product?.name);
        setValue('sku', product?.sku);
        setValue('condition', product?.condition_id);
        setValue('price', String(product?.price));
        setValue('quantity', String(product?.quantity));
        setValue('sale_price', numberFormat(product?.sale_price));
        setValue('description', product?.description);
        setValue('categories', cateValueOptions);
        setValue('brand', brandValueOptions);
        setValue('meta_keywords', product?.meta_keywords);
        setValue('product_page_title', product?.product_page_title);
        setValue('shipping', shippingValues);
        setValue('imagesOrder', newImagesOrder as never[]);
    }, [product, setValue, cateValueOptions, brandValueOptions, shippingValues, newImagesOrder])

    return (
        <div>
            <Box>
                <Typography my={1} variant='h5' sx={{ color: '#fff' }} >
                    {product?.name}
                </Typography>
                <Typography
                    sx={{
                        position: 'relative',
                        display: 'inline-block',
                        textAlign: 'center',
                        color: '#b18aff',
                        marginLeft: '10px',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-5px',
                            width: '40px',
                            height: '2px',
                            left: '-10px',
                            backgroundColor: '#b18aff',
                            borderRadius: '2px'
                        }
                    }}
                >
                    Info
                </Typography>
                <Box
                    sx={{
                        width: '600px',
                        marginLeft: '100px'
                    }}
                >
                    <div className='input-item'>
                        <p className='label-name'>Vendors <span className='star'><sup>*</sup></span></p>
                        <InputField
                            name='vendor_id'
                            control={control}
                            style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                        />
                    </div>

                    <div className='input-item'>
                        <p className='label-name'>Product Title <span className='star'><sup>*</sup></span></p>
                        <InputField
                            name='name'
                            control={control}
                            style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                        />
                    </div>

                    <div className='input-item'>
                        <p className='label-name'>Brand <span className='star'><sup>*</sup></span></p>
                        <Controller
                            name='brand'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    styles={colourStyles}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e)
                                    }}
                                    options={brandOptions}
                                />
                            )}
                        />
                    </div>

                    <div className='input-item'>
                        <p className='label-name'>Condition <span className='star'><sup>*</sup></span></p>
                        <SelectField
                            name='condition'
                            control={control}
                            options={[{ id: '294', name: 'Used' }]}
                            style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
                        />
                    </div>

                    <div className='input-item'>
                        <p className='label-name'>SKU <span className='star'><sup>*</sup></span></p>
                        <InputField
                            name='sku'
                            control={control}
                            style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                        />
                    </div>
                    {/* images */}
                    <div className="input-item">
                        <p className='label-name'>Image <span className='star'><sup>*</sup></span></p>
                        <Controller
                            name='imagesOrder'
                            control={control}
                            render={({ field }) =>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        width: 1,
                                        flexWrap: 'wrap',
                                        marginTop: '10px'
                                    }}
                                >
                                    {product?.images.map((item) => {
                                        if (isDeletedImage(item.id)) return null;
                                        return (
                                            <Badge
                                                key={item.file}
                                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                sx={{ mr: 2 }}
                                                badgeContent={
                                                    <Box
                                                        onClick={(e) => handleRemoveImage(item.id)}
                                                        sx={{
                                                            backgroundColor: '#fff',
                                                            display: 'flex',
                                                            alignItem: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '50%',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Close sx={{ color: 'red', fontSize: '18px' }}/>
                                                    </Box>
                                                }
                                            >
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 120, height: 120, cursor: 'pointer', marginBottom: '1rem'}}
                                                    src={item.thumbs[0] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Circle-icons-camera.svg/800px-Circle-icons-camera.svg.png'}
                                                />
                                            </Badge>
                                        );
                                    })}
                                    {files.map((item) => {
                                        return (
                                            <Badge
                                                key={item.base64Src}
                                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                                sx={{ mr: 2 }}
                                                badgeContent={
                                                    <Box
                                                        onClick={(e) => removeFile(item.base64Src)}
                                                        sx={{
                                                            backgroundColor: '#fff',
                                                            display: 'flex',
                                                            alignItem: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '50%',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Close sx={{ color: 'red', fontSize: '18px' }}/>
                                                    </Box>
                                                }
                                            >
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 120, height: 120, marginBottom: '1rem', cursor: 'pointer' }}
                                                    src={item.base64Src}
                                                />
                                            </Badge>
                                        );
                                    })}
                                    <FileUploader multiple handleChange={handleAddFiles} name="file" types={fileTypes}>
                                        <Box mt={-2} sx={{ minHeight: 120, width: 120, border: '1px dashed #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 80, height: 80, cursor: 'pointer', padding: '10px' }}
                                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Circle-icons-camera.svg/800px-Circle-icons-camera.svg.png"
                                            />
                                        </Box>
                                    </FileUploader>
                                </Box>
                            }
                        />
                    </div>
                
                    <div className='input-item'>
                        <p className='label-name'>Category <span className='star'><sup>*</sup></span></p>
                        <Controller
                            name='categories'
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={categoryOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        styles={colourStyles}
                                        value={field.value}
                                        onChange={(e) => field.onChange(e)}
                                    />
                                )
                            }}
                        />
                    </div>

                    <div className="input-item">
                        <p className='label-name'>Description <span className='star'><sup>*</sup></span></p>
                        {/* <p dangerouslySetInnerHTML={{ __html: product?.description }}></p> */}
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => <EditDocument title={field.value} setTitle={(e) => field.onChange(e)} />}
                        />
                    </div>

                    <div className="input-item">
                        <p className='label-name'>Available for sale</p>
                        <CustomToggle value='1'/>
                    </div>
                </Box>
            </Box>
            {/*  */}
            <div
                style={{
                    overflow: 'hidden',
                    backgroundColor: '#323259',
                    height: '20px',
                    width: '104%',
                    marginLeft: '-20px'
                }}
            ></div>
            {/* pricing */}
            <Box my={2}>
                <Typography my={2} variant='h5' sx={{ color: '#fff' }} >
                {` Prices & Inventory`}
                </Typography>
                <Box sx={{ width: '600px', marginLeft: '100px' }}>
                <div className='input-item'>
                    <p className='label-name'>Member ship</p>
                    <SelectField
                        name='memberships'
                        control={control}
                        options={[{ id: '4', name: 'General' }]}
                        style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
                    />
                </div>

                <div className="input-item">
                    <p className='label-name'>Tax class</p>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '-60px'}}>
                        <Typography mr={16} sx={{ color: '#fff' }}>Default</Typography>
                        <Controller
                            name='tax_exempt'
                            control={control}
                            render={({ field }) => <FormControlLabel
                            control={<Checkbox />}
                            label="Tax Exempt"
                            sx={{ color: '#fff' }}
                            {...field}
                            />}
                        />
                    </Box>
                </div>  

                <div className='input-item'>
                    <p className='label-name'>Price <span className='star'><sup>*</sup></span></p>
                    <Box sx={{ flex: 1, display: 'flex', marginLeft: '-60px'}}>
                        <Controller
                            name='price'
                            control={control}
                            render={({ field }) => (
                                <FormControl sx={{ width: '150px', color: '#fff', backgroundColor: '#323259', marginRight: '20px' }} size='small' variant='outlined'>
                                    <FilledInput
                                        id="filled-adornment-amount"
                                        size='small'
                                        type='number'
                                        startAdornment={<InputAdornment position='end'>$</InputAdornment>}
                                        {...field}
                                    />
                                </FormControl>
                            )}
                        />
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox onChange={handleChangeSaleCheckbox} />}
                                label="Sale"
                                sx={{ color: '#fff' }}
                            />
                        </FormGroup> 
                    </Box>
                    {showSaleCheckbox ?
                        <Controller
                            name='sale_price'
                            control={control}
                            render={({ field }) => (
                                <FormControl sx={{ width: '150px', color: '#fff', backgroundColor: '#323259' }} size='small' variant='outlined'>
                                    <FilledInput
                                        id="filled-adornment-amount"
                                        size='small'
                                        type='number'
                                        startAdornment={<InputAdornment position='end'>$</InputAdornment>}
                                        {...field}
                                    />
                                </FormControl>
                            )}
                        /> : null} 
                </div>

                <div style={{ marginTop: '20px'}}>
                    <div className="input-item" >
                        <p className='label-name'>Arrival date</p>
                        <Controller
                            name='arriveDate'
                            control={control}
                            render={({ field }) => <LocalizationProvider dateAdapter={AdapterMomentFns}>
                                <DatePicker
                                    value={field.value}
                                    onChange={(e) => field.onChange(e)}
                                    renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size='small'
                                        fullWidth
                                        sx={{ color: '#fff', backgroundColor: '#323259', marginLeft: 0 }}
                                    />
                                    )}
                                />
                            </LocalizationProvider>}
                        />
                    </div>
                </div>

                <div className='input-item'>
                    <p className='label-name'>Quanlity in stock <span className='star'><sup>*</sup></span></p>
                    <InputField
                        name='quantity'
                        control={control}
                        style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                    />
                </div>
                </Box>
            </Box>
            {/* shipping */}
            <div
                style={{
                    overflow: 'hidden',
                    backgroundColor: '#323259',
                    height: '20px',
                    width: '104%',
                    marginLeft: '-20px'
                }}
            ></div>
            <Box my={2}>
                <Typography my={2} variant='h5' sx={{ color: '#fff' }} >Shipping</Typography>
                <Box sx={{ width: '600px', marginLeft: '100px' }}>
                    {product?.shipping.map((item) => (
                        <div className='input-item' key={item.id}>
                            <p className='label-name'>{item.zone_name} <span className='star'><sup>*</sup></span></p>
                            <Controller
                                name='shipping'
                                control={control}
                                render={({ field }) => (
                                    <FormControl sx={{ color: '#fff', backgroundColor: '#323259' }} fullWidth size='small' variant='outlined'>
                                        <FilledInput
                                            id="filled-adornment-amount"
                                            size='small'
                                            type='number'
                                            value={numberFormat(item.price)}
                                            onChange={(e) => field.onChange(e)}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        />
                                    </FormControl>
                                )}
                            />
                        </div>
                    ))}
                    
                    {/* {shippingList.map((item, index: number) => (
                        <div className="input-item" key={index}>
                            <p className='label-name'>{item.zone_name}</p>
                            <Box ml={-8} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Controller
                                    name='shipping'
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl sx={{ color: '#fff', backgroundColor: '#323259', width: '250px' }} fullWidth size='small' variant='outlined'>
                                            <FilledInput
                                                id="filled-adornment-amount"
                                                type='number'
                                                value={field.value}
                                                onChange={(e) => field.onChange(e)}
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            />
                                        </FormControl>
                                    )}
                                />
                                <Button
                                    variant='outlined'
                                    color='error'
                                    size='small'
                                    sx={{ width: '100px', fontSize: '10px', marginLeft: '50px' }}
                                    onClick={() => handleRemoveShipping(index)}
                                >
                                    remove
                                </Button>
                            </Box>
                        </div>
                    ))} */}
                    
                    
                    {/* <div className="input-item">
                        <p className='label-name'></p>
                        <Controller
                            name='shipping'
                            control={control}
                            render={({ field }) => {
                                return (
                                    <Box ml={-8} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <FormControl size='small' sx={{ color: '#fff', backgroundColor: '#323259', width: '250px' }}>
                                            <MuiSelect
                                                value={field.value}
                                                onChange={(e) => field.onChange(e)}
                                                inputProps={{ 'aria-label': 'Without label' }}
                                                sx={{ color: '#fff' }}
                                                placeholder='Select new zone'
                                            >
                                                {shippings.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </MuiSelect>
                                        </FormControl>
                                                    
                                        <Button
                                            variant='outlined'
                                            color='success'
                                            size='small'
                                            sx={{ width: '150px', fontSize: '10px', marginLeft: '20px' }}
                                            onClick={() => handleAddShipping({ id: 1, zone_name: 'abc', price: 1.20 })}
                                        >
                                            Add shipping location
                                        </Button>
                                    </Box>
                                )}}
                        />
                    </div> */}
                </Box>
            </Box>
            {/* marketing */}
            <div
                style={{
                    overflow: 'hidden',
                    backgroundColor: '#323259',
                    height: '20px',
                    width: '104%',
                    marginLeft: '-20px'
                }}
            ></div>
            <Box my={2}>
                <Typography my={2} variant='h5' sx={{ color: '#fff' }} >Shipping</Typography>
                <Box sx={{ width: '600px', marginLeft: '100px' }}>
                <div className="input-item">
                    <p className='label-name'>Open Graph meta tags</p>
                    <SelectField
                        name='meta'
                        control={control}
                        options={[
                            { id: 'autogenerate', name: 'Autogenerate' },
                            { id: 'custom', name: 'Custom' }
                        ]}
                        style={{ color: '#fff', backgroundColor: '#323259' }}
                    />
                </div>

                <div className="input-item">
                    <p className='label-name'>Meta description</p>
                    <SelectField
                        name='meta_description'
                        control={control}
                        options={[
                            { id: 'autogenerate', name: 'Autogenerate' },
                            { id: 'custom', name: 'Custom' }
                        ]}
                        style={{ color: '#fff', backgroundColor: '#323259' }}
                    />
                </div>

                <div className='input-item'>
                    <p className='label-name'>Meta keywords</p>
                    <InputField
                        name='meta_keywords'
                        control={control}
                        style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                    />
                </div>

                <div className='input-item'>
                    <p className='label-name'>Product page title</p>
                    <InputField
                        name='product_page_title'
                        control={control}
                        style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                    />
                </div>

                <div className="input-item">
                    <p className='label-name'>Add to Facebook <br /> product feed</p>
                    <CustomToggle />
                </div>

                <div className="input-item">
                    <p className='label-name'>Add to Google <br /> product feed</p>
                    <CustomToggle />
                </div>
                </Box>
            </Box>
            <Box
                sx={{
                    backgroundColor: '#323259',
                    padding: '10px 30px',
                    position: 'sticky',
                    bottom: '0px',
                    boxShadow: '0 0 13px 0 #b18aff',
                    borderStyle: 'solid',
                    borderColor:'#323259',
                    borderImage: 'initial',
                    zIndex: 2,
                    width: '100%', 
                }}
            >
                <Button variant='contained' color='warning' onClick={handleSubmit(onSubmit)}>
                    update product
                </Button>
            </Box>
        </div>
    )
}

export default React.memo(ProductDetail);