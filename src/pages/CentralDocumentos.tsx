import { useEffect, useState, useMemo } from 'react';
import supabase from '../lib/supabase';

export const CentralDocumentos = () => {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('category');
        
        if (!error) setDocumentos(data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const categoriasAgrupadas = useMemo(() => {
    return documentos.reduce((acc: any, doc: any) => {
      const { category } = doc;
      if (!acc[category]) acc[category] = [];
      acc[category].push(doc);
      return acc;
    }, {});
  }, [documentos]);

  return (
    <div className="py-10 animate-fadeIn min-h-screen">
      <header className="mb-12 border-l-4 border-sh-neon pl-6">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
          Central de <span className="text-sh-neon">Documentos</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-[10px] mt-2 italic">
          Recursos e diretrizes oficiais SPORTSH
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-sh-neon border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sh-neon font-black uppercase text-[10px] tracking-widest">Sincronizando Arquivos...</p>
        </div>
      ) : documentos.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {Object.keys(categoriasAgrupadas).map((categoria) => (
            <div key={categoria} className="space-y-6">
              <h3 className="text-sh-neon font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                <span className="w-12 h-[2px] bg-sh-neon"></span> {categoria}
              </h3>
              
              <div className="grid gap-3">
                {categoriasAgrupadas[categoria].map((doc: any) => (
                  <a 
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-sh-green/10 hover:border-sh-green/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📄</span>
                      <div>
                        <p className="text-sm font-bold text-white uppercase group-hover:text-sh-green transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{doc.file_size}</p>
                      </div>
                    </div>
                    <span className="bg-sh-neon text-sh-black px-4 py-1 rounded-lg font-black text-[10px] uppercase italic group-hover:scale-105 transition-transform">
                      Download
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <p className="text-gray-500 font-bold uppercase text-xs">Nenhum documento disponível no radar.</p>
        </div>
      )}
    </div>
  );
};