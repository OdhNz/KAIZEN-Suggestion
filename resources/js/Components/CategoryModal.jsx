import React, { useEffect, useState } from "react";
import { Table, Modal, Spin } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const CategoryModal = ({ category, open, onClose, searchMonth }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (open && category) {
      setLoading(true);
      axios
        .get("/api/fetchKaizenByCategory", {
          params: { 
            category: category.name,
            tl_date: dayjs(searchMonth).format("YYYYMMDD")
          }, 
          
        })
        .then((res) => {
            console.log("📡 Raw response:", res);
          const rawData = res.data;
          const normalized = Array.isArray(rawData)
            ? rawData
            : Array.isArray(rawData?.data)
            ? rawData.data
            : [];
          setRows(normalized);
          console.log("📊 Category data:", normalized);
        })
        .catch((err) => {
            console.error("❌ Error fetching category data:", err);
          setRows([]);
        })
        .finally(() => setLoading(false));
    }
  }, [open, category]);

  const columns = [
    //{ title: "ID", dataIndex: "kaizen_id", key: "kaizen_id", width: 100 },
    { title: "Kaizen Id", dataIndex: "kaizen_id_nm", key: "kaizen_id_nm", width: 160 },
    //{ title: "Nama Kategori", dataIndex: "category_nm", key: "category_nm", width: 160 },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Dept", dataIndex: "dept", key: "dept", width: 140 },
    { title: "Tanggal", dataIndex: "tl_date", key: "tl_date", width: 120 },
    //{ title: "Status", dataIndex: "status_nm", key: "status_nm", width: 120 },
  ];

  return (
    <Modal
      title={<div className="modal-title-center">Data Category: {category?.name || "-"}</div>}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={rows}
          rowKey="kaizen_id"
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: "max-content", y: 400 }}
          className="custom-table-header"
        />
      </Spin>
    </Modal>
  );
};

export default CategoryModal;
