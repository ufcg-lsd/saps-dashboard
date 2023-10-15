# Dashboard

## Configuração

Para rodar o projeto corretamente, siga os passos abaixo:

### 1. Alterando a Porta do Dashboard

Caso seja necessário, você pode alterar a porta na qual o Dashboard irá rodar (default = 3000). Abaixo o exemplo de como definir a porta como 8081:

1. Navegue até o arquivo `saps-dashboard/package.json`.
2. Localize a parte de scripts e altere a variável `dev` para:

```json
"dev": "next dev -p 8081"
```

### 2. Gerando o Token para o Mapa

1. Acesse [Mapbox](https://www.mapbox.com).
2. Crie uma conta ou faça login.
3. Gere um novo token para consumir a API.
4. Copie esse token e cole no campo `<Seu Token Aqui>` no arquivo `.env.local`.

### 3. Configurando Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione as seguintes linhas:

```
NEXT_PUBLIC_API_URL=<IP:Porta do Dispatcher>
NEXT_PUBLIC_MAP_API_KEY=<Seu Token Aqui>
```

## Executando o Projeto

Depois de concluir as etapas de configuração, você pode rodar o projeto com os comandos abaixo:

### Usando npm:
```bash
npm run dev
``````
