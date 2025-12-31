import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

const DetailDashboardTable = (props) => {
    const { data, dataRef } = props;
    const [tableData, setTableData] = useState([]);
    const [count, setCount] = useState(0);
    const [totalData, setTotalData] = useState();
    useEffect(() => {
        setCount((res) => res + 1);
        if (count) {
            data && setTableData([...data]);
            getAccDashboard();
        }
    }, [data]);

    const getAccDashboard = () => {
        let tot_data = data[0].tot_skill;
        let aTot = data.reduce((n, { a }) => n + parseInt(a), 0);
        let bTot = data.reduce((n, { b }) => n + parseInt(b), 0);
        let cTot = data.reduce((n, { c }) => n + parseInt(c), 0);
        let dTot = data.reduce((n, { d }) => n + parseInt(d), 0);
        let sum = data.reduce(
            (n, { tot_skills }) => n + parseInt(tot_skills),
            0
        );
        let aPers = parseFloat((aTot / tot_data) * 100).toFixed(2);
        let bPers = parseFloat((bTot / tot_data) * 100).toFixed(2);
        let cPers = parseFloat((cTot / tot_data) * 100).toFixed(2);
        let dPers = parseFloat((dTot / tot_data) * 100).toFixed(2);
        let sumPers = parseFloat((sum / tot_data) * 100).toFixed(2);

        aPers = isNaN(aPers) ? 0 : aPers;
        bPers = isNaN(bPers) ? 0 : bPers;
        cPers = isNaN(cPers) ? 0 : cPers;
        dPers = isNaN(dPers) ? 0 : dPers;
        sumPers = isNaN(sumPers) ? 0 : sumPers;

        const gradTotal = {
            nm: "GRAND TOTAL",
            a_per: aPers,
            a_tot: aTot.toLocaleString(),
            b_per: bPers,
            b_tot: bTot.toLocaleString(),
            c_per: cPers,
            c_tot: cTot.toLocaleString(),
            d_per: dPers,
            d_tot: dTot.toLocaleString(),
            tot: sum.toLocaleString(),
        };
        setTotalData(gradTotal);
    };
    const getEmpMultiskill = (
        year,
        round,
        plant,
        parent,
        process,
        skill,
        dept,
        level,
        score
    ) => {
        const params = {
            year,
            round,
            plant,
            parent,
            process,
            skill,
            dept,
            level,
            score,
            isSearch: true,
        };
        return router.visit("search", {
            data: params,
            preserveState: true,
        });
    };
    return (
        <div className="overflow-x-auto w-full max-h-[75vh] px-10">
            <table
                ref={dataRef}
                className="table border-2 border-neutral divide-x-2 divide-y-2 divide-neutral border-spacing-0 select-text"
            >
                <thead className="text-xl text-center font-bold text-zinc-900 sticky top-0">
                    <tr className="divide-x-2 divide-y-2 divide-reverse divide-neutral bg-primary text-neutral">
                        <th rowSpan={2}>NO</th>
                        <th rowSpan={2}>DEPT</th>
                        <th rowSpan={2}>PLANT</th>
                        <th rowSpan={2}>PROCESS</th>
                        {/* <th rowSpan={2}>AREA</th> */}
                        <th rowSpan={2}>JOB</th>
                        <th rowSpan={2}>
                            SKILL <br /> LEVEL
                        </th>
                        <th rowSpan={2}>
                            TOTAL <br /> SKILL
                        </th>
                        <th colSpan={4}>SCORE</th>
                    </tr>
                    <tr className="divide-x-2 divide-y-2 divide-reverse divide-neutral bg-primary text-neutral">
                        <th className="border-2 w-4 border-neutral" colSpan={1}>
                            100%
                        </th>
                        <th colSpan={1}>75%</th>
                        <th colSpan={1}>50%</th>
                        <th colSpan={1}>25%</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.length
                        ? tableData.map((res, index) => {
                              return (
                                  <tr
                                      key={index}
                                      className={`text-center text-neutral divide-x-2 divide-y-2 divide-neutral text-lg ${
                                          (index + 1) % 2
                                              ? " bg-secondary"
                                              : "bg-accent"
                                      }`}
                                  >
                                      <td className="border-2 border-neutral w-1">
                                          {index + 1}
                                      </td>
                                      {res.parent_rn < 2 ? (
                                          <td
                                              key={index + "y"}
                                              rowSpan={res.parent_cnt}
                                              className="w-28 font-bold bg-secondary"
                                          >
                                              {res.parent_dept}
                                          </td>
                                      ) : null}
                                      {index < 1 ? (
                                          <td
                                              key={index + "x"}
                                              rowSpan={res.plant_cnt}
                                              className="w-28 text-left font-bold"
                                          >
                                              {res.plant}
                                          </td>
                                      ) : null}
                                      {res.process_rn < 2 ? (
                                          <td
                                              key={index + "c"}
                                              rowSpan={res.process_cnt}
                                              className="w-28 font-bold bg-secondary"
                                          >
                                              {res.process_nm}
                                          </td>
                                      ) : null}
                                      {/* <td className="w-34">{res.dept_name}</td> */}
                                      <td className="w-34">{res.skill_nm}</td>
                                      <td className="w-4">{res.skill_level}</td>
                                      <td
                                          className="w-10 cursor-pointer hover:font-extrabold hover:text-amber-300"
                                          onClick={() =>
                                              getEmpMultiskill(
                                                  res.year,
                                                  res.round_cd,
                                                  res.plant_location,
                                                  res.parent_cd,
                                                  res.process_nm,
                                                  res.skill_nm,
                                                  res.dept_cd,
                                                  res.skill_level,
                                                  null
                                              )
                                          }
                                      >
                                          {parseInt(
                                              res.tot_skills
                                          ).toLocaleString()}
                                      </td>
                                      <td
                                          className="w-4 cursor-pointer hover:font-extrabold hover:text-amber-300"
                                          onClick={() =>
                                              getEmpMultiskill(
                                                  res.year,
                                                  res.round_cd,
                                                  res.plant_location,
                                                  res.parent_cd,
                                                  res.process_nm,
                                                  res.skill_nm,
                                                  res.dept_cd,
                                                  res.skill_level,
                                                  "100"
                                              )
                                          }
                                      >
                                          {parseInt(res.a).toLocaleString()}
                                      </td>
                                      <td
                                          className="w-4 cursor-pointer hover:font-extrabold hover:text-amber-300"
                                          onClick={() =>
                                              getEmpMultiskill(
                                                  res.year,
                                                  res.round_cd,
                                                  res.plant_location,
                                                  res.parent_cd,
                                                  res.process_nm,
                                                  res.skill_nm,
                                                  res.dept_cd,
                                                  res.skill_level,
                                                  "075"
                                              )
                                          }
                                      >
                                          {parseInt(res.b).toLocaleString()}
                                      </td>
                                      <td
                                          className="w-4 cursor-pointer hover:font-extrabold hover:text-amber-300"
                                          onClick={() =>
                                              getEmpMultiskill(
                                                  res.year,
                                                  res.round_cd,
                                                  res.plant_location,
                                                  res.parent_cd,
                                                  res.process_nm,
                                                  res.skill_nm,
                                                  res.dept_cd,
                                                  res.skill_level,
                                                  "050"
                                              )
                                          }
                                      >
                                          {parseInt(res.c).toLocaleString()}
                                      </td>
                                      <td
                                          className="w-4 cursor-pointer hover:font-extrabold hover:text-amber-300"
                                          onClick={() =>
                                              getEmpMultiskill(
                                                  res.year,
                                                  res.round_cd,
                                                  res.plant_location,
                                                  res.parent_cd,
                                                  res.process_nm,
                                                  res.skill_nm,
                                                  res.dept_cd,
                                                  res.skill_level,
                                                  "025"
                                              )
                                          }
                                      >
                                          {parseInt(res.d).toLocaleString()}
                                      </td>
                                  </tr>
                              );
                          })
                        : null}
                    {tableData.length ? (
                        <tr
                            className={` sticky bottom-0 text-center text-primary divide-x-2 divide-y-2 divide-neutral text-lg bg-sky-200 text-lg font-bold`}
                        >
                            <td
                                colSpan={6}
                                className="w-34 text-center border-2 border-neutral font-extrabold"
                            >
                                {totalData.nm}
                            </td>
                            <td className="w-28 font-extrabold">
                                {totalData.tot}
                            </td>
                            <td className="w-20 font-extrabold">
                                {totalData.a_tot}
                            </td>
                            <td className="w-20 font-extrabold">
                                {totalData.b_tot}
                            </td>
                            <td className="w-20 font-extrabold">
                                {totalData.c_tot}
                            </td>
                            <td className="w-20 font-extrabold">
                                {totalData.d_tot}
                            </td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};

export default DetailDashboardTable;
