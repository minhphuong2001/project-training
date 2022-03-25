import React, { useCallback, useState, useEffect } from 'react'
import { Box } from '@mui/system'
import InputField from '../../../components/FormField/InputField'
import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputAdornment,
  FilledInput,
  TextField,
  CircularProgress,
  Badge,
  CardMedia,
  Select as MuiSelect,
  MenuItem,
} from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import '../components/product.scss'
import { SelectField } from '../../../components/FormField/SelectField';
import { useHistory } from 'react-router';
import { ROUTES } from '../../../configs/routes';
import CustomToggle from '../../../components/FormField/CustomToggle/CustomToggle';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import EditDocument from '../../../components/EditDocument';
import Select from 'react-select'
import axios from 'axios';
import { API_PATHS } from '../../../configs/api';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { toast, ToastContainer } from 'react-toastify';
import { FileUploader } from 'react-drag-drop-files';
import { fileToBase64String } from '../../../utils/common';
import { IShipping } from '../../../models/product';

const fileTypes = ['JPG', 'PNG', 'JPEG'];
interface IFileImage {
  file: File;
  base64Src: string;
}

const initialValue = {
  vendor_id: {},
  name: '',
  brand: '',
  condition: '',
  sku: Math.floor(Math.random() * 100000000),
  categories: [],
  imagesOrder: [],
  description: '',
  memberships: '',
  meta: '',
  meta_description: '',
  meta_keywords: '',
  tax_exempt: 0,
  product_page_title: '',
  quantity: 0,
  price: 0.0000,
  sale_price: 0.0000,
  sale_price_type: '$',
  arriveDate: new Date(),
  shipping: [{ id: 1, zone_name: 'Continental U.S.', price: '0.00' }],
  shipping_to_zones: [],
  facebook_marketing_enabled: 0,
  google_feed_enabled: 0,
}

export default function AddProductPage() {
  const history = useHistory();
  const { brands } = useSelector((state: AppState) => state.brand);
  const { categories } = useSelector((state: AppState) => state.category);
  const { vendors } = useSelector((state: AppState) => state.vendor);
  const { shippings } = useSelector((state: AppState) => state.shipping);
  const [showSaleCheckbox, setShowSaleCheckbox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<Array<IFileImage>>([]);

  const [shippingList, setShippingList] = useState<IShipping[]>([]);
  const [shippingItem, setShippingItem] = useState<IShipping>();

  const addFile = useCallback(async (file: File) => {
    const base64String = await fileToBase64String(file);
   
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles].filter((item) => item.base64Src !== base64String);
      newFiles.push({ file, base64Src: base64String });
      return newFiles;
    });
  }, []);

  const removeFile = useCallback((base64Src: string) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles].filter((item) => item.base64Src !== base64Src);
      return newFiles;
    });
  }, []);

  const handleAddFiles = (files: FileList) => {
    Array.from(files).map((file) => addFile(file));
  };

  const handleAddShipping = (item: IShipping) => {
    setShippingList([...shippingList, item]);
  }
  const handleRemoveShipping = (index: number) => {
    shippingList.splice(index, 1);
    setShippingList([...shippingList]);
  }

  const validationSchema = Yup.object().shape({
    vendor_id: Yup.object()
      .required('This field is required.'),
    name: Yup.string()
      .required('This field is required.'),
    brand: Yup.string()
      .required('This field is required.'),
    condition: Yup.string()
      .required('This field is required.'),
    sku: Yup.string()
      .required('This field is required.'),
    categories: Yup.array()
      .required('This field is required.'),
  });
  
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: initialValue,
    resolver: yupResolver(validationSchema),
    mode: 'all'
  });

  const handleChangeSaleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked === true) {
      setShowSaleCheckbox(true);
    } else {
      setShowSaleCheckbox(false);
    }
  }

  const options: any = vendors.slice(0, 200).map(function (vendor) {
    return { value: vendor.id, label: vendor.name };
  })
    const categoryOptions: any = categories.map(function (cate) {
      return { value: cate.id, label: cate.name }
  });
  const colourStyles = {
    control: (styles: any) => ({ ...styles, backgroundColor: '#323259', color: '#fff', flex: 1}),
  };

  const onUploadFile = async (file: File, productId: string, order: string) => {
    const formData = new FormData();
    formData.append('images[]', file);
    formData.append('productId', productId);
    formData.append('order', order);

    const json = await axios.post(API_PATHS.uploadImage, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
      }
    });

    console.log(json.data);
  }

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      const values = {
        vendor_id: data?.vendor_id.value,
        brand_id: data.brand,
        condition_id: data.condition,
        name: data.name,
        categories: data.categories.map((value: any) => value?.value),
        description: data.description,
        enabled: 1,
        memberships: data.memberships,
        tax_exempt: data.tax_exempt,
        price: data.price,
        sale_price_type: data.sale_price_type,
        sale_price: data.sale_price,
        shipping_to_zones: [{ id: 1, zone_name: 'Continental U.S.', price: data.shipping }],
        arrival_date: data.arriveDate,
        inventory_tracking: 0,
        quantity: data.quantity,
        sku: data.sku,
        participate_sale: 1,
        og_tags_type: 0,
        og_tags: '',
        enableOffers: 1,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords,
        product_page_title: data.product_page_title,
        facebook_marketing_enabled: data.facebook_marketing_enabled === false ? 0 : 1,
        google_feed_enabled: data.google_feed_enabled === false ? 0 : 1,
        imagesOrder: [...files].map(file => file.file.name),
        deleted_images: []
      }
      // console.log(values);
      formData.append('productDetail', JSON.stringify(values));
      const response = await axios.post(`${API_PATHS.productAdmin}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        }
      });

      setIsLoading(false);
      
      if (response.data?.success === true) {
        const productId = response.data?.data;
        const file: File[] = files.map(item => item.file);
        const index = file.length > 0 && file.length;

        await Promise.all(file.map(async (file) => {
          await onUploadFile(file, productId, index.toString());
        }));

        toast.success('Add product successfully');
        setTimeout(() => {
          history.push(`${ROUTES.product}/product-detail/${productId}`);
        }, 2000);
      
      } else {
        toast.error(response.data?.errors ? response.data?.errors : 'Something went wrong.');
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  }

  useEffect(() => {
    setValue('imagesOrder', [...files].map(file => file.file.name) as never[]);
  }, [setValue, files])

  return (
    <div>
      <Box>
        <Box
          mb={4}
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          onClick={() => history.push(`${ROUTES.product}/manage-products`)}
        >
          <ArrowBack />
        </Box>
        <Typography my={2} variant='h4' sx={{ color: '#fff' }} >
          Add product  
        </Typography>
        <Box
          sx={{
            width: '600px',
            marginLeft: '100px'
          }}
        >
          <div className='input-item'>
            <p className='label-name'>Vendors <span className='star'><sup>*</sup></span></p>
            <Controller
              name='vendor_id'
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
                  options={options}
                />
              )}
            />
          </div>

          <div className='input-item'>
            <p className='label-name'>Product Title <span className='star'><sup>*</sup></span></p>
            <InputField
              name='name'
              label='Product Title'
              control={control}
              style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className='input-item'>
            <p className='label-name'>Brand <span className='star'><sup>*</sup></span></p>
            <SelectField
              name='brand'
              label='Brand'
              control={control}
              options={brands}
              style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className='input-item'>
            <p className='label-name'>Condition <span className='star'><sup>*</sup></span></p>
            <SelectField
              name='condition'
              label='Condition'
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
                      <Box sx={{
                        minHeight: 120,
                        cursor: 'pointer',
                        marginBottom: '1rem',
                      }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 120, height: 120, objectFit: 'cover' }}
                          src={item.base64Src}
                        />
                      </Box>
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
            <Controller
              name='description'
              control={control}
              render={({ field }) => <EditDocument title={field.value} setTitle={(e) => field.onChange(e)} />}
            />
          </div>

          <div className="input-item">
            <p className='label-name'>Available for sale</p>
            <CustomToggle value='1' />
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
              label='Member ship'
              control={control}
              options={[{ id: 'general', name: 'General' }]}
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
            <Box sx={{ flex: 1, display: 'flex', marginLeft: showSaleCheckbox ? '110px' : '-60px' }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Controller
                  name='sale_price_type'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      id="filled-select-currency"
                      size='small'
                      select
                      value={field.value}
                      onChange={field.onChange}
                      variant="filled"
                      sx={{ color: '#fff', backgroundColor: '#323259', width: '100px', marginRight: '1px' }}
                    >
                      <MenuItem value='$'>$</MenuItem>
                      <MenuItem value='%'>%</MenuItem>
                    </TextField>
                  )}
                />
                <Controller
                  name='sale_price'
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={{ width: '200px', color: '#fff', backgroundColor: '#323259' }} size='small' variant='outlined'>
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
              </Box> : null} 
          </div>

          <div style={{ marginTop: '20px'}}>
            <div className="input-item" >
              <p className='label-name'>Arrival date</p>
              <Controller
                name='arriveDate'
                control={control}
                render={({ field }) => <LocalizationProvider dateAdapter={AdapterMomentFns}>
                  <DatePicker
                    label='Date'
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
          <div className='input-item'>
            <p className='label-name'>Continental U.S. <span className='star'><sup>*</sup></span></p>
            <Controller
              name='shipping'
              control={control}
              render={({ field }) => (
                <FormControl sx={{ color: '#fff', backgroundColor: '#323259' }} fullWidth size='small' variant='outlined'>
                  <FilledInput
                    id="filled-adornment-amount"
                    size='small'
                    type='number'
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                  />
                </FormControl>
              )}
            />
          </div> 

          {shippingList.map((item, index: number) => (
            <div className="input-item" key={index}>
              <p className='label-name'>{item.zone_name}</p>
              <Box ml={-8} sx={{ display: 'flex', alignItems: 'center' }}>
                <Controller
                  name='shipping_to_zones'
                  control={control}
                  render={({ field }) => (
                    <FormControl sx={{ color: '#fff', backgroundColor: '#323259', width: '250px' }} fullWidth size='small' variant='outlined'>
                      <FilledInput
                        id="shipping-zones"
                        type='number'
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value, index)}
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
          ))}
          
          <div className="input-item">
            <p className='label-name'></p>
            <Controller
              name='shipping_to_zones'
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
                          <MenuItem
                            key={item.id}
                            value={item.id}
                            onClick={() => setShippingItem({ id: item.id, zone_name: item.name, price: 0.00 })}
                          >
                            {item.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <Button
                      variant='outlined'
                      color='success'
                      size='small'
                      sx={{ width: '150px', fontSize: '10px', marginLeft: '20px' }}
                      onClick={() => handleAddShipping(shippingItem as IShipping)}
                    >
                      Add shipping location
                    </Button>
                  </Box>
                )}}
              />
          </div>
          
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
        <Typography my={2} variant='h5' sx={{ color: '#fff' }} >Marketing</Typography>
        <Box sx={{ width: '600px', marginLeft: '100px' }}>
          <div className="input-item">
            <p className='label-name'>Open Graph meta tags</p>
            <SelectField
              name='meta'
              control={control}
              options={[
                { id: '1', name: 'Autogenerate' },
                { id: '2', name: 'Custom' }
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
                { id: '3', name: 'Autogenerate' },
                { id: '4', name: 'Custom' }
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
            <Controller
              name='facebook_marketing_enabled'
              control={control}
              render={({ field }) => <CustomToggle value={field.value} />}
            />
          </div>

          <div className="input-item">
            <p className='label-name'>Add to Google <br /> product feed</p>
            <Controller
              name='google_feed_enabled'
              control={control}
              render={({ field }) => <CustomToggle value={field.value}/>}
            />
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
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Button
          variant='contained'
          color='warning'
          onClick={handleSubmit(onSubmit)}
        >
          add product
        </Button>
        {isLoading ? <CircularProgress sx={{ marginLeft: 2, color: '#fff' }} size={28} /> : null}
      </Box>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}