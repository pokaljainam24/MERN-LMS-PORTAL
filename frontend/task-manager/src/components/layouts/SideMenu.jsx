import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContex";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import getAvatarSrc from "../../utils/getAvatarSrc";
import placeholderImg from "../../../public/my.jpg"; 

const SideMenu = ({ activeMenu }) => {
    const { user, clearUser } = useContext(UserContext);
    const [sideMenuData, setSideMenuData] = useState([]);
    const navigate = useNavigate();

    // avatar source (absolute or fallback)
    const avatarSrc = getAvatarSrc(user);

    const handleClick = (route) => {
        if (route === "logout") {
            localStorage.clear();
            clearUser();
            navigate("/login");
        } else {
            navigate(route);
        }
    };

    useEffect(() => {
        if (user) {
            setSideMenuData(user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA);
        }
    }, [user]);

    return (
        <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200 sticky top-[61px] z-20">
            {/* -------- profile block -------- */}
            <div className="flex flex-col items-center justify-center mb-7 pt-5">
                <img
                    src={avatarSrc}
                    alt="Profile"
                    className="w-20 h-20 rounded-full border-2 border-white object-cover"
                    onError={(e) => { e.currentTarget.src = placeholderImg }}
                />

                {user?.role === "admin" && (
                    <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
                        Admin
                    </div>
                )}

                <h5 className="text-gray-950 font-medium leading-6 mt-3">
                    {user?.name || ""}
                </h5>
                
                <p className="text-[12px] text-gray-500">
                    {user?.email || ""}
                </p>
            </div>

            {/* -------- menu items -------- */}
            {sideMenuData.map(({ label, path, icon: Icon }, idx) => (
                <button
                    key={idx}
                    className={`w-full flex items-center gap-4 text-[15px] ${activeMenu === label
                        ? "text-primary bg-gradient-to-r from-blue-50/40 to-blue-100/50 border-r-[3px] "
                        : ""
                        } py-3 px-6 mb-3 cursor-pointer`}
                    onClick={() => handleClick(path)}
                >
                    <Icon className="text-xl" />
                    {label}
                </button>
            ))}
        </div>
    );
};

export default SideMenu;
