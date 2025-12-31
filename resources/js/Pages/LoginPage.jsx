import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useStore from "../State/useStore";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Skeleton, Spin } from "antd";
// import { Spinner } from "flowbite-react";

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, login, path, pathFile } = useStore();
    const [loading, setLoading] = useState(false);
    const now = Math.floor(new Date().getTime() / 1000);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (loading) return false;
        setLoading(true);
        const formData = new FormData();
        formData.append("_method", "post");
        for (let key in data) {
            formData.append(key, data[key]);
        }
        try {
            const response = await axios.post(`api/login`, formData);
            if (response.data.status !== 200) {
                toast.error(
                    "The data is incorrect, please log in again with the correct data."
                );
                return false;
            }
            await login(response.data);
            toast.success("Login Success!");
            return navigate(`${path}/`);
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };
    const onLoginAuth = async (formdata) => {
        setLoading(true);
        const response = await axios.post("api/login", formdata);
        setLoading(false);
        if (response.data.status !== 200) {
            toast.error(
                "The data is incorrect, please log in again with the correct data."
            );
            return false;
        }
        await login(response.data);
        toast.success("Login Success!");
        return navigate(`${path}/`);
    };
    const onEnded = (res) => {
        console.log(res);
    };
    useEffect(() => {
        const url = new URL(window.location.href);
        const username = url.searchParams.get("empid");
        const password = url.searchParams.get("pass");
        if (username != null && password != null) {
            const formData = new FormData();
            formData.append("_method", "post");
            formData.append("empid", username);
            formData.append("auth", password);
            onLoginAuth(formData);
        }
        if (user?.exp > now) {
            return navigate(`${path}/`);
        }
    }, []);

    return (
        <>
            <section
                className={`h-screen m-auto relative bg-zinc-50 bg-cover bg-center bg-no-repeat`}
            >
                <div className="flex flex-col items-center justify-center h-screen px-6 py-8 mx-auto lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-center font-extrabold text-zinc-700 text-4xl">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                                    {" "}
                                    KAIZEN{" "}
                                </span>
                                Suggestion
                            </h1>
                            <form
                                className="space-y-4 md:space-y-6"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div>
                                    <label
                                        htmlFor="empid"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        name="empid"
                                        id="empid"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Emp ID"
                                        required
                                        {...register("empid")}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="••••••••"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        required
                                        {...register("password")}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-green-600 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    {loading ? (
                                        <>
                                            {/* <Spin
                                                size="medium"
                                                style={{
                                                    fontSize: 24,
                                                    color: "red",
                                                }}
                                            />
                                            <span className="pl-3">
                                                Loading...
                                            </span> */}
                                            <Skeleton.Button
                                                active={true}
                                                block={true}
                                            />
                                        </>
                                    ) : (
                                        "Sign in"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default LoginPage;
