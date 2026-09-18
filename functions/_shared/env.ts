export interface Env {
  readonly APP_ENV?: "local" | "published";
  readonly APP_VERSION?: string;
  readonly ADMIN_SECRET?: string;
  readonly DB: D1Database;
}
