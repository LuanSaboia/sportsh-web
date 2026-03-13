import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { registerActivity } from '../lib/activities';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
    const [profile, setProfile] = useState<any>(null);
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ physical: 0, spiritual: 0, evangelization: 0 });

    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");

    const METAS = { fisico: 500, espiritual: 500 };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(profileData);

        const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3);
        setNews(newsData || []);

        const { data: activities } = await supabase.from('activities').select('type, points_earned').eq('user_id', user.id);

        if (activities) {
            const totals = activities.reduce((acc, act) => {
                if (act.type === 'physical') acc.physical += act.points_earned;
                if (act.type === 'spiritual') acc.spiritual += act.points_earned;
                if (act.type === 'evangelization') acc.evangelization += act.points_earned;
                return acc;
            }, { physical: 0, spiritual: 0, evangelization: 0 });
            setStats(totals);
        }

        setLoading(false);
    }

    const handleCheckIn = async (type: 'physical' | 'spiritual' | 'evangelization', desc: string) => {
        try {

            await registerActivity(type, desc);
            alert(`${desc} registrado!`);
            fetchDashboardData();
        } catch (err) {
            alert("Erro ao registrar. Tente novamente.");
        }
    };

    const getYoutubeId = (url: string) => {
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    const handlePostSuor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caption) return alert("Escreva uma legenda!");
        if (!file && !youtubeLink) return alert("Selecione um arquivo ou cole um link!");

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            let finalImageUrl = "";
            let finalExternalUrl = null;
            let postType = "image";

            if (youtubeLink) {
                const ytId = getYoutubeId(youtubeLink);
                if (ytId) {
                    postType = "youtube";
                    finalExternalUrl = youtubeLink;
                    finalImageUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
                } else {
                    postType = "image";
                    finalImageUrl = youtubeLink;
                }
            } else if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('suor-posts').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('suor-posts').getPublicUrl(fileName);
                finalImageUrl = publicUrl;
                postType = file.type.startsWith('video/') ? 'video' : 'image';
            }

            const { error: dbError } = await supabase.from('posts').insert({
                user_id: user?.id,
                image_url: finalImageUrl,
                external_url: finalExternalUrl,
                post_type: postType,
                caption: caption,
                mission: profile?.mission || 'Arena Geral'
            });

            if (dbError) throw dbError;
            alert("Suor registrado! 🔥");
            setFile(null); setCaption(""); setYoutubeLink("");
            fetchDashboardData();
        } catch (error: any) {
            alert("Erro: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const porcentagemFisica = Math.min((stats.physical / METAS.fisico) * 100, 100);
    const totalEspiritual = stats.spiritual + stats.evangelization;
    const pctEspiritual = Math.min((totalEspiritual / METAS.espiritual) * 100, 100);

    return (
        <div className="py-10 animate-fadeIn">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter">Vestiário <span className="text-sh-neon">SH</span></h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2">Bem-vindo, {profile?.full_name?.split(' ')[0]}</p>
                </div>
                <div className="bg-sh-green/10 border border-sh-green/20 px-6 py-3 rounded-2xl flex flex-col items-end">
                    <span className="text-sh-green font-black text-2xl italic">{profile?.total_points || 0} PTS</span>
                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">Saldo Total</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-8 space-y-8">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button onClick={() => handleCheckIn('physical', 'Treino Individual')} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-sh-green/50 transition-all text-left group">
                            <span className="text-2xl mb-2 block">🏃‍♂️</span>
                            <h4 className="font-black uppercase italic text-sh-green group-hover:tracking-widest transition-all">Treino</h4>
                            <p className="text-gray-500 text-[9px] uppercase font-bold">Corpo em Oferta</p>
                        </button>

                        <button onClick={() => handleCheckIn('spiritual', 'Oração Pessoal')} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-sh-neon/50 transition-all text-left group">
                            <span className="text-2xl mb-2 block">🙏</span>
                            <h4 className="font-black uppercase italic text-sh-neon group-hover:tracking-widest transition-all">Oração</h4>
                            <p className="text-gray-500 text-[9px] uppercase font-bold">Vigor da Alma</p>
                        </button>

                        <button onClick={() => handleCheckIn('evangelization', 'Ação Missionária')} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-white/50 transition-all text-left group">
                            <span className="text-2xl mb-2 block">📢</span>
                            <h4 className="font-black uppercase italic text-white group-hover:tracking-widest transition-all">Missão</h4>
                            <p className="text-gray-500 text-[9px] uppercase font-bold">Evangelização</p>
                        </button>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] space-y-8">
                        <h3 className="text-sh-neon font-black uppercase text-xs tracking-widest">Minha Performance</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>Performance Física</span>
                                <span className="text-sh-green">{Math.round(porcentagemFisica)}%</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <div className="h-full bg-sh-green rounded-full shadow-[0_0_15px_#21a551] transition-all duration-1000" style={{ width: `${porcentagemFisica}%` }}></div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>Vigor Espiritual</span>
                                <span className="text-sh-neon">{Math.round(pctEspiritual)}%</span>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <div className="h-full bg-sh-neon rounded-full shadow-[0_0_15px_#d7f205] transition-all duration-1000" style={{ width: `${pctEspiritual}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden">
                        <h3 className="text-white font-black uppercase italic text-lg mb-6 tracking-tighter">📸 Registrar Suor</h3>
                        <form onSubmit={handlePostSuor} className="space-y-4">
                            <textarea
                                placeholder="Conte como foi sua oferta hoje..."
                                className="w-full bg-sh-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-sh-neon transition-all italic text-sm min-h-[100px]"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />

                            {/* Campo para link (YouTube ou Imagem Externa) */}
                            <input
                                type="text"
                                placeholder="Ou cole um link (YouTube, Shorts ou Imagem)..."
                                className="w-full bg-sh-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-sh-green transition-all text-[10px] font-bold uppercase"
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                            />

                            <div className="flex flex-col md:flex-row gap-4">
                                <label className="flex-1 bg-white/5 border border-dashed border-white/20 p-4 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        {file ? `✅ ${file.name}` : "Ou subir arquivo (Foto/Vídeo)"}
                                    </span>
                                    <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                                </label>
                                <button
                                    disabled={uploading}
                                    className="bg-white text-sh-black px-10 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-sh-neon transition-all disabled:opacity-50"
                                >
                                    {uploading ? 'Processando...' : 'Publicar Agora'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] sticky top-32">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-black uppercase italic text-sm tracking-tight">Últimas da Arena</h3>
                            <Link to="/noticias" className="text-sh-neon text-[8px] font-black uppercase border-b border-sh-neon">Ver Tudo</Link>
                        </div>

                        <div className="space-y-4">
                            {news.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/noticias/${item.id}`}
                                    className="block p-4 bg-sh-black/40 border border-white/5 rounded-2xl hover:border-sh-neon/30 transition-all group"
                                >
                                    <span className="text-sh-green text-[8px] font-black uppercase tracking-widest">{item.category}</span>
                                    <h4 className="text-white font-bold text-xs uppercase leading-tight mt-1 group-hover:text-sh-neon transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-[8px] text-gray-600 font-bold uppercase mt-2">
                                        {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </Link>
                            ))}

                            {news.length === 0 && (
                                <p className="text-gray-600 text-[10px] uppercase font-bold text-center py-4">Aguardando novidades...</p>
                            )}
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="bg-sh-neon/10 border border-sh-neon/20 p-4 rounded-2xl relative overflow-hidden">
                                <p className="text-sh-neon font-black uppercase text-[9px] mb-2 tracking-widest">Frase do Dia</p>
                                <p className="text-white text-[10px] italic font-medium leading-relaxed uppercase">
                                    "Pelo Vosso suor, fortalecei o meu coração!"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};