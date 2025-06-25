import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

// Hàm phụ: xuất Excel
export async function exportPlanToExcel(data, fileName = "plan.xlsx") {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Plan");

    worksheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Time", key: "time", width: 15 },
        { header: "Keyword", key: "keyword", width: 30 },
    ];

    data.forEach((item) => {
        worksheet.addRow({
            date: item.date,
            time: item.time,
            keyword: item.keyword,
        });
    });

    const exportDir = path.resolve("src/public/exports");
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
    }

    const filePath = path.join(exportDir, fileName);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
}

// Tạo mảng từ các thông tin trong excel
export async function getInforFromExcel(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    // const todayStr = new Date().toISOString().slice(0, 10);
    const results = [];

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return;
        const dateCell = row.getCell(1).text.trim();
        const timeCell = row.getCell(2).text.trim();
        const keywordCell = row.getCell(3).text.trim();

        // if (dateCell === todayStr) {
        results.push({ date: dateCell, time: normalizeTimeString(timeCell), keyword: keywordCell });
        // }
    });

    fs.unlinkSync(filePath);
    return results;
}

export function removeVietnameseTones(str) {
    return str
        .normalize("NFD") // tách dấu
        .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
        .replace(/đ/g, "d") // thay đ thường
        .replace(/Đ/g, "D") // thay Đ hoa
        .replace(/[^\w\s]/g, "") // loại bỏ ký tự đặc biệt (ngoài chữ, số, khoảng trắng)
        .replace(/\s+/g, "_") // thay khoảng trắng bằng _
        .toLowerCase();
}

export function normalizeTimeString(input) {
    // Nếu input là chuỗi số kiểu "0.67..." => ép kiểu về number
    if (typeof input === "string" && !isNaN(input) && parseFloat(input) < 1) {
        input = parseFloat(input);
    }

    // 1. Chuỗi có định dạng HH:mm hoặc HH:mm:ss
    if (
        typeof input === "string" &&
        /^\d{1,2}:\d{2}(:\d{2})?(\s?[APap][Mm])?$/.test(input.trim())
    ) {
        const date = new Date(`1970-01-01T${input.trim()}`);
        if (!isNaN(date)) {
            const h = date.getHours().toString().padStart(2, "0");
            const m = date.getMinutes().toString().padStart(2, "0");
            const s = date.getSeconds().toString().padStart(2, "0");
            return `${h}:${m}:${s}`;
        }
    }

    // 2. Nếu là số thập phân từ Excel
    if (typeof input === "number" && input >= 0 && input < 1) {
        const totalSeconds = Math.floor(input * 86400); // 24*60*60
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
    }

    // 3. Nếu là Date object
    if (input instanceof Date && !isNaN(input)) {
        const hours = input.getHours();
        const minutes = input.getMinutes();
        const seconds = input.getSeconds();
        return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
    }

    throw new Error(`Invalid time format: ${input}`);
}
