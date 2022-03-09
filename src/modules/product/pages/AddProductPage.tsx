import React, { useState } from 'react'
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
  InputLabel,
  InputAdornment,
  FilledInput,
  TextField,
  CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import '../components/product.scss'
import { SelectField } from '../../../components/FormField/SelectField';
import { useHistory } from 'react-router';
import { ROUTES } from '../../../configs/routes';
import UploadImage from '../../../components/UploadImage/UploadImage';
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

const initialValue = {
  vendor_id: {},
  name: '',
  brand: '',
  condition: '',
  sku: '1646235088515',
  categories: '',
  imagesOrder: [],
  description: '',
  memberships: '',
  meta: '',
  meta_description: '',
  meta_keywords: '',
  tax_exempt: 0,
  zone: '',
  product_page_title: '',
  quantity: 0,
  price: 0.0000,
  sale_price: 0.0000,
  arriveDate: new Date(),
  shipping: 0.0000,
  facebook_marketing_enabled: 0,
  google_feed_enabled: 0,
}

export default function AddProductPage() {
  const history = useHistory();
  const { brands } = useSelector((state: AppState) => state.brand);
  const { categories } = useSelector((state: AppState) => state.category);
  const { vendors } = useSelector((state: AppState) => state.vendor);
  const [showSaleCheckbox, setShowSaleCheckbox] = useState(false);

  const [selectImage, setSelectImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    categories: Yup.string()
      .required('This field is required.'),
  });
  
  const { control, handleSubmit } = useForm({
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

  const options: any = vendors.slice(0, 100).map(function (vendor) {
    return { value: vendor.id, label: vendor.name };
  })

  const colourStyles = {
    control: (styles: any) => ({ ...styles, backgroundColor: '#323259', flex: 1}),
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArr = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      
      setSelectImage(prev => prev.concat(fileArr as any));
      
      Array.from(e.target.files).map(file => URL.createObjectURL(file));
    }
  }
  const handleRemoveImage = (index: number) => {
    selectImage.splice(index, 1);
    setSelectImage([...selectImage]);
  }

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const values = {
        vendor_id: data?.vendor_id.value,
        ...data
      }
      formData.append('images', `${selectImage}`)
      formData.append('productDetail', `${JSON.stringify(values)}`)
      console.log(values);

      const response = await axios.post(`${API_PATHS.productAdmin}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: Cookies.get(ACCESS_TOKEN_KEY) || '',
        }
      })
      setIsLoading(false);
      console.log(response.data);
      if (response.data?.success === true) {
        toast.success('Update successfully');
      } else {
        toast.error('Something went wrong');
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  }

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
            justifyContent: 'center'
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
              options={[{ id: '123', name: 'Used' }]}
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
              render={({ field }) => <UploadImage
                selectImage={selectImage}
                onChangeImage={handleImageChange}
                onRemoveImage={handleRemoveImage}
              />}
              name='imagesOrder'
              control={control}
            />
          </div>
    
          <div className='input-item'>
            <p className='label-name'>Category <span className='star'><sup>*</sup></span></p>
            <SelectField
              name='categories'
              label='Category'
              control={control}
              options={categories}
              style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
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
            <Box sx={{ flex: 1, display: 'flex', marginLeft: '-60px' }}>
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
                  <InputLabel htmlFor="filled-adornment-amount">Money</InputLabel>
                  <FilledInput
                    id="filled-adornment-amount"
                    size='small'
                    type='number'
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    {...field}
                  />
                </FormControl>
              )}
            />
          </div>

          <div className="input-item">
            <p className='label-name'>Add Shipping Location</p>
            <SelectField
              name='zone'
              label='Select new zone'
              control={control}
              options={[{ id: 'used', name: 'Used' }]}
              style={{ color: '#fff', backgroundColor: '#323259' }}
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
        <Typography my={2} variant='h5' sx={{ color: '#fff' }} >Shipping</Typography>
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