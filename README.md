# iparraguirre-studio

## Docker

Requires Docker with Compose v2. Everything runs from the repo root.

```sh
cp .env.example .env                              # Docker config (names, network, ports)
cp prim8-nextjs/.env.example prim8-nextjs/.env    # app config: fill in real SMTP values
make up                                           # build and start in the background
```

| Service  | Folder          | URL                                   |
| -------- | --------------- | ------------------------------------- |
| `nextjs` | `prim8-nextjs/` | http://localhost:3000 (`NEXTJS_PORT`) |

The Next.js image uses the `output: "standalone"` build on `node:26-slim`, runs as the `node`
user, and checks its health against `/api/health`. App settings (SMTP, contact inbox) are read
from `prim8-nextjs/.env` at runtime and are never baked into the image.

Root `.env` variables:

| Variable         | Default         | Description                                      |
| ---------------- | --------------- | ------------------------------------------------ |
| `PROJECT_NAME`   | `prim8`         | Prefix for containers, images and network        |
| `NETWORK_SUBNET` | `172.29.0.0/16` | Subnet of the Docker network (must not overlap)  |
| `NEXTJS_PORT`    | `3000`          | Host port for the Next.js app (container `3000`) |

There's no database, cache or queue yet, so there are no backup targets.

| Target                   | What it does                                         |
| ------------------------ | ---------------------------------------------------- |
| `make build`             | Build the images                                     |
| `make up`                | Start the stack in the background                    |
| `make down`              | Stop the stack                                       |
| `make logs`              | Follow logs                                          |
| `make shell S=<service>` | Shell into a service (default `nextjs`)              |
| `make ps`                | Show service status                                  |
| `make clean`             | Stop and remove containers, volumes and local images |
