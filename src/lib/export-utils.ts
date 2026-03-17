/**
 * Utility to export data to CSV and trigger a download in the browser.
 */
export function exportToCSV(data: any[], filename: string, headers: string[]) {
    if (!data || !data.length) return;

    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header] ?? '';
                // Escape quotes and wrap in quotes
                const escapedValue = String(value).replace(/"/g, '""');
                return `"${escapedValue}"`;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Utility to export data to Excel-friendly CSV (with BOM)
 */
export function exportToExcel(data: any[], filename: string, headers: { label: string, key: string }[]) {
  if (!data || !data.length) return;

  const csvContent = [
    headers.map(h => h.label).join(';'),
    ...data.map(row => 
      headers.map(h => {
        const value = row[h.key] ?? '';
        // Escape semicolons for Excel CSV (standard in many regions)
        const escapedValue = String(value).replace(/;/g, ',');
        return `"${escapedValue}"`;
      }).join(';')
    )
  ].join('\r\n');

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
