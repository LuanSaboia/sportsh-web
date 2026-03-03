import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 py-16 px-4 bg-sh-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">
            SPORT<span className="text-sh-neon">SH</span>
          </h3>
          <p className="text-gray-500 text-sm max-w-sm uppercase font-bold italic leading-relaxed">
            A visão cristã do desporto. Transformando o suor em oferta e a disciplina em santidade.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sh-neon font-black uppercase text-xs tracking-widest">Navegação</h4>
          <ul className="text-gray-400 text-[10px] font-black uppercase space-y-2">
            <li><Link to="/ranking" className="hover:text-white transition-colors">Ranking Magnificat</Link></li>
            <li><Link to="/mapa" className="hover:text-white transition-colors">Arena SH</Link></li>
            <li><Link to="/documentos" className="hover:text-white transition-colors">Materiais</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sh-green font-black uppercase text-xs tracking-widest">Social</h4>
          <ul className="text-gray-400 text-[10px] font-black uppercase space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="https://comshalom.org" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Comshalom</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-bold uppercase text-gray-600 tracking-[0.2em]">
        <p>© 2026 SPORTSH. Todos os direitos reservados.</p>
        <p>Desenvolvido com suor e oração</p>
      </div>
    </footer>
  );
};