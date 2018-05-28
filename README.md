# @n1ru4l/react-time-ago

[![npm version](https://badge.fury.io/js/%40n1ru4l%2Freact-time-ago.svg)](https://badge.fury.io/js/%40n1ru4l%2Freact-time-ago)
[![CircleCI](https://circleci.com/gh/n1ru4l/react-time-ago.svg?style=shield)](https://circleci.com/gh/n1ru4l/react-time-ago)
[![dependency status](https://david-dm.org/n1ru4l/react-time-ago/status.svg)](https://david-dm.org/n1ru4l/react-time-ago)
[![dev dependency status](https://david-dm.org/bevry/badges/dev-status.svg)](https://david-dm.org/n1ru4l/react-time-ago?type=dev)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A component for updating the format of a date based on the elapsed time.
The formatter is pluggable and extensible.
By default it will use `now`, `X minute(s) ago`, `X hour(s) ago` and `X day(s) ago`.
It uses the renderProp pattern to give you full control over how stuff is rendered.
Internally it uses [`zen-observable`](https://github.com/zenparsing/zen-observable).

Demo: https://codesandbox.io/s/34423v2v26

Differences to other available solutions:

- Works on react for the web and react-native.
- Instead of checking all dates at a given interval it checks and updates single dates only when necessary

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
      next: minuteSeconds - (d % 60),
    }
  } else if (d < daySeconds) {
    const hours = Math.floor(d / hourSeconds)
    return {
      value: `${hours} hour${hours > 1 ? `s` : ``} ago`,
      next: hourSeconds - (d % hourSeconds),
    }
  } else {
    const days = Math.floor(d / daySeconds)
    return {
      value: `${days} day${days > 1 ? `s` : ``} ago`,
      next: daySeconds - (d % daySeconds),
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

## Contributing

This repository follows [semantic versioning](https://semver.org/). A short introduction can be found [here](https://medium.com/just-meteor/understanding-semver-3f75d11b4d).

This repository also uses [semantic-release](https://github.com/semantic-release/semantic-release) for managing the releases.

Please fork this repository and checkout your clone. [Here](https://guides.github.com/activities/forking/) is a short guide for doing so.

Pull requests should be made to the [`master`](https://github.com/n1ru4l/react-time-ago/tree/master) branch. Therefore if you develop you should always branch off `master`.

Install the dependencies using `yarn`.

Please to use `yarn cm` for committing changes.

Create your [Pull Request](https://guides.github.com/activities/forking/#making-a-pull-request) as soon as possible. So you can obtain feedback early and prevent multiple people working on the same thing.

Make sure all changes you make are covered by tests. You can run those with `yarn test`. Also you can run the interactive watch mode (`yarn test --watch`). This repository is using [`jest`](https://facebook.github.io/jest/docs/en/getting-started.html) for testing.
