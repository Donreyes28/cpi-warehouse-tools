const Excel = require('exceljs')
const path = require('path')

exports.logger = (category, message) => {
    console.log({ date: new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }), category, message })
}

exports.writeToExcel = async( sheetname, rows, columns ) => {
    const workbook = new Excel.Workbook();
    // console.log(sheetname)
    const worksheet = await workbook.addWorksheet(sheetname)
    worksheet.columns = columns; //@header, @key, @width
    await worksheet.addRows(rows); //array of data based on columns
    const exportPath = path.resolve('C:/Don-Reyes-files/warehouse-tool/workers/assets', 'order-details.xlsx');
    await workbook.xlsx.writeFile(exportPath);
}
