export type Matrix<T> = T[][]

export function matrixOf<T>(rows: number, columns?: number, value?: T) {
  if (!columns) columns = rows
  const matrix = new Array(rows) as Matrix<T>
  for (let row = 0; row < rows; row++) {
    matrix[row] = new Array(columns)
    if (value) matrix[row].fill(value)
  }
  return matrix
}

export function sample<T>(array: T[], size: number) {
  if (size <= 0) {
    throw new Error(`Invalid size for sample: ${size}`)
  }
  const randomized = [...array].sort(() => Math.random() - 0.5)
  const sample = randomized.slice(0, size)
  return sample
}

export function randomElement<T>(array: T[]) {
  const index = ~~(Math.random() * array.length)
  const element = array[index]
  return element
}

export function sleep(delay: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, delay)
  })
}

export function removeElement<T>(array: T[], element: T) {
  const index = array.indexOf(element)
  if (index === -1) return false
  array.splice(index, 1)
  return true
}

export const Keyboard = new class {
  private readonly bindings: {[key: string]: Array<() => any>} = {}

  constructor() {
    window.addEventListener('keydown', event => {
      const code = event.key
      const bucket = this.bindings[code]
      if (!bucket) return
      bucket.forEach(action => action())
    })
  }

  addBinding(key: string, binding: () => any) {
    if (!this.bindings[key]) {
      this.bindings[key] = new Array()
    }
    this.bindings[key].push(binding)
  }

  removeBinding(key: string, binding: () => any) {
    const maybeBucket = this.bindings[key]
    if (!maybeBucket) return false
    return removeElement(maybeBucket, binding)
  }
}