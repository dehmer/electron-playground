import React from 'react'
import * as ol from 'ol'
import { OSM, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { defaults, Interaction, Select, Snap, Draw } from 'ol/interaction'
import GeoJSON from 'ol/format/GeoJSON'
import './App.scss'

const format = new GeoJSON({
  dataProjection: 'EPSG:3857',
  featureProjection: 'EPSG:3857'
})

class Tap extends Interaction {
  constructor (options) {
    super(options)
    this.name = options.name
  }

  handleEvent (mapBrowserEvent) {
    const { type } = mapBrowserEvent
    if (!['pointermove'].includes(type)) console.log(`[${this.name}]`, type)
    // mapBrowserEvent.stopPropagation()
    return true /* propagate event */
  }
}

const features = [
  { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[1736215.296039282, 6146634.720103862], [1737884.370211603, 6146736.723228034], [1738275.5314786648, 6144946.173943821], [1736200.5745400905, 6144698.974173032], [1736215.296039282, 6146634.720103862]]] } },
  { type: 'Feature', geometry: { type: 'Polygon', coordinates: [[[1737884.370211603, 6146736.723228034], [1739814.5567995475, 6146743.847211322], [1739961.0195044258, 6145052.018397226], [1738275.5314786648, 6144946.173943821], [1737884.370211603, 6146736.723228034]]] } }
].map(json => format.readFeature(json))

const Map = () => {
  React.useEffect(() => {
    const tileLayer = new TileLayer({ source: new OSM() })
    const vectorSource = new VectorSource({ wrapX: false, features })
    const vectorLayert = new VectorLayer({ source: vectorSource })
    const layers = [tileLayer, vectorLayert]
    const center = [1740294.4412834928, 6145380.806904582]
    const zoom = 14
    const view = new ol.View({ center, zoom })

    const tap = name => new Tap({ name })

    /**
     * Select default `condition` is `singleClick`. `singleClick` is less responsive
     * than `click`, since some time is waited if click is actually a double click.
     * For that reason, NIDO uses `click` as select `condition`.
     */
    const select = new Select()
    const snap = new Snap({ source: vectorSource })
    const draw = new Draw({ source: vectorSource, type: 'Polygon' })

    select.on('select', event => console.log('select', event))
    draw.on('drawend', ({ feature }) => console.log('drawend', JSON.stringify(format.writeFeatureObject(feature))))

    const target = document.getElementById('map')
    const interactions = defaults({ doubleClickZoom: false }).extend(
      // [select, draw, snap, tap]

      /**
       * Without draw interaction the regular event order is
       * pointerdown -> pointerup -> click -> singleclick.
       */
      [select, tap('tap-b'), draw, tap('tap-a'), snap]
    )

    /* eslint-disable no-new */
    const map = new ol.Map({
      layers,
      target,
      view,
      controls: [],
      interactions
    })

    console.log('iteractions', map.getInteractions().getArray())
    /* eslint-enable no-new */
  })

  return (
    <div
      id='map'
      className='map fullscreen'
      tabIndex='0'
    />
  )
}

export const App = () => {
  return (
    <>
      <Map/>
    </>
  )
}
