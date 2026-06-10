/**
 * Compute layout regions based on terminal dimensions.
 * Returns the number of visible rows for the session table.
 */
export function computeLayout(termRows, termCols) {
  // Header: 3 lines (box)
  // Search bar: 1 line
  // Column headers: 1 line
  // Separator: 1 line
  // Bottom separator: 1 line
  // Status bar: 1 line
  // Total chrome = 8 lines
  const chromeLines = 8;
  const tableRows = Math.max(termRows - chromeLines, 3);

  return {
    termRows,
    termCols,
    tableRows,
    chromeLines,
  };
}

/**
 * Compute column widths given terminal width.
 * When showPrompt is true, the FIRST PROMPT column is shown alongside TITLE,
 * splitting the flexible space between them; otherwise TITLE takes it all.
 */
export function computeColumns(termCols, showPrompt = false) {
  // Columns: indicator + repo + branch + title [+ prompt] + date + msg.
  // One space gap sits between each pair of columns.
  const numCols = showPrompt ? 6 : 5;
  const gaps = numCols - 1;
  const available = termCols - 2 - gaps;

  // Fixed/proportional columns, flexible space goes to title (+ prompt).
  const repoW = Math.max(Math.floor(available * 0.16), 8);
  const branchW = Math.max(Math.floor(available * 0.18), 8);
  const dateW = Math.max(8, 8);
  const msgW = Math.max(4, 4);
  const flexW = Math.max(available - repoW - branchW - dateW - msgW, 10);

  const columns = [
    { key: 'repoName', header: 'REPO', width: repoW },
    { key: 'gitBranch', header: 'BRANCH', width: branchW },
  ];

  if (showPrompt) {
    const titleW = Math.max(Math.floor(flexW / 2), 10);
    const promptW = Math.max(flexW - titleW, 10);
    columns.push(
      { key: 'title', header: 'TITLE', width: titleW },
      { key: 'firstPrompt', header: 'FIRST PROMPT', width: promptW },
    );
  } else {
    columns.push({ key: 'title', header: 'TITLE', width: flexW });
  }

  columns.push(
    { key: 'modified', header: 'DATE', width: dateW, isDate: true },
    { key: 'messageCount', header: 'MSG', width: msgW, isNumber: true },
  );

  return columns;
}
