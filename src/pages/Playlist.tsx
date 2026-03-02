export const PlaylistsDeFogo = () => {
  
  const playlistId = "37i9dQZF1DX8mBR9U17m9G";

  return (
    <div className="py-10 animate-fadeIn min-h-[80vh] flex flex-col">

      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Playlists <span className="text-sh-neon">de Fogo</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2">
          O som que embala a oferta do seu suor.
        </p>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-sh-green/5">
        <iframe
          src={`https://open.spotify.com/embed/playlist/12E7uzxnyyCzC70uNCio5z?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="min-h-[500px]"
        ></iframe>
      </div>

      <div className="mt-8 p-6 bg-sh-neon rounded-2xl flex items-center gap-4">
        <div className="text-3xl">🎧</div>
        <div>
          <h4 className="text-sh-black font-black uppercase italic leading-none">Dica do Vestiário</h4>
          <p className="text-sh-black/70 text-xs font-bold uppercase tracking-tighter">
            Treinar ouvindo MSH ou Sopragod aumenta em 100% o foco na intenção do dia.
          </p>
        </div>
      </div>
    </div>
  );
};