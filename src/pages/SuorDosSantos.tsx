// src/pages/SuorDosSantos.tsx
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

export const SuorDosSantos = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`*, profiles(full_name), post_reactions(reaction_type, user_id)`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error("Erro ao sincronizar o mural:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleReaction = async (postId: string, emoji: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Faz login para reagir!");

    try {
      const { error } = await supabase
        .from('post_reactions')
        .upsert({ post_id: postId, user_id: user.id, reaction_type: emoji }, { onConflict: 'post_id, user_id, reaction_type' });
      if (!error) fetchPosts(); 
    } catch (e: any) {
      console.error("Erro ao reagir:", e.message);
    }
  };

  return (
    <div className="py-10 animate-fadeIn min-h-screen">
      <header className="mb-12 border-l-4 border-sh-neon pl-6">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Suor dos <span className="text-sh-neon">Santos</span></h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-[10px] mt-2 italic">O testemunho visual da nossa oferta na arena</p>
      </header>

      {selectedPost && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedPost(null)}>
          <button className="absolute top-6 right-6 text-white text-3xl font-black">✕</button>
          <div className="relative w-full max-w-4xl flex items-center justify-center" onClick={e => e.stopPropagation()}>
            {selectedPost.post_type === 'youtube' ? (
              <div className={`${selectedPost.external_url?.includes('shorts') ? 'w-[315px] aspect-[9/16]' : 'w-full aspect-video'} bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10`}>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYoutubeId(selectedPost.external_url)}?autoplay=1&rel=0`}
                  title="YouTube player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : selectedPost.post_type === 'video' ? (
              <video src={selectedPost.image_url} className="max-w-full max-h-[80vh] rounded-2xl" controls autoPlay />
            ) : (
              <img src={selectedPost.image_url} className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl" alt="Suor" />
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20 text-sh-neon font-black uppercase text-[10px] animate-pulse italic">Sincronizando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden group hover:border-sh-neon/30 transition-all shadow-xl">
              <div className="relative aspect-square overflow-hidden bg-sh-black cursor-pointer" onClick={() => setSelectedPost(post)}>
                {post.post_type === 'youtube' ? (
                  <div className="w-full h-full relative">
                    <img src={`https://img.youtube.com/vi/${getYoutubeId(post.external_url)}/maxresdefault.jpg`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-4xl">▶️</span></div>
                  </div>
                ) : post.post_type === 'video' ? (
                  <video src={post.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0" muted loop onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                ) : (
                  <img src={post.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sh-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-sh-neon flex items-center justify-center text-sh-black font-black italic text-xs uppercase">{post.profiles?.full_name?.charAt(0)}</div>
                    <div>
                      <p className="text-white font-black uppercase text-[10px] tracking-tight">{post.profiles?.full_name || 'Atleta'}</p>
                      <p className="text-sh-green text-[8px] font-bold uppercase tracking-widest">{post.mission}</p>
                    </div>
                  </div>
                  <p className="text-white text-[11px] italic line-clamp-2 mb-4">"{post.caption}"</p>
                  <div className="flex gap-2">
                    {['🔥', '🙌', '💪'].map(emoji => {
                      const count = post.post_reactions?.filter((r: any) => r.reaction_type === emoji).length || 0;
                      return (
                        <button key={emoji} onClick={(e) => { e.stopPropagation(); handleReaction(post.id, emoji); }} className="bg-white/10 hover:bg-sh-neon/20 px-3 py-1.5 rounded-xl text-sm transition-all border border-white/5">
                          {emoji} <span className="text-[10px] font-black text-white/60">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};