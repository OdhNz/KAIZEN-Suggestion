import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SelectDept from "../Components/SelectDept";
import SearchTable from "../Components/SearchTable";
import Loading from "../Components/Loading";
import Notfound from "../Components/Notfound";
import { usePage } from "@inertiajs/react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import MainLayout from "../Layouts/MainLayout";
const parentDef = { text: "DEPT", id: "" };
const plantDef = { text: "PLANT", id: "" };
const lineDef = { text: "LINE", id: "" };
const procDef = { text: "SKILLS", id: "" };
const valueDepf = { text: "GRADE", id: "" };
const YearDef = { text: "YEAR", id: "" };
const defQuarter = { text: "QUARTER", id: "" };
const defSkillLvl = { text: "SKILL LEVEL", id: "" };
const skillValue = [
    { text: "GRADE", id: "" },
    { text: "", id: "" },
    { text: "100%", id: "100" },
    { text: "75%", id: "075" },
    { text: "50%", id: "050" },
    { text: "25%", id: "025" },
];
const DasHeaders = [
    "DEPT",
    "PLANT",
    "PROCESS",
    "EMP NO",
    "NAME",
    "POSITION",
    "SKILL",
    "SKILL LEVEL",
    "SCORE",
    "TIER LEVEL",
];
const quarterData = [
    { text: "QUARTER", id: "" },
    { text: "", id: "" },
    { text: "1", id: "A" },
    { text: "2", id: "B" },
    { text: "3", id: "C" },
    { text: "4", id: "D" },
];

const tierMSkill = [
    { id: "", text: "TIER LEVEL" },
    { id: "", text: "" },
    { id: "1", text: "Level 1" },
    { id: "2", text: "Level 2" },
    { id: "3", text: "Level 3" },
    { id: "4", text: "Star 1" },
    { id: "5", text: "Star 2" },
    { id: "6", text: "Star 3" },
];
const Search = () => {
    const {
        plant: propsPlant,
        dept: propsDept,
        level: propsLevel,
        parent: propsParent,
        year: propsYear,
        round: propsRound,
        skill: propsSkill,
        process: propsProcess,
        score: propsScore,
        search: propsSearch = false,
        dataskill,
        scPlant,
        scParent,
        scProcess,
        scLevel,
    } = usePage().props;
    const [plants, setPlant] = useState([]);
    const [line, setLine] = useState([]);
    const [parentDept, setParentDept] = useState([]);
    const [proc, setProc] = useState([]);
    const [skillLvl, setSkillLvl] = useState([]);
    const [init, setInit] = useState(true);
    const [selectYear, setSelectYear] = useState([]);
    const [selectValue, setSelectValue] = useState({
        dept: "",
        line: "",
        part: "",
        proc: "",
        value: "",
        year: "",
        qrt: "",
        skill: "",
        parentDept: "",
        skillLvl: "",
        tier: "",
    });
    const [skill, setSkill] = useState([]);
    const [multiskillEmp, setMultiskillEmp] = useState([]);
    const [onLoad, setOnLoad] = useState(false);
    const [count, setCount] = useState(0);
    const [ref, setRef] = useState(undefined);

    const controller = new AbortController();
    const getPlant = async () => {
        setPlant([{ ...plantDef }, { id: "", text: "" }]);
        selectValue.dept = scPlant[0].id;
        setPlant((res) => [...res, ...scPlant]);
    };
    const getLine = async () => {
        setLine([{ ...lineDef }, { id: "", text: "" }]);
        selectValue.line = scProcess[0].id;
        setLine((res) => [...res, ...scProcess]);
    };
    const getProc = async (item) => {
        setSelectValue((res) => ({ ...res, skill: item }));
        setProc([{ ...procDef }, { id: "", text: "" }]);
        const data = await axios.get(`api/proc`, {
            params: {
                line: item,
            },
        });
        if (data.status == 200) {
            selectValue.proc = data.data[0].id;
            setProc((res) => [...res, ...data.data]);
            return data.data;
        }
    };
    const getYear = async () => {
        setSelectYear([{ ...YearDef }, { id: "", text: "" }]);
        const data = await axios.get(`api/getyear`);
        if (data.status == 200) {
            selectValue.year = data.data[0].id;
            !init && setSelectYear((res) => [...res, ...data.data]);
            return data.data;
        }
    };
    const getParentDept = async () => {
        setParentDept([{ ...parentDef }, { id: "", text: "" }]);
        selectValue.parentDept = scParent[0].id;
        setParentDept((res) => [...res, ...scParent]);
    };
    const getSkillLevel = () => {
        setSkillLvl([{ ...defSkillLvl }, { id: "", text: "" }]);
        setSkillLvl((res) => [...res, ...scLevel]);
    };
    const getQuarter = () => {
        let date = new Date();
        let month = date.getMonth();
        let qrt = Math.floor(month / 3) + 1;
        return quarterData[qrt + 1];
    };
    const initData = async () => {
        let year = await getYear();
        let last = year[0];
        const data = await Promise.all([
            getQuarter(),
            getPlant(),
            getLine(""),
            getProc(""),
            getSkillLevel(),
            getParentDept(),
            getMultiskillFromDetail(),
        ]);
        let qrt = data[0];

        setSelectValue((res) => ({
            ...res,
            qrt: propsRound ? propsRound : qrt.id,
            year: propsYear ? propsYear : last.id,
        }));
        setSelectYear((res) => [...res, ...year]);

        setInit(false);
    };

    const getSkillData = (item) => {
        setSelectValue((res) => ({ ...res, proc: item }));
    };
    const onSkill = (item) => {
        setSelectValue((res) => ({ ...res, value: item }));
    };
    const onYear = (item) => {
        setSelectValue((res) => ({ ...res, year: item }));
    };
    const onQrt = (item) => {
        setSelectValue((res) => ({ ...res, qrt: item }));
    };
    const getMultiskillFromDetail = () => {
        setSelectValue((res) => ({
            ...res,
            parentDept: propsParent,
            skill: propsProcess,
            proc: propsSkill,
            dept: propsPlant,
            qrt: propsRound,
            year: propsYear,
            value: propsScore,
            skillLvl: propsLevel,
        }));
        setMultiskillEmp(dataskill);
    };
    const getMultiskill = async (item) => {
        setOnLoad(true);
        let ckSkill = { ...proc.find((res) => res.id === item.proc) };
        Object.keys(ckSkill).length < 1 && (item.proc = "");
        setCount((cnt) => cnt + 1);
        try {
            const res = await axios.get(`api/empskill`, {
                params: {
                    ...item,
                },
                signal: controller.signal,
            });
            if (res.status == 200) {
                setMultiskillEmp([...res.data]);
                setOnLoad(false);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const submitButton = () => {
        getMultiskill(selectValue);
    };
    const getBack = () => {
        window.history.back();
    };

    useEffect(() => {
        initData();
        setSkill(skillValue);
    }, []);

    useEffect(() => {}, [selectValue]);
    return (
        <MainLayout>
            <div className="w-full">
                <div className="px-36 m-auto grid grid-cols-9 gap-4">
                    <div className="h-[35px] col-span-2">
                        <SelectDept
                            data={parentDept}
                            defData={selectValue.parentDept}
                            changed={(item) => {
                                setSelectValue((res) => ({
                                    ...res,
                                    parentDept: item,
                                }));
                            }}
                        ></SelectDept>
                    </div>
                    <div>
                        <SelectDept
                            data={plants}
                            defData={selectValue.dept}
                            changed={(item) => {
                                setSelectValue((res) => ({
                                    ...res,
                                    dept: item,
                                }));
                            }}
                        ></SelectDept>
                    </div>
                    <div className="col-span-2">
                        <SelectDept
                            data={line}
                            defData={selectValue.skill}
                            changed={getProc}
                            parent={selectValue.dept}
                        ></SelectDept>
                    </div>
                    <div className="col-span-4">
                        <SelectDept
                            data={proc}
                            defData={selectValue.proc}
                            changed={getSkillData}
                            parent={selectValue.part}
                        ></SelectDept>
                    </div>
                    <div>
                        <SelectDept
                            data={skillLvl}
                            defData={selectValue.skillLvl}
                            changed={(item) => {
                                setSelectValue((res) => ({
                                    ...res,
                                    skillLvl: item,
                                }));
                            }}
                        ></SelectDept>
                    </div>
                    <div>
                        <SelectDept
                            data={skill}
                            defData={selectValue.value}
                            changed={onSkill}
                            parent={selectValue.proc}
                        ></SelectDept>
                    </div>
                    <div>
                        <SelectDept
                            data={tierMSkill}
                            defData={selectValue.tier}
                            changed={(item) => {
                                setSelectValue((res) => ({
                                    ...res,
                                    tier: item,
                                }));
                            }}
                            parent={selectValue.proc}
                        ></SelectDept>
                    </div>
                    <div>
                        <SelectDept
                            data={quarterData}
                            defData={selectValue.qrt}
                            changed={onQrt}
                            parent={selectValue.proc}
                        ></SelectDept>
                    </div>
                    <div>
                        <SelectDept
                            data={selectYear}
                            defData={selectValue.year}
                            changed={onYear}
                            parent={selectValue.proc}
                        ></SelectDept>
                    </div>
                    <div className="col-span-4 flex gap-3 ml-auto">
                        {propsSearch ? (
                            <button
                                onClick={() => getBack()}
                                className="w-40 h-9 btn btn-sm text-lg font-bold bg-secondary text-white hover:bg-primary"
                            >
                                Back
                            </button>
                        ) : null}
                        <DownloadTableExcel
                            filename="Multiskill EMP Dashboard"
                            sheet="users"
                            currentTableRef={ref}
                        >
                            <button className="text-white w-40 h-9 bg-gradient-to-br from-cyan-950 to-sky-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-300 font-medium rounded-lg text-md  text-center">
                                Download
                            </button>
                        </DownloadTableExcel>

                        <button
                            onClick={() => submitButton()}
                            className="w-40 h-9 btn btn-sm text-lg font-bold bg-primary text-white hover:bg-primary"
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center px-5">
                    <div className="w-screen mt-5">
                        {onLoad ? (
                            <div className="flex items-center justify-center w-full h-[400px]">
                                <Loading></Loading>
                            </div>
                        ) : (
                            <div className="px-36">
                                <SearchTable
                                    header={DasHeaders}
                                    data={multiskillEmp}
                                    dataRef={setRef}
                                ></SearchTable>
                            </div>
                        )}
                        <div>
                            {multiskillEmp.length == 0 && !onLoad ? (
                                <Notfound></Notfound>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Search;
