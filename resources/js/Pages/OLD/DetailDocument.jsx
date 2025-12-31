import { usePage } from "@inertiajs/react";
import React, { useEffect, useState, useRef } from "react";
import MainLayout from "../Layouts/MainLayout";
import DocCategory from "../Components/DocCategory";
import DocDetail from "../Components/DocDetail";
import DocListHis from "../Components/DocListHis";

const DetailDocument = () => {
    return (
        <div className="w-full h-full bg-transparent flex flex-row">
            <div className="lg:w-2/3">HAI</div>
            <div className="lg:w-1/3">HAI2</div>
        </div>
    );
};

export default DetailDocument;
