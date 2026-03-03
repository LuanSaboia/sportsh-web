import { useEffect, useState } from 'react';
import supabase from '../lib/supabase';

export const CentralDocumentos = () => {
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('category');
      
      if (!error) setDocumentos(data || []);
    } finally {
      setLoading(false);
    }
  }

  const categoriasAgrupadas = documentos.reduce((acc: any, doc: any) => {
    const { category } = doc;
    if (!acc[category]) acc[category] = [];
    acc[category].push(doc);
    return acc;
  }, {});

  return (
    <div className="py-10 animate-fadeIn">
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Central de <span className="text-sh-neon">Documentos</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2 italic">
          Diretrizes e materiais oficiais do SPORTSH
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-sh-neon font-black animate-pulse uppercase">Sincronizando Arquivos...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {Object.keys(categoriasAgrupadas).map((categoria) => (
            <div key={categoria} className="space-y-6">
              <h3 className="text-sh-neon font-black uppercase text-xs tracking-[0.3em] flex items-center gap-3">
                <span className="w-12 h-[2px] bg-sh-neon"></span> {categoria}
              </h3>
              
              <div className="grid gap-4">
                {categoriasAgrupadas[categoria].map((doc: any) => (
                  <a 
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-5 bg-sh-black/40 border border-white/5 rounded-2xl group hover:bg-sh-green/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform">📄</div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight leading-tight group-hover:text-sh-green transition-colors">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{doc.file_size}</p>
                      </div>
                    </div>
                    <span className="bg-sh-neon text-sh-black px-3 py-1 rounded-lg font-black text-[10px] uppercase">
                      Baixar
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 p-8 border-2 border-dashed border-sh-green/30 rounded-3xl flex flex-col md:flex-row items-center gap-6 bg-sh-green/5">
        <div className="text-5xl">💡</div>
        <div>
          <h4 className="text-sh-neon font-black uppercase italic text-lg tracking-tighter">Dica de Gestão</h4>
          <p className="text-gray-400 text-xs italic leading-relaxed uppercase font-medium">
            "A unidade visual é o que torna o SPORTSH reconhecível em qualquer arena. Usa sempre os templates oficiais."
          </p>
        </div>
      </div>
    </div>
  );
};