# Imagem base
FROM node:22-slim

# Diretório de trabalho
WORKDIR /app

# Instalar pnpm e NestJS CLI globalmente
RUN npm install -g pnpm @nestjs/cli

# Copiar apenas os arquivos de dependências primeiro
COPY package.json pnpm-lock.yaml ./

# Instalar todas as dependências (incluindo as de desenvolvimento)
RUN pnpm install --frozen-lockfile

# Copiar o restante do código fonte
COPY . .

# Compilar o projeto
RUN pnpm build

# Expor a porta
EXPOSE 3001

# Comando para iniciar a aplicação em produção
CMD ["pnpm", "start"]
