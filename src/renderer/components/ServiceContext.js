import React from 'react'
import { ServiceProvider } from './hooks'

export const ServiceContext = ({ children, provider }) => {
  const [services, setServices] = React.useState(null)
  React.useEffect(() => { provider().then(setServices) }, [provider])

  return services && (
    <ServiceProvider { ...services }>
      {children}
    </ServiceProvider>
  )
}
