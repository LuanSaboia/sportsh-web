import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

export const SuorDosSantos = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Erro ao sincronizar o mural:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-10 animate-fadeIn">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-sh-neon">
          Suor dos <span className="text-white">Santos</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2 italic">
          A disciplina do corpo a serviço da alma.
        </p>
      </div>

      <section className="mb-16">
        <h3 className="text-sh-green font-black uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-3">
          <span className="w-12 h-[2px] bg-sh-green"></span> Registros da Arena
        </h3>

        {loading ? (
          
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-sh-neon border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-black uppercase text-[10px] tracking-widest">Sincronizando Suor...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {posts.map((post) => (
              <div 
                key={post.id} 
                className="break-inside-avoid rounded-2xl overflow-hidden border border-white/5 hover:border-sh-neon/50 transition-all group relative bg-white/5"
              >
                <img 
                  src={post.image_url} 
                  alt={post.caption} 
                  className="w-full h-auto grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-sh-black via-sh-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 flex flex-col justify-end">
                  <p className="text-[10px] font-black text-sh-neon uppercase tracking-tighter">
                    {post.profiles?.full_name || 'Atleta SH'}
                  </p>
                  {post.caption && (
                    <p className="text-white text-[10px] italic leading-tight mt-1 line-clamp-3">
                      "{post.caption}"
                    </p>
                  )}
                  <span className="text-[8px] text-gray-500 uppercase font-bold mt-2">
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          
          <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-[3rem] p-20 text-center flex flex-col items-center justify-center">
            <div className="text-5xl mb-6 opacity-20">📸</div>
            <h4 className="text-white font-black uppercase italic text-2xl mb-2 tracking-tighter">Arena em Silêncio</h4>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] max-w-xs leading-relaxed">
              Ainda não há registros nesta temporada. <br/> 
              Seja o primeiro a postar através do seu <span className="text-sh-neon">Vestiário</span>.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};