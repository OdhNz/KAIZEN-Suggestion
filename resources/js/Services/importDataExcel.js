import ExcelJS from "exceljs";
import useStore from "../State/useStore";

const workbook = new ExcelJS.Workbook();

export const rangeCellFillBg = (
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
    export const dowmloadExcel = (filteredData, schemas) => {
        const sheet = workbook.addWorksheet("Kaizen List");
        sheet.columns = schemas;
        const promise = Promise.all(
            filteredData.map(async (item, index) => {
                sheet.addRow(item);
            })
        );
        promise
            .then(() => {
                workbook.xlsx.writeBuffer().then(function (data) {
                    const blob = new Blob([data], {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });

                    const url = window.URL.createObjectURL(blob);
                    const anchor = document.createElement("a");
                    anchor.href = url;
                    anchor.download = "TTKaizen.xlsx";
                    anchor.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .catch((err) => {
                toast.err(err);
            })
            .finally(() => {
                toast.success("File downloaded successfully!");
                setIsDownload(false);
            });
    };
    export const dowmloadExcelTemplate = async (filteredData) => {
        const promise = Promise.all(
            filteredData.map(async (item, index) => {
                const sheet = workbook.addWorksheet(
                    item.kaizen_id_nm + "-" + item.name
                );
                sheet.properties.defaultColWidth = 10.14;
                rangeCellFillBg(sheet, 1, 33, 1, 12, "FFFFFFFF");
                sheet.mergeCells("A1:L6");
                sheet.getCell("A1").value = "TT KAIZEN SUGGESTION";
                sheet.getCell("A1").font = {
                    size: 36,
                    bold: true,
                    name: "Times New Roman",
                };
                sheet.getCell("A1").alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };

                sheet.getCell("A7").value = "Judul";
                sheet.getCell("A8").value = "Category";
                sheet.getCell("A9").value = "Idea";
                sheet.getCell("A10").value = "Plant Area";
                sheet.getCell("A11").value = "Start Date";
                sheet.getCell("A12").value = "End Date";

                sheet.getCell("B7").value = item.title;
                sheet.getCell("B8").value = item.category_nm;
                sheet.getCell("B9").value = item.name;
                sheet.getCell("B10").value = item.location_nm;
                sheet.getCell("B11").value = item.bgn_dt;
                sheet.getCell("B12").value = item.end_dt;

                sheet.getCell("H7").value = "Supporting Team";

                sheet.getCell("H8").value = item.emp1
                    ? "1." + item.emp1 + "-" + item.name1 + "-" + item.dept1
                    : "";
                sheet.getCell("H9").value = item.emp2
                    ? "2." + item.emp2 + "-" + item.name2 + "-" + item.dept2
                    : "";
                sheet.getCell("H10").value = item.emp3
                    ? "3." + item.emp3 + "-" + item.name3 + "-" + item.dept3
                    : "";
                sheet.getCell("H11").value = item.emp4
                    ? "4." + item.emp4 + "-" + item.name4 + "-" + item.dept4
                    : "";
                sheet.getCell("H12").value = item.emp5
                    ? "5." + item.emp5 + "-" + item.name5 + "-" + item.dept5
                    : "";

                sheet.mergeCells("A15:E15");
                sheet.getCell("A15").fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF008080" },
                };
                sheet.getCell("A15").value = "BEFORE";
                sheet.getCell("A15").font = {
                    size: 12,
                    bold: true,
                    color: { argb: "FFFFFFFF" },
                };
                sheet.getCell("A15").alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };

                sheet.mergeCells("H15:L15");
                sheet.getCell("H15").fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FF009999" },
                };
                sheet.getCell("H15").value = "AFTER";
                sheet.getCell("H15").font = {
                    size: 12,
                    bold: true,
                    color: { argb: "FFFFFFFF" },
                };
                sheet.getCell("H15").alignment = {
                    horizontal: "center",
                    vertical: "middle",
                };

                sheet.mergeCells("A28:E33");
                sheet.getCell("A28").fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF2F2F2" },
                };
                sheet.getCell("A28").value = item.bef_remark;
                sheet.getCell("A28").alignment = {
                    horizontal: "left",
                    vertical: "top",
                    wrapText: true,
                };

                sheet.mergeCells("H28:L33");
                sheet.getCell("H28").fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFF2F2F2" },
                };
                sheet.getCell("H28").value = item.aft_remark;
                sheet.getCell("H28").alignment = {
                    horizontal: "left",
                    vertical: "top",
                    wrapText: true,
                };

                sheet.getCell("A7").font = {
                    bold: true,
                };
                sheet.getCell("A8").font = {
                    bold: true,
                };
                sheet.getCell("A9").font = {
                    bold: true,
                };
                sheet.getCell("A10").font = {
                    bold: true,
                };
                sheet.getCell("A11").font = {
                    bold: true,
                };
                sheet.getCell("A12").font = {
                    bold: true,
                };
                sheet.getCell("A13").font = {
                    bold: true,
                };
                sheet.getCell("H7").font = {
                    bold: true,
                };
                const resultBef = await fetchKaizenFile({
                    path: item.bef_file,
                });
                if (resultBef?.data?.status == 200) {
                    const imageIdBef = workbook.addImage({
                        base64: resultBef?.data?.data,
                        extension: resultBef?.data?.ext,
                    });

                    sheet.addImage(imageIdBef, {
                        tl: { col: 0, row: 15 },
                        br: { col: 5, row: 27 },
                    });
                }
                const resultAft = await fetchKaizenFile({
                    path: item.aft_file,
                });
                if (resultAft?.data?.status == 200) {
                    const imageIdAft = workbook.addImage({
                        base64: resultAft?.data?.data,
                        extension: resultAft?.data?.ext,
                    });

                    sheet.addImage(imageIdAft, {
                        tl: { col: 7, row: 15 },
                        br: { col: 12, row: 27 },
                    });
                }
            })
        );
        promise
            .then(() => {
                workbook.xlsx.writeBuffer().then(function (data) {
                    const blob = new Blob([data], {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                    const url = window.URL.createObjectURL(blob);
                    const anchor = document.createElement("a");
                    anchor.href = url;
                    anchor.download = "TTKaizen.xlsx";
                    anchor.click();
                    window.URL.revokeObjectURL(url);
                });
            })
            .finally(() => {
                toast.success("File downloaded successfully!");
                setIsDownload(false);
            });
    };