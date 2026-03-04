import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabase';

export const NewsDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('id', id)
                .single();

            if (!error) setItem(data);
            setLoading(false);
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="py-20 text-center animate-pulse text-sh-neon font-black">CARREGANDO...</div>;
    if (!item) return <div className="py-20 text-center text-white">Notícia não encontrada.</div>;

    return (
        <div className="py-10 max-w-4xl mx-auto animate-fadeIn">
            <Link to="/noticias" className="text-sh-green text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors mb-8 inline-block">
                ← Voltar para Notícias
            </Link>

            <img src={item.image_url} className="w-full h-[400px] object-cover rounded-[3rem] border border-white/10 mb-10 grayscale-[0.3]" alt="" />

            <div className="space-y-6">
                <span className="bg-sh-neon text-sh-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {item.category}
                </span>
                <h1 className="text-5xl md:text-6xl font-black italic uppercase leading-none text-white tracking-tighter">
                    {item.title}
                </h1>
                <p className="text-xl text-sh-green font-bold italic uppercase opacity-80 border-l-4 border-sh-green pl-6">
                    {item.subtitle}
                </p>

                <div className="text-gray-300 leading-relaxed text-lg pt-8 whitespace-pre-wrap font-medium">
                    {item.content || "Conteúdo em breve..."}
                    {item.gallery && item.gallery.length > 0 && (
                        <div className="mt-16 space-y-8">
                            <h3 className="text-sh-neon font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                                <span className="w-12 h-[2px] bg-sh-neon"></span> Galeria do Evento
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {item.gallery.map((img: string, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImg(img)}
                                        className="aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-sh-neon transition-all"
                                    >
                                        <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {selectedImg && (
                        <div
                            className="fixed inset-0 bg-sh-black/95 z-[200] flex items-center justify-center p-4 animate-fadeIn"
                            onClick={() => setSelectedImg(null)}
                        >
                            <button className="absolute top-10 right-10 text-sh-neon font-black text-xl">FECHAR [X]</button>
                            <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-white/10" alt="" />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-20 p-10 bg-white/5 border border-white/10 rounded-[2.5rem] text-center">
                <h4 className="text-sh-neon font-black italic uppercase mb-2">Gostou desse registro?</h4>
                <p className="text-gray-500 text-xs uppercase font-bold">O SPORTSH é feito pela sua oferta. Participe da sua Arena local!</p>
            </div>
        </div>
    );
};