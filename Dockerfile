# ================ #
#    Base Stage    #
# ================ #

FROM node:18-alpine as base

WORKDIR /usr/src/app

ENV YARN_DISABLE_GIT_HOOKS=1
ENV LOG_LEVEL=info
ENV FORCE_COLOR=true

RUN apk add --no-cache dumb-init

COPY --chown=node:node yarn.lock .
COPY --chown=node:node package.json .
COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node .yarn/ .yarn/

ENTRYPOINT ["dumb-init", "--"]

# ================ #
#   Builder Stage  #
# ================ #

FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node assets/ assets/
COPY --chown=node:node components/ components/
COPY --chown=node:node composables/ composables/
COPY --chown=node:node layouts/ layouts/
COPY --chown=node:node pages/ pages/
COPY --chown=node:node plugins/ plugins/
COPY --chown=node:node public/ public/
COPY --chown=node:node server/ server/
COPY --chown=node:node static/ static/

COPY --chown=node:node app.vue app.vue
COPY --chown=node:node nuxt.config.ts nuxt.config.ts
COPY --chown=node:node tailwind.config.ts tailwind.config.ts
COPY --chown=node:node tsconfig.json tsconfig.json

RUN yarn install --immutable
RUN yarn run build

# ================ #
#   Runner Stage   #
# ================ #

FROM base AS runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps"

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app/.output .output

USER root

RUN rm -rf .yarn .yarnrc.yml package.json yarn.lock

USER node

CMD [ "node", ".output/server/index.mjs" ]
