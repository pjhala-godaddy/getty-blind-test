import * as XLSX from 'xlsx';
import { ParsedBusinessData } from '../types';

export function parseExcelFile(file: File): Promise<ParsedBusinessData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const businesses: ParsedBusinessData[] = jsonData.map((row: any) => ({
          name: row['Business Name'] || row['name'] || '',
          description: row['Description'] || row['description'] || '',
          industry: row['Industry'] || row['industry'] || '',
          content_style: row['Content Style'] || row['content_style'] || '',
          writing_style: row['Writing Style'] || row['writing_style'] || '',
          image_url_a: row['Image URL A'] || row['image_url_a'] || '',
          image_url_b: row['Image URL B'] || row['image_url_b'] || '',
        }));

        // Validate that we have required fields
        const valid = businesses.every(
          (b) => b.name && b.image_url_a && b.image_url_b
        );

        if (!valid) {
          reject(new Error('Invalid file format. Required columns: Business Name, Image URL A, Image URL B'));
          return;
        }

        resolve(businesses);
      } catch (error) {
        reject(new Error('Failed to parse file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}

export function parseCSVFile(file: File): Promise<ParsedBusinessData[]> {
  return parseExcelFile(file); // xlsx library handles CSV too
}

export function exportToCSV(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

