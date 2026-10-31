/**
 * Genera `src/environments/environment.generated.ts` a partir de variables de entorno.
 * Así NINGUNA clave se guarda en el repositorio (ver `.env.example`).
 * Uso local: `npm run config` (lee `.env` si existe). En CI/Vercel se leen del entorno.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

const e = process.env;
const config = {
  supabaseUrl: e.SUPABASE_URL ?? '',
  supabaseAnonKey: e.SUPABASE_ANON_KEY ?? '',
  firebase: {
    apiKey: e.FIREBASE_API_KEY ?? '',
    authDomain: e.FIREBASE_AUTH_DOMAIN ?? '',
    projectId: e.FIREBASE_PROJECT_ID ?? '',
    appId: e.FIREBASE_APP_ID ?? '',
  },
};

mkdirSync('src/environments', { recursive: true });
writeFileSync(
  'src/environments/environment.generated.ts',
  `// ARCHIVO GENERADO por scripts/set-env.mjs. No editar ni subir a Git.\nexport const environment = ${JSON.stringify(config, null, 2)};\n`,
);
console.log('environment.generated.ts generado',
  config.supabaseUrl ? '(Supabase configurado)' : '(AVISO: SUPABASE_URL vacío)');
