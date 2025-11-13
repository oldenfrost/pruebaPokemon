import { render } from '@testing-library/vue'
import { nextTick } from 'vue'
import Countdown from '../src/components/Countdown.vue'

describe('Countdown (simple)', () => {
  beforeEach(() => { jest.useFakeTimers() })
  afterEach(() => { jest.useRealTimers(); jest.clearAllTimers() })

  test('cuenta regresiva y emite finished', async () => {
    const { getByText, queryByText, emitted } = render(Countdown, { props: { startFrom: 3, final: true } })

    getByText('3')
    jest.advanceTimersByTime(1000)
    await nextTick()
    getByText('2')
    jest.advanceTimersByTime(2000)
    await nextTick()
    expect(queryByText('1')).toBeNull()
    const ev = emitted()['finished']
    expect(ev).toBeTruthy()
    expect(ev[0]).toEqual([true])
  })
})
