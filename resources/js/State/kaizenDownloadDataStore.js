import ExcelJS from "exceljs";
import { toast } from "react-toastify";
import axios from "axios";

 const workbook = new ExcelJS.Workbook();

 const kaizenDownloadDataStore = (set, get) => ({
       rangeCellFillBg: (sheet,
                        bgnRow,
                        endRow,
                        bgnCell,
                        endCell,
                        color) => {
            for (let rowNum = bgnRow; rowNum <= endRow; rowNum++) {
            for (let cellNum = bgnCell; cellNum <= endCell; cellNum++) {
                sheet.getCell(rowNum, cellNum).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: color },
                };
            }
        }},
      downloadExcel: async (filteredData, schemas) => {
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
                  });
      },
      fetchKaizenFileBatch: async (paths) => {
        try {
          const response = await axios.post("/api/fetchKaizenFileBatch", { paths });
          return response.data;
        } catch (err) {
          console.error("Batch file fetch failed:", err);
          return {};
        }
      },
      downloadExcelTemplate: async (filteredData, setIsDownload) => {
        if (!filteredData || filteredData.length === 0) {
          toast.warn("Tidak ada data untuk diunduh.");
          return;
        }
    
        setIsDownload(true);
        await new Promise((res) => setTimeout(res, 50)); // beri waktu render spinner
    
        const workbook = new ExcelJS.Workbook();
        let hasError = false;
        toast.info("Sedang memproses file Kaizen...");
    
        try {
          // 🔧 Kumpulkan semua path gambar
          const allPaths = [];
          filteredData.forEach(item => {
            if (item.bef_file) allPaths.push(item.bef_file);
            if (item.aft_file) allPaths.push(item.aft_file);
          });
    
          // 🔧 Ambil semua file sekaligus dari Laravel
          const fileResults = await get().fetchKaizenFileBatch(allPaths);
    
          for (const item of filteredData) {
            const sheet = workbook.addWorksheet(`${item.kaizen_id_nm}-${item.name}`);
            sheet.properties.defaultColWidth = 10.14;
            get().rangeCellFillBg(sheet, 1, 33, 1, 12, "FFFFFFFF");
    
            sheet.mergeCells("A1:L6");
            sheet.getCell("A1").value = "TT KAIZEN SUGGESTION";
            sheet.getCell("A1").font = { size: 36, bold: true, name: "Times New Roman" };
            sheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    
            const labels = [
              ["A7", "Judul"], ["A8", "Category"], ["A9", "Idea"],
              ["A10", "Plant Area"], ["A11", "Start Date"], ["A12", "End Date"]
            ];
            labels.forEach(([cell, label]) => {
              sheet.getCell(cell).value = label;
              sheet.getCell(cell).font = { bold: true };
            });
    
            sheet.getCell("B7").value = item.title;
            sheet.getCell("B8").value = item.category_nm;
            sheet.getCell("B9").value = item.name;
            sheet.getCell("B10").value = item.location_nm;
            sheet.getCell("B11").value = item.bgn_dt;
            sheet.getCell("B12").value = item.end_dt;
    
            sheet.getCell("H7").value = "Supporting Team";
            sheet.getCell("H7").font = { bold: true };
            ["emp1", "emp2", "emp3", "emp4", "emp5"].forEach((key, i) => {
              const val = item[key];
              if (val) {
                sheet.getCell(`H${8 + i}`).value = `${i + 1}. ${val}-${item[`name${i + 1}`]}-${item[`dept${i + 1}`]}`;
              }
            });
    
            sheet.mergeCells("A15:E15");
            sheet.getCell("A15").value = "BEFORE";
            sheet.getCell("A15").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF008080" } };
            sheet.getCell("A15").font = { size: 12, bold: true, color: { argb: "FFFFFFFF" } };
            sheet.getCell("A15").alignment = { horizontal: "center", vertical: "middle" };
    
            sheet.mergeCells("H15:L15");
            sheet.getCell("H15").value = "AFTER";
            sheet.getCell("H15").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF009999" } };
            sheet.getCell("H15").font = { size: 12, bold: true, color: { argb: "FFFFFFFF" } };
            sheet.getCell("H15").alignment = { horizontal: "center", vertical: "middle" };
    
            sheet.mergeCells("A28:E33");
            sheet.getCell("A28").value = item.bef_remark;
            sheet.getCell("A28").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" } };
            sheet.getCell("A28").alignment = { horizontal: "left", vertical: "top", wrapText: true };
    
            sheet.mergeCells("H28:L33");
            sheet.getCell("H28").value = item.aft_remark;
            sheet.getCell("H28").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF2F2F2" } };
            sheet.getCell("H28").alignment = { horizontal: "left", vertical: "top", wrapText: true };
    
            ["A7", "A8", "A9", "A10", "A11", "A12", "A13", "H7"].forEach((cell) => {
              sheet.getCell(cell).font = { bold: true };
            });
    
            // 🔧 Gambar BEFORE
            const resultBef = fileResults[item.bef_file];
            if (resultBef?.status === 200) {
              const imageIdBef = workbook.addImage({
                base64: resultBef.data,
                extension: resultBef.ext,
              });
              sheet.addImage(imageIdBef, { tl: { col: 0, row: 15 }, br: { col: 5, row: 27 } });
            } else {
              hasError = true;
            }
    
            // 🔧 Gambar AFTER
            const resultAft = fileResults[item.aft_file];
            if (resultAft?.status === 200) {
              const imageIdAft = workbook.addImage({
                base64: resultAft.data,
                extension: resultAft.ext,
              });
              sheet.addImage(imageIdAft, { tl: { col: 7, row: 15 }, br: { col: 12, row: 27 } });
            } else {
              hasError = true;
            }
    
            await new Promise((res) => setTimeout(res, 100)); // jeda antar item
          }
    
          const data = await workbook.xlsx.writeBuffer();
          const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "TTKaizen.xlsx";
          anchor.click();
          window.URL.revokeObjectURL(url);
    
          if (hasError) {
            toast.warn("File berhasil diunduh, tapi beberapa gambar gagal dimuat.");
          } else {
            toast.success("File downloaded successfully!");
          }
        } catch (err) {
          toast.error("Gagal membuat file Excel.");
          console.error("Excel download error:", err);
        }
    
        setIsDownload(false);
      }
    });

   export default kaizenDownloadDataStore