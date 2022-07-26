import React from 'react'
import { createRoot } from 'react-dom/client'
import { ServiceContext } from './components/ServiceContext'
import { App } from './components/App'

const services = async () => ({
  versions: process.versions
})

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(
  <ServiceContext provider={services}>
    <App/>
  </ServiceContext>
)
