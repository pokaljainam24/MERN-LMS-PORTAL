import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList = [], setTodoList }) => {
    const [option, setOption] = useState("");

    const handleAddOption = () => {
        const value = option.trim();
        if (!value) return;          
        setTodoList([...todoList, value]);
        setOption("");               
    };

    const handleDeleteOption = (index) => {
        setTodoList(todoList.filter((_, i) => i !== index));
    };

    return (
        <div>
            {todoList.map((item, index) => (
                <div
                    key={index}                            
                    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
                >
                    <p className="text-xs text-black">
                        <span className="text-xs text-gray-400 font-semibold mr-2">
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>

                    <button
                        className="cursor-pointer"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}

            <div className="flex items-center gap-5 mt-4">
                <input
                    type="text"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                    placeholder="Add new todo"
                    className="w-full text-xs text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
                />

                <button className="card-btn text-nowrap" onClick={handleAddOption}>
                    <HiMiniPlus className="text-lg" /> Add
                </button>
            </div>
        </div>
    );
};

export default TodoListInput;
