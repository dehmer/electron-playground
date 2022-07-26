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
