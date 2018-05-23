import Observable from 'zen-observable'
import { Component } from 'react'
import PropTypes from 'prop-types'

const minuteSeconds = 60
const hourSeconds = minuteSeconds * 60
const daySeconds = hourSeconds * 24

export function formatDate(date, now) {
  const d = now - date

  if (d < minuteSeconds * 2) {
    return {
      value: `now`,
      next: minuteSeconds * 2 - d,
    }
  } else if (d < hourSeconds) {
    const minutes = Math.floor(d / minuteSeconds)
    return {
      value: `${minutes}m ago`,
      next: minuteSeconds - d % 60,
    }
  } else if (d < daySeconds) {
    const hours = Math.floor(d / hourSeconds)
    return {
      value: `${hours}h ago`,
      next: hourSeconds - d % hourSeconds,
    }
  } else {
    const days = Math.floor(d / daySeconds)
    return {
      value: `${days}d ago`,
      next: daySeconds - d % daySeconds,
    }
  }
}

export function createTimeAgoObservable(
  date = new Date(),
  _formatDate = formatDate
) {
  return new Observable(observer => {
    let pendingTimeout = undefined
    const initial = date.getTime() / 1000

    function update() {
      const now = new Date().getTime() / 1000
      const { value, next } = _formatDate(initial, now)
      observer.next(value)
      pendingTimeout = setTimeout(update, next * 1000)
    }

    update()

    return () => {
      if (pendingTimeout === undefined) return
      clearTimeout(pendingTimeout)
    }
  })
}

export class TimeAgo extends Component {
  constructor(...args) {
    super(...args)
    const {
      props: { formatter, date },
    } = this
    const { value } = formatter(
      date.getTime() / 1000,
      new Date().getTime() / 1000
    )
    this.state = {
      error: undefined,
      value,
    }
    this.subscription = undefined
  }
  componentWillMount() {
    const {
      props: { date, formatter },
    } = this
    this.subscription = createTimeAgoObservable(date, formatter).subscribe({
      next: value => {
        if (value === this.state.value) {
          return
        }
        this.setState({ value })
      },
      error: error => this.setState({ error, value: undefined }),
    })
  }

  componentWillUnmount() {
    if (!this.subscription) {
      return
    }
    this.subscription.unsubscribe()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.date.getTime() !== nextProps.date.getTime()) {
      this.subscription.unsubscribe()
      const { value } = this.props.formatter(
        nextProps.date.getTime() / 1000,
        new Date().getTime() / 1000
      )
      this.setState({ value })

      this.subscription = createTimeAgoObservable(
        nextProps.date,
        this.props.formatter
      ).subscribe({
        next: value => {
          if (value === this.state.value) {
            return
          }
          this.setState({ value })
        },
        error: error => this.setState({ error, value: undefined }),
      })
    }
  }

  render() {
    const {
      state: { error, value },
      props: { render, children },
    } = this
    return (children || render)({ error, value })
  }
}

TimeAgo.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  render: PropTypes.func,
  formatter: PropTypes.func,
}

TimeAgo.defaultProps = {
  formatter: formatDate,
}
