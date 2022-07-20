import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './components/App'

/*
  Cannot be used due to context isolation and
  lack of node integration:

  import { ipcRenderer } from 'electron'
  import path from 'path'
*/

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App/>)
