import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getChallenges() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    redirect('/login');
  }

  const res = await fetch('http://localhost:3001/devarena/api/challenges', {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    cache: 'no-store', 
  });

  if (!res.ok) {
    throw new Error('Error al cargar los retos');
  }

  return res.json();
}

export default async function DashboardPage() {
  const challenges = await getChallenges();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-blue-400">DevArena Dashboard</h1>
          <form action={async () => {
            'use server';
            const cookieStore = await cookies();
            cookieStore.delete('access_token');
            redirect('/login');
          }}>
            <button type="submit" className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
              Cerrar Sesión
            </button>
          </form>
        </header>

        <section>
          <h2 className="text-xl font-semibold mb-4">Retos Disponibles</h2>
          
          {challenges.length === 0 ? (
            <p className="text-gray-400">No hay retos creados todavía.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {challenges.map((challenge: any) => (
                <div key={challenge.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{challenge.title}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-300">
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {challenge.description}
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-yellow-400 font-mono">{challenge.points} XP</span>
                    <Link 
                      href={`/challenges/${challenge.slug}`}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded transition-colors inline-block"
                    >
                      Resolver
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}