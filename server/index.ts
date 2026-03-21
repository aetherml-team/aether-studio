import app from "./app";
import config from "./config";

app.listen(config.port, () => {
  console.log(`[gateway] listening on port ${config.port} (${config.nodeEnv})`);
  console.log(`  landing → ${config.dists.landing}`);
  console.log(`  app     → ${config.dists.app}`);
});
