# 🌎 Trekko — Backend API

Backend serverless para o site Trekko, usando **Vercel Functions**.
Integra com Amadeus (voos) e Booking.com via RapidAPI (hotéis).

---

## 📁 Estrutura

```
trekko/
├── index.html              ← página principal
├── destino.html            ← página de destino
├── resultados.html         ← resultados de busca
├── reserva.html            ← checkout
├── perfil.html             ← perfil do usuário
├── vercel.json             ← configuração do Vercel
├── .env.example            ← modelo de variáveis de ambiente
├── uploads/                ← imagens (logo, hero)
└── api/
    ├── voos.js             ← busca de voos (Amadeus)
    ├── hoteis.js           ← busca de hotéis (Booking via RapidAPI)
    ├── clima.js            ← clima em tempo real (wttr.in - grátis)
    └── aeroportos.js       ← autocomplete de aeroportos IATA
```

---

## 🚀 Como colocar no ar (passo a passo)

### 1. Instalar o Vercel CLI

```bash
npm install -g vercel
```

### 2. Fazer upload do projeto

```bash
# Entre na pasta do projeto
cd trekko/

# Faça login no Vercel (abre o browser)
vercel login

# Faça o deploy
vercel

# Responda as perguntas:
# → Set up and deploy? Y
# → Which scope? (escolha sua conta)
# → Link to existing project? N
# → Project name: trekko
# → In which directory? ./
# → Override settings? N
```

Pronto! O Vercel vai te dar uma URL tipo `https://trekko-xyz.vercel.app`.

---

## 🔑 Configurar as API Keys (para dados reais)

### Amadeus — Voos (GRÁTIS para começar)

1. Acesse **https://developers.amadeus.com**
2. Clique em **"Get Started"** → **"Create Account"**
3. Confirme o e-mail
4. Clique em **"My Self-Service Workspace"**
5. Clique em **"Create New App"**
6. Dê um nome (ex: "Trekko")
7. Copie o **Client ID** e o **Client Secret**

**Limites do plano gratuito (sandbox):**
- 2.000 chamadas/mês grátis
- Dados de teste (não cobram cartão)
- Para dados reais: migrar para produção (~$0.01/chamada)

### RapidAPI — Hotéis Booking.com (GRÁTIS 100 req/mês)

1. Acesse **https://rapidapi.com**
2. Crie uma conta grátis
3. Busque por **"Booking.com"**
4. Clique em **"Subscribe to Test"** (plano gratuito)
5. Vá em **"Endpoints"** → copie o header **X-RapidAPI-Key**

---

### Adicionar as keys no Vercel

```bash
# Via CLI
vercel env add AMADEUS_CLIENT_ID
# Cole o valor quando pedir

vercel env add AMADEUS_CLIENT_SECRET
# Cole o valor quando pedir

vercel env add RAPIDAPI_KEY
# Cole o valor quando pedir

# Redeploy para aplicar
vercel --prod
```

**Ou pelo painel web:**
1. Acesse **https://vercel.com/dashboard**
2. Clique no projeto **trekko**
3. Vá em **Settings** → **Environment Variables**
4. Adicione cada variável

---

## 🧪 Testando as APIs

Com o projeto no ar, você pode testar direto no browser:

```
# Buscar voos SP → Rio
https://seu-projeto.vercel.app/api/voos?origem=GRU&destino=GIG&data=2025-08-15&adultos=1

# Buscar hotéis em Salvador
https://seu-projeto.vercel.app/api/hoteis?cidade=Salvador&checkin=2025-08-15&checkout=2025-08-18

# Clima em Fortaleza
https://seu-projeto.vercel.app/api/clima?cidade=Fortaleza&dias=5

# Aeroportos com "São Paulo"
https://seu-projeto.vercel.app/api/aeroportos?q=São Paulo
```

**Sem API keys:** retorna dados simulados realistas.
**Com API keys:** retorna dados reais da Amadeus/Booking.

---

## 💡 Como o frontend chama as APIs

O `index.html` já está configurado para chamar `/api/voos` quando o
usuário clica em "Buscar". Exemplo no código:

```javascript
// Busca voos ao clicar no botão
async function buscar() {
  const origem = document.getElementById('origem-input').value;
  const destino = document.getElementById('dest-input').value;
  const data = document.getElementById('date-ida').value;

  const res = await fetch(
    `/api/voos?origem=${encodeURIComponent(origem)}&destino=${encodeURIComponent(destino)}&data=${data}`
  );
  const dados = await res.json();

  // dados.voos contém os resultados
  // dados.modo pode ser 'demo', 'real' ou 'fallback'
  renderVoos(dados.voos);
}
```

---

## 💰 Custo estimado em produção

| Serviço  | Plano Gratuito        | Custo Pago             |
|----------|-----------------------|------------------------|
| Vercel   | 100GB bandwidth/mês   | $20/mês (Pro)          |
| Amadeus  | 2.000 calls/mês       | ~$0.01 por chamada     |
| RapidAPI | 100 calls/mês         | $10-50/mês             |
| wttr.in  | Ilimitado (clima)     | Sempre grátis          |

**Para um site pequeno (até ~500 usuários/mês):** custo zero.

---

## 🛠️ Desenvolvimento local

```bash
# Instalar dependências (opcional, só se quiser rodar local)
npm install

# Rodar localmente com o Vercel Dev
vercel dev

# O site estará em http://localhost:3000
# As APIs em http://localhost:3000/api/...
```

Crie um arquivo `.env.local` (não sobe no Git) com suas keys:

```env
AMADEUS_CLIENT_ID=seu_client_id
AMADEUS_CLIENT_SECRET=seu_client_secret
RAPIDAPI_KEY=sua_rapidapi_key
AMADEUS_ENV=sandbox
DEFAULT_CURRENCY=BRL
```

---

## ❓ Dúvidas frequentes

**P: Precisa de cartão de crédito para a Amadeus sandbox?**
R: Não. O sandbox é 100% gratuito e não exige cartão.

**P: O que acontece se exceder o limite gratuito?**
R: A API retorna erro e o backend automaticamente usa dados mock.

**P: Posso usar a URL do Vercel no site em produção?**
R: Sim! A URL `https://trekko-xyz.vercel.app` funciona como domínio final.
   Você pode também conectar um domínio próprio (trekko.com.br) grátis.

**P: O `.env.local` vai para o GitHub?**
R: Não, desde que o `.gitignore` tenha `.env.local` (já incluído).
