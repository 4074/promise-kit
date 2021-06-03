
type CallablePromiseFunction = (...args: any[]) => Promise<any>

export default class PromisePool {
  resolves: CallableFunction[] = []
  running = 0

  constructor(public size: number) { }

  execute = (fn: CallablePromiseFunction) => {
    if (this.running === this.size) {
      return new Promise((resolve) => {
        this.resolves.push(resolve)
      }).then(fn)
    }

    return fn().then((data) => {
      if (this.resolves.length) {
        this.resolves.shift()()
      } else {
        this.running -= 1
      }
      return data
    })
  }
}