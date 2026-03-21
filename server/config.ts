import path from "path";

const __dirname = import.meta.dir;
const REPO_ROOT = path.resolve(__dirname, Bun.env.REPO_ROOT ?? "..");

function resolveFromRepo(envVar: string, defaultRel: string) {
  return path.resolve(REPO_ROOT, Bun.env[envVar] ?? defaultRel);
}

const config = {
  port: Number(Bun.env.PORT) || 3000,
  nodeEnv: Bun.env.NODE_ENV ?? "development",
  trustProxy: Bun.env.TRUST_PROXY === "1" || Bun.env.NODE_ENV === "production",

  dists: {
    landing: resolveFromRepo("LANDING_DIST", "landing-page/dist"),
    app: resolveFromRepo("APP_DIST", "app/dist"),
  },

  get isProduction() {
    return this.nodeEnv === "production";
  },
} as const;

export default config;
export type Config = typeof config;
