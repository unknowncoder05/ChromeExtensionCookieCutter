FROM node:22-alpine

WORKDIR /workspace
COPY package*.json ./
COPY scripts/install-deps.sh ./scripts/install-deps.sh
RUN ./scripts/install-deps.sh
COPY . .
RUN npm run build

CMD ["npm", "run", "validate"]
