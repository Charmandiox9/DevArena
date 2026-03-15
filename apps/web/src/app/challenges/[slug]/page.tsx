import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import Workspace from '@/components/Workspace';

async function getChallenge(slug: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) redirect('/login');

  const res = await fetch(`http://localhost:3001/devarena/api/challenges/${slug}`, {
    headers: { Authorization: `Bearer ${token.value}` },
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ChallengePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  
  const challenge = await getChallenge(resolvedParams.slug);

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h1 className="text-2xl text-red-500 font-bold">Reto no encontrado (404)</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Lado Izquierdo: Instrucciones */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <Link href="/dashboard" className="text-blue-400 hover:underline mb-4 inline-block">
            &larr; Volver al Dashboard
          </Link>
          
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            <span className="bg-yellow-900 text-yellow-300 px-3 py-1 rounded text-sm font-bold">
              {challenge.points} XP
            </span>
          </div>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>
          </div>

          <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Casos de Prueba Públicos</h3>
          <div className="space-y-4">
            {challenge.testCases.map((tc: any) => (
              <div key={tc.id} className="bg-gray-900 p-4 rounded font-mono text-sm border border-gray-700">
                <p><span className="text-gray-500">Input:</span> <span className="text-green-400">{tc.input}</span></p>
                <p><span className="text-gray-500">Output Esperado:</span> <span className="text-blue-400">{tc.expectedOutput}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* Lado Derecho: Editor de Código */}
        <div className="flex flex-col h-full min-h-[500px]">
          <Workspace challengeId={challenge.id} />
        </div>

      </div>
    </div>
  );
}