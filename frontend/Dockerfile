# Imagem base
FROM node:22-alpine

# Define as variáveis de ambiente dentro do contêiner
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STORAGE_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_STORAGE_URL=${NEXT_PUBLIC_STORAGE_URL}

# Diretório de trabalho
WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar apenas os arquivos de dependências primeiro
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar o restante do código fonte
COPY . .

# Compilar o projeto
RUN pnpm build

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["pnpm", "start"]
