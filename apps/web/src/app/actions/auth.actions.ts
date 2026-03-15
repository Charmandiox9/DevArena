"use server";

import { cookies } from "next/headers";

export async function loginAction(email: string, password: string) {
  try {
    const response = await fetch(
      "http://localhost:3001/devarena/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Credenciales inválidas" };
    }

    const data = await response.json();

    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: data.user };
  } catch (error) {
    return { error: "Error al conectar con el servidor de DevArena" };
  }
}
