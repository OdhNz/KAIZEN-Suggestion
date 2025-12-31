import React, { useContext } from "react";
import TabIcon from "@mui/icons-material/Tab";
const DocCategory = () => {
    // console.log(test);
    return (
        <div className="px-5 ">
            <p className="text-[rgba(0,0,0,0.54)] font-medium mb-3">Category</p>
            <div className="h-[175px] overflow-y-auto">
                <div className="py-[13px] px-[20px] rounded bg-white text-zinc-500 hover:bg-[#00000011] cursor-pointer shadow-[0_1px_4px_0_rgba(0,0,0,0.14)] inline-block w-[185px] my-[15px] mr-[20px] font-medium">
                    <i className="mr-2">
                        <TabIcon />
                    </i>{" "}
                    Folder
                </div>
            </div>
        </div>
    );
};

export default DocCategory;
