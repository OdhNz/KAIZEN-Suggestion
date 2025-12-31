import React, { useEffect, useState } from "react";

const SearchTable = (props) => {
    const { header, data, dataRef } = props;
    const [headers, setHeaders] = useState([]);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        setHeaders([...header]);
        data && setTableData([...data]);
    }, [data]);
    return (
        <div className="overflow-x-auto w-full max-h-[74vh]">
            <table
                className="table table-pin-rows border-2 border-neutral select-text"
                ref={dataRef}
            >
                <thead className="text-lg text-center text-zinc-900 ">
                    <tr className="divide-x-2 divide-y-2  divide-reverse divide-neutral bg-primary text-white ">
                        <th>No</th>
                        <th className="min-w-[150px]">DEPT</th>
                        <th>PLANT</th>
                        <th className="min-w-[150px]">PROCESS</th>
                        <th>EMP NO</th>
                        <th>NAME</th>
                        <th>POSITION</th>
                        <th>SKILL</th>
                        <th>
                            SKILL <br /> LEVEL
                        </th>
                        <th>SCORE</th>
                        <th className="min-w-[100px]">
                            TIER <br /> LEVEL
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.length
                        ? tableData.map((res, index) => {
                              return (
                                  <tr
                                      key={index}
                                      className={`text-center text-lg text-neutral divide-x-2 divide-y-2 divide-neutral ${
                                          (index + 1) % 2
                                              ? " bg-secondary"
                                              : "bg-accent"
                                      }`}
                                  >
                                      <th className=" border-2 border-neutral w-4">
                                          {index + 1}
                                      </th>
                                      <td>{res.parent_name}</td>
                                      <td>{res.plant}</td>
                                      <td className="text-left">
                                          {res.vsm_line}
                                      </td>
                                      <td className="w-5">{res.empid}</td>
                                      <td className="text-left">{res.name}</td>
                                      <td className="text-left">
                                          {res.job_position_nm}
                                      </td>
                                      <td className="text-left">
                                          {res.process_nm}
                                      </td>
                                      <td>{res.skill_level}</td>
                                      <td>{res.multi_skill_flag}</td>
                                      <td>{res.tier_nm}</td>
                                  </tr>
                              );
                          })
                        : null}
                </tbody>
            </table>
        </div>
    );
};

export default SearchTable;
