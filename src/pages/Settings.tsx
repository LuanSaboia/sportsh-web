import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export const Settings = () => {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({ full_name: '', mission: '', avatar_url: '' });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (!error && data) {
                setProfile({ 
                    full_name: data.full_name || '', 
                    mission: data.mission || '',
                    avatar_url: data.avatar_url || ''
                });
                if (data.avatar_url) setAvatarPreview(data.avatar_url);
            }
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) return;
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const fileExt = avatarFile.name.split('.').pop();
            const filePath = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile);
            
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            alert("Foto de perfil atualizada!");
            setAvatarFile(null);
        } catch (err: any) {
            alert("Erro ao subir foto: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    full_name: profile.full_name, 
                    mission: profile.mission 
                })
                .eq('id', user?.id);

            if (error) throw error;
            alert("Perfil atualizado com sucesso!");
        } catch (err: any) {
            alert("Erro ao atualizar perfil: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwords.new || passwords.new !== passwords.confirm) {
            return alert("As senhas não coincidem!");
        }
        if (passwords.new.length < 6) {
            return alert("A senha deve ter no mínimo 6 caracteres.");
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });

            if (error) throw error;
            alert("Senha alterada com sucesso!");
            setPasswords({ new: '', confirm: '' });
        } catch (err: any) {
            alert("Erro ao alterar senha: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-10 animate-fadeIn max-w-4xl mx-auto">
            <header className="mb-12 border-l-4 border-sh-neon pl-6">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">
                    Configurações da <span className="text-sh-neon">Conta</span>
                </h1>
                <p className="text-sh-green font-bold uppercase tracking-widest text-[10px] mt-2 italic">
                    Gerencie seu equipamento e identidade na arena
                </p>
            </header>

            <div className="space-y-8">
                
                <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center">
                    <div className="relative group w-32 h-32 mb-6">
                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/10 group-hover:border-sh-neon transition-all bg-sh-black flex items-center justify-center">
                            {avatarPreview ? (
                                <img src={avatarPreview} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                                <span className="text-4xl font-black italic text-gray-700">
                                    {profile.full_name?.charAt(0) || '?'}
                                </span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-sh-neon text-sh-black p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                            <span className="text-[8px] font-black uppercase">Alterar</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    {avatarFile && (
                        <button 
                            onClick={handleUploadAvatar}
                            className="text-sh-neon font-black uppercase text-[10px] animate-pulse border-b border-sh-neon pb-1"
                        >
                            Confirmar Nova Foto
                        </button>
                    )}
                </section>

                <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                    <h3 className="text-white font-black uppercase italic text-lg mb-6">👤 Perfil</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Nome Completo</label>
                            <input
                                type="text"
                                value={profile.full_name}
                                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                className="w-full bg-sh-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-sh-neon transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Missão / Cidade</label>
                            <input
                                type="text"
                                value={profile.mission}
                                onChange={e => setProfile({ ...profile, mission: e.target.value })}
                                className="w-full bg-sh-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-sh-green transition-all"
                            />
                        </div>
                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="md:col-span-2 bg-white text-sh-black font-black uppercase italic py-4 rounded-2xl hover:bg-sh-neon transition-all disabled:opacity-50"
                        >
                            {loading ? 'Sincronizando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </section>

                <section className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem]">
                    <h3 className="text-white font-black uppercase italic text-lg mb-6">🔐 Segurança</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Nova Senha</label>
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                className="w-full bg-sh-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-sh-neon transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Confirmar Senha</label>
                            <input
                                type="password"
                                value={passwords.confirm}
                                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                className="w-full bg-sh-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-sh-neon transition-all"
                            />
                        </div>
                        <button
                            onClick={handleUpdatePassword}
                            disabled={loading}
                            className="md:col-span-2 border-2 border-sh-neon text-sh-neon font-black uppercase italic py-4 rounded-2xl hover:bg-sh-neon hover:text-sh-black transition-all"
                        >
                            Atualizar Senha
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};