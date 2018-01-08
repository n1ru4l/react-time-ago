import each from 'jest-each'
import lolex from 'lolex'
import { createElement } from 'react'
import Enzyme, { mount } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

import { getPitString, createPitObservable, PointInTimeIndicator } from '.'

Enzyme.configure({ adapter: new EnzymeAdapter() })

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

describe(`createPitObservable`, () => {
  it(`publishes stuff`, () => {
    expect.assertions(1)

    const emittedValues = []

    const clock = lolex.install()
    const observable = createPitObservable(new Date())
    observable.subscribe(value => {
      emittedValues.push(value)
    })

    expect(emittedValues).toEqual([`now`])
    clock.uninstall()
  })

  it(`publishes multiple values over time`, () => {
    expect.assertions(1)

    const emittedValues = []

    const clock = lolex.install()
    const observable = createPitObservable(new Date())
    observable.subscribe(value => {
      emittedValues.push(value)
    })
    clock.tick(`02:00`)
    expect(emittedValues).toEqual([`now`, `2 minutes ago`])
    clock.uninstall()
  })

  it(`does not publish values that are in the past`, () => {
    expect.assertions(1)

    const emittedValues = []

    const clock = lolex.install()

    const observable = createPitObservable(new Date())
    clock.tick(`05:00`)

    observable.subscribe(value => {
      emittedValues.push(value)
    })
    expect(emittedValues).toEqual([`5 minutes ago`])
    clock.uninstall()
  })
})

describe(`<PointInTimeIndicator />`, () => {
  const render = ({ value, error } = {}) => createElement(`span`, null, value)

  it(`can be mounted`, () => {
    expect.assertions(1)

    const clock = lolex.install()

    const element = mount(
      createElement(PointInTimeIndicator, { date: new Date() }, render),
    )
    expect(element.text()).toEqual(`now`)
    clock.uninstall()
  })

  it(`also supports a render prop`, () => {
    expect.assertions(1)

    const clock = lolex.install()

    const element = mount(
      createElement(PointInTimeIndicator, { date: new Date(), render }),
    )
    expect(element.text()).toEqual(`now`)
    clock.uninstall()
  })

  it(`can update the date over time`, () => {
    expect.assertions(3)

    const clock = lolex.install()

    const element = mount(
      createElement(PointInTimeIndicator, { date: new Date() }, render),
    )
    expect(element.text()).toEqual(`now`)
    clock.tick(`02:00`)
    expect(element.text()).toEqual(`2 minutes ago`)
    clock.tick(`01:00:00`)
    expect(element.text()).toEqual(`1 hour ago`)
    clock.uninstall()
  })
})
