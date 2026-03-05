import { useState, useEffect } from 'react';
import { TimerTrigger } from '../features/intercessao/TimerTrigger';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';

export const Home = () => {
  const [session, setSession] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedNews();
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  async function fetchFeaturedNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setSlides(data);
    } catch (err) {
      console.error("Erro ao carregar notícias:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  return (
    <div className="flex flex-col gap-12 md:gap-24 pb-20">

      <section className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/10 bg-sh-black h-[750px] md:h-[800px] flex items-center">

        {loading ? (
          <div className="w-full text-center text-sh-neon font-black animate-pulse uppercase tracking-widest">
            Convocando Atletas...
          </div>
        ) : (
          <>
          
            {slides.map((slide, index) => (
              <div
                key={`bg-${slide.id}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-40' : 'opacity-0'}`}
              >
                <img
                  src={slide.image_url}
                  className="w-full h-full object-cover object-center grayscale"
                  alt={slide.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-sh-black via-sh-black/90 md:via-sh-black/70 to-transparent"></div>
              </div>
            ))}

            <div className="relative z-10 w-full px-6 md:px-20 h-full flex items-center">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

                <div className="lg:col-span-7 h-[400px] flex flex-col justify-center">
                  {slides.map((slide, index) => (
                    <div
                      key={`content-${slide.id}`}
                      className={`${index === currentSlide ? 'block animate-fadeIn' : 'hidden'}`}
                    >
                      <span className="bg-sh-neon text-sh-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-4">
                        {slide.category}
                      </span>

                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic text-white uppercase tracking-tighter leading-[0.9] mb-6 line-clamp-3">
                        {slide.title.split(' ')[0]} <br />
                        <span className="text-sh-neon">
                          {slide.title.split(' ').slice(1).join(' ')}
                        </span>
                      </h1>

                      <p className="text-gray-400 font-bold text-base md:text-xl max-w-xl italic uppercase tracking-tight leading-snug mb-8 line-clamp-2">
                        {slide.subtitle}
                      </p>

                      <Link
                        to={slide.link || '/noticias'}
                        className="bg-white text-sh-black px-8 py-4 rounded-2xl font-black uppercase italic hover:bg-sh-neon transition-all hover:scale-105 inline-block shadow-xl"
                      >
                        {slide.cta_text || 'Saiba Mais'}
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                  <div className="w-full max-w-sm bg-sh-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative">
                    <div className="absolute -top-3 -right-3 bg-sh-green text-sh-black text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-pulse">
                      Ao Vivo
                    </div>
                    <p className="text-sh-green font-black uppercase text-[10px] tracking-[0.3em] mb-6">Intercessão SH</p>
                    <div className="scale-110 origin-center">
                      <TimerTrigger />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-12 bg-sh-neon' : 'w-4 bg-white/20'}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">
        <div className="space-y-6">
          <h2 className="text-5xl font-black italic uppercase leading-none">
            Mais que <span className="text-sh-neon">Atletas</span>,<br /> somos <span className="text-white">Santos</span>.
          </h2>
          <p className="text-gray-400 leading-relaxed font-medium">
            O SPORTSH é o caminho de evangelização da Comunidade Católica Shalom no mundo do desporto.
            Entendemos que o suor do treino é uma forma de oferta e a disciplina esportiva um espelho
            da vida espiritual.
          </p>
          <div className="flex gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="block text-sh-neon font-black text-2xl tracking-tighter">01</span>
              <span className="text-[10px] font-bold uppercase text-gray-500">Formação Integral</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <span className="block text-sh-green font-black text-2xl tracking-tighter">02</span>
              <span className="text-[10px] font-bold uppercase text-gray-500">Vida de Oração</span>
            </div>
          </div>
        </div>
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-sh-green/20 group">
          <img
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            alt="Treino SPORTSH"
          />
        </div>
      </section>

      <section className="bg-sh-green/10 border-y border-sh-green/20 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <span className="text-sh-green font-black uppercase tracking-[0.3em] text-[10px]">O que a Igreja diz</span>
          <blockquote className="text-2xl md:text-4xl font-black italic uppercase tracking-tight text-white leading-tight">
            "Ver o esporte como um caminho de vida que os ajuda a construir uma comunidade mais unida e a levar adiante os valores da vida cristã..."
          </blockquote>
          <cite className="block text-sh-neon font-bold not-italic uppercase text-xs tracking-widest">
            — Papa Francisco
          </cite>
        </div>
      </section>

      <section className="px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase leading-none">Suor dos <span className="text-sh-neon">Santos</span></h2>
            <p className="text-sh-green font-bold uppercase text-[10px] tracking-widest mt-2">Testemunhos da Arena</p>
          </div>
          <Link to="/suor-dos-santos" className="text-[10px] font-black border-b-2 border-sh-neon pb-1 uppercase hover:tracking-widest transition-all">Ver Galeria</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-sh-neon/30 transition-all">
            <p className="italic text-gray-300 mb-6 leading-relaxed">"O esporte é um caminho que Deus me dá pra minha vocação e pra evangelização."</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sh-neon rounded-full"></div>
              <p className="font-bold text-white text-xs uppercase tracking-tighter">João Pedro | Guarulhos</p>
            </div>
          </div>

          <Link
            to={session ? "/dashboard" : "/vestiario"}
            className="bg-sh-neon p-8 rounded-3xl flex flex-col justify-center items-center text-center group cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <span className="text-sh-black font-black uppercase italic text-xl mb-2">Conte sua história</span>
            <p className="text-sh-black/60 font-bold uppercase text-[10px]">
              {session ? "Postar no Vestiário" : "Entre no time para postar"}
            </p>
          </Link>
        </div>
      </section>

    </div>
  );
};