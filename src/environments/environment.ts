// Configurazione runtime del frontend.
export const environment = {
  production: false,
  // Base API derivata dall'host della pagina: così il dev server è usabile sia
  // da localhost sia dal telefono in LAN (apri http://<ip-pc>:4200 sul telefono
  // e l'API punta a http://<ip-pc>:3000 da sola, senza IP hardcoded).
  apiBase:
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}:3000/api/v1`
      : 'http://localhost:3000/api/v1',
};
