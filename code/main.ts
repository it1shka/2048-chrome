import { colorBoardNumber, createBoard, getBoardPivots, promptBoardSize } from './board'
import { Matrix, matrixOf, sample, randomElement, Keyboard, sleep } from './utils'

class Game2048 {
  private pivots: Matrix<readonly [number, number]>
  private elements: Matrix<HTMLElement | null>

  constructor() {
    const boardSize = promptBoardSize()
    const boardElement = createBoard(boardSize)
    this.pivots = getBoardPivots(boardElement)
    this.elements = matrixOf(boardSize, boardSize, null)
    this.bindKeys()
    this.startGame()
  }

  private startGame = () => {
    for (let i = 0; i < this.elements.length; i++) {
      for (let j = 0; j < this.elements[i].length; j++) {
        this.deleteNumberAt(i, j)
      }
    }
    this.spawnNumbers(2)
  }

  private bindKeys = () => {
    Keyboard.addBinding('r', this.startGame)
    Keyboard.addMultikeyBinding(['w', 'W', 'ArrowUp'   ],    this.moveUp   )
    Keyboard.addMultikeyBinding(['d', 'D', 'ArrowRight'],    this.moveRight)
    Keyboard.addMultikeyBinding(['s', 'S', 'ArrowDown' ],    this.moveDown )
    Keyboard.addMultikeyBinding(['a', 'A', 'ArrowLeft' ],    this.moveLeft )
  }

  // i dont give a fuck about repetitive code,
  // fuck you if you actually care

  private moveUp = () => {
    for (let col = 0; col < this.elements.length; col++) {
      for (let row = 1; row < this.elements.length; row++) {

        const element = this.elements[row][col]
        if (!element) continue

        let moveIndex = row
        while (true) {
          if (moveIndex <= 0) break
          const currentElement = this.elements[moveIndex][col]
          if (currentElement !== element && currentElement && currentElement.textContent === element.textContent) break
          const nextElement = this.elements[moveIndex - 1][col]
          if (nextElement && nextElement.textContent !== element.textContent) break
          moveIndex--
        }

        if (moveIndex === row) continue
        this.moveElement(row, col, moveIndex, col)        
      }
    }
    this.spawnNumbers(1)
  }

  private moveLeft = () => {
    for (let row = 0; row < this.elements.length; row++) {
      for (let col = 1; col < this.elements.length; col++) {

        const element = this.elements[row][col]
        if (!element) continue

        let moveIndex = col
        while (true) {
          if (moveIndex <= 0) break
          const currentElement = this.elements[row][moveIndex]
          if (currentElement !== element && currentElement && currentElement.textContent === element.textContent) break
          const nextElement = this.elements[row][moveIndex - 1]
          if (nextElement && nextElement.textContent !== element.textContent) break
          moveIndex--
        }

        if (moveIndex === col) continue
        this.moveElement(row, col, row, moveIndex)        
      }
    }
    this.spawnNumbers(1)
  }

  private moveDown = () => {
    for (let col = 0; col < this.elements.length; col++) {
      for (let row = this.elements.length - 2; row >= 0; row--) {

        const element = this.elements[row][col]
        if (!element) continue

        let moveIndex = row
        while (true) {
          if (moveIndex >= this.elements.length - 1) break
          const currentElement = this.elements[moveIndex][col]
          if (currentElement !== element && currentElement && currentElement.textContent === element.textContent) break
          const nextElement = this.elements[moveIndex + 1][col]
          if (nextElement && nextElement.textContent !== element.textContent) break
          moveIndex++
        }

        if (moveIndex === row) continue
        this.moveElement(row, col, moveIndex, col)        
      }
    }
    this.spawnNumbers(1)
  }

  private moveRight = () => {
    for (let row = 0; row < this.elements.length; row++) {
      for (let col = this.elements.length - 2; col >= 0; col--) {

        const element = this.elements[row][col]
        if (!element) continue

        let moveIndex = col
        while (true) {
          if (moveIndex >= this.elements.length - 1) break
          const currentElement = this.elements[row][moveIndex]
          if (currentElement !== element && currentElement && currentElement.textContent === element.textContent) break
          const nextElement = this.elements[row][moveIndex + 1]
          if (nextElement && nextElement.textContent !== element.textContent) break
          moveIndex++
        }

        if (moveIndex === col) continue
        this.moveElement(row, col, row, moveIndex)        
      }
    }
    this.spawnNumbers(1)
  }

  private moveElement = (
    fromRow: number, fromCol: number,
    toRow: number, toCol: number
  ) => {
    const fromElement = this.elements[fromRow][fromCol]!
    this.elements[fromRow][fromCol] = null
    this.translateElement(fromElement, toRow, toCol)
    const toElement = this.elements[toRow][toCol]

    if (!toElement) { // empty space
      this.elements[toRow][toCol] = fromElement
      return
    } 

    // increase existing
    toElement.textContent = String(Number(fromElement.textContent) * 2)
    colorBoardNumber(toElement)
    setTimeout(() => fromElement.remove(), 300)
  }

  private translateElement = (
    element: HTMLElement,
    row: number, column: number
  ) => {
    const [top, left] = this.pivots[row][column]
    element.style.top = `${top}px`
    element.style.left = `${left}px`
  }

  private getFreeSpace = () => {
    const space = new Array<readonly [number, number]>()
    for (let i = 0; i < this.elements.length; i++) {
      for (let j = 0; j < this.elements[i].length; j++) {
        const maybeElement = this.elements[i][j]
        if (!maybeElement) {
          space.push([i, j])
        }
      }
    }
    return space
  }

  private spawnNumbers = (amount: number) => {
    const freeSpace = this.getFreeSpace()
    const chosenSpace = sample(freeSpace, amount)
    const spawned = new Array<HTMLElement>()

    for (const [row, col] of chosenSpace) {
      // creating an element and adding some classes
      const numberElement = document.createElement('div')
      numberElement.classList.add('board-number', 'inactive')
      // setting the position
      this.translateElement(numberElement, row, col)
      // setting the value and coloring
      numberElement.textContent = randomElement(['2', '4'])
      colorBoardNumber(numberElement)

      this.elements[row][col] = numberElement
      document.body.appendChild(numberElement)
      spawned.push(numberElement)
    }

    // animation
    setInterval(() => {
      spawned.forEach(element => {
        element.classList.remove('inactive')
      })
    })
  }

  private deleteNumberAt = (row: number, column: number) => {
    const element = this.elements[row][column]
    element?.remove()
    this.elements[row][column] = null
  }
}

export default new Game2048()