# Dashboard

## Configuração

Para rodar o projeto corretamente, siga os passos abaixo:

### 1. Alterando a Porta do Dashboard

Devido às configurações de grupos de segurança, é necessário alterar a porta padrão do dashboard:

1. Navegue até o arquivo `saps-dashboard/package.json`.
2. Localize a parte de scripts e altere a variável `dev` para:

```json
"dev": "next dev -p 8081"
```

### 2. Configurando Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione os seguintes parâmetros:

```
NEXT_PUBLIC_API_URL=<IP e Porta do Dispatcher>
NEXT_PUBLIC_MAP_API_KEY=<Seu Token Aqui>
```

#### Gerando o Token para o Mapa

1. Acesse [Mapbox](https://www.mapbox.com).
2. Crie uma conta ou faça login.
3. Gere um novo token para consumir a API.
4. Copie esse token e cole no campo `<Seu Token Aqui>` no arquivo `.env.local`.


## Executando o Projeto

Depois de concluir as etapas de configuração, você pode rodar o projeto com os comandos abaixo:

### Usando npm:
```bash
npm run dev
``````

### 3. Mudando o IP da URL

Para garantir que o dashboard se conecte corretamente ao backend, é necessário atualizar o IP em alguns arquivos:

Nos arquivos abaixo, procure pela constante `URL` e atualize-a com o IP correto:

- `saps-dashboard/src/components/compound/DataProcessingForm/index.tsx`
- `saps-dashboard/src/components/compound/DataProcessingForm/SearchResultsModal.tsx`

### 4. Atualizando o Endpoint de Autenticação

No arquivo `/home/ubuntu/saps-dashboard/src/components/compound/RegisterForm/index.tsx`, 

procure por `authEndpoint` e altere para o IP correto do dispatcher.
