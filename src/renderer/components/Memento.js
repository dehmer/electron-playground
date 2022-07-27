import React from 'react'
import * as Hooks from './hooks'

export const App = () => {
  const { randomScope } = Hooks.useServices()
  const [scope, setScope] = Hooks.useMemento('ui.sidebar.scope')

  React.useEffect(() => {
    const callback = () => { setScope(randomScope()) }
    const timer = setInterval(callback, 100)
    return () => clearInterval(timer)
  }, [randomScope, setScope])

  return <span>{`Scope: ${scope}`}</span>
}

export const Wrapper = () => {
  const [showing, setShowing] = Hooks.useMemento('ui.sidebar.showing')

  React.useEffect(() => {
    const callback = () => { setShowing(false) }
    const timer = setTimeout(callback, 5000)
    return () => clearInterval(timer)
  }, [setShowing])

  return showing
    ? <App/>
    : <span>Ready.</span>
}
