import React, { useContext, useEffect, useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DevicesIcon from "@mui/icons-material/Devices";
import { usePage } from "@inertiajs/react";
import { Outlet, Link } from "react-router-dom";
import Main from "../Context/Main";

const DocSidebar = () => {
    const SideBarItems = [
        { name: "Dashboard", icon: <DashboardIcon />, link: "/" },
        { name: "Document", icon: <DevicesIcon />, link: "test" },
        {
            name: "Detail",
            icon: <DevicesIcon />,
            link: "#",
        },
    ];
    const [onUrl, setOnUrl] = useState(usePage().url);
    const { modalCreate, setModalCreate } = useContext(Main);
    useEffect(() => {
        document.title = "Document Storage";
    }, []);

    const setModal = () => {
        console.log("oke");
        setModalCreate(true);
    };
    return (
        <ul className="w-[250px] ml-3">
            <li className="px-1">
                <button
                    type="button"
                    className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={() => setModal()}
                >
                    New Document
                </button>
            </li>
            {SideBarItems.map((item, index) => {
                return (
                    <li
                        key={"sideitem" + index}
                        className={`flex items-center text-gray-500 hover:bg-[#00000011] hover:text-[#212121] my-1 h-50 px-2 py-3 ${
                            onUrl == item.link && "bg-[#00000011]"
                        }`}
                    >
                        <Link to={item.link}>
                            <i
                                className={`p-0 mr-[24px] ${
                                    onUrl == item.link && "text-[#285aff]"
                                }`}
                            >
                                {item.icon}
                            </i>
                            <span
                                className={`${
                                    onUrl == item.link && "font-bold"
                                }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};

export default DocSidebar;
