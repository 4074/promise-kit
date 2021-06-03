export class PromisePool {
  public resolves: CallableFunction[] = []
  public size = 0
  public running = 0

  public constructor(size: number) {
    this.size = size
  }

  public execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (this.size && this.running === this.size) {
      return new Promise((resolve) => {
        this.resolves.push(resolve)
      }).then(fn)
    }

    return fn().then((data) => {
      this.resolves.length ? this.resolves.shift()() : this.running -= 1
      return data
    })
  }
}

export default <P extends any[], T>(fn: (...args: P) => Promise<T>, size: number) => {
  const pool = new PromisePool(size)
  return (...args: P) => {
    return pool.execute(fn.bind(null, ...args))
  }
}