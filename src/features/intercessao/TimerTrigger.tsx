import { useState } from 'react';
import { registerActivity } from '../../lib/activities';

export const TimerTrigger = () => {
  const [isTraining, setIsTraining] = useState(false);

  const handleFinishTraining = async () => {
    try {
      
      await registerActivity('spiritual', 'Treino Ofertado');
      setIsTraining(false);
      alert("Oferta aceita! O suor de hoje virou intercessão.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-sh-black p-8 rounded-3xl border-2 border-sh-neon shadow-[0_0_15px_rgba(215,242,5,0.2)]">
      <h2 className="text-sh-neon font-black text-2xl uppercase italic mb-4">
        {isTraining ? "Treino em Oferta" : "Pronto para o Jogo?"}
      </h2>

      {!isTraining ? (
        <button
          onClick={() => setIsTraining(true)}
          className="bg-sh-neon text-sh-black font-bold py-4 px-8 rounded-full hover:scale-105 transition-transform"
        >
          VOU TREINAR (INICIAR)
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-white italic">"Ofertando meu suor por: Jovens das periferias"</p>
          <button
            onClick={handleFinishTraining}
            className="border-2 border-sh-green text-sh-green font-bold py-2 px-6 rounded-full"
          >
            TREINO ENTREGUE 🏁
          </button>
        </div>
      )}
    </div>
  );
};