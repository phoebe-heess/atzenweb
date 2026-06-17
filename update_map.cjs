const fs = require('fs');
let code = fs.readFileSync('src/components/ThreeDMap.tsx', 'utf-8');

// 1. Imports
code = code.replace(
  "import { \n  CheckCircle2",
  "import { \n  CheckCircle2,\n  Plus,\n  Minus,\n  Compass,\n  Layers"
);
code = code.replace(
  "import Map, { Marker } from 'react-map-gl/maplibre';",
  "import Map, { Marker } from 'react-map-gl/maplibre';\nimport type { MapRef } from 'react-map-gl/maplibre';\nimport useSupercluster from 'use-supercluster';"
);

// 2. State and useSupercluster
const stateAdditions = `
  const mapRef = useRef<MapRef>(null);

  const [highContrast, setHighContrast] = useState(false);
  const mapStyle = highContrast 
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);

  const points = useMemo(() => {
    return filteredVenues.map(venue => ({
      type: "Feature" as const,
      properties: { cluster: false, venueId: venue.id, venue },
      geometry: { type: "Point" as const, coordinates: [venue.coordinates.longitude, venue.coordinates.latitude] }
    }));
  }, [filteredVenues]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  const handleZoomIn = () => { setViewport(v => ({ ...v, zoom: Math.min(v.zoom + 1, 20) })); setAnnouncement("Karte vergrößert"); };
  const handleZoomOut = () => { setViewport(v => ({ ...v, zoom: Math.max(v.zoom - 1, 0) })); setAnnouncement("Karte verkleinert"); };
  const handleResetNorth = () => { setViewport(v => ({ ...v, bearing: 0, pitch: 0 })); setAnnouncement("Nach Norden ausgerichtet"); };
  const handleToggleContrast = () => { setHighContrast(v => !v); setAnnouncement("Kontrast umgeschaltet"); };

  const updateBounds = () => {
    if (mapRef.current) {
      const b = mapRef.current.getMap().getBounds().toArray().flat();
      setBounds(b as [number, number, number, number]);
    }
  };
`;
code = code.replace(
  "const [announcement, setAnnouncement] = useState('');",
  "const [announcement, setAnnouncement] = useState('');\n" + stateAdditions
);

// 3. Skip Link
code = code.replace(
  '<div className={`flex-1 relative h-full bg-[#EFEFE8] ${mobileView === \'map\' ? \'block\' : \'hidden lg:block\'}`}>',
  '<div className={`flex-1 relative h-full bg-[#EFEFE8] ${mobileView === \'map\' ? \'block\' : \'hidden lg:block\'}`}>\n' +
  '            <a href="#venue-list-start" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:text-primary focus:p-4 focus:font-bold focus:shadow-xl rounded-lg top-4 left-4 outline-none border-2 border-primary">\n' +
  '              Zur Liste überspringen (Skip Map)\n' +
  '            </a>\n'
);

// Need an anchor for skip link
code = code.replace(
  '<ol className="space-y-4 pb-20">',
  '<ol id="venue-list-start" tabIndex={-1} className="space-y-4 pb-20 focus:outline-none">'
);

// 4. Map updates (ref, onLoad, onMove, mapStyle)
code = code.replace(
  'onMove={evt => setViewport(evt.viewState)}',
  'ref={mapRef}\n              onLoad={updateBounds}\n              onMove={evt => {\n                setViewport(evt.viewState);\n                updateBounds();\n              }}'
);
code = code.replace(
  'mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"',
  'mapStyle={mapStyle}'
);

// 5. On-Map Controls Overlay
const controlsOverlay = `
            {/* On-Map Accessibility Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col pointer-events-auto">
                <button onClick={handleZoomIn} aria-label="Hineinzoomen" title="Hineinzoomen" className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary border-b border-gray-200">
                  <Plus strokeWidth={3} className="w-5 h-5" />
                </button>
                <button onClick={handleZoomOut} aria-label="Herauszoomen" title="Herauszoomen" className="w-[44px] h-[44px] flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <Minus strokeWidth={3} className="w-5 h-5" />
                </button>
              </div>

              {(viewport.bearing !== 0 || viewport.pitch !== 0) && (
                <button onClick={handleResetNorth} aria-label="Nach Norden ausrichten" title="Nach Norden ausrichten" className="w-[44px] h-[44px] bg-white rounded-lg shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto">
                  <Compass className="w-5 h-5" style={{ transform: \`rotate(\${-viewport.bearing}deg)\` }} />
                </button>
              )}

              <button onClick={handleGeolocation} aria-label="Eigenen Standort auf der Karte finden" title="Eigenen Standort auf der Karte finden" className="w-[44px] h-[44px] bg-white rounded-lg shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto">
                <Locate className="w-5 h-5" />
              </button>

              <button onClick={handleToggleContrast} aria-label={highContrast ? "Standard-Kontrast aktivieren" : "Hohen Kontrast aktivieren"} title="Karten-Kontrast umschalten" className="w-[44px] h-[44px] bg-white rounded-lg shadow-xl border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary pointer-events-auto">
                <Layers className="w-5 h-5" />
              </button>
            </div>
`;

code = code.replace(
  '              {/* User Location Marker */}',
  controlsOverlay + '\n              {/* User Location Marker */}'
);

// 6. Cluster rendering
const markersReplacement = `
              {/* Clusters and Venues */}
              {clusters.map(cluster => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const { cluster: isCluster, point_count: pointCount } = cluster.properties;

                if (isCluster) {
                  return (
                    <Marker key={\`cluster-\${cluster.id}\`} longitude={longitude} latitude={latitude} anchor="center">
                      <button
                        className="w-[44px] h-[44px] bg-ink text-white font-bold rounded-full shadow-2xl border-4 border-white flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/50 transform transition-transform hover:scale-110 cursor-pointer pointer-events-auto"
                        aria-label={\`\${pointCount} Standorte in diesem Bereich. Klicken zum Vergrößern.\`}
                        onClick={() => {
                          const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                          setViewport(prev => ({ ...prev, latitude, longitude, zoom: expansionZoom }));
                        }}
                      >
                        {pointCount}
                      </button>
                    </Marker>
                  );
                }

                const venue = cluster.properties.venue;
                return (
                  <Marker 
                    key={venue.id} 
                    longitude={longitude} 
                    latitude={latitude}
                    anchor="bottom"
                  >
                    <button 
                      onClick={() => handleSelectVenue(venue)}
                      className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/50 rounded-full w-[44px] h-[44px] flex items-center justify-center pointer-events-auto"
                      aria-label={\`Markierung für \${venue.name} anzeigen\`}
                    >
                      <div className={\`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white transform transition-transform group-hover:scale-110 \${venue.isGastronomy ? 'bg-primary' : 'bg-ink'}\`}>
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className={\`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 absolute bottom-0 left-1/2 -translate-x-1/2 \${venue.isGastronomy ? 'border-t-primary' : 'border-t-ink'}\`} />
                    </button>
                  </Marker>
                );
              })}
`;

// remove existing markers mapping
code = code.replace(
  /\{\/\* Venue Pins \*\/\}[\s\S]*?(?=\{\/\* Custom high-contrast Location Detail Card overlay \*\/})/,
  markersReplacement + '\n'
);

// High contrast logic for detail card: ensure text contrast
// We will just leave detail card styling as is, it's black on white so already high contrast

fs.writeFileSync('src/components/ThreeDMap.tsx', code);
console.log('Successfully updated ThreeDMap.tsx');
