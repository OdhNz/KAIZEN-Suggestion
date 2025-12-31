import React, { useEffect, useState, useRef, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Spin, Table } from "antd";
import Highlighter from "react-highlight-words";
import { HiDownload } from "react-icons/hi";
import useStore from "../../State/useStore";
import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import Loading from "../../Components/Loading";

const KaizenTableAdmin = (props) => {
    const {
        data,
        columns,
        pageSize = 10,
        width = "max-content",
        height = 450,
        loading = false,
    } = props;
    const [tableCount, setTableCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([...data]);
    const [searchedColumn, setSearchedColumn] = useState("");
    const [isDownload, setIsDownload] = useState(false);
    const {
        fetchKaizenFile,
        downloadExcel,
        downloadExcelTemplate,
    } = useStore();
    const searchInput = useRef(null);
    const workbook = new ExcelJS.Workbook();
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const rangeCellFillBg = (
        sheet,
        bgnRow,
        endRow,
        bgnCell,
        endCell,
        color
    ) => {
        for (let rowNum = bgnRow; rowNum <= endRow; rowNum++) {
            for (let cellNum = bgnCell; cellNum <= endCell; cellNum++) {
                sheet.getCell(rowNum, cellNum).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: color },
                };
            }
        }
    };
    const downloadSummaryExc = async () => {
        if (isDownload) return false;
        setIsDownload(true);
        const schemaParent = columns
            .filter((res) => res?.import != false)
            .map((res) => {
                return {
                    header: res.title,
                    key: res.key,
                    width: res.width / 10,
                };
            });
        const schemaChildren = [
            ...columns
                .filter((res) => res.children)
                .map((res) => {
                    return res.children
                        .filter((res) => res?.import != false)
                        .map((item) => {
                            return {
                                header: item.title,
                                key: item.key,
                                width: item.width / 10,
                            };
                        });
                }),
        ];

        const schemas = [...schemaParent, ...schemaChildren[0]];
        await downloadExcel(filteredData, schemas).finally(() => {
            setIsDownload(false);
        });
    };
    const dowloadTable = async () => {
        if (isDownload) return;
        await downloadExcelTemplate(filteredData, setIsDownload);
      };
      
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const handleDataChange = (pagination, filters, sorter, extra) => {
        setFilteredData(extra.currentDataSource);
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search...`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                        borderColor: "green",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90, background: "green" }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                        style={{ color: "gray" }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        style={{ color: "gray" }}
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? "#1677ff" : undefined }}
            />
        ),
        onFilter: (value, record) => {
            return record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase());
        },
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => {
                        var _a;
                        return (_a = searchInput.current) === null ||
                            _a === void 0
                            ? void 0
                            : _a.select();
                    }, 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });
    const columnsAnt = columns.map((res) =>
        Object.assign(
            Object.assign(
                {
                    title: res.title,
                    dataIndex: res.dataIndex,
                    key: res.key,
                    width: res.width,
                    hidden: res.hidden ? res.hidden : null,
                    onCell: res.onCell ? res.onCell : null,
                    render: res.render ? res.render : null,
                    fixed: res.fixed ? res.fixed : null,
                    filters: res.filters ?? null, // 🔥 tambahkan ini 
                    onFilter: res.onFilter ?? null, // 🔥 tambahkan ini 
                    filterMultiple: res.filterMultiple ?? null, // 🔥 kalau ada
                    children: !res.children
                        ? null
                        : res.children.map((item) =>
                              Object.assign({
                                  title: item.title,
                                  dataIndex: item.dataIndex,
                                  key: item.key,
                                  width: item.width,
                                  hidden: item.hidden ? res.hidden : null,
                                  onCell: item.onCell ? res.onCell : null,
                                  render: item.render ? res.render : null,
                                  fixed: item.fixed ? res.fixed : null,
                                  filters: item.filters ?? null, // 🔥 juga di children 
                                  onFilter: item.onFilter ?? null, 
                                  filterMultiple: item.filterMultiple ?? null,
                              })
                          ),
                },
                res.filter ? getColumnSearchProps(res.key) : null
            ),
            res.sort
                ? {
                      sorter: (a, b) => {
                          return a[res.key] < b[res.key]
                              ? 1
                              : a[res.key] > b[res.key]
                              ? -1
                              : 0;
                      },
                      sortDirections: ["descend", "ascend"],
                  }
                : null
        )
    );
    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    return (
        <div className="w-full h-full overflow-auto">
            <Spin spinning={isDownload}>
                {" "}
                <Table
                    sticky
                    bordered
                    rowHoverable={true}
                    loading={loading}
                    columns={columnsAnt}
                    dataSource={data}
                    onChange={handleDataChange}
                    scroll={{ x: width, y: height }}
                    pagination={{
                        style: {
                            position: "relative",
                            background: "white",
                            marginTop: 5,
                            padding: "5px",
                            // paddingTop: "16px",
                            // paddingBottom: "2px",
                            // paddingLeft: "7px",
                            borderRadius: "5px",
                        },
                        position: ["bottomRight"],
                        showTotal: (total, range) => {
                            return (
                               
                                <div className="absolute left-0 flex flex-row gap-3 items-center bg-white px-2">
                                    <span>{total} Rows</span>
                                    <span
                                        className="flex flex-row items-center gap-1 text-xs font-bold mt-auto mb-auto cursor-pointer select-none text-green-700"
                                        onClick={() => downloadSummaryExc()}
                                    >
                                        <HiDownload />
                                        List
                                    </span>
                                    <span
                                        className="flex flex-row items-center gap-1 text-xs font-bold mt-auto mb-auto cursor-pointer select-none text-green-700"
                                        onClick={() => dowloadTable()}
                                    >
                                        <HiDownload />
                                        Detail
                                    </span>
                                    {isDownload && <Loading />}
                                </div>
                               
                            );
                        },
                    }}
                />
            </Spin>
        </div>
    );
};

export default KaizenTableAdmin;
