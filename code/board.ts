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
  const boardRoot = document.createElement('main')
  boardRoot.classList.add('board-root')
  boardRoot.style.gridTemplateRows = `repeat(${size}, 1fr)`
  boardRoot.style.gridTemplateColumns = `repeat(${size}, 1fr)`
  for (let i = 0; i < size * size; i++) {
    const boardCell = document.createElement('div')
    boardCell.classList.add('board-slot')
    boardRoot.appendChild(boardCell)
  }
  document.body.appendChild(boardRoot)
  return boardRoot
}

export function getBoardPivots(boardElement: HTMLElement) {
  const children = Array.from(boardElement.children)
  const size = Math.sqrt(children.length)
  const pivots = new Array<Array<readonly [number, number]>>(size)

  for (let row = 0; row < size; row++) {
    const rowPivots = new Array<readonly [number, number]>(size)
    for (let col = 0; col < size; col++) {
      const index = row * size + col
      const child = children[index]
      const rect = child.getBoundingClientRect()
      rowPivots[col] = [rect.top, rect.left]
    }
    pivots[row] = rowPivots
  }

  return pivots
}

export function colorBoardNumber(numberElement: HTMLElement) {
  const numberValue = numberElement.textContent
  const color = ((): string => {
    switch (numberValue) {
      case '2':    return '#ebae34'
      case '4':    return '#c99428'
      case '8':    return '#bf6021'
      case '16':   return '#c73312'
      case '32':   return '#b31e30'
      case '64':   return '#bf3691'
      case '128':  return '#9d2fc2'
      case '256':  return '#4426c9'
      case '512':  return '#1c58d9'
      case '1024': return '#6ba10e'
      default: return 'black'
    }
  })()
  numberElement.style.backgroundColor = color
}
