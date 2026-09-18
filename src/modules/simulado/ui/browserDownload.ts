const UTF8_BOM = "﻿";

/** Triggers a browser download of CSV text, prefixed with a UTF-8 BOM for Excel compatibility. */
export function downloadCsvFile(filename: string, csvContent: string): void {
  const blob = new Blob([UTF8_BOM + csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  try {
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}
