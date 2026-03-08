// apps/web/src/app/page.tsx
import { prisma } from '@devarena/database';

export default async function Home() {
  // Hacemos una consulta real a la base de datos de Neon
  const usersCount = await prisma.user.count();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">DevArena</h1>
      <p className="text-xl">
        Conexión exitosa. Usuarios registrados: {usersCount}
      </p>
    </main>
  );
}