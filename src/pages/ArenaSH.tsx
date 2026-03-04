import { useEffect, useState, useMemo } from 'react';
import supabase from '../lib/supabase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const INITIAL_CENTER: [number, number] = [-15.78, -47.92];

const neonIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FlyToLocation({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 12, { duration: 2 });
  }, [center, map]);
  return null;
}

export const ArenaSH = () => {
  const [arenas, setArenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>(INITIAL_CENTER);

  useEffect(() => {
    const fetchArenas = async () => {
      try {
        const { data, error } = await supabase.from('arenas').select('*');
        if (!error) setArenas(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchArenas();
  }, []);

  const arenasFiltradas = useMemo(() => {
    return arenas.filter(a => 
      a.city?.toLowerCase().includes(busca.toLowerCase()) || 
      a.location_name?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca, arenas]);

  return (
    <div className="h-[calc(100vh-120px)] py-6 flex flex-col md:flex-row gap-6 animate-fadeIn">
      
      <aside className="w-full md:w-96 flex flex-col gap-6 order-2 md:order-1">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            Encontre sua <span className="text-sh-neon">Arena</span>
          </h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar cidade ou local..." 
              className="w-full bg-sh-black border border-white/10 p-4 rounded-2xl outline-none focus:border-sh-green transition-all text-sm"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {loading ? (
            <p className="text-sh-green font-black uppercase text-[10px] animate-pulse">Sincronizando satélites...</p>
          ) : (
            arenasFiltradas.map(arena => (
              <button 
                key={arena.id}
                onClick={() => setMapCenter([arena.latitude, arena.longitude])}
                className="w-full text-left bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-sh-green/10 hover:border-sh-green/30 transition-all group"
              >
                <p className="text-[10px] font-black uppercase text-sh-green tracking-widest">{arena.city}</p>
                <h4 className="font-bold text-white uppercase text-sm mt-1">{arena.location_name}</h4>
                <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-500 font-bold uppercase">
                  <span>📍 {arena.address || 'Ver no mapa'}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="flex-1 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative z-0 order-1 md:order-2 min-h-[400px]">
        <MapContainer 
          center={INITIAL_CENTER} 
          zoom={4} 
          style={{ height: '100%', width: '100%', background: '#0b0b0b' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <FlyToLocation center={mapCenter} />

          {arenasFiltradas.map((arena) => (
            arena.latitude && (
              <Marker 
                key={arena.id} 
                position={[arena.latitude, arena.longitude]}
                icon={neonIcon}
              >
                <Popup className="custom-popup">
                  <div className="p-2 font-urban text-center">
                    <h5 className="font-black italic uppercase text-sh-black text-sm">{arena.location_name}</h5>
                    <p className="text-[9px] font-bold uppercase text-gray-500">{arena.city}</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
        
        <div className="absolute top-6 right-6 z-[1000] bg-sh-black/80 p-3 rounded-xl border border-sh-green/20 backdrop-blur-md">
           <p className="text-sh-green font-black uppercase text-[8px] tracking-widest">Radar SPORTSH Online</p>
        </div>
      </section>
    </div>
  );
};