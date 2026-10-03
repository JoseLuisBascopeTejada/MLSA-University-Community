# Verify the current Node LTS before changing this version.
ARG NODE_VERSION=24
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

FROM base AS dev
EXPOSE 5173
# Dependencies live in a named volume (see docker-compose.yml); run
# `docker compose run --rm web npm install` after changing package.json.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
