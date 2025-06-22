import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    // Resolve the label that should appear in the button
    const currentLabel =
        options.find((opt) => opt.value === value)?.label || placeholder;

    return (
        <div className="relative w-full">
            <button
                type="button"
                className="w-full text-sm text-black bg-white border border-slate-200 px-2.5 py-3 rounded-md mt-2 flex justify-between items-center"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {currentLabel}
                <LuChevronDown
                    className={`ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div className="absolute w-full bg-white border border-slate-200 rounded-md mt-1 shadow-md z-10">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100"
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SelectDropdown;
