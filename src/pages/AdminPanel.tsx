import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { registerActivity } from '../lib/activities';

export const AdminPanel = () => {
  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', category: 'Institucional' });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const buscarUsuarios = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, mission, total_points')
      .ilike('full_name', `%${busca}%`)
      .limit(5);

    if (!error) setUsuarios(data || []);
    setLoading(false);
  };

  const adicionarPontosExtra = async (userId: string, pontos: number, motivo: string) => {
    const confirmacao = window.confirm(`Confirmar envio de ${pontos} pontos para este atleta?`);
    if (!confirmacao) return;

    try {
      const { error } = await supabase.rpc('handle_activity', {
        p_user_id: userId,
        p_type: 'evangelization',
        p_description: `PONTOS ADMIN: ${motivo}`,
        p_points: pontos
      });

      if (error) throw error;
      alert("Pontos creditados com sucesso!");
      buscarUsuarios();
    } catch (e) {
      alert("Erro ao processar pontos.");
    }
  };

  const [newsForm, setNewsForm] = useState({
    title: '', subtitle: '', category: 'Evento', cta_text: 'Saiba Mais', link: '', content: '', is_featured: false
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleCreateNews = async () => {
    if (!newsForm.title || !coverFile) return alert("Título e Imagem de Capa são obrigatórios!");
    setIsPublishing(true);

    try {
      
      const coverPath = `covers/${Date.now()}-${coverFile.name}`;
      await supabase.storage.from('news-media').upload(coverPath, coverFile);
      const { data: { publicUrl: coverUrl } } = supabase.storage.from('news-media').getPublicUrl(coverPath);

      const galleryUrls = [];
      for (const file of galleryFiles) {
        const path = `gallery/${Date.now()}-${file.name}`;
        await supabase.storage.from('news-media').upload(path, file);
        const { data: { publicUrl } } = supabase.storage.from('news-media').getPublicUrl(path);
        galleryUrls.push(publicUrl);
      }

      const { error } = await supabase.from('news').insert({
        ...newsForm,
        image_url: coverUrl,
        gallery: galleryUrls
      });

      if (error) throw error;
      alert("Notícia publicada com sucesso!");

    } catch (e) {
      alert("Erro ao publicar.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!docForm.name || !docFile) return alert("Preenche o nome e seleciona um arquivo!");

    setIsUploadingDoc(true);
    try {
      
      const fileExt = docFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `oficiais/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos-oficiais')
        .upload(filePath, docFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documentos-oficiais')
        .getPublicUrl(filePath);

      const sizeInMB = (docFile.size / (1024 * 1024)).toFixed(1);
      const fileSizeStr = `${sizeInMB} MB`;

      const { error: dbError } = await supabase.from('documents').insert({
        name: docForm.name,
        category: docForm.category,
        file_url: publicUrl,
        file_size: fileSizeStr
      });

      if (dbError) throw dbError;

      alert("Documento disponibilizado na Central!");
      setDocForm({ name: '', category: 'Institucional' });
      setDocFile(null);
    } catch (e: any) {
      alert("Erro no upload: " + e.message);
    } finally {
      setIsUploadingDoc(false);
    }
  };

  return (
    <div className="py-10 animate-fadeIn max-w-4xl mx-auto">
      <h1 className="text-4xl font-black italic uppercase mb-8 border-l-4 border-sh-green pl-4">
        Painel de <span className="text-sh-neon">Coordenação</span>
      </h1>

      <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 mb-8">
        <p className="text-sh-green font-bold uppercase text-[10px] tracking-widest mb-4">Premiar Atleta</p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nome do Atleta..."
            className="flex-1 bg-sh-black border border-white/10 rounded-xl px-4 text-white outline-none focus:border-sh-neon"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            onClick={buscarUsuarios}
            className="bg-sh-neon text-sh-black px-6 py-3 rounded-xl font-black uppercase italic hover:scale-105 transition-all"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {usuarios.map(u => (
          <div key={u.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group">
            <div>
              <h4 className="font-black uppercase text-white">{u.full_name}</h4>
              <p className="text-gray-500 text-[10px] uppercase font-bold">{u.mission} | {u.total_points} PTS</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => adicionarPontosExtra(u.id, 50, "Participação em Evento")}
                className="bg-sh-green/20 text-sh-green px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-sh-green hover:text-sh-black transition-all"
              >
                +50 PTS
              </button>
              <button
                onClick={() => adicionarPontosExtra(u.id, 100, "Destaque da Missão")}
                className="bg-sh-neon/20 text-sh-neon px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-sh-neon hover:text-sh-black transition-all"
              >
                +100 PTS
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-12 bg-white/5 p-8 rounded-[2rem] border border-white/10">
        <h3 className="text-sh-neon font-black uppercase italic text-xl mb-6">Novo Evento / Notícia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="Título" className="bg-sh-black border border-white/10 p-4 rounded-xl outline-none focus:border-sh-neon" onChange={e => setNewsForm({ ...newsForm, title: e.target.value })} />
          <input type="text" placeholder="Subtítulo" className="bg-sh-black border border-white/10 p-4 rounded-xl outline-none focus:border-sh-neon" onChange={e => setNewsForm({ ...newsForm, subtitle: e.target.value })} />

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500">Imagem de Capa (Carrossel)</label>
            <input type="file" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full text-xs" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500">Fotos da Galeria (Múltiplas)</label>
            <input type="file" multiple onChange={e => setGalleryFiles(Array.from(e.target.files || []))} className="w-full text-xs" />
          </div>

          <textarea placeholder="Conteúdo da notícia..." className="md:col-span-2 bg-sh-black border border-white/10 p-4 rounded-xl h-32 outline-none focus:border-sh-neon" onChange={e => setNewsForm({ ...newsForm, content: e.target.value })} />

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" onChange={e => setNewsForm({ ...newsForm, is_featured: e.target.checked })} />
            <span className="text-xs font-bold uppercase">Destaque no Carrossel?</span>
          </label>

          <button
            onClick={handleCreateNews}
            disabled={isPublishing}
            className="md:col-span-2 bg-sh-green text-sh-black font-black uppercase italic py-4 rounded-2xl hover:bg-sh-neon transition-all"
          >
            {isPublishing ? "Publicando..." : "Publicar Notícia"}
          </button>
        </div>
      </section>

      <section className="mt-12 bg-white/5 p-8 rounded-[2rem] border border-white/10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-sh-green/20 rounded-2xl flex items-center justify-center text-2xl">📂</div>
          <div>
            <h3 className="text-white font-black uppercase italic text-xl leading-none">Gestão de Documentos</h3>
            <p className="text-sh-green font-bold uppercase text-[10px] tracking-widest mt-1">Upload de Materiais Oficiais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Nome do Documento</label>
            <input
              type="text"
              placeholder="Ex: Manual de Identidade 2026"
              className="w-full bg-sh-black border border-white/10 p-4 rounded-xl outline-none focus:border-sh-green transition-all"
              value={docForm.name}
              onChange={e => setDocForm({ ...docForm, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-2">Categoria</label>
            <select
              className="w-full bg-sh-black border border-white/10 p-4 rounded-xl outline-none focus:border-sh-green appearance-none cursor-pointer"
              value={docForm.category}
              onChange={e => setDocForm({ ...docForm, category: e.target.value })}
            >
              <option value="Institucional">Institucional</option>
              <option value="Identidade Visual">Identidade Visual</option>
              <option value="Gestão e Modelos">Gestão e Modelos</option>
              <option value="Regulamentos">Regulamentos</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-sh-green/50 transition-all">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={e => setDocFile(e.target.files?.[0] || null)}
              />
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase text-gray-400">
                  {docFile ? docFile.name : "Clique ou arraste o ficheiro (PDF, ZIP, PNG)"}
                </p>
                {docFile && <p className="text-[10px] text-sh-green font-black uppercase">Ficheiro Selecionado</p>}
              </div>
            </div>

            <button
              onClick={handleUploadDocument}
              disabled={isUploadingDoc}
              className="w-full bg-sh-green text-sh-black font-black uppercase italic py-4 rounded-2xl hover:bg-sh-neon transition-all disabled:opacity-50 shadow-lg shadow-sh-green/10"
            >
              {isUploadingDoc ? "A Sincronizar Arquivo..." : "Publicar Documento"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};