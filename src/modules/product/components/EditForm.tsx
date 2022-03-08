import React, { useState } from 'react'
import { numberFormat } from '../../../utils/common'

interface EditFormProps {
    value: string;
    index: number;
    setValue: (index: number, value: string) => void;
    money?: string;
}

function EditForm({ value, index, setValue, money }: EditFormProps) {
    const [isLabel, setIsLabel] = useState(true);

    const handleOnChange = (e: any) => {
        setValue(index, e.target.value);
    };

    return (
        <div>
            {isLabel ? (
                <label
                    className='label'
                    onClick={() => setIsLabel(false)}
                >
                    {money && value ? `${money}${numberFormat(+value)}` : `${money ? money : ''}${value}`}
                </label>) :
                (<div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    {money ? <button className='money-btn' disabled>{money}</button> : ''}
                    <input
                        type="text"
                        className='input'
                        name='text'
                        value={value}
                        onChange={handleOnChange}
                        onBlur={() => setIsLabel(true)}
                        autoFocus
                    />
                </div>)
            }
        </div>
    )
}

export default React.memo(EditForm);