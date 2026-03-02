// src/pages/CentralDocumentos.tsx

const categorias = [
  {
    titulo: "Institucional",
    docs: [
      { nome: "Manual dos Esportes (Oficial)", tamanho: "2.4 MB", link: "#" },
      { nome: "Documento 'Dar o Melhor de Si'", tamanho: "1.1 MB", link: "#" },
      { nome: "Projeto Shalom Social", tamanho: "850 KB", link: "#" },
    ]
  },
  {
    titulo: "Identidade Visual",
    docs: [
      { nome: "Pack de Logos SPORTSH (PNG/SVG)", tamanho: "15 MB", link: "#" },
      { nome: "Manual de Uso da Marca", tamanho: "3.2 MB", link: "#" },
      { nome: "Templates para Redes Sociais", tamanho: "45 MB", link: "#" },
    ]
  },
  {
    titulo: "Gestão e Modelos",
    docs: [
      { nome: "Modelo de Autorização de Quadras", tamanho: "120 KB", link: "#" },
      { nome: "Ficha de Inscrição de Atletas", tamanho: "95 KB", link: "#" },
      { nome: "Checklist para Eventos (Copa/Olimpíadas)", tamanho: "200 KB", link: "#" },
    ]
  },
  {
    titulo: "Regulamentos",
    docs: [
      { nome: "Regras Vôlei e Beach Tênis", tamanho: "500 KB", link: "#" },
      { nome: "Regras Futsal e Basquete", tamanho: "480 KB", link: "#" },
      { nome: "Protocolo de Primeiros Socorros", tamanho: "1.5 MB", link: "#" },
    ]
  }
];

export const CentralDocumentos = () => {
  return (
    <div className="py-10 animate-fadeIn">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter">
          Central de <span className="text-sh-neon">Documentos</span>
        </h1>
        <p className="text-sh-green font-bold uppercase tracking-widest text-sm mt-2">
          Área de Draft: Tudo o que precisas para entrar em campo.
        </p>
      </div>

      {/* GRID DE CATEGORIAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categorias.map((cat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-sh-neon/30 transition-all">
            <h3 className="text-sh-neon font-black uppercase italic text-xl mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-sh-green rounded-full"></span>
              {cat.titulo}
            </h3>
            
            <div className="space-y-3">
              {cat.docs.map((doc, dIdx) => (
                <div 
                  key={dIdx} 
                  className="flex items-center justify-between p-4 bg-sh-black/40 border border-white/5 rounded-2xl group hover:bg-sh-green/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform">📄</div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight leading-tight">{doc.nome}</p>
                      <p className="text-[10px] text-gray-500 font-bold">{doc.tamanho}</p>
                    </div>
                  </div>
                  <button className="bg-sh-neon text-sh-black p-2 rounded-lg font-black text-[10px] hover:scale-110 transition-transform">
                    DOC
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AVISO DO MANUAL */}
      <div className="mt-12 p-8 border-2 border-dashed border-sh-green/30 rounded-3xl flex flex-col md:flex-row items-center gap-6 bg-sh-green/5">
        <div className="text-5xl">💡</div>
        <div>
          <h4 className="text-sh-neon font-black uppercase italic text-lg">Dica de Gestão</h4>
          <p className="text-gray-400 text-sm italic leading-relaxed">
            "O esporte oferece uma grande oportunidade de evangelização. Usa estes materiais para garantir que a tua missão tenha a unidade visual e espiritual do Carisma Shalom."
          </p>
        </div>
      </div>
    </div>
  );
};