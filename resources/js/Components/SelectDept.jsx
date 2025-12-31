import React, { useEffect } from "react";
import { useState } from "react";

const SelectDept = (props) => {
    const { data, defData = false, changed, parent } = props;

    const [selectData, setSelectData] = useState([...data]);
    const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        let findDt = { ...data.find((res) => defData === res.id) };
        setSelectedItem(Object.keys(findDt).length > 0 ? defData : "");
        setSelectData([...data]);
    }, [data, defData]);

    const setValue = (event) => {
        let item = event.target.value;
        changed(item);
    };
    return (
        <>
            {selectData && (
                <select
                    value={selectedItem}
                    className="select select-bordered text-lg font-bold  min-h-fit h-full lg:max-w-96 w-full text-neutral bg-secondary"
                    onChange={setValue}
                >
                    {selectData.map((res, index) => {
                        return (
                            <option
                                disabled={index === 0 ? true : false}
                                key={index}
                                value={res.id}
                            >
                                {res.text}
                            </option>
                        );
                    })}
                </select>
            )}
        </>
    );
};

export default SelectDept;
