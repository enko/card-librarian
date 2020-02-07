FROM node:12.14.1 as builder

WORKDIR /opt/card-librarian

RUN mkdir -p /opt/card-librarian && chown node /opt/card-librarian

COPY src /opt/card-librarian/src/
COPY config /opt/card-librarian/config/
COPY tsconfig.json ormconfig.json package* /opt/card-librarian/
RUN chown -R node /opt/card-librarian

USER node
RUN npm clean-install && npm run build

RUN cp -v /opt/card-librarian/src/migrations/*.sql /opt/card-librarian/dist/migrations/

FROM node:12.14.1-slim as runner

WORKDIR /opt/card-librarian

RUN chown -R node:node /opt/card-librarian

USER node

COPY tsconfig.json ormconfig.json package* /opt/card-librarian/
COPY config /opt/card-librarian/config/
COPY --from=builder /opt/card-librarian/dist /opt/card-librarian/dist
COPY src/translations /opt/card-librarian/dist/translations

RUN npm clean-install --production

ENTRYPOINT [ "/usr/local/bin/npm", "run" ]
