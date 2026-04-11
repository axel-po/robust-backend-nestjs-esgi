import type { IConnection } from "@nestia/fetcher";

// Connexion vers l'API NestJS
export const connection: IConnection = {
  host: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
};

// Connexion authentifiée (avec JWT)
export const authConnection = (token: string): IConnection => ({
  ...connection,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
