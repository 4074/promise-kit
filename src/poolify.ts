export class PromisePool {
  public resolves: CallableFunction[] = []
  public size = 0
  public running = 0

  public constructor(size: number) {
    this.size = size
  }

  public execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    const executor = this.createExecutor(fn)

    if (this.size && this.running === this.size) {
      return new Promise((resolve) => {
        this.resolves.push(resolve)
      }).then(executor)
    }

    return executor()
  }

  private createExecutor = <T>(fn: () => Promise<T>) => async () => {
    this.running += 1
    return fn().then((data) => {
      this.running -= 1
      this.resolves.length && this.resolves.shift()()
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