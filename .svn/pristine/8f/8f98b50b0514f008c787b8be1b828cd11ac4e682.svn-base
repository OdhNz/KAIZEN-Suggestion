import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
const Table = (props) => {
    const { header, data, totalData, dataRef } = props;
    const [headers, setHeaders] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setHeaders([...header]);
        data && setTableData([...data]);
    }, [data]);

    const getDetailPage = (year, round, plant, dept) => {
        const params = {
            year: year,
            round: round,
            plant: plant,
            dept: dept,
        };
        sessionStorage.setItem("key1", JSON.stringify([params]));
        sessionStorage.setItem("key2", JSON.stringify([...data]));
        return router.visit("detail", {
            data: params,
            preserveState: true,
        });
    };
    return (
        <div className="overflow-x-auto w-full max-h-[75vh]">
            <table
                className="table table-sm border-2 border-neutral divide-x-2 divide-y-2 divide-neutral border-spacing-0 select-text"
                ref={dataRef}
            >
                <thead className="text-xl text-center font-bold text-zinc-900 sticky top-0">
                    <tr className="divide-x-2 divide-y-2 divide-reverse divide-neutral bg-primary text-neutral">
                        <th rowSpan={2}>NO</th>
                        <th rowSpan={2}>DEPT</th>
                        <th rowSpan={2}>PLANT</th>
                        <th rowSpan={2}>
                            TOTAL<br></br> MSKILLER{" "}
                        </th>
                        <th rowSpan={2}>
                            TOTAL <br></br> SKILL{" "}
                        </th>
                        <th colSpan={2}>100%</th>
                        <th colSpan={2}>75%</th>
                        <th colSpan={2}>50%</th>
                        <th colSpan={2}>25%</th>
                    </tr>
                    <tr className="divide-x-2 divide-y-2 divide-reverse divide-neutral bg-primary text-neutral">
                        <th className="border-2 border-neutral" colSpan={1}>
                            %
                        </th>
                        <th className="text-sm" colSpan={1}>
                            TOTAL
                        </th>
                        <th colSpan={1}>%</th>
                        <th className="text-sm" colSpan={1}>
                            TOTAL
                        </th>
                        <th colSpan={1}>%</th>
                        <th className="text-sm" colSpan={1}>
                            TOTAL
                        </th>
                        <th colSpan={1}>%</th>
                        <th className="text-sm" colSpan={1}>
                            TOTAL
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.length && Object.keys(totalData).length
                        ? tableData.map((res, index) => {
                              return (
                                  <tr
                                      key={index + "a"}
                                      className={`cursor-pointer text-center text-neutral divide-x-2 divide-y-2 divide-neutral text-lg ${
                                          (index + 1) % 2
                                              ? " bg-secondary"
                                              : "bg-accent"
                                      } hover:font-bold hover:text-amber-300`}
                                      onClick={() =>
                                          getDetailPage(
                                              res.year,
                                              res.round_cd,
                                              res.plant_location,
                                              res.dept_name
                                          )
                                      }
                                  >
                                      <td className="border-2 border-neutral w-1">
                                          {index + 1}
                                      </td>
                                      <td className="w-58 text-lg text-left">
                                          {res.dept_name}
                                      </td>
                                      <td className="w-35 text-center">
                                          {res.plant}
                                      </td>
                                      <td className="w-5 font-bold">
                                          {parseInt(
                                              res.headcount
                                          ).toLocaleString()}
                                      </td>
                                      <td className="w-5 font-bold">
                                          {parseInt(
                                              res.tot_skills
                                          ).toLocaleString()}
                                      </td>
                                      <td className="w-5">{res.a_per}</td>
                                      <td className="w-5">
                                          {parseInt(res.a_tot).toLocaleString()}
                                      </td>
                                      <td className="w-5">{res.b_per}</td>
                                      <td className="w-5">
                                          {parseInt(res.b_tot).toLocaleString()}
                                      </td>
                                      <td className="w-5">{res.c_per}</td>
                                      <td className="w-5">
                                          {parseInt(res.c_tot).toLocaleString()}
                                      </td>
                                      <td className="w-5">{res.d_per}</td>
                                      <td className="w-5">
                                          {parseInt(res.d_tot).toLocaleString()}
                                      </td>
                                  </tr>
                              );
                          })
                        : null}
                    <tr
                        key={313 + "b"}
                        className={` sticky bottom-0 text-center text-primary divide-x-2 divide-y-2 divide-neutral text-lg bg-sky-200 text-lg font-bold`}
                    >
                        <td
                            colSpan={3}
                            className="w-34 text-center border-2 border-neutral font-extrabold"
                        >
                            {totalData.nm}
                        </td>
                        <td className="w-28 font-extrabold">
                            {totalData.head_tot}
                        </td>
                        <td className="w-28 font-extrabold">{totalData.tot}</td>
                        <td className="w-28 font-extrabold">
                            {totalData.a_per}%{" "}
                        </td>
                        <td className="w-28 font-extrabold">
                            {totalData.a_tot}
                        </td>
                        <td className="w-28 font-extrabold">
                            {totalData.b_per}%
                        </td>
                        <td className="w-28 font-extrabold">
                            {totalData.b_tot}
                        </td>
                        <td className="w-28 font-extrabold">
                            {totalData.c_per}%
                        </td>
                        <td className="w-28 font-extrabold">
                            {totalData.c_tot}
                        </td>
                        <td className="w-28 font-extrabold">
                            {totalData.d_per}%
                        </td>
                        <td className="w-24 font-extrabold">
                            {totalData.d_tot}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table;
