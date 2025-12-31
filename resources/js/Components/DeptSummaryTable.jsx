import React from "react";
import { Table } from "antd";
import dayjs from "dayjs";

const DeptSummaryTable = ({ data, searchMonth }) => {
  // Ambil 3 bulan terakhir (format "MMM" uppercase: OCT, NOV, DEC)
  const months = Array.from({ length: 3 }, (_, i) =>
    dayjs(searchMonth).subtract(2 - i, "month").format("MMM").toUpperCase()
  );

  //console.log("📊 Raw data from backend:", data);
  //console.log("📊 Months used:", months);

  const columns = [
    { title: "Department", dataIndex: "TYPE", key: "TYPE", width: 100 },
    ...months.map((m) => ({
      title: m,
      dataIndex: m,
      key: m,
      width: 30,
      align: "center",
    })),
    { title: "Total", dataIndex: "total", key: "total", width: 30, align: "center" },
  ];

  // Pivot data: group by TYPE, isi nilai per bulan
  const grouped = {};
  (Array.isArray(data) ? data : []).forEach((item) => {
    const type = item.TYPE || item.type;   // antisipasi huruf kecil
    const month = item.MONTH || item.month; // antisipasi huruf kecil
    const value = Number(item.VALUE || item.value);

    if (!months.includes(month)) return;

    if (!grouped[type]) {
      grouped[type] = { TYPE: type };
      months.forEach((m) => {
        grouped[type][m] = 0;
      });
    }

    grouped[type][month] += value;
  });

  const dataSource = Object.values(grouped).map((row, idx) => {
    const total = months.reduce((sum, m) => sum + (row[m] || 0), 0);
    return { ...row, total, key: idx };
  });

  //console.log("📊 Pivoted dataSource:", dataSource);

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      bordered
      scroll={{ x: "max-content", y: 300 }}
      className="dept-summary-table"
    />
  );
};

export default DeptSummaryTable;
