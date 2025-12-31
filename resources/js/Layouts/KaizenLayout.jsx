import * as React from "react";
import iconTKG from "../../assets/logo.png";
import popupLoad from "../../assets/TKG.png";
import { Outlet, Link, useNavigate } from "react-router-dom";
// import {
//     Sidebar,
//     Navbar,
//     SidebarCollapse,
//     SidebarItem,
//     SidebarItems,
//     SidebarItemGroup,
//     Card,
// } from "flowbite-react";
import {
    HiCalendar,
    HiChartPie,
    HiDatabase,
    HiMailOpen,
    HiOfficeBuilding,
    HiPencilAlt,
    HiQuestionMarkCircle,
} from "react-icons/hi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useStore from "../State/useStore";
import { useEffect } from "react";
import icon from "../../assets/icon.png";
import { Head } from "@inertiajs/react";
import UseModal from "../Components/UseModal";

import {
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { calc } from "antd/es/theme/internal";
const { Header, Content, Footer, Sider } = Layout;
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
    (icon, index) => {
        const key = String(index + 1);
        return {
            key: `sub${key}`,
            icon: React.createElement(icon),
            label: `subnav ${key}`,
            children: Array.from({ length: 4 }).map((_, j) => {
                const subKey = index * 4 + j + 1;
                return {
                    key: subKey,
                    label: `option${subKey}`,
                };
            }),
        };
    }
);
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export default function KaizenLayout(props) {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { path, pathFile, user, logout, firstLoad, toggleLoad } = useStore();
    const urlPathNm = window.location.pathname.substring(pathFile ? 0 : 1);
    document.title = "Utility Reservation";
    const listMenu = [
        {
            path: `${path}/`,
            icon: HiChartPie,
            name: "Dashboard",
            roles: ["admin", "sys"],
        },
        {
            path: `user-reservation`,
            icon: HiPencilAlt,
            name: "User Reservation",
            roles: ["user", "admin", "sys", "exp"],
        },
        {
            path: `admin-reservation`,
            icon: HiMailOpen,
            name: "Admin Reservation",
            roles: ["admin", "sys"],
        },
        {
            path: `list-reservation-dom`,
            icon: HiOfficeBuilding,
            name: "Reservation Dom",
            roles: ["admin", "sys", "exp"],
        },
        {
            path: `calendar-event`,
            icon: HiCalendar,
            name: "Calendar Progress",
            roles: ["admin", "sys"],
        },
        {
            path: `/`,
            icon: HiDatabase,
            name: "Setting",
            roles: ["admin", "sys"],
            children: [
                {
                    path: "master-repairment",
                    name: "Repair Type",
                },
                {
                    path: "master-location",
                    name: "Location",
                },
            ],
        },
    ];
    const onLogout = () => {
        logout();
        return navigate(`${path}/login`, { replace: true });
    };

    useEffect(() => {
        console.log(urlPathNm.replace(path, ""));
    }, [urlPathNm]);

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
                    <Header className="flex items-center justify-between px-2 bg-white md:px-6 ">
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
                            <Link
                                onClick={onLogout}
                                className="hidden text-red-700 font-medium md:block "
                            >
                                {" "}
                                Log Out...
                            </Link>
                        </div>
                        {/* <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={["2"]}
                            items={items1}
                            style={{ flex: 1, minWidth: 0 }}
                        /> */}
                    </Header>
                    <Layout className="h-[calc(100vh-64px)]">
                        {/* <Sider
                            width={250}
                            className="hidden h-full md:block"
                            style={{
                                background: colorBgContainer,
                            }}
                        >
                            <div className="flex flex-col h-[250px] justify-center p-6 bg-emerald-950">
                                <img
                                    src={`https://gw.taekwang.com/images/ProfilePhoto/${user?.empid}.jpg`}
                                    className="rounded-full m-auto h-24 w-24"
                                />
                                <span className="text-sm text-neutral-300">
                                    {user?.name} ({user?.role})
                                </span>
                                <span className="text-sm text-neutral-300">
                                    {user?.position_nm}
                                </span>
                            </div>
                            <div className="h-[calc(100%-250px)] overflow-auto">
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={["1"]}
                                    defaultOpenKeys={["sub1"]}
                                    style={{ borderRight: 0 }}
                                    items={items2}
                                />
                            </div>
                        </Sider> */}
                        <Layout className="md:p-5">
                            <Content
                                style={{
                                    padding: 24,
                                    margin: 0,
                                    minHeight: 280,
                                    background: colorBgContainer,
                                    borderRadius: borderRadiusLG,
                                }}
                            >
                                <Outlet />
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </QueryClientProvider>
        </>
    );
}
