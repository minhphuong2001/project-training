import React, { ChangeEvent, useState } from 'react'
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
    Button,
    Select,
    MenuItem,
    SelectChangeEvent,
    OutlinedInput
} from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';
import AdapterMomentFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import '../components/product.scss'
import { SelectField } from '../../../components/FormField/SelectField';
import UploadImage from '../../../components/UploadImage/UploadImage';
import CustomToggle from '../../../components/FormField/CustomToggle/CustomToggle';
import { IProductDetail } from '../../../models/product';
import { numberFormat } from '../../../utils/common';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';

export interface ProductDetailProps {
    product: IProductDetail;
    brand: any;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
  },
};

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
        personName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
    };
}

export default function ProductDetail({ product, brand }: ProductDetailProps) {
    const { control } = useForm({
        defaultValues: {
            vendors: '',
            productTitle: ''
        },
        mode: 'all'
    });
    const [date, setDate] = useState<Date | null>(null);
    const theme = useTheme();
    const { categories } = useSelector((state: AppState) => state.category);
    const { shippings } = useSelector((state: AppState) => state.shipping);
    const [categoryData, setCategoryData] = React.useState<string[]>([]);
    const [showSaleCheckbox, setShowSaleCheckbox] = useState(false);

    const handleChange = (event: SelectChangeEvent<typeof categoryData>) => {
        const {
            target: { value },
        } = event;
        setCategoryData(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeSaleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked === true) {
            setShowSaleCheckbox(true);
        } else {
            setShowSaleCheckbox(false);
        }
    }

    return (
        <div>
            <Box>
                
                <Typography my={2} variant='h4' sx={{ color: '#fff' }} >
                    {product?.name}
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
                            value={product?.vendor_id}
                            control={control}
                            style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                        />
                    </div>

                    <div className='input-item'>
                        <p className='label-name'>Product Title <span className='star'><sup>*</sup></span></p>
                        <InputField
                            name='productTitle'
                            value={product?.name}
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
                            options={brand}
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
                            value={product?.sku}
                            control={control}
                            style={{color: '#fff', backgroundColor: '#323259', flex: 1 }}
                        />
                    </div>
                    {/* images */}
                    <div className="input-item">
                        <p className='label-name'>Image <span className='star'><sup>*</sup></span></p>
                        <UploadImage images={product?.images} />
                    </div>
                
                    <div className='input-item'>
                        <p className='label-name'>Category <span className='star'><sup>*</sup></span></p>
                        <FormControl fullWidth size='small' sx={{ margin: '10px 0'}}>
                            <InputLabel id="demo-multiple-name-label">Category</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={categoryData}
                                onChange={handleChange}
                                MenuProps={MenuProps}
                                input={<OutlinedInput label="Category" />}
                                style={{ color: '#fff', backgroundColor: '#323259'  }}
                            >
                                {categories.map((item) => (
                                    <MenuItem
                                        key={item.id}
                                        value={item.name}
                                        style={getStyles(item.name, categoryData, theme)}
                                    >
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                    <div className="input-item">
                        <p className='label-name'>Description <span className='star'><sup>*</sup></span></p>
                        <p dangerouslySetInnerHTML={{__html: product?.description}}></p>
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
                        name='member'
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
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="Tax Exempt" sx={{ color: '#fff' }} />
                        </FormGroup>
                    </Box>
                </div>  

                <div className='input-item'>
                    <p className='label-name'>Price <span className='star'><sup>*</sup></span></p>
                    <Box sx={{ flex: 1, display: 'flex', marginLeft: '-60px'}}>
                        <FormControl sx={{ width: '150px', color: '#fff', backgroundColor: '#323259', marginRight: '20px' }} size='small' variant='outlined'>
                            <FilledInput
                                id="filled-adornment-amount"
                                size='small'
                                type='number'
                                value={numberFormat(product?.price)}
                                startAdornment={<InputAdornment position='end'>$</InputAdornment>}
                            />
                        </FormControl>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox onChange={handleChangeSaleCheckbox} />}
                                label="Sale"
                                sx={{ color: '#fff' }}
                            />
                        </FormGroup>
                    </Box>
                    {
                        showSaleCheckbox ? <FormControl sx={{ width: '150px', color: '#fff', backgroundColor: '#323259' }} size='small' variant='outlined'>
                            <FilledInput
                                id="filled-adornment-amount"
                                size='small'
                                type='number'
                                value={0}
                                startAdornment={<InputAdornment position='end'>$</InputAdornment>}
                            />
                        </FormControl> : null
                    } 
                </div>

                <div style={{ marginTop: '20px'}}>
                    <div className="input-item" >
                    <p className='label-name'>Arrival date</p>
                    <LocalizationProvider dateAdapter={AdapterMomentFns}>
                        <DatePicker
                            label='Date'
                            value={date}
                            onChange={(newValue: any) => setDate(newValue)}
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
                        value={product?.quantity}
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
                    {
                        product?.shipping.map((item) => (
                            <div className='input-item' key={item.id}>
                                <p className='label-name'>{item.zone_name} <span className='star'><sup>*</sup></span></p>
                                <FormControl sx={{ color: '#fff', backgroundColor: '#323259' }} fullWidth size='small' variant='outlined'>
                                    <InputLabel htmlFor="filled-adornment-amount">Money</InputLabel>
                                    <FilledInput
                                        id="filled-adornment-amount"
                                        size='small'
                                        type='number'
                                        value={numberFormat(item.price)}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    />
                                </FormControl>
                            </div>
                        ))
                    }
                    
                    <div className="input-item">
                        <p className='label-name'>Add Shipping Location</p>
                        <SelectField
                            name='zone'
                            label='Select new zone'
                            control={control}
                            options={shippings}
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
                    update product
                </Button>
            </Box>
        </div>
    )
}