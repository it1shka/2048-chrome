import { emptyMatrix } from './utils'

export function promptBoardSize() {
  let message = 'Please, select board size in range [4, 6]: '
  while (true) {
    const rawInput = prompt(message)
    if (rawInput === null || rawInput.trim() === '') {
      return 4
    }
    if (!/^\d+$/.test(rawInput)) {
      message = 'The input you provided is not an integer. Please, try again: '
      continue
    }
    const value = Number(rawInput)
    if (value < 4 || value > 6) {
      message = 'The value you provided is not in range [4, 6]. Please, try again: '
      continue
    }
    return value
  }
}

export function createBoard(size: number) {
  const boardElements = emptyMatrix(size) as HTMLDivElement[][]
  const boardRoot = document.createElement('main')
  boardRoot.classList.add('board-root')
  for (let i = 0; i < size * size; i++) {
    const boardCell = document.createElement('div')
    boardCell.classList.add('board-slot')
    boardRoot.appendChild(boardCell)
    const [firstIdx, secondIdx] = [~~(i / size), i % size]
    boardElements[firstIdx][secondIdx] = boardCell
  }
  document.body.appendChild(boardRoot)
  return boardElements
}
