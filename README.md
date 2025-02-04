Este é um projeto para o teste técnico para a Quiker, com funcionalidades de um blog.

O sistema está online para visualização em: https://quiker-frontend-production.up.railway.app/

## Funcionalidades entregues

- ✅ 1ab: Readme.md com descrição da stack e instruções de execução
- ✅ 2: Estrutura base com 3+ entidades
- ✅ 3: Sistema de autenticação
- ✅ 4: CRUD de usuários com autenticação e edição de perfil
- ✅ 5: CRUD de postagens com:
  - ✅ 5a: Controle de acesso
  - ✅ 5b: Upload de imagem (através do Cloudflare R2)
  - ✅ 5c: Histórico de edições (mostrado na página de edição do post, quando há edições)
  - ✅ 5d: Contador de visualizações (\*conta as visualizações únicas por ip)
  - ✅ 5e: Contador de curtidas/não curtidas (\*somente para usuários logados)
- ✅ 6: CRUD de comentários com:
  - ✅ 6abc: Controle de edição/remoção
  - 6d: Marcador de remoção
  - ✅ 6e: Notificação por e-mail (através do Mailtrap para teste)
- ✅ 7: Rota para relatório de posts.

## Stack

Decidi optar pelo Next + Nest pois se alinhava melhor com o requisitado da vaga.
Porém, analisando os requisitos do projeto, levando em consideração que um blog básico não precisaria de uma API externa, e também a relevância do SEO, em um caso real acredito que a melhor opção seria o Next com SSR e Server Actions.

_Frontend:_ Next.js [v15], React [v19], Material UI, TypeScript
_Backend:_ NestJS [v11], TypeORM, PostgreSQL
_DevOps:_ Docker, Docker Compose, pnpm

### Pacotes

- `tipTap` - Editor (WYSIWYG) visual de texto
- `axios` - Cliente HTTP
- `date-fns` - Para datas dinâmicas
- `html-react-parser` - Parse seguro de HTML (para processar o html gerador pelo editor visual)
- `truncate-html` - Truncagem de conteúdo HTML (para o "ler mais...")
- `passport/jwt` - Token de autenticação JWT da API
- `aws-sdk/client-s3` - Storage compatível com S3 (Cloudflare R2) para upload das imagens do blog
- `nodemailer` - Serviço de envio de emails (MailTrap para testes)

## Como Rodar o Projeto

### Pré-requisitos

- Docker
- Docker Compose
- pnpm (opcional, apenas para desenvolvimento local)

### Passos para Execução

1. Clone o repositório:

```bash
git clone https://github.com/renandecarlo/quiker-blog
cd quiker-blog
```

2. Configure as variáveis de ambiente:

   - Copie os arquivos `.env.example` para `.env` tanto no frontend quanto no backend
   - Preencha as variáveis necessárias (Cloudflare R2, Mailtrap, etc.)

3. Inicie os containers:

```bash
docker compose up
```

4. Aguarde a inicialização dos serviços:
   - Frontend estará disponível em: http://localhost:3000
   - Backend estará disponível em: http://localhost:3001
   - PostgreSQL estará disponível em: localhost:5432
   - A rota para relatório de posts estará disponível em: http://localhost:3001/posts/report

## Estrutura do Projeto

- `/frontend` - Aplicação Next.js
- `/backend` - API NestJS
- `docker-compose.yml` - Configuração dos containers
