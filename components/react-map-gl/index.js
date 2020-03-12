import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import ReactMapGL, {Source, Layer, Popup} from 'react-map-gl'

import RegionSumup from './region-sumup'

import {regionLayer, regionCountLayer} from './layers'

const settings = {
  maxZoom: 16
}

const Map = ({viewport, data, onViewportChange}) => {
  const [map, setMap] = useState()
  const [hovered, setHovered] = useState(null)

  const mapRef = useCallback(ref => {
    if (ref) {
      setMap(ref.getMap())
    }
  }, [])

  const onHover = event => {
    event.stopPropagation()
    const feature = event.features && event.features[0]
    const [longitude, latitude] = event.lngLat
    let hoverInfo

    if (feature) {
      hoverInfo = {
        longitude,
        latitude,
        feature
      }
    }

    setHovered(hoverInfo)
  }

  return (
    <div className='map-container'>
      <ReactMapGL
        ReuseMaps
        ref={mapRef}
        {...viewport}
        width='100%'
        height='100%'
        mapOptions={{hash: true}}
        mapStyle='https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json'
        {...settings}
        interactiveLayerIds={[regionLayer.id]}
        onViewportChange={onViewportChange}
        onHover={onHover}
      >

        <Source type='geojson' id='regions' data={data}>
          <Layer {...regionLayer} />
          <Layer {...regionCountLayer} />
        </Source>

        {hovered && (
          <Popup
            longitude={hovered.longitude}
            latitude={hovered.latitude}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setHovered(null)}
            anchor='top'
            offsetTop={20}
          >
            <RegionSumup {...hovered.feature.properties} />
          </Popup>
        )}
      </ReactMapGL>
      <style jsx>{`
        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}

Map.propTypes = {
  viewport: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onViewportChange: PropTypes.func.isRequired
}

export default Map