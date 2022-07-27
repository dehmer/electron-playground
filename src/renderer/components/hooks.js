import React from 'react'
import { newDefaultScheduler, currentTime } from '@most/scheduler'
import * as Most from '@most/core'

const ServiceContext = React.createContext({})

export const ServiceProvider = props => {
  const { children, ...services } = props

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  )
}


/**
 * useServices :: () => {k, v}
 * useServices :: [k] => [v]
 * useServices :: k => v
 */
export const useServices = arg => {
  const services = React.useContext(ServiceContext)
  return arg
    ? Array.isArray(arg)
      ? arg.map(key => services[key])
      : services[arg]
    : services
}

// --> REACTIVE STREAMS

const addEventListener = (type, target, handler) => {
  if (target.addEventListener) target.addEventListener(type, handler)
  else if (target.on) target.on(type, handler)
  else console.error('cannot register handler', type, target)
}

const removeEventListener = (type, target, handler) => {
  if (target.removeEventListener) target.removeEventListener(type, handler)
  else if (target.off) target.off(type, handler)
  else console.error('cannot deregister handler', type, target)
}

const pipe = ops => stream => ops.reduce((acc, op) => op(acc), stream)
const fromListeners = (types, target) => ({
  run: (sink, scheduler) => {
    const push = (...event) => sink.event(currentTime(scheduler), event)
    types.forEach(type => addEventListener(type, target, push))

    return {
      dispose: () => types.forEach(type => removeEventListener(type, target, push))
    }
  }
})

// Sink
export class Invoker {
  constructor (callback) { this.callback = callback }
  event (time, x) { this.callback(x) }
  end () {}
  error () {}
}

const valueObserver = (store, key, callback) => {
  const tuple = async key => [key, await store.get(key)]

  const pipeline = pipe([
    Most.startWith(tuple(key)),
    Most.map(x => Promise.resolve(x)),
    Most.awaitPromises,
    Most.filter(([k]) => k === key),
    Most.map(([k, v]) => v)
  ])

  const sink = new Invoker(callback)
  const scheduler = newDefaultScheduler()
  const stream = pipeline(fromListeners(['put'], store))
  const disposable = Most.run(sink, scheduler, stream)
  return () => disposable.dispose()
}

// <-- REACTIVE STREAMS

export const useMemento = key => {
  const { store } = useServices()
  const [value, setValue] = React.useState(null)

  // Q: Why useCallack()?
  // A: See diary, July 22, 2022 - Chapter 2 - Two-way Binding
  //
  const put = React.useCallback(value => {
    store.put(key, value)
  }, [store, key])

  React.useEffect(() => {
    return valueObserver(store, key, setValue)
  }, [store, key])

  return [value, put]
}
