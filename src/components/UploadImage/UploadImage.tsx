import React, { useState } from 'react'
import './upload.scss'
import { Clear, PhotoCamera } from '@mui/icons-material'
import { IImage } from '../../models/product';

interface UploadImageProps {
    images?: IImage[];
}

export default function UploadImage({ images }: UploadImageProps) {
    const [selectImage, setSelectImage] = useState([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArr = Array.from(e.target.files).map(file => URL.createObjectURL(file))
            
            setSelectImage(prev => prev.concat(fileArr as any));
            
            Array.from(e.target.files).map(file => URL.createObjectURL(file))
        }
    }

    const handleRemoveImage = (index: number) => {
        selectImage.splice(index, 1);
        setSelectImage([...selectImage]);
    }

    return (
        <div className="upload-img">
            <div className="row upload-img__container">
                {
                    images ? images.map((item) => {
                        return (
                            <div className="img-item" key={item.id}>
                                <img src={item.thumbs[0]} alt="" />
                                <Clear className="cancel" />
                            </div>
                        )
                    }) : ''
                }
                {
                    selectImage.map((item, index) => {
                        return (
                            <div className="img-item" key={index}>
                                <img src={item} alt="" />
                                <Clear className="cancel" onClick={() => handleRemoveImage(index)}/>
                            </div>
                        )
                    })
                }
            </div>
            <form>
                <label htmlFor="file" className="upload-img__btn">
                    <PhotoCamera sx={{ color: '#fff', fontSize: '50px' }}/>
                    <input
                        id="file"
                        type="file"
                        multiple
                        accept=".jpg, .png, .jpeg"
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </label>
            </form>
        </div>
    )
}