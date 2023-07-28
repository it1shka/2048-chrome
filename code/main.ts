import { createBoard, promptBoardSize } from './board'

function main() {
  const boardSize = promptBoardSize()
  const board = createBoard(boardSize)
  
}

main()