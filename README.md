# react-point-in-time

A component for updating the format of a date based on the elapsed time.
The formatter is pluggable and extensible.
By default it will use `now`, `X minute(s) ago`, `X hour(s) ago` and `X day(s) ago`.
It uses the renderProp pattern to give you full control over how stuff is rendered.
Internally it uses [`zen-observable`](https://github.com/zenparsing/zen-observable).

## Install

Not published to NPM (yet).

```bash
yarn add react-point-in-time@https://github.com/n1ru4l/react-point-in-time.git
```

## Usage

### Default

```jsx
import { PointInTimeIndicator } from 'react-point-in-time'

ReactDOM.render(
  <PointInTimeIndicator
    date={new Date()}
    render={({ error, value }) => <span>{value}</span>}
  />,
  document.querySelector(`#main`),
)
```

or

```jsx
import { PointInTimeIndicator } from 'react-point-in-time'

ReactDOM.render(
  <PointInTimeIndicator date={new Date()}>
    {({ error, value }) => <span>{value}</span>}
  </PointInTimeIndicator>,
  document.querySelector(`#main`),
)
```

### Custom Date Formatter

```jsx
import { PointInTimeIndicator } from 'react-point-in-time'

const minuteSeconds = 60
const hourSeconds = minuteSeconds * 60
const daySeconds = hourSeconds * 24

function formatter(date, now) {
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

ReactDOM.render(
  <PointInTimeIndicator date={new Date()} formatter={formatter}>
    {({ error, value }) => <span>{value}</span>}
  </PointInTimeIndicator>,
  document.querySelector(`#main`),
)
```

## API Docs

TODO
