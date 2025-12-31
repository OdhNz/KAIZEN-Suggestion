import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoute";
import NotFoundPage from "../Pages/NotFoundPage";
import { ToastContainer } from "react-toastify";
import useStore from "../State/useStore";
import KaizenCategory from "../Pages/UserKaizen/KaizenCategory";
import KaizenForm from "../Pages/UserKaizen/KaizenForm";
import KaizenList from "../Pages/AdminKaizen/KaizenList";
import KaizenAdminLayout from "../Layouts/KaizenAdminLayout";
import LoginPage from "../Pages/LoginPage";
import MasterDataCategory from "../Pages/MasterData/MasterDataCategory";
import Dashboard from "../Pages/Dashboard";

export default function RouterPages() {
    const { path } = useStore();
    const routes = [
        {
            path: `${path}/`,
            element: <KaizenAdminLayout />,
            children: [
                {
                    element: <KaizenCategory />,
                    protect: false,
                    roles: [],
                },
                {
                    path: "kaizen/:id",
                    element: <KaizenForm />,
                    protect: false,
                    roles: [],
                },
                {
                    path: "list-kaizen",
                    element: <KaizenList />,
                    protect: true,
                    roles: ["sys", "admin"],
                },
                {
                    path: "master-category",
                    element: <MasterDataCategory />,
                    protect: true,
                    roles: ["sys", "admin"],
                },
                {
                    path: "dashboard",
                    element: <Dashboard />,
                    protect: true,
                    roles: ["sys", "admin"],
                },
                {
                    path: `*`,
                    element: <NotFoundPage />,
                },
            ],
        },
        {
            path: `${path}/login`,
            element: <LoginPage />,
            protect: false,
            roles: [],
        },
    ];
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                {routes.map((route) => (
                    <Route
                        key="{route.path}"
                        path={route.path}
                        element={route.element}
                    >
                        (
                        {route.children?.map((child, index) =>
                            child.path ? (
                                <Route
                                    key={"childroute" + child.path}
                                    path={child.path}
                                    element={
                                        child.protect ? (
                                            <ProtectedRoute
                                                roles={child?.roles}
                                            >
                                                {child.element}
                                            </ProtectedRoute>
                                        ) : (
                                            child.element
                                        )
                                    }
                                />
                            ) : (
                                <Route
                                    key={"childroute" + index}
                                    index
                                    element={
                                        child.protect ? (
                                            <ProtectedRoute
                                                roles={child?.roles}
                                            >
                                                {child.element}
                                            </ProtectedRoute>
                                        ) : (
                                            child.element
                                        )
                                    }
                                />
                            )
                        )}
                        )
                    </Route>
                ))}
            </Routes>
        </BrowserRouter>
    );
}
