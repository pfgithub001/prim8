# prim8

## Docker

Requires Docker with Compose v2. Everything runs from the repo root.

```sh
cp .env.example .env                              # Docker config (names, network)
cp prim8-nextjs/.env.example prim8-nextjs/.env    # app config: fill in real SMTP values
make up                                           # build and start in the background
```

| Service  | Folder          | Container port                                             |
| -------- | --------------- | ---------------------------------------------------------- |
| `nextjs` | `prim8-nextjs/` | `3000`, not published (reached through the platform proxy) |

No port is published on the host, so check the running stack from inside the container (for local
development use `pnpm dev` in `prim8-nextjs/` instead):

```sh
docker compose exec nextjs node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>r.text()).then(console.log)"
```

The Next.js image uses the `output: "standalone"` build on `node:26-slim`, runs as the `node`
user, and checks its health against `/api/health`. App settings (SMTP, contact inbox) are read
from `prim8-nextjs/.env` at runtime and are never baked into the image.

Root `.env` variables:

| Variable         | Default         | Description                                     |
| ---------------- | --------------- | ----------------------------------------------- |
| `PROJECT_NAME`   | `prim8`         | Prefix for containers, images and network       |
| `NETWORK_SUBNET` | `172.29.0.0/16` | Subnet of the Docker network (must not overlap) |

There's no database, cache or queue yet, so there are no backup targets.

| Target                   | What it does                                                       |
| ------------------------ | ------------------------------------------------------------------ |
| `make build`             | Build the images                                                   |
| `make up`                | Start the stack in the background                                  |
| `make down`              | Stop the stack                                                     |
| `make logs`              | Follow logs                                                        |
| `make shell S=<service>` | Shell into a service (default `nextjs`)                            |
| `make ps`                | Show service status                                                |
| `make clean`             | Stop and remove containers, volumes and the project's built images |

### Deploying on Coolify

`prim8-nextjs/.env` is gitignored, so it doesn't exist in Coolify's clone. Compose skips it and
loads the app vars from the root `.env` that Coolify generates from its Environment Variables
(locally, `prim8-nextjs/.env` wins over the root one):

- Set every key from `prim8-nextjs/.env.example` (SMTP\_\*, `CONTACT_TO`) in Coolify's
  Environment Variables. Without them the app fails env validation at startup and the container
  stays unhealthy (Coolify then serves a 503).
- Set the domain on the `nextjs` service to `http://<domain>:3000`: the **container** port,
  which the proxy reaches over the Docker network.
- Keep `NETWORK_SUBNET` unique per project on the server.
