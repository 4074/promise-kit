import { poolify } from '../src'

describe('poolify', () => {
  it('should execute in order', async () => {
    const fn = async (i: number, d: number) => new Promise((resolve) => {
      setTimeout(() => {
        resolve(i)
      }, d)
    })

    const pooled = poolify(fn, 3)
    const durations = [100, 100, 300, 100, 50, 100, 100]
    const order = [0, 1, 4, 3, 5, 2, 6]
    const result = []

    const promises = durations.map((d, i) => pooled(i, d).then((i) => {
      result.push(i)
      return i
    }))
    const data = await Promise.all(promises)

    expect(data.join(',')).toEqual(durations.map((_, i) => i).join(','))
    expect(result.join(',')).toEqual(order.join(','))
  })
})