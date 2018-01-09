# @n1ru4l/react-time-ago

A component for updating the format of a date based on the elapsed time.
The formatter is pluggable and extensible.
By default it will use `now`, `X minute(s) ago`, `X hour(s) ago` and `X day(s) ago`.
It uses the renderProp pattern to give you full control over how stuff is rendered.
Internally it uses [`zen-observable`](https://github.com/zenparsing/zen-observable).

Demo: https://codesandbox.io/s/34423v2v26

Differences to other available solutions:

* Works on react for the web and react-native.
* Instead of checking all dates at a given interval it checks and updates single dates only when necessary

## Install

```bash
yarn add @n1ru4l/react-time-ago
```

## Usage

### Default

```jsx
import ReactDOM from 'react-dom'
import React from 'react'
import { TimeAgo } from '@n1ru4l/react-time-ago'

ReactDOM.render(
  <TimeAgo
    date={new Date()}
    render={({ error, value }) => <span>{value}</span>}
  />,
  document.querySelector(`#main`)
)
```

or

```jsx
import ReactDOM from 'react-dom'
import React from 'react'
import { TimeAgo } from '@n1ru4l/react-time-ago'

ReactDOM.render(
  <TimeAgo>{({ error, value }) => <span>{value}</span>}</TimeAgo>,
  document.querySelector(`#main`)
)
```

### Custom Date Formatter

```jsx
import ReactDOM from 'react-dom'
import React from 'react'
import { TimeAgo } from '@n1ru4l/react-time-ago'

const minuteSeconds = 60
const hourSeconds = minuteSeconds * 60
const daySeconds = hourSeconds * 24

function formatter(date, now) {
  const d = now - date

  if (d < minuteSeconds * 2) {
    return {
      value: `now`, // this is the value should be displayed
      next: minuteSeconds * 2 - d, // this number is used to schedule the next update of a value
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
  <TimeAgo date={new Date()} formatter={formatter}>
    {({ error, value }) => <span>{value}</span>}
  </TimeAgo>,
  document.querySelector(`#main`)
)
```

## API Docs

TODO
