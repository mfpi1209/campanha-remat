import { useState, useEffect } from 'react';
import { supabase, Campanha, Matricula } from '../lib/supabase';
import { CheckCircle2, AlertCircle, UserPlus, Zap } from 'lucide-react';

export default function FormularioRematricula() {
  const [nome, setNome] = useState('');
  const [rgm, setRgm] = useState('');
  const [serie, setSerie] = useState('1');
  const [situacaoFinanceira, setSituacaoFinanceira] = useState<'Adimplente' | 'Inadimplente'>('Adimplente');
  const [valorMensalidade, setValorMensalidade] = useState('');
  const [mensalidadesRestantes, setMensalidadesRestantes] = useState('');
  const [campanhaId, setCampanhaId] = useState('');
  const [consultor, setConsultor] = useState('');

  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [preenchidoAutomatico, setPreenchidoAutomatico] = useState(false);

  useEffect(() => {
    carregarCampanhas();
  }, [situacaoFinanceira]);

  useEffect(() => {
    if (rgm.length >= 6) {
      buscarCandidato();
    } else {
      setPreenchidoAutomatico(false);
    }
  }, [rgm]);

  const carregarCampanhas = async () => {
    const { data, error } = await supabase
      .from('campanhas')
      .select('*')
      .eq('situacao_financeira', situacaoFinanceira);

    if (error) {
      console.error('Erro ao carregar campanhas:', error);
      return;
    }

    setCampanhas(data || []);
    if (data && data.length > 0) {
      setCampanhaId(data[0].id);
    }
  };

  const buscarCandidato = async () => {
    const { data, error } = await supabase
      .from('candidatos_rematricula')
      .select('*')
      .eq('rgm', rgm)
      .maybeSingle();

    if (error || !data) {
      setPreenchidoAutomatico(false);
      return;
    }

    setNome(data.nome);
    setSerie(data.serie.toString());
    setSituacaoFinanceira(data.situacao_financeira as 'Adimplente' | 'Inadimplente');
    setPreenchidoAutomatico(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const matricula: Matricula = {
      nome,
      rgm,
      serie: parseInt(serie),
      situacao_financeira: situacaoFinanceira,
      valor_mensalidade: parseFloat(valorMensalidade),
      mensalidades_restantes: parseInt(mensalidadesRestantes),
      campanha_id: campanhaId,
      consultor: consultor
    };

    const { error } = await supabase
      .from('matriculas')
      .insert([matricula]);

    if (error) {
      setMessage({ type: 'error', text: 'Erro ao cadastrar matrícula. Tente novamente.' });
      setLoading(false);
      return;
    }

    setMessage({ type: 'success', text: 'Matrícula cadastrada com sucesso!' });
    setLoading(false);

    setNome('');
    setRgm('');
    setSerie('1');
    setSituacaoFinanceira('Adimplente');
    setValorMensalidade('');
    setMensalidadesRestantes('');
    setConsultor('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <UserPlus className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Campanha de Rematrícula</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {preenchidoAutomatico && (
        <div className="mb-6 p-4 rounded-lg flex items-center gap-3 bg-blue-50 text-blue-800">
          <Zap className="w-5 h-5" />
          <span>Dados do candidato carregados automaticamente!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Aluno
          </label>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Digite o nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RGM
          </label>
          <input
            type="text"
            required
            value={rgm}
            onChange={(e) => setRgm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Digite o RGM"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Série
            </label>
            <select
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                <option key={s} value={s}>
                  {s}ª Série
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Situação Financeira
            </label>
            <select
              value={situacaoFinanceira}
              onChange={(e) => setSituacaoFinanceira(e.target.value as 'Adimplente' | 'Inadimplente')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="Adimplente">Adimplente</option>
              <option value="Inadimplente">Inadimplente</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Mensalidade (R$)
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={valorMensalidade}
              onChange={(e) => setValorMensalidade(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensalidades Restantes
            </label>
            <input
              type="number"
              required
              min="0"
              value={mensalidadesRestantes}
              onChange={(e) => setMensalidadesRestantes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultor
            </label>
            <input
              type="text"
              required
              value={consultor}
              onChange={(e) => setConsultor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nome do consultor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campanha
            </label>
            <select
              value={campanhaId}
              onChange={(e) => setCampanhaId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              {campanhas.length === 0 ? (
                <option value="">Nenhuma campanha disponível</option>
              ) : (
                campanhas.map((campanha) => (
                  <option key={campanha.id} value={campanha.id}>
                    {campanha.descricao}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || campanhas.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Rematrícula'}
        </button>
      </form>
    </div>
  );
}
