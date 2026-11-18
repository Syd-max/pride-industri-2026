export function downloadCsv(rows: (string | number)[][], fileName: string) {
  const content = rows.map((row) => row.map((cell) => {
    const value = String(cell);
    const safe = typeof cell === 'string' && /^[\t\r\n]|^\s*[=+@-]/.test(value)
      ? "'" + value
      : value;
    return '"' + safe.replaceAll('"', '""') + '"';
  }).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
