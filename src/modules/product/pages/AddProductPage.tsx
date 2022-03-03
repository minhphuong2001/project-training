import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/system'
import InputField from '../../../components/FormField/InputField'
import { useForm } from 'react-hook-form'
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  InputAdornment,
  FilledInput,
  TextField,
  Button
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
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState } from '../../../redux/reducer';
import { Action } from 'typesafe-actions';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { setShippingData } from '../redux/shippingReducer';

export default function AddProductPage() {
  const history = useHistory();
  const { control } = useForm();
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [date, setDate] = useState<Date | string>(new Date());

  const getShippingList = useCallback(async () => {
    const response = await dispatch(fetchThunk(API_PATHS.shipping, 'get'));
    
    if (response?.success === true) {
      dispatch(setShippingData(response?.data));
    }
  }, [dispatch])

  useEffect(() => {
    getShippingList();
  }, [getShippingList])

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
            <InputField
              name='vendors'
              label='Vendors'
              control={control}
              style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className='input-item'>
            <p className='label-name'>Product Title <span className='star'><sup>*</sup></span></p>
            <InputField
              name='productTitle'
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
              options={[{ id: 'used', name: 'Used' }]}
              style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className='input-item'>
            <p className='label-name'>Condition <span className='star'><sup>*</sup></span></p>
            <SelectField
              name='condition'
              label='Condition'
              control={control}
              options={[{ id: 'used', name: 'Used' }]}
              style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className='input-item'>
            <p className='label-name'>SKU <span className='star'><sup>*</sup></span></p>
            <InputField
              name='sku'
              // label='SKU'
              value='1646235088515'
              control={control}
              style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>
          {/* images */}
          <div className="input-item">
            <p className='label-name'>Image <span className='star'><sup>*</sup></span></p>
            <UploadImage />
          </div>
    
          <div className='input-item'>
            <p className='label-name'>Category <span className='star'><sup>*</sup></span></p>
            <SelectField
              name='category'
              label='Category'
              control={control}
              options={[{ id: 'used', name: 'Used' }]}
              style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className="input-item">
            <p className='label-name'>Description <span className='star'><sup>*</sup></span></p>

          </div>

          <div className="input-item">
            <p className='label-name'>Available for sale</p>
            <CustomToggle />
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
              name='member'
              label='Member ship'
              control={control}
              options={[{ id: 'used', name: 'Used' }]}
              style={{ color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className="input-item">
            <p className='label-name'>Tax class</p>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '-60px'}}>
              <Typography mr={32} sx={{ color: '#fff' }}>Default</Typography>
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Tax Exempt" sx={{ color: '#fff' }} />
              </FormGroup>
            </Box>
          </div>  

          <div className='input-item'>
            <p className='label-name'>Price <span className='star'><sup>*</sup></span></p>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: '-60px'}}>
              <FormControl sx={{ width: '264px', color: '#fff', backgroundColor: '#323259', marginRight: '36px' }} size='small' variant='outlined'>
                <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
                <FilledInput
                  id="filled-adornment-amount"
                  size='small'
                  type='number'
                  // value={values.amount}
                  // onChange={handleChange('amount')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
              </FormControl>
              <FormGroup>
                <FormControlLabel control={<Checkbox />} label="Sale" sx={{ color: '#fff' }} />
              </FormGroup>
            </Box>
          </div>

          <div style={{ marginTop: '20px'}}>
            <div className="input-item" >
              <p className='label-name'>Arrival date</p>
              <LocalizationProvider dateAdapter={AdapterMomentFns}>
                <DatePicker
                  label='Date'
                  value={date}
                  onChange={(newValue) => setDate(newValue as string)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size='small'
                      fullWidth
                      sx={{ color: '#fff', backgroundColor: '#323259', marginLeft: 0 }}
                    />
                  )}
                />
              </LocalizationProvider> 
            </div>
          </div>

          <div className='input-item'>
            <p className='label-name'>Quanlity in stock <span className='star'><sup>*</sup></span></p>
            <InputField
              name='quality'
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
              <FormControl sx={{ color: '#fff', backgroundColor: '#323259' }} fullWidth size='small' variant='outlined'>
                <InputLabel htmlFor="filled-adornment-amount">Money</InputLabel>
                <FilledInput
                  id="filled-adornment-amount"
                  size='small'
                  type='number'
                  // value={values.amount}
                  // onChange={handleChange('amount')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                />
              </FormControl>
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
                { id: 'autogenerate', name: 'Autogenerate' },
                { id: 'custom', name: 'Custom' }
              ]}
              style={{ color: '#fff', backgroundColor: '#323259' }}
            />
          </div>

          <div className="input-item">
            <p className='label-name'>Meta description</p>
            <SelectField
              name='metaDesc'
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
              name='metaKeywords'
              control={control}
              style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
            />
          </div>

          <div className='input-item'>
            <p className='label-name'>Product page title</p>
            <InputField
              name='productTitle'
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
        <Button variant='contained' color='warning'>
          add product
        </Button>
      </Box>
    </div>
  )
}