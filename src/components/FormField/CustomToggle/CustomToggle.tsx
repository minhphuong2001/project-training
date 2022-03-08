import React from 'react'
import './toggle.scss'

export default function CustomToggle({ value }: any) {
    return (
        <div className="checkbox-btn">
            <input value={value} type="checkbox" className="checkbox"/>
            <div className="toggler" data-label-checked="Yes" data-label-unchecked="No"></div>
        </div>
    )
}