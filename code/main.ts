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
    Keyboard.addMultikeyBinding(['w', 'W', 'ArrowUp'],    this.moveUp)
    Keyboard.addMultikeyBinding(['d', 'D', 'ArrowRight'], this.moveRight)
    Keyboard.addMultikeyBinding(['s', 'S', 'ArrowDown'],  this.moveDown)
    Keyboard.addMultikeyBinding(['a', 'A', 'ArrowLeft'],  this.moveLeft)
  }

  private moveUp = () => {}
  private moveRight = () => {}
  private moveDown = () => {}
  private moveLeft = () => {}

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

  private spawnNumbers = async (amount: number) => {
    const freeSpace = this.getFreeSpace()
    const chosenSpace = sample(freeSpace, amount)
    const spawned = new Array<HTMLElement>()
    for (const [row, col] of chosenSpace) {
      const numberElement = document.createElement('div')
      numberElement.classList.add('board-number', 'inactive')
      const [top, left] = this.pivots[row][col]
      numberElement.style.top = `${top}px`
      numberElement.style.left = `${left}px`
      const numberValue = randomElement(['2', '4'])
      numberElement.textContent = numberValue
      numberElement.setAttribute('value', numberValue)
      colorBoardNumber(numberElement)

      this.elements[row][col] = numberElement
      document.body.appendChild(numberElement)
      spawned.push(numberElement)
    }
    await sleep(10)
    spawned.forEach(element => {
      element.classList.remove('inactive')
    })
  }

  private deleteNumberAt = (row: number, column: number) => {
    const element = this.elements[row][column]
    element?.remove()
    this.elements[row][column] = null
  }
}

export default new Game2048()