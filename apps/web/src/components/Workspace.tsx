'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { submitCodeAction } from '../app/actions/submit.actions';

interface WorkspaceProps {
  challengeId: string;
}

export default function Workspace({ challengeId }: WorkspaceProps) {
  const [code, setCode] = useState('// Escribe tu solución en JavaScript aquí...\n\nfunction solve(input) {\n  \n}\n');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect?: boolean; message: string } | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFeedback(null);

    const response = await submitCodeAction(challengeId, code);

    if (response.error) {
      setFeedback({ isCorrect: false, message: response.error });
    } else if (response.success) {
      setFeedback({ 
        isCorrect: response.result.success, 
        message: response.result.feedback 
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full w-full rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
      
      {/* Barra superior del editor */}
      <div className="flex justify-between items-center bg-gray-800 px-4 py-3 border-b border-gray-700">
        <span className="text-sm font-mono text-blue-400">JavaScript</span>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-1.5 rounded text-sm font-bold transition-colors shadow-lg ${
            isSubmitting 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
          }`}
        >
          {isSubmitting ? 'Evaluando...' : 'Enviar Solución →'}
        </button>
      </div>
      
      {/* Contenedor del Editor */}
      <div className="flex-grow min-h-[400px]">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            wordWrap: 'on',
            padding: { top: 16 },
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
          }}
        />
      </div>

      {/* Consola de Resultados (Solo aparece si hay feedback) */}
      {feedback && (
        <div className={`p-4 border-t ${feedback.isCorrect ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
          <h3 className={`font-bold mb-1 ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {feedback.isCorrect ? '✅ ¡Reto Superado!' : '❌ Error de Ejecución'}
          </h3>
          <p className="text-gray-300 font-mono text-sm whitespace-pre-wrap">{feedback.message}</p>
        </div>
      )}

    </div>
  );
}