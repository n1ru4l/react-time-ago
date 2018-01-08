import each from 'jest-each'
import { getPitString } from '.'

describe(`getPitString`, () => {
  const initial = Math.floor(new Date().getTime() / 1000)

  each([
    [initial, initial, `now`, 120],
    [initial, initial + 119, `now`, 1],
    [initial, initial + 120, `2 minutes ago`, 60],
    [initial, initial + 121, `2 minutes ago`, 59],
    [initial, initial + 60 * 59, `59 minutes ago`, 60],
    [initial, initial + 60 * 59 + 59, `59 minutes ago`, 1],
    [initial, initial + 60 * 60, `1 hour ago`, 3600],
    [initial, initial + 60 * 60 * 2 - 1, `1 hour ago`, 1],
    [initial, initial + 60 * 120, `2 hours ago`, 3600],
    [initial, initial + 60 * 60 * 24 - 1, `23 hours ago`, 1],
    [initial, initial + 60 * 60 * 24, `1 day ago`, 60 * 60 * 24],
    [initial, initial + 60 * 60 * 24 * 2, `2 days ago`, 60 * 60 * 24],
    [initial, initial + 60 * 60 * 24 * 2 + 3, `2 days ago`, 60 * 60 * 24 - 3],
  ]).test(
    `returns the correct value for the start date %s and the current date %s which is '%s' and the next update in %s seconds`,
    (date, now, value, next) => {
      expect(getPitString(initial, now)).toEqual({
        value,
        next,
      })
    },
  )
})
