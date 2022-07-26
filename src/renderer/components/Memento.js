import React from 'react'
import * as Hooks from './hooks'

export const App = () => {
  const { randomScope } = Hooks.useServices()
  const [scope, setScope] = Hooks.useMemento('ui.sidebar.scope')

  React.useEffect(() => {
    const callback = () => { setScope(randomScope()) }
    const timer = setInterval(callback, 1000)
    return () => clearInterval(timer)
  }, [randomScope, setScope])

  return <span>{`Scope: ${scope}`}</span>
}
