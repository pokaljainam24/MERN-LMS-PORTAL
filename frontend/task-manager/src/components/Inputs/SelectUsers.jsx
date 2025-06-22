import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { LuUsers } from "react-icons/lu";
import Model from "./../Model";
import AvtarGroup from "../AvtarGroup";

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    // Fetch all users once, right after mount
    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
                if (Array.isArray(res.data)) {
                    setAllUsers(res.data);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        getAllUsers();
    }, []);  // <— empty dependency array = run only once

    // Reset the temp list whenever *selectedUsers* changes
    useEffect(() => {
        setTempSelectedUsers(selectedUsers);
    }, [selectedUsers]);

    const toggleUserSelection = (userId) =>
        setTempSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );

    const handleAssign = () => {
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    const selectedUserAvatars = allUsers
        .filter((u) => selectedUsers.includes(u._id))
        .map((u) => u.profileImageUrl);

    return (
        <div className="space-y-4 mt-2">
            {selectedUserAvatars.length === 0 && (
                <button className="card-btn" onClick={() => setIsModalOpen(true)}>
                    <LuUsers className="text-sm" /> Add Members
                </button>
            )}

            {selectedUserAvatars.length > 0 && (
                <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    <AvtarGroup avatars={selectedUsers} mxVisible={3} />
                </div>
            )}

            <Model isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Select Users">
                <div className="space-y-4 h-[60vh] overflow-y-auto">
                    {allUsers.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 border-b border-gray-200"
                        >
                            <img
                                src={user.profileImageUrl || "/default-avatar.png"}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover object-center"
                            />

                            <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                                <p className="text-[13px] text-gray-500">{user.email}</p>
                            </div>

                            <input
                                type="checkbox"
                                checked={tempSelectedUsers.includes(user._id)}
                                onChange={() => toggleUserSelection(user._id)}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"
                            />
                        </div>
                    ))}
                </div>

                {/* Assign button so the user can confirm */}
                <div className="flex justify-end gap-4 pt-4">
                    <button className="card-btn" onClick={() => setIsModalOpen(false)}>
                        CANCEL
                    </button>
                    <button className="card-btn-fill" onClick={handleAssign}>
                        DONE
                    </button>
                </div>
            </Model>
        </div>
    );
};

export default SelectUsers;
