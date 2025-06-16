import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

function Input({ value, onChange, label, placeholder, type }) {
    const [showPassword, setShowPassword] = useState(false);

    // Flip the state when the icon is clicked
    const handleToggle = () => setShowPassword((prev) => !prev);

    return (
        <>
            <div>
                <label className="">{label}</label>
            </div>

            <div className="input-box">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}      
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                />

                {type === 'password' && (
                    showPassword ? (
                        <FaRegEye
                            size={22}
                            className="text-primary cursor-pointer"
                            onClick={handleToggle}
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className="text-slate-400 cursor-pointer"
                            onClick={handleToggle}
                        />
                    )
                )}
            </div>
        </>
    );
}

export default Input;
