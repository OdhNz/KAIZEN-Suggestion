import React, { useEffect, useState, useRef, useMemo } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { HiDownload } from "react-icons/hi";
import writeXlsxFile from "write-excel-file";

const UseTableKaizen = (props) => {
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
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const dowloadTable = async () => {
        const schema = columns.map((res) => {
            return {
                column: res.title,
                type: String,
                value: (value) => value[res.key],
            };
        });
        await writeXlsxFile(data, {
            schema,
            fileName: "TTUtility.xlsx",
        });
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
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
    return (
        <div className="w-full h-full overflow-auto">
            {" "}
            <Table
                // rowClassName={(record, index) =>
                //     index % 2 === 0 ? "bg-zinc-100" : ""
                // }
                sticky
                rowHoverable={true}
                loading={loading}
                columns={columnsAnt}
                dataSource={data}
                scroll={{ x: width, y: height }}
                pagination={{
                    style: {
                        position: "relative",
                    },
                    position: ["bottomRight"],
                    showTotal: (total, range) => {
                        return (
                            <div className="absolute left-0 flex flex-row gap-3 items-center">
                                <span>{total} Rows</span>
                                <span
                                    className="flex flex-row items-center gap-1 text-xs font-bold mt-auto mb-auto cursor-pointer text-green-700"
                                    onClick={() => dowloadTable()}
                                >
                                    <HiDownload />
                                    Download
                                </span>
                            </div>
                        );
                    },
                }}
            />
        </div>
    );
};

export default UseTableKaizen;
