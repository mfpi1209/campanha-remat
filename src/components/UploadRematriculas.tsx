import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadStatus {
  total: number;
  processados: number;
  encontrados: number;
  naoEncontrados: number;
}

export default function UploadRematriculas() {
  const [status, setStatus] = useState<UploadStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processarCSV = async (file: File) => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const text = await file.text();
      const linhas = text.split('\n').filter(linha => linha.trim());

      if (linhas.length === 0) {
        setError('Arquivo vazio');
        setLoading(false);
        return;
      }

      const rgms = linhas
        .slice(1)
        .map(linha => {
          const partes = linha.split(',');
          return partes[0]?.trim().replace(/"/g, '');
        })
        .filter(Boolean);

      const uploadStatus: UploadStatus = {
        total: rgms.length,
        processados: 0,
        encontrados: 0,
        naoEncontrados: 0,
      };

      for (const rgm of rgms) {
        const { data: matriculas, error: searchError } = await supabase
          .from('matriculas')
          .select('id')
          .eq('rgm', rgm);

        if (!searchError && matriculas && matriculas.length > 0) {
          await supabase
            .from('matriculas')
            .update({
              status_rematricula: 'Rematrícula feita com Sucesso',
              data_rematricula: new Date().toISOString(),
            })
            .eq('rgm', rgm);

          uploadStatus.encontrados++;
        } else {
          uploadStatus.naoEncontrados++;
        }

        uploadStatus.processados++;
      }

      setStatus(uploadStatus);
      setMessage(`Processamento concluído! ${uploadStatus.encontrados} matrículas atualizadas.`);

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
        <h2 className="text-2xl font-bold text-gray-800">Upload de Confirmações</h2>
      </div>

      <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="inline-flex flex-col items-center cursor-pointer hover:opacity-75 transition"
        >
          <Upload className="w-12 h-12 text-blue-600 mb-3" />
          <span className="text-lg font-medium text-gray-800">Clique para selecionar arquivo CSV</span>
          <span className="text-sm text-gray-600 mt-2">Ou arraste um arquivo aqui</span>
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
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">Total de registros</p>
            <p className="text-3xl font-bold text-blue-600">{status.total}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-gray-600">Matrículas encontradas</p>
            <p className="text-3xl font-bold text-green-600">{status.encontrados}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-gray-600">Não encontradas</p>
            <p className="text-3xl font-bold text-yellow-600">{status.naoEncontrados}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Processadas</p>
            <p className="text-3xl font-bold text-gray-600">{status.processados}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <p className="text-blue-800">Processando arquivo... {status ? `${status.processados}/${status.total}` : ''}</p>
        </div>
      )}
    </div>
  );
}
