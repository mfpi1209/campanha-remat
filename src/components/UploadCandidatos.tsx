import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadStatus {
  total: number;
  sucesso: number;
  erro: number;
  duplicados: number;
}

interface CandidatoCSV {
  polo: string;
  nome: string;
  telefone: string;
  email: string;
  rgm: string;
  serie: number;
  curso: string;
  apto_rematricula: boolean;
  situacao_financeira: string;
}

export default function UploadCandidatos() {
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): CandidatoCSV[] => {
    const linhas = text.split('\n').filter(linha => linha.trim());
    if (linhas.length === 0) throw new Error('Arquivo vazio');

    const headers = linhas[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const candidatos: CandidatoCSV[] = [];

    for (let i = 1; i < linhas.length; i++) {
      const valores = linhas[i].split(',').map(v => v.trim().replace(/"/g, ''));

      const candidato: CandidatoCSV = {
        polo: valores[0] || '',
        nome: valores[1] || '',
        telefone: valores[2] || '',
        email: valores[3] || '',
        rgm: valores[4] || '',
        serie: parseInt(valores[5]) || 1,
        curso: valores[6] || '',
        apto_rematricula: valores[7]?.toLowerCase() === '1' || valores[7]?.toLowerCase() === 'sim',
        situacao_financeira: (valores[8] || 'Adimplente').toLowerCase() === 'adimplente' ? 'Adimplente' : 'Inadimplente',
      };

      if (candidato.rgm && candidato.nome) {
        candidatos.push(candidato);
      }
    }

    return candidatos;
  };

  const processarCSV = async (file: File) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const text = await file.text();
      const candidatos = parseCSV(text);

      const uploadStatus: UploadStatus = {
        total: candidatos.length,
        sucesso: 0,
        erro: 0,
        duplicados: 0,
      };

      for (const candidato of candidatos) {
        const { error: insertError } = await supabase
          .from('candidatos_rematricula')
          .insert([candidato]);

        if (insertError) {
          if (insertError.message.includes('duplicate')) {
            uploadStatus.duplicados++;
          } else {
            uploadStatus.erro++;
          }
        } else {
          uploadStatus.sucesso++;
        }
      }

      setStatus(uploadStatus);
      setMessage(`Upload concluído! ${uploadStatus.sucesso} candidatos adicionados.`);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Erro ao processar arquivo: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Por favor, selecione um arquivo CSV');
        return;
      }
      processarCSV(file);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Upload de Candidatos</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Envie um arquivo CSV com os dados dos candidatos a rematrícula. O sistema preencherá automaticamente os campos ao digitar o RGM no formulário.
      </p>

      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
          id="csv-upload-candidatos"
        />
        <label
          htmlFor="csv-upload-candidatos"
          className="inline-flex flex-col items-center cursor-pointer hover:opacity-75 transition"
        >
          <Upload className="w-12 h-12 text-blue-600 mb-3" />
          <span className="text-lg font-medium text-gray-800">Clique para selecionar arquivo CSV</span>
          <span className="text-sm text-gray-600 mt-2">Colunas esperadas: Polo, Aluno, Telefone, E-mail, RGM, Serie, Curso, Apto Rematricula, Situação</span>
        </label>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {message && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <span className="text-green-800">{message}</span>
        </div>
      )}

      {status && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-blue-600">{status.total}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Inseridos</p>
            <p className="text-3xl font-bold text-green-600">{status.sucesso}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600">Duplicados</p>
            <p className="text-3xl font-bold text-orange-600">{status.duplicados}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Erros</p>
            <p className="text-3xl font-bold text-red-600">{status.erro}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800">Processando arquivo...</p>
        </div>
      )}
    </div>
  );
}
