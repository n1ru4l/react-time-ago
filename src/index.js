//@flow
import Observable, { type Subscription } from "zen-observable";
import { Component, type Node } from "react";

const minuteSeconds = 60;
const hourSeconds = minuteSeconds * 60;
const daySeconds = hourSeconds * 24;

export type FormatDateFunction = (
  date: number,
  now: number
) => { value: string, next: number };

export function formatDate(date: number, now: number) {
  const d = now - date;

  if (d < minuteSeconds * 2) {
    return {
      value: `now`,
      next: minuteSeconds * 2 - d
    };
  } else if (d < hourSeconds) {
    const minutes = Math.floor(d / minuteSeconds);
    return {
      value: `${minutes}m ago`,
      next: minuteSeconds - (d % 60)
    };
  } else if (d < daySeconds) {
    const hours = Math.floor(d / hourSeconds);
    return {
      value: `${hours}h ago`,
      next: hourSeconds - (d % hourSeconds)
    };
  } else {
    const days = Math.floor(d / daySeconds);
    return {
      value: `${days}d ago`,
      next: daySeconds - (d % daySeconds)
    };
  }
}

export function createTimeAgoObservable(
  date?: Date = new Date(),
  _formatDate?: FormatDateFunction = formatDate
): Observable<string> {
  return new Observable(observer => {
    let pendingTimeout = undefined;
    const initial = date.getTime() / 1000;

    function update() {
      const now = new Date().getTime() / 1000;
      const { value, next } = _formatDate(initial, now);
      observer.next(value);
      pendingTimeout = setTimeout(update, next * 1000);
    }

    update();

    return () => {
      if (pendingTimeout === undefined) return;
      clearTimeout(pendingTimeout);
    };
  });
}

export type TimeAgoRenderFunction = ({
  value?: string,
  error?: string
}) => Node;

export type TimeAgoPropTypes =
  | {
      date: Date,
      formatter?: FormatDateFunction,
      render: TimeAgoRenderFunction,
      children: void
    }
  | {
      date: Date,
      formatter?: FormatDateFunction,
      render: void,
      children: TimeAgoRenderFunction
    };

export type TimeAgoStateTypes = {
  error?: string,
  value?: string
};

export class TimeAgo extends Component<TimeAgoPropTypes, TimeAgoStateTypes> {
  subscription: Subscription<string>;
  constructor(props: TimeAgoPropTypes) {
    super((props: TimeAgoPropTypes));
    const {
      props: { formatter = formatDate, date }
    } = this;
    const { value } = formatter(
      date.getTime() / 1000,
      new Date().getTime() / 1000
    );
    this.state = {
      error: undefined,
      value
    };
    this.subscription = createTimeAgoObservable(date, formatter).subscribe({
      next: value => {
        if (value === this.state.value) {
          return;
        }
        this.setState({ value });
      },
      error: error => {
        this.setState({ error: error.toString(), value: undefined });
      }
    });
  }

  componentWillUnmount() {
    if (!this.subscription) {
      return;
    }
    this.subscription.unsubscribe();
  }

  componentWillReceiveProps(nextProps: TimeAgoPropTypes) {
    if (this.props.date.getTime() !== nextProps.date.getTime()) {
      this.subscription.unsubscribe();
      const { value } = (this.props.formatter || formatDate)(
        nextProps.date.getTime() / 1000,
        new Date().getTime() / 1000
      );
      this.setState({ value });

      this.subscription = createTimeAgoObservable(
        nextProps.date,
        this.props.formatter
      ).subscribe({
        next: value => {
          if (value === this.state.value) {
            return;
          }
          this.setState({ value });
        },
        error: error =>
          this.setState({ error: error.toString(), value: undefined })
      });
    }
  }

  render() {
    return (this.props.children || this.props.render)(this.state);
  }
}
