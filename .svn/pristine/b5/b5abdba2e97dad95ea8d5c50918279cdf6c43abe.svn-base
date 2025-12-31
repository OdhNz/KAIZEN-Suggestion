import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import icon from "../../assets/logo.png";
import Main from "../Context/Main";
const DocNav = () => {
    const { setIsDocForm } = useContext(Main);
    const createDoc = () => {
        setIsDocForm(true);
    };
    return (
        <nav className="h-auto bg-white fixed flex flex-col w-full shadow-md">
            <div className="flex justify-between items-center h-[100px] mx-5 z-50">
                <ul className="">
                    <li>
                        <img src={icon} className="h-10" />
                    </li>
                </ul>
                <div className="flex flex-row items-center gap-5 bg-[#f5f5f5] text-[#757575] w-[1000px] ">
                    <form className="w-full mx-auto">
                        <label
                            htmlFor="default-search"
                            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                        >
                            Search
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="search"
                                id="default-search"
                                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                                placeholder="Search Document..."
                                required
                            />
                            <button
                                type="submit"
                                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 outline-none hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                <ul className="flex flex-row items-center">
                    <li>
                        <a href="#!">
                            <i className="material-icons grey-text text-darken-1">
                                apps
                            </i>
                        </a>
                    </li>
                    <li>
                        <a href="#!">
                            <i className="material-icons grey-text text-darken-1">
                                notifications
                            </i>
                        </a>
                    </li>
                    <li>
                        <a href="#!">
                            <img
                                src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/40532/profile/profile-80.jpg"
                                className="w-8 h-8 rounded-full"
                            />
                        </a>
                    </li>
                </ul>
            </div>

            {/* <div className="flex justify-between items-center px-5">
                <Button
                    variant="contained"
                    className="w-[75px] h-[30px] text-white"
                    onClick={() => {
                        createDoc();
                    }}
                >
                    New
                </Button>
                <ul className="right">
                    <li>
                        <a href="#!">
                            <i className="material-icons grey-text text-darken-1">
                                view_list
                            </i>
                        </a>
                    </li>
                    <li>
                        <a href="#!">
                            <i className="material-icons grey-text text-darken-1">
                                info
                            </i>
                        </a>
                    </li>
                    <li>
                        <a href="#!">
                            <i className="material-icons grey-text text-darken-1">
                                settings
                            </i>
                        </a>
                    </li>
                </ul>
            </div> */}
        </nav>
    );
};

export default DocNav;
