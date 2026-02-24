import { useState, useEffect } from 'react';
import { supabase, Matricula, Campanha } from '../lib/supabase';
import { Users, RefreshCw, Download } from 'lucide-react';

interface MatriculaComCampanha extends Matricula {
  campanhas?: Campanha;
}

export default function ListaMatriculas() {
  const [matriculas, setMatriculas] = useState<MatriculaComCampanha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMatriculas();
  }, []);

  const carregarMatriculas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('matriculas')
      .select(`
        *,
        campanhas (
          descricao,
          situacao_financeira
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao carregar matrículas:', error);
      setLoading(false);
      return;
    }

    setMatriculas(data || []);
    setLoading(false);
  };

  const exportarCSV = () => {
    if (matriculas.length === 0) return;

    const headers = ['Nome', 'RGM', 'Série', 'Situação Financeira', 'Valor Mensalidade', 'Mensalidades Restantes', 'Campanha', 'Consultor', 'Data Cadastro'];

    const rows = matriculas.map((matricula) => [
      matricula.nome,
      matricula.rgm,
      matricula.serie,
      matricula.situacao_financeira,
      `R$ ${Number(matricula.valor_mensalidade).toFixed(2)}`,
      matricula.mensalidades_restantes,
      matricula.campanhas?.descricao || '-',
      matricula.consultor || '-',
      matricula.data_cadastro_campanha
        ? new Date(matricula.data_cadastro_campanha).toLocaleDateString('pt-BR')
        : '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `matriculas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Matrículas Cadastradas</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportarCSV}
            disabled={matriculas.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button
            onClick={carregarMatriculas}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>

      {matriculas.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhuma matrícula cadastrada ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  RGM
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Série
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Situação
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Mensalidade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Restantes
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Campanha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Consultor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status Rematrícula
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matriculas.map((matricula) => (
                <tr key={matricula.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {matricula.nome}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {matricula.rgm}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {matricula.serie}ª
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      matricula.situacao_financeira === 'Adimplente'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {matricula.situacao_financeira}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    R$ {Number(matricula.valor_mensalidade).toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {matricula.mensalidades_restantes}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {matricula.campanhas?.descricao || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {matricula.consultor || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {matricula.data_cadastro_campanha
                      ? new Date(matricula.data_cadastro_campanha).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      matricula.status_rematricula === 'Rematrícula feita com Sucesso'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {matricula.status_rematricula || 'Aguardando confirmação de rematrícula'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
