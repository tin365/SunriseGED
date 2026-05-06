export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  ADMIN_SETUP_TOKEN: string;
  SITE_URL: string;
  PUBLIC_R2_BASE_URL?: string;
  ADMIN_EMAIL?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'super_admin' | 'editor' | 'viewer';
  sessionId: string;
}

export type AppBindings = {
  Bindings: Env;
  Variables: {
    user: AuthUser;
  };
};
