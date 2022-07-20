import React from 'react'

export const App = () => {

  // Exposed by context bridge in preload script.
  const versions = window.api.versions()

  return (
    <>
      <h1>Hello World!</h1>
      We are using Node.js <span>{versions.node}</span>,
      Chromium <span>{versions.chrome}</span>,
      and Electron <span>{versions.electron}</span>.
    </>
  )
}
