FROM node:22

WORKDIR /jslets/MiSeguroDigitalAPI

# 1) Install all dependencies (not only production)
COPY package*.json ./
RUN npm ci

# 2) Copy source and tsconfig
COPY src ./src
COPY tsconfig.json ./

# 3) Build (uses local node_modules/typescript)
RUN npm run build

# 4) Optionally remove devDependencies to reduce size
RUN npm prune --production

EXPOSE 3001

CMD ["npm", "run", "start"]