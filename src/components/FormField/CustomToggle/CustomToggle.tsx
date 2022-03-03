import React from 'react'
import './toggle.scss'

export default function CustomToggle() {
    return (
        <div className="checkbox-btn">
            <input type="checkbox" className="checkbox"/>
            <div className="toggler" data-label-checked="Yes" data-label-unchecked="No"></div>
        </div>
    )
}