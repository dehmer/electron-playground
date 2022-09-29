import * as R from 'ramda'
import React from 'react'
import * as ol from 'ol'
import OSM from 'ol/source/OSM'
import { Tile as TileLayer } from 'ol/layer'
import Icon from '@mdi/react'
import * as mdi from '@mdi/js'
import ms from 'milsymbol'
import uuid from 'uuid-random'
import './index.scss'
import descriptors from './2525c.json'
import KBar from './kbar'

const Map = () => {
  React.useEffect(() => {
    const target = document.getElementById('map')
    const tileLayer = new TileLayer({ source: new OSM() })
    const layers = [tileLayer]
    const center = [1740294.4412834928, 6145380.806904582]
    const zoom = 14
    const view = new ol.View({ center, zoom })
    const map = new ol.Map({ layers, target, view, controls: [] })
    console.log(map)
  })

  return (
    <div
      id='map'
      className='map fullscreen'
      tabIndex='0'
    />
  )
}

function setCharAt (s, i, c) {
  if (i > s.length - 1) return s
  return s.substring(0, i) + c + s.substring(i + 1)
}

export const url = sidc => {
  const symbol = new ms.Symbol(sidc, { size: 30, fill: false, monoColor: 'currentcolor' })
  return symbol.asSVG()
}

const globalActions = [
  {
    id: 'command:create:layer',
    name: 'Create - New Layer',
    keywords: ['create', 'new', 'layer'],
    shortcut: ['$mod+N L'],
    perform: () => console.log('perform/command:create:layer'),
    dryRun: () => {}
  },
  {
    id: 'command:create:bookmark',
    name: 'Create - New Bookmark',
    keywords: ['create', 'new', 'bookmark'],
    shortcut: ['$mod+N B'],
    perform: () => console.log('perform/command:create:bookmark'),
    dryRun: () => {}
  },
  {
    id: 'command:create:xyz',
    name: 'Create - New XYZ',
    keywords: ['create', 'new', 'xyz'],
    shortcut: ['Control+Shift+X'],
    perform: () => console.log('perform/command:create:xyz'),
    dryRun: () => {}
  },
  {
    id: 'command:create:abc',
    name: 'Create - New ABC',
    keywords: ['create', 'new', 'abc'],
    shortcut: ['Option+B'],
    perform: () => console.log('perform/command:create:abc'),
    dryRun: () => {}
  }
]

const actions = descriptors
  .filter(R.propEq('geometry', 'Point'))
  .map((descriptor, index) => {
    const { hierarchy } = descriptor
    const sidc = setCharAt(setCharAt(descriptor.sidc, 1, 'F'), 3, 'P')

    // Note: name and subtitle is automatically added to keywords.
    // const keywords = R.uniq(R.dropLast(1, hierarchy).flatMap(s => s.split(' ')))
    const keywords = R.uniq(hierarchy.flatMap(s => s.split(' ')))
    return {
      id: sidc,
      name: R.last(hierarchy),
      keywords,
      icon: url(sidc),
      perform: () => console.log('perform', sidc),
      dryRun: () => console.log('dryRun', sidc)
    }
  })

const DryRunner = () => {
  const { results } = KBar.useMatches()
  const { visualState, activeIndex } = KBar.useKBar(R.identity)

  React.useEffect(() => {
    if (visualState !== 'showing') return
    results[activeIndex]?.dryRun?.()
  }, [results, activeIndex, visualState])

  React.useEffect(() => {
    if (!['animating-in', 'animating-out'].includes(visualState)) return
    console.log('visualState', visualState)
  }, [visualState])
}


const Results = () => {
  const { results } = KBar.useMatches()
  const onRender = ({ item, active }) => {
    const icon = path => <Icon key={uuid()} className='key' path={mdi[path]}></Icon>
    const span = token => <span key={uuid()} className='key'>{token}</span>
    const separator = () => <span key={uuid()}>&nbsp;&nbsp;</span>

    const avatar = item.icon
      // ? <img src={item.icon} className='image'/>
      ? <span dangerouslySetInnerHTML={{ __html: item.icon }} />
      : item.shortcut
        ? item.shortcut[0].split(/( )/)
          .flatMap(token => token.split('+'))
          .map(token => {
            if (token === '$mod') return icon('mdiAppleKeyboardCommand')
            else if (token === 'Control') return icon('mdiAppleKeyboardControl')
            else if (token === 'Shift') return icon('mdiAppleKeyboardShift')
            else if (token === 'Option') return icon('mdiAppleKeyboardOption')
            else if (/^[A-Z]$/i.test(token)) return span(token)
            else if (token === ' ') return separator()
            else return token
          })
        : null

    return (
      <div className={active ? 'item item--active' : 'item'}>
        <div className='item__title'>
          {item.name}
        </div>
        <div className='item__avatar'>
          {avatar}
        </div>
      </div>
    )
  }

  return <KBar.Results items={results} onRender={onRender}/>
}

export const App = () => {
  const options = {
    callbacks: {
      onOpen: () => console.log('create snapshot from selection'),
      onClose: () => console.log('restore state from snapshot'),
      onSelectAction: () => console.log('discard snapshot')
    }
  }

  return (
    <>
      <KBar.Provider actions={actions} options={options}>
        <KBar.Portal>
          <KBar.Positioner>
            <KBar.Animator className='animator'>
              <KBar.Search className='search'/>
              <Results/>
              <DryRunner/>
            </KBar.Animator>
          </KBar.Positioner>
        </KBar.Portal>
      </KBar.Provider>
      <Map/>
    </>
  )
}
