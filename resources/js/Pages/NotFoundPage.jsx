import { usePage } from "@inertiajs/react";
import React, { useEffect, useState, useRef } from "react";
import err from "../../assets/error-404.png";
import cat1 from "../../assets/cat1.jpg";
import cat2 from "../../assets/cat2.jpg";
import useStore from "../State/useStore";
import { Card } from "antd";

const NotFoundPage = () => {
    const { pathFile } = useStore();
    return (
        <Card className="m-5">
            <div className="flex flex-row">
                <main class="grid w-1/2 min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
                    <div class="text-center">
                        <p class="text-6xl font-semibold text-emerald-600">
                            404
                        </p>
                        <h1 class="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
                            Page not found
                        </h1>
                        <p class="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                            Sorry, we couldn’t find the page you’re looking for.
                        </p>
                    </div>
                </main>
                <div className="flex flex-col items-center w-1/2">
                    <div className="w-full h-32">
                        <img
                            src={`${pathFile}${cat1}`}
                            className="w-full h-32 object-cover"
                        />
                    </div>
                    <div className="w-full h-[550px]">
                        <img
                            src={`${pathFile}${err}`}
                            className="w-full h-[500px] object-contain"
                        />
                    </div>
                    <div className="w-full h-32">
                        <img
                            src={`${pathFile}${cat2}`}
                            className="w-full h-32 object-cover"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default NotFoundPage;
