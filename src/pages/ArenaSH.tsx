import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function FlyToLocation({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, { duration: 2 });
    }
  }, [center, map]);
  return null;
}

const neonIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const ArenaSH = () => {
  const [arenas, setArenas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [mapCenter, setMapCenter] = useState<[number, number]>([-15.7801, -47.9292]);

  useEffect(() => {
    fetchArenas();
  }, []);

  async function fetchArenas() {
    const { data, error } = await supabase
      .from('arenas')
      .select('*')
      .order('city');
    
    if (!error) setArenas(data || []);
    setLoading(false);
  }

  const arenasFiltradas = arenas.filter(a => 
    a.city.toLowerCase().includes(busca.toLowerCase()) || 
    a.modalities.join(' ').toLowerCase().includes(busca.toLowerCase())
  );

  const handleCityClick = (lat: number, lng: number) => {
    setMapCenter([lat, lng]);
  };

  return (
    <div className="py-10 animate-fadeIn">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Arena <span className="text-sh-neon">SH</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2 italic">
          Onde o SPORTSH acontece
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <input 
            type="text" 
            placeholder="Buscar cidade ou esporte..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-sh-neon transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-sh-green animate-pulse font-bold uppercase text-xs text-center">Mapeando Missões...</p>
            ) : arenasFiltradas.map(arena => (
              <div 
                key={arena.id} 
                onClick={() => handleCityClick(arena.latitude, arena.longitude)}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-sh-green/50 transition-all group cursor-pointer"
              >
                <h4 className="text-sh-neon font-black italic uppercase text-lg group-hover:tracking-wider transition-all">{arena.city}</h4>
                <p className="text-gray-400 text-xs mb-3">{arena.location_name}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {arena.modalities.map((mod: string) => (
                    <span key={mod} className="text-[8px] bg-sh-green/20 text-sh-green px-2 py-0.5 rounded font-bold uppercase">{mod}</span>
                  ))}
                </div>
                <a 
                  href={arena.contact_link} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sh-neon text-[10px] font-black uppercase underline decoration-sh-green underline-offset-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  Falar com Coordenador
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 min-h-[500px] bg-sh-black rounded-3xl border border-sh-green/30 relative overflow-hidden z-0">
          <MapContainer 
            center={mapCenter} 
            zoom={4} 
            style={{ height: '100%', width: '100%', background: '#000' }}
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
                  <Popup>
                    <div className="text-black font-bold uppercase p-1">
                      {arena.city} <br/>
                      <span className="text-[10px] text-gray-600">{arena.location_name}</span>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
          
          <div className="absolute top-6 right-6 z-[1000] bg-sh-black/80 p-3 rounded-xl border border-sh-green/20 backdrop-blur-sm pointer-events-none">
             <p className="text-sh-green font-black italic uppercase text-xs tracking-tighter">Brasil SH</p>
          </div>
        </div>
      </div>
    </div>
  );
};