import Observable from 'zen-observable'

const minuteSeconds = 60
const hourSeconds = minuteSeconds * 60
const daySeconds = hourSeconds * 24

export function getPitString(date, now) {
  const d = now - date

  if (d < minuteSeconds * 2) {
    return {
      value: `now`,
      next: minuteSeconds * 2 - d,
    }
  } else if (d < hourSeconds) {
    const minutes = Math.floor(d / minuteSeconds)
    return {
      value: `${minutes} minutes ago`,
      next: minuteSeconds - d % 60,
    }
  } else if (d < daySeconds) {
    const hours = Math.floor(d / hourSeconds)
    return {
      value: `${hours} hour${hours > 1 ? `s` : ``} ago`,
      next: hourSeconds - d % hourSeconds,
    }
  } else {
    const days = Math.floor(d / daySeconds)
    return {
      value: `${days} day${days > 1 ? `s` : ``} ago`,
      next: daySeconds - d % daySeconds,
    }
  }
}

export function createPitObservable(
  date = new Date(),
  _getPitString = getPitString,
) {
  return new Observable(observer => {
    let pendingTimeout = undefined
    const initial = date.getTime() / 1000

    function update() {
      const now = new Date().getTime() / 1000
      const { value, next } = _getPitString(initial, now)
      observer.next(value)
      pendingTimeout = setTimeout(update, next * 1000)
    }

    update()

    return () => {
      console.log(`waaat`)
      if (pendingTimeout === undefined) return
      clearTimeout(pendingTimeout)
    }
  })
}
