import React from 'react'
import { createRoot } from 'react-dom/client'
import levelup from 'levelup'
import memdown from 'memdown'
import encode from 'encoding-down'
import uuid from 'uuid-random'
import { ServiceContext } from './components/ServiceContext'
import { App } from './components/Memento'

const services = async () => {
  const versions = process.versions
  const scopes = ['layer', 'feature', 'link', 'symbol', 'marker']
  const randomScope = () => scopes[Math.floor(Math.random() * scopes.length)]
  const store = levelup(encode(memdown(), { valueEncoding: 'json' }))

  await store.batch([
    { type: 'put', key: 'ui.sidebar.showing', value: true },
    { type: 'put', key: 'ui.sidebar.scope', value: scopes[0] },
    { type: 'put', key: 'ui.sidebar.filter', value: uuid() }
  ])

  return {
    versions,
    store,
    scopes,
    randomScope
  }
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(
  <ServiceContext provider={services}>
    <App/>
  </ServiceContext>
)
