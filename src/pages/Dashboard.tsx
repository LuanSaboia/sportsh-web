import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { registerActivity } from '../lib/activities';

interface Profile {
    full_name: string;
    mission: string;
    level: string;
    total_points: number;
}

export const Dashboard = () => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ physical: 0, spiritual: 0, evangelization: 0 });
    const METAS = {
        fisico: 500,
        espiritual: 500
    };

    const porcentagemFisica = Math.min((stats.physical / METAS.fisico) * 100, 100);

    const totalEspiritual = stats.spiritual + stats.evangelization;
    const porcentagemEspiritual = Math.min((totalEspiritual / METAS.espiritual) * 100, 100);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState("");

    const handleUpload = async () => {
        try {
            if (!file) return alert("Selecione uma foto primeiro!");
            setUploading(true);

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Utilizador não encontrado");

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('suor-posts')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('suor-posts')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('posts')
                .insert({
                    user_id: user.id,
                    image_url: publicUrl,
                    caption: caption,
                    mission: profile?.mission
                });

            if (dbError) throw dbError;

            alert("Foto publicada no Mural!");
            setFile(null);
            setCaption("");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    async function getStats() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('activities')
            .select('type, points_earned')
            .eq('user_id', user.id);

        if (!error && data) {
            const totals = data.reduce((acc: any, curr: any) => {
                acc[curr.type] = (acc[curr.type] || 0) + curr.points_earned;
                return acc;
            }, { physical: 0, spiritual: 0, evangelization: 0 });

            setStats(totals);
        }
    }
    useEffect(() => {
        getProfile();
        getStats();
    }, []);

    async function getProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                let { data, error } = await supabase
                    .from('profiles')
                    .select('full_name, mission, level, total_points')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                setProfile(data);
            }
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCheckIn = async (type: 'physical' | 'spiritual' | 'evangelization', desc: string) => {
        try {
            await registerActivity(type, desc);
            alert("Atividade entregue com sucesso! Pontos computados.");
            getProfile();
            getStats();
        } catch (error) {
            alert("Erro ao registrar atividade.");
        }
    };

    if (loading) return <div className="py-20 text-center animate-pulse text-sh-neon uppercase font-black">Sincronizando com o Vestiário...</div>;

    return (
        <div className="py-10 animate-fadeIn space-y-8">

            <div className="flex flex-col md:flex-row gap-6 items-center bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                <div className="w-24 h-24 bg-sh-green rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(33,165,81,0.4)] border-4 border-sh-black">
                    👟
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                        {profile?.full_name || 'Atleta SH'}
                    </h2>
                    <p className="text-sh-neon font-bold uppercase text-xs tracking-widest">
                        {profile?.level} | Missão {profile?.mission}
                    </p>
                </div>
                <div className="bg-sh-black/50 border border-sh-green/30 px-6 py-4 rounded-2xl text-center">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Pontuação Total</span>
                    <span className="text-3xl font-black italic text-sh-neon">{profile?.total_points || 0}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-sh-neon font-black uppercase text-xs tracking-widest ml-2">Check-in de Hoje</h3>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-3">
                        <button onClick={() => handleCheckIn('physical', 'Treino do dia')} className="w-full bg-sh-green/20 border border-sh-green/40 hover:bg-sh-green hover:text-sh-black transition-all p-4 rounded-2xl flex items-center justify-between group">
                            <span className="font-black italic uppercase text-sm">Entregar Suor (Treino)</span>
                            <span className="group-hover:scale-125 transition-transform text-xl">💪</span>
                        </button>
                        <button onClick={() => handleCheckIn('spiritual', 'Oração pessoal')} className="w-full bg-sh-neon/10 border border-sh-neon/40 hover:bg-sh-neon hover:text-sh-black transition-all p-4 rounded-2xl flex items-center justify-between group">
                            <span className="font-black italic uppercase text-sm">Entregar Oração</span>
                            <span className="group-hover:scale-125 transition-transform text-xl">🙏</span>
                        </button>
                        <button onClick={() => handleCheckIn('evangelization', 'Convite para o SH')} className="w-full bg-white/5 border border-white/10 hover:border-white/30 transition-all p-4 rounded-2xl flex items-center justify-between group">
                            <span className="font-black italic uppercase text-sm">Levei um Amigo</span>
                            <span className="group-hover:scale-125 transition-transform text-xl">🎣</span>
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-sh-green font-black uppercase text-xs tracking-widest ml-2">Equilíbrio da Alma</h3>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-full flex flex-col justify-center gap-8">

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>Performance Física</span>

                                <span className="text-sh-green">{Math.round(porcentagemFisica)}%</span>
                            </div>
                            <div className="h-4 bg-sh-black rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-sh-green shadow-[0_0_10px_#21a551] transition-all duration-500"
                                    style={{ width: `${porcentagemFisica}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span>Vigor Espiritual</span>
                                <span className="text-sh-neon">{Math.round(porcentagemEspiritual)}%</span>
                            </div>
                            <div className="h-4 bg-sh-black rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-sh-neon shadow-[0_0_10px_#d7f205] transition-all duration-500"
                                    style={{ width: `${porcentagemEspiritual}%` }}
                                ></div>
                            </div>
                        </div>

                        <p className="text-[10px] text-gray-500 italic mt-4">
                            * Dica do Treinador: "Não adianta ter pernas fortes se a alma está cansada. Dedique tempo à oração hoje!"
                        </p>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mt-8">
                    <h3 className="text-sh-neon font-black uppercase text-xs tracking-widest mb-4">Postar no Suor dos Santos</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-sh-neon file:text-sh-black cursor-pointer mb-4"
                    />
                    <textarea
                        placeholder="Escreva uma legenda ou testemunho..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full bg-sh-black/50 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-sh-neon mb-4"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full bg-sh-green text-sh-black font-black uppercase italic py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50"
                    >
                        {uploading ? 'A Enviar...' : 'Publicar no Mural'}
                    </button>
                </div>
            </div>

            <div className="bg-sh-neon p-8 rounded-[2rem] text-sh-black relative overflow-hidden group">
                <div className="absolute -right-8 -bottom-8 text-9xl opacity-10 italic font-black group-hover:scale-110 transition-transform">SH</div>
                <h4 className="font-black uppercase italic text-sm mb-2 tracking-tighter">Jaculatória de Combate</h4>
                <p className="text-2xl font-black italic leading-tight uppercase">
                    "Pelo Vosso suor, fortalecei o meu coração!"
                </p>
            </div>

        </div>
    );
};