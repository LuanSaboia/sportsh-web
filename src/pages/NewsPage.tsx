import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { Link } from 'react-router-dom';

export const NewsPage = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('news').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setNews(data || []));
  }, []);

  return (
    <div className="py-10 animate-fadeIn">
      <h1 className="text-5xl font-black italic uppercase mb-12">Portal de <span className="text-sh-neon">Notícias</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map(item => (
          <Link
            key={item.id}
            to={`/noticias/${item.id}`}
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-sh-green/50 transition-all group flex flex-col h-full"
          >
            <div className="h-48 overflow-hidden">
              <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-sh-green font-black uppercase text-[8px] tracking-widest">{item.category}</span>
                <h3 className="text-xl font-black italic uppercase leading-tight">{item.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">{item.subtitle}</p>
              </div>
              <span className="text-sh-neon text-[10px] font-black uppercase mt-6 group-hover:translate-x-2 transition-transform inline-block">
                Ler mais +
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};