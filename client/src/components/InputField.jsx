import React from 'react';

const InputField = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    ...rest
}) => (
    <div className="input-field">
        {label && <label htmlFor={name}>{label}</label>}
        <input
            type={type}
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            {...rest}
        />
    </div>
);

export default InputField;