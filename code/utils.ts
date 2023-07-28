export function emptyMatrix(rows: number, columns?: number) {
  if (!columns) {
    columns = rows
  }
  const matrix = new Array<unknown[]>(rows)
  for (let i = 0; i < rows; i++) {
    const row = new Array<unknown>(columns)
    matrix[i] = row
  }
  return matrix
}