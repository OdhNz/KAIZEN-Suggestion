import * as React from "react";
import iconTKG from "../../assets/logo.png";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { HiQuestionMarkCircle } from "react-icons/hi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useStore from "../State/useStore";
import { useEffect } from "react";
import icon from "../../assets/icon.png";
import { Head } from "@inertiajs/react";
import { Layout, Menu, theme } from "antd";
import bgSvg from "../../assets/bgSvg.svg";
import { toast } from "react-toastify";

import { FaChartPie, FaFolderPlus, FaFileAlt, FaDatabase, FaTags } from "react-icons/fa";


const { Header, Content, Footer, Sider } = Layout;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export default function KaizenAdminLayout(props) {
    const { path, pathFile, user, logout, errorStatusText } = useStore();
    const urlPathNm = window.location.pathname.substring(pathFile ? 0 : 1);
    const navigate = useNavigate();
    document.title = "TT Kaizen";
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const listMenu = [
        {
          key: "dashboard",
          icon: <FaChartPie size={28} color="#16a34a" />,
          label: <span className="menu-label">Dashboard</span>,
          roles: ["admin", "sys"],
        },
        {
          key: "",
          icon: <FaFolderPlus size={28} color="#2563eb" />,
          label: <span className="menu-label">Kaizen Regist</span>,
          roles: ["user", "admin", "sys", "exp"],
        },
        {
          key: "list-kaizen",
          icon: <FaFileAlt size={28} color="#f59e0b" />,
          label: <span className="menu-label">Kaizen Report</span>,
          roles: ["admin", "sys"],
        },
        {
          key: "#",
          icon: <FaDatabase size={28} color="#dc2626" />,
          label: <span className="menu-label">Setting</span>,
          roles: ["admin", "sys"],
          children: [
            {
              key: "master-category",
              label: <span className="menu-label">Kaizen Category</span>,
              icon: <FaTags size={22} color="#10b981" />,
            },
          ],
        },
      ];      
      const listPhoneMenu = [
        {
          key: "dashboard",
          icon: <FaChartPie size={32} color="#16a34a" />,
          label: "Kaizen",
          roles: ["admin", "sys"],
        },
        {
          key: "",
          icon: <FaFolderPlus size={32} color="#2563eb" />,
          label: "List",
          roles: [],
        },
        {
          key: "list-kaizen",
          icon: <FaFileAlt size={32} color="#f59e0b" />,
          label: "Admin",
          roles: ["admin", "sys"],
        },
      ];      

    const checkMenu = (res) => {
        const menu = res.filter((item) => item.roles.includes(user?.role));
        return menu;
    };
    const onLogout = () => {
        logout();
        // return navigate(`${path}/login`, { replace: true });
    };
    const onClickMenu = (res) => {
        return navigate(path + "/" + res.key, { replace: true });
    };
    useEffect(() => {
        errorStatusText && toast.error(errorStatusText);
    }, [errorStatusText]);
    return (
        <>
            <Head>
                <link
                    rel="icon"
                    type="image/svg+xml"
                    href={`${pathFile}${icon}`}
                />
            </Head>
            {/* <UseModal
                modalStatus={firstLoad}
                toggleModal={() => toggleLoad(firstLoad)}
                modalName={"Announcement!📢"}
                size={"6xl"}
            >
                <img
                    src={`${pathFile}${popupLoad}`}
                    className="w-full select-none"
                />
            </UseModal> */}
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Header className="flex items-center justify-between px-2 bg-white md:px-6">
                        <div>
                            <img
                                src={`${pathFile}${iconTKG}`}
                                className="mr-3 h-6 sm:h-9"
                            />
                        </div>
                        <div className="flex items-center justify-around gap-3">
                            <Link className="text-2xl">
                                <HiQuestionMarkCircle />
                            </Link>
                            {user ? (
                                <Link
                                    to={`${path}/login`}
                                    onClick={onLogout}
                                    className="hidden text-base text-red-700 font-bold md:block "
                                >
                                    {" "}
                                    Log Out...
                                </Link>
                            ) : (
                                <Link
                                    to={`${path}/login`}
                                    className="hidden text-base text-blue-800 font-bold md:block "
                                >
                                    {" "}
                                    Log In
                                </Link>
                            )}
                        </div>
                    </Header>

                    <Layout className="relative min-h-[calc(100vh-64px)]">
                        {!user ? null : (
                            <Sider
                                width={250}
                                className="hidden min-h-[calc(100vh-64px)] lg:block"
                                style={{
                                    background: colorBgContainer,
                                }}
                            >
                             <div className="flex flex-col h-[250px] justify-center items-center p-6 
                                             bg-gradient-to-r from-emerald-600 to-teal-500 
                                             rounded-lg shadow-lg">
                               <div className="relative">
                                 <img
                                 src={`${import.meta.env.VITE_API_URL}/profile-photo/${user?.empid}`}
                                   //onError={(e) => { e.target.src = "/cat1.jpg"; }}
                                   className="rounded-full h-28 w-28 border-4 border-white shadow-lg 
                                              hover:scale-105 transition-transform duration-300
                                              ring-4 ring-emerald-400/50"
                                   alt="Profile"
                                 />
                                 <span className="absolute bottom-0 right-0 flex h-4 w-4">
                                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full 
                                                    bg-gradient-to-r from-emerald-400 to-teal-400 opacity-75"></span>
                                   <span className="relative inline-flex rounded-full h-4 w-4 
                                                    bg-emerald-400 border-2 border-white"></span>
                                 </span>
                               </div>
                                                         
                               <span className="mt-4 text-lg font-semibold text-white tracking-wide">
                                 {user?.name} <span className="text-teal-200">({user?.role})</span>
                               </span>
                               <span className="text-sm text-white/80 italic">
                                 {user?.position_nm}
                               </span>
                             </div>
                                <div className="h-[calc(100%-250px)] overflow-auto">
                                    <Menu
                                        mode="inline"
                                        defaultSelectedKeys={["1"]}
                                        defaultOpenKeys={["sub1"]}
                                        style={{
                                            borderRight: 0,
                                            fontSize: "15px",
                                            // fontWeight: 500,
                                        }}
                                        onClick={(res) => onClickMenu(res)}
                                        items={checkMenu(listMenu)}
                                    />
                                </div>
                            </Sider>
                        )}
                        <Layout
                            style={{
                                backgroundImage: `url(${path}${bgSvg})`,
                                backgroundRepeat: "no-repeat",
                                backgroundColor: "white",
                            }}
                            className="flex flex-col justify-between w-full h-[calc(100vh-64px)] overflow-auto bg-auto md:bg-cover bg-right-top"
                        >
                            <Layout className="h-full bg-transparent mb-10">
                                <Content
                                    style={{
                                        padding: 24,
                                        margin: 0,
                                        minHeight: 280,
                                        // background: colorBgContainer,
                                        borderRadius: borderRadiusLG,
                                    }}
                                >
                                    <Outlet />
                                </Content>
                            </Layout>
                            {!user ? null : (
                                <Layout className="fixed bottom-0 left-0 z-50 block w-full h-16 lg:p-5 lg:hidden">
                                    <div className="w-full overflow-auto h-16 bg-white border-t border-gray-200">
                                        <div className="grid h-full grid-cols-3 mx-auto w-full">
                                            {listPhoneMenu.map((res, index) => {
                                                return (
                                                    <button
                                                        key={
                                                            "bottomnav" + index
                                                        }
                                                        type="button"
                                                        className="inline-flex flex-col items-center justify-center font-medium px-5 py-1 gap-1 hover:bg-gray-59 group"
                                                        onClick={() =>
                                                            onClickMenu(res)
                                                        }
                                                    >
                                                        <span className="text-2xl items-center text-gray-500 group-hover:text-gray-600">
                                                            {res.icon}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Layout>
                            )}
                        </Layout>
                    </Layout>
                </Layout>
            </QueryClientProvider>
        </>
    );
}
