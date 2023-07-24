import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import React, { useState } from 'react';

const CustomInput = ({ type, value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <div className="dis-cus-input mb-20">
            <input
                className="input-login"
                type={type === 'password' && !showPassword ? 'password' : 'text'}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {/* {type === 'password' && (
                <IconButton
                    style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}
                    onClick={handleTogglePasswordVisibility}
                >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
            )} */}
        </div>
    );
};

export default CustomInput;
