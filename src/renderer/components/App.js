import React from 'react'
import * as Hooks from './hooks'
import './App.scss'

export const App = () => {
  const versions = Hooks.useServices('versions')

  return (
    <>
      <h1>Hello World!</h1>
      We are using Node.js <span>{versions.node}</span>,
      Chromium <span>{versions.chrome}</span>,
      and Electron <span>{versions.electron}</span>.
    </>
  )
}
