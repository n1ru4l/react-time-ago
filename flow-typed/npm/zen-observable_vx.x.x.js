declare module "zen-observable" {
  declare type Observer<T> = {
    next: T => void,
    error: any => void,
    complete: () => void
  };

  declare type Subscription<T> = {
    unsubscribe: () => void,
    closed: boolean
  };

  declare class Observable<T> {
    constructor(subscriber: (Observer<T>) => () => void): Observable<T>;
    subscribe(observer: (T) => void): Subscription<T>;

    subscribe({
      next: T => void,
      error?: Error => void
    }): Subscription<T>;
  }
  declare module.exports: typeof Observable;
}
