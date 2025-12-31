import React, { useEffect, useState, useRef, useMemo } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TextInput, Table, Select } from "flowbite-react";
import { HiDocument, HiDownload } from "react-icons/hi";
import { DownloadTableExcel } from "react-export-table-to-excel";

const UseTable = (props) => {
    const {
        onDetail,
        onEdit,
        onDelete,
        editNm = "Edit",
        editStyle = "font-medium text-cyan-600 cursor-pointer hover:underline dark:text-cyan-500",
        deleteNm = "Delete",
        deleteStyle = "font-medium text-red-600 cursor-pointer hover:underline dark:text-red-600",
        data,
        columns,
        style,
        isLoading,
        isFilter = false,
    } = props;
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 100,
    });
    const [loadNumber, setLoadNumber] = useState([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
    ]);
    const tableRef = useRef(null);
    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    });

    return (
        <div className="p-2">
            <div className={style}>
                <Table ref={tableRef} hoverable>
                    {table.getHeaderGroups().map((headerGroup, index) => (
                        <Table.Head
                            key={headerGroup.id}
                            className="sticky top-0"
                        >
                            {" "}
                            <Table.HeadCell key={"no" + index} className="w-11">
                                No
                            </Table.HeadCell>
                            {onDetail && (
                                <Table.HeadCell
                                    key={"detail" + index}
                                    className="w-24"
                                >
                                    {" "}
                                    Detail
                                </Table.HeadCell>
                            )}
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Table.HeadCell
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        <div
                                            {...{
                                                className: header.column.getCanSort()
                                                    ? "cursor-pointer select-none"
                                                    : "",
                                                onClick: header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: "  ⮥",
                                                desc: " ⮦",
                                            }[header.column.getIsSorted()] ??
                                                null}
                                        </div>
                                    </Table.HeadCell>
                                );
                            })}
                            <Table.HeadCell> </Table.HeadCell>
                        </Table.Head>
                    ))}
                    <Table.Body className="divide-y">
                        {isLoading
                            ? loadNumber.map((res) => {
                                  {
                                      return table
                                          .getHeaderGroups()
                                          .map((headerGroup, index) => (
                                              <Table.Row className="animate-pulse">
                                                  <Table.Cell
                                                      key={"noload" + index}
                                                      className="p-0 m-1"
                                                  >
                                                      <div className="h-7 w-4/5 bg-gray-200 rounded-lg  dark:bg-gray-700"></div>
                                                  </Table.Cell>
                                                  {headerGroup.headers.map(
                                                      (header) => {
                                                          return (
                                                              <Table.Cell
                                                                  key={
                                                                      "load" +
                                                                      header.id
                                                                  }
                                                                  colSpan={
                                                                      header.colSpan
                                                                  }
                                                                  className="p-1 m-1"
                                                              >
                                                                  <div className="h-7 w-4/5 bg-gray-200 rounded-lg  dark:bg-gray-700"></div>
                                                              </Table.Cell>
                                                          );
                                                      }
                                                  )}
                                              </Table.Row>
                                          ));
                                  }
                              })
                            : table.getRowModel().rows.map((row, index) => {
                                  return (
                                      <Table.Row
                                          key={row.id}
                                          className="w-12 px-0 bg-white dark:border-gray-700 dark:bg-gray-800"
                                      >
                                          <Table.Cell key={"NO" + index}>
                                              {row.index + 1}
                                          </Table.Cell>
                                          {onDetail ? (
                                              <Table.Cell
                                                  key={index}
                                                  className="cursor-pointer flex justify-center w-24 px-0"
                                                  onClick={() =>
                                                      onDetail(row.original)
                                                  }
                                              >
                                                  <HiDocument />
                                              </Table.Cell>
                                          ) : null}
                                          {row
                                              .getVisibleCells()
                                              .map((cell, index) => {
                                                  return (
                                                      <Table.Cell key={cell.id}>
                                                          {flexRender(
                                                              cell.column
                                                                  .columnDef
                                                                  .cell,
                                                              cell.getContext()
                                                          )}
                                                      </Table.Cell>
                                                  );
                                              })}
                                          {(onEdit || onDelete) && (
                                              <Table.Cell
                                                  key={"action" + index}
                                              >
                                                  <div className="flex flex-row justify-center items-center gap-2">
                                                      {onEdit ? (
                                                          <span
                                                              className={
                                                                  editStyle
                                                              }
                                                              onClick={() => {
                                                                  onEdit(
                                                                      row.original
                                                                  );
                                                              }}
                                                          >
                                                              {editNm}
                                                          </span>
                                                      ) : null}
                                                      {onDelete ? (
                                                          <span
                                                              className={
                                                                  deleteStyle
                                                              }
                                                              onClick={() =>
                                                                  onDelete(
                                                                      row.original
                                                                  )
                                                              }
                                                          >
                                                              {deleteNm}
                                                          </span>
                                                      ) : null}
                                                  </div>
                                              </Table.Cell>
                                          )}
                                      </Table.Row>
                                  );
                              })}
                    </Table.Body>
                    {isFilter
                        ? table.getHeaderGroups().map((headerGroup, index) => (
                              <Table.Head
                                  key={headerGroup.id}
                                  className="sticky bottom-0"
                              >
                                  {" "}
                                  <Table.HeadCell
                                      key={"no" + index}
                                      className="w-11"
                                  ></Table.HeadCell>
                                  {onDetail && (
                                      <Table.HeadCell
                                          key={"detail" + index}
                                          className="w-24"
                                      >
                                          {" "}
                                      </Table.HeadCell>
                                  )}
                                  {headerGroup.headers.map((header) => {
                                      return (
                                          <Table.HeadCell
                                              key={header.id}
                                              colSpan={header.colSpan}
                                              className="px-3"
                                          >
                                              <div>
                                                  {header.column.getCanFilter() ? (
                                                      <div>
                                                          <Filter
                                                              column={
                                                                  header.column
                                                              }
                                                              table={table}
                                                          />
                                                      </div>
                                                  ) : null}
                                              </div>
                                          </Table.HeadCell>
                                      );
                                  })}
                                  <Table.HeadCell> </Table.HeadCell>
                              </Table.Head>
                          ))
                        : null}
                </Table>
            </div>
            <div className="flex flex-row justify-between align-middle">
                <div className="flex flex-row gap-4 items-center">
                    <div className="text-xs font-bold mt-auto mb-auto text-gray-700">
                        {table.getRowCount().toLocaleString()} Rows
                    </div>
                    <DownloadTableExcel
                        filename="TTUtility"
                        sheet="TTUtility"
                        currentTableRef={tableRef.current}
                    >
                        <span className="flex flex-row items-center gap-1 text-xs font-bold mt-auto mb-auto cursor-pointer text-green-700">
                            <HiDownload />
                            Download
                        </span>
                    </DownloadTableExcel>
                </div>

                <div className="flex items-center gap-2 text-xs  mt-auto mb-auto">
                    <button
                        className="border rounded p-1"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {"<<"}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {"<"}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {">"}
                    </button>
                    <button
                        className="border rounded p-1"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {">>"}
                    </button>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount().toLocaleString()}
                        </strong>
                    </span>
                    <span className="flex items-center gap-1">
                        | Go to page :
                        <TextInput
                            type="number"
                            sizing="sm"
                            min="1"
                            max={table.getPageCount()}
                            defaultValue={
                                table.getState().pagination.pageIndex + 1
                            }
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                table.setPageIndex(page);
                            }}
                        />
                    </span>
                    <Select
                        value={table.getState().pagination.pageSize}
                        sizing="sm"
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                    >
                        {[100, 200, 300, 400, 500].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>
        </div>
    );
};

function Filter({ column, table }) {
    const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id);

    const columnFilterValue = column.getFilterValue();

    return typeof firstValue === "number" ? (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <input
                type="number"
                value={columnFilterValue?.[0] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old) => [e.target.value, old?.[1]])
                }
                placeholder={`Min`}
                className="w-24 border shadow rounded"
            />
            <input
                type="number"
                value={columnFilterValue?.[1] ?? ""}
                onChange={(e) =>
                    column.setFilterValue((old) => [old?.[0], e.target.value])
                }
                placeholder={`Max`}
                className="w-24 border shadow rounded"
            />
        </div>
    ) : (
        <TextInput
            onChange={(e) => column.setFilterValue(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            type="text"
            sizing={"sm"}
            value={columnFilterValue ?? ""}
            className="text-zinc-600 sticky bottom-0"
        />
    );
}

export default UseTable;
