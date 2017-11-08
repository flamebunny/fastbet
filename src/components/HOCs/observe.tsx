import * as React from 'react'
import * as Rx from 'rx'
import { Record } from 'immutable'
import { TypedRecord} from 'typed-immutable-record'

export function observeImmutable<TObservable, TProps>(
  observable$: Rx.Observable<TObservable>,
  WrappedComponent: React.ComponentClass<{ record: TObservable } & TProps>  | React.StatelessComponent<{ record: TObservable } & TProps>) {
  {
    return observe<{record: TObservable}, TProps> (observable$.select((record: TObservable) => ({record})), WrappedComponent)
  }
}

export function observe<TObservable, TProps>(
  observable$: Rx.Observable<TObservable>,
  WrappedComponent: React.StatelessComponent<TObservable & TProps> |  React.ComponentClass<TObservable & TProps>  ) {
  return class ObservableHOC extends React.Component<TProps, { currentValue: TObservable, hasReceivedValue: boolean }> {
    private sub: Rx.Disposable

    constructor() {
      super()
      this.state = { currentValue: null as any, hasReceivedValue: false }
    }

    public componentWillMount() {
      this.sub = getSafeObservable(observable$).subscribe((x) => {
        this.setState({ currentValue: x, hasReceivedValue: true })
      })
    }

    public componentWillUnmount() {
      this.sub.dispose()
    }

    public render() {
      if (this.state.hasReceivedValue) {
        if (!PRODUCTION) {
          if (this.state.currentValue instanceof Record && Object.getOwnPropertyNames(this.props).length === 0) {
            return <span className='red'> Cannot merge properties into strongly typed Record, use observeImmutable.'</span>
          }
        }
        return <WrappedComponent  {...this.state.currentValue} {...this.props} />
      }
      return null
    }
  }
}

function getSafeObservable<TObservable>(observable$: Rx.Observable<TObservable>): Rx.Observable<TObservable> {
  // This is to support isomorphic rendering. If we are server side we can only render the first value from the observable.
  // componentWillUnmount does not get called: https://github.com/facebook/react/issues/3714
  const canUseDOM = !!((typeof window !== 'undefined' && window.document && window.document.createElement))
  return canUseDOM ? observable$ : observable$.first()
}
