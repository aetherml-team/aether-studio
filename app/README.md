# App (dashboard)

Build the client here (Vite/React or your stack). The gateway serves `app/dist` when the request `Host` is the **app** subdomain (e.g. `app.example.com`).

```bash
npm run build
# output: app/dist/
```

Until `app/dist/index.html` exists, visitors on the app host see a short “not deployed” page.
