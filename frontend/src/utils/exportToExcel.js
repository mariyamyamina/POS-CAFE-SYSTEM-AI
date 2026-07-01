import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Name of the Excel file (without extension)
 * @param {String} sheetName - Name of the sheet
 * @returns {Boolean} - Returns true if export was successful, false if no data
 */
export const exportToExcel = (data, fileName = 'export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    return false;
  }

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().slice(0, 10);
  const fullFileName = `${fileName}_${timestamp}.xlsx`;
  
  // Download file
  XLSX.writeFile(workbook, fullFileName);
  
  return true;
};
