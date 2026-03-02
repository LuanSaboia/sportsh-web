const reels = [
  { id: 1, titulo: "Disciplina e Oração", autor: "@pjj_oficial", thumb: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80" },
  { id: 2, titulo: "Suor que Oferta", autor: "@sh_fortaleza", thumb: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&q=80" },
  { id: 3, titulo: "Vôlei e Castidade", autor: "@sh_brasilia", thumb: "https://images.unsplash.com/photo-1544691371-3392468789cc?auto=format&fit=crop&w=400&q=80" },
];

const fotos = [
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
];

export const SuorDosSantos = () => {
  return (
    <div className="py-10 animate-fadeIn">
      
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-sh-neon">
          Suor dos <span className="text-white">Santos</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2">
          A disciplina do corpo a serviço da alma.
        </p>
      </div>

      <section className="mb-16">
        <h3 className="text-sh-neon font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
          <span className="w-8 h-[2px] bg-sh-neon"></span> Web-Série
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {reels.map((reel) => (
            <div key={reel.id} className="relative group aspect-[9/16] bg-sh-green/10 rounded-3xl overflow-hidden border border-white/10 hover:border-sh-neon transition-all">
              <img src={reel.thumb} alt={reel.titulo} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-sh-black via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] font-bold text-sh-neon uppercase">{reel.autor}</p>
                <h4 className="text-white font-black italic text-sm uppercase leading-tight">{reel.titulo}</h4>
              </div>
              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-sh-neon rounded-full flex items-center justify-center shadow-lg shadow-sh-neon/40">
                  <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-sh-black border-b-[8px] border-b-transparent ml-1"></div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sh-green font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
          <span className="w-8 h-[2px] bg-sh-green"></span> Mural da Arena
        </h3>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {fotos.map((foto, index) => (
            <div key={index} className="break-inside-avoid rounded-2xl overflow-hidden border border-white/5 hover:border-sh-green/50 transition-all">
              <img src={foto} alt={`Ação ${index}`} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" />
            </div>
          ))}
          <div className="break-inside-avoid bg-sh-neon p-6 rounded-2xl text-sh-black text-center group cursor-pointer">
            <h4 className="font-black uppercase italic text-xl leading-none mb-2">Envie seu Registro</h4>
            <p className="text-[10px] font-bold uppercase mb-4 tracking-tighter leading-tight text-sh-black/70 italic">Marque @SPORTSH e apareça no mural</p>
            <div className="w-10 h-10 bg-sh-black rounded-full mx-auto flex items-center justify-center text-sh-neon font-bold">+</div>
          </div>
        </div>
      </section>
    </div>
  );
};