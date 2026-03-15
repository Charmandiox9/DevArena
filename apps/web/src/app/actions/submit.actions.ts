"use server";

import { cookies } from "next/headers";

export async function submitCodeAction(challengeId: string, content: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    if (!token) {
      return {
        error:
          "Sesión expirada o no autorizada. Por favor, inicia sesión de nuevo.",
      };
    }

    const response = await fetch(
      "http://localhost:3001/devarena/api/submissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.stringify({ challengeId, content }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Error al compilar el código en la arena",
      };
    }

    const data = await response.json();
    return { success: true, result: data };
  } catch (error) {
    return { error: "Error fatal de conexión con el motor de evaluación" };
  }
}
