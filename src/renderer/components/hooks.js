import * as R from 'ramda'
import React from 'react'

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
    // Get initial value; expect key to be present.
    (async () => setValue(await store.get(key)))()
    const handler = (k, v) => k === key && setValue(v)
    store.on('put', handler)
    return () => store.off('put', handler)
  }, [store, key])

  return [value, put]
}
