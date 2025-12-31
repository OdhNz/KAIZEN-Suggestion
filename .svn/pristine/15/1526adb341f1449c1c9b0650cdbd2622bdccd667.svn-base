import React, { useContext } from "react";
import TabIcon from "@mui/icons-material/Tab";
import { HiX } from "react-icons/hi";
import { Button } from "flowbite-react";
const DocDetail = () => {
    const test = useContext(Main);
    // console.log(test);
    return (
        <section className="text-gray-700 body-font overflow-hidden">
            <div className="container px-5 py-10 mx-auto">
                <div className="w-full mx-auto flex flex-wrap text-lg">
                    <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                        <h2 className="text-lg title-font text-red-600 tracking-widest">
                            V 12.0
                        </h2>
                        <h1 className="text-gray-900 text-5xl title-font font-medium mb-6">
                            The Catcher in the Rye
                        </h1>
                        <div className="flex mb-4">
                            <span className="flex items-center">
                                <span className="text-gray-600 ml-3">Area</span>
                                <span className="text-gray-600 ml-3">
                                    Categori
                                </span>
                                <span className="text-gray-600 ml-3">
                                    Level
                                </span>
                            </span>
                        </div>
                        <p className="leading-relaxed mb-1 font-medium">
                            Remark
                        </p>
                        <p className="leading-relaxed mb-3">
                            Remark dasda fdsf sd asd asd a asdasds fsd
                        </p>

                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col">
                                <p className="leading-relaxed mb-3 font-medium">
                                    Tags
                                </p>
                                <div>
                                    <Button
                                        key={`tags`}
                                        size="xs"
                                        color="warning"
                                        onClick={() => {
                                            // removeTags(index);
                                        }}
                                    >
                                        TAG
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="leading-relaxed mb-3 font-medium">
                                    Assign
                                </p>
                                <div>
                                    <Button
                                        key={`tags`}
                                        size="xs"
                                        color="warning"
                                        onClick={() => {
                                            // removeTags(index);
                                        }}
                                    >
                                        EMPID
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5"></div>
                        <div className="flex justify-between">
                            <span className="title-font font-medium text-2xl text-gray-900"></span>
                            <div className="flex flex-row gap-5">
                                <Button
                                    size="md"
                                    onClick={() => {
                                        // removeTags(index);
                                    }}
                                >
                                    Download
                                </Button>
                                <Button
                                    size="md"
                                    color="failure"
                                    onClick={() => {
                                        // removeTags(index);
                                    }}
                                >
                                    Send Email
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DocDetail;
