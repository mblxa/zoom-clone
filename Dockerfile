FROM node:14.18.1-alpine AS builder
WORKDIR /app
COPY . /app
RUN npm install --unsafe-perm
RUN npm run build

FROM node:14.18.1-alpine
WORKDIR /app
COPY --from=builder /app /app
RUN npm install --only=prod --unsafe-perm

CMD ["npm", "run", "start"]
