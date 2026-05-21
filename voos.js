// ══════════════════════════════════════════════════════════
// api/voos.js — Busca de voos via Amadeus API
// Vercel Serverless Function
//
// Como usar:
//   GET /api/voos?origem=GRU&destino=GIG&data=2025-08-15&adultos=1
//   GET /api/voos?origem=GRU&destino=GIG&data=2025-08-15&adultos=2&volta=2025-08-22
//
// Parâmetros:
//   origem   — código IATA do aeroporto de origem (ex: GRU, CGH, SDU)
//   destino  — código IATA do aeroporto de destino
//   data     — data de ida (YYYY-MM-DD)
//   adultos  — número de adultos (padrão: 1)
//   volta    — data de volta, opcional (YYYY-MM-DD)
//   criancas — número de crianças, opcional
// ══════════════════════════════════════════════════════════

// Cache de token Amadeus (dura 30 minutos)
let amadeusToken = null;
let tokenExpiry = 0;

// ── Busca ou renova o token da Amadeus ──────────────────
async function getAmadeusToken() {
  const now = Date.now();

  // Retorna token cacheado se ainda válido
  if (amadeusToken && now < tokenExpiry) {
    return amadeusToken;
  }

  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

  // Sem API key → modo demo
  if (!clientId || clientId === 'cole_seu_client_id_aqui') {
    return null;
  }

  const isProd = process.env.AMADEUS_ENV === 'production';
  const baseUrl = isProd
    ? 'https://api.amadeus.com'
    : 'https://test.api.amadeus.com';

  const res = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Amadeus auth failed: ${res.status}`);
  }

  const data = await res.json();
  amadeusToken = data.access_token;
  tokenExpiry = now + (data.expires_in - 60) * 1000; // 60s de margem

  return amadeusToken;
}

// ── Formata duração ISO 8601 → "2h 30min" ───────────────
function formatDuration(iso) {
  if (!iso) return '—';
  const h = iso.match(/(\d+)H/)?.[1] || '0';
  const m = iso.match(/(\d+)M/)?.[1] || '0';
  return `${h}h${m !== '0' ? ` ${m}min` : ''}`;
}

// ── Formata data ISO → "15/08 às 14:30" ────────────────
function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
    ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ── Nome da companhia aérea ──────────────────────────────
const AIRLINES = {
  LA: 'LATAM', G3: 'GOL', AD: 'Azul', O6: 'Avianca',
  JJ: 'LATAM', TP: 'TAP', AA: 'American', UA: 'United',
  DL: 'Delta', AF: 'Air France', LH: 'Lufthansa',
};
function airlineName(code) {
  return AIRLINES[code] || code;
}

// ── Dados MOCK realistas (quando não há API key) ─────────
function getMockFlights(origem, destino, data, adultos) {
  const routes = {
    'GRU-GIG': { price: 149, dur: '1h10', comp: 'GOL', stops: 0 },
    'GRU-SSA': { price: 289, dur: '2h10', comp: 'LATAM', stops: 0 },
    'GRU-FOR': { price: 319, dur: '2h50', comp: 'Azul', stops: 0 },
    'GRU-FLN': { price: 179, dur: '1h30', comp: 'LATAM', stops: 0 },
    'GRU-MAO': { price: 499, dur: '3h50', comp: 'Azul', stops: 0 },
    'GRU-REC': { price: 289, dur: '2h50', comp: 'GOL', stops: 0 },
    'GRU-POA': { price: 199, dur: '1h40', comp: 'GOL', stops: 0 },
    'GRU-BEL': { price: 399, dur: '3h30', comp: 'Azul', stops: 1 },
    'GIG-CGH': { price: 149, dur: '1h10', comp: 'LATAM', stops: 0 },
    'REC-FEN': { price: 380, dur: '1h20', comp: 'LATAM', stops: 0 },
    'BSB-CGH': { price: 159, dur: '1h30', comp: 'GOL', stops: 0 },
    'CNF-NAT': { price: 299, dur: '3h00', comp: 'GOL', stops: 1 },
  };

  const key = `${origem}-${destino}`;
  const base = routes[key] || {
    price: Math.floor(Math.random() * 400) + 150,
    dur: '2h30',
    comp: ['LATAM', 'GOL', 'Azul'][Math.floor(Math.random() * 3)],
    stops: Math.random() > 0.7 ? 1 : 0,
  };

  const baseDate = new Date(data + 'T00:00:00');

  // Gera 5 opções com horários e preços variados
  const options = [
    { hour: 6,  min: 30, priceAdj: 0.9  },
    { hour: 9,  min: 15, priceAdj: 1.0  },
    { hour: 12, min: 0,  priceAdj: 1.1  },
    { hour: 16, min: 45, priceAdj: 0.95 },
    { hour: 20, min: 0,  priceAdj: 0.85 },
  ];

  return options.map((opt, i) => {
    const dep = new Date(baseDate);
    dep.setHours(opt.hour, opt.min, 0);
    const [h, m] = base.dur.replace('h', ':').replace('min', '').split(':').map(Number);
    const arr = new Date(dep.getTime() + (h * 60 + (m || 0)) * 60000);
    const price = Math.round(base.price * opt.priceAdj * adultos);

    return {
      id: `MOCK-${origem}-${destino}-${i}`,
      origem,
      destino,
      companhia: base.comp,
      companhiaNome: base.comp,
      preco: price,
      precoFormatado: `R$ ${price.toLocaleString('pt-BR')}`,
      duracao: base.dur,
      escalas: base.stops,
      partida: dep.toISOString(),
      chegada: arr.toISOString(),
      partidaFormatado: formatDateTime(dep.toISOString()),
      chegadaFormatado: formatDateTime(arr.toISOString()),
      classe: 'Econômica',
      bagagem: price > 300 ? '1 mala incluída' : 'Bagagem de mão',
      isMock: true,
    };
  }).sort((a, b) => a.preco - b.preco);
}

// ── Handler principal ────────────────────────────────────
export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const {
    origem = 'GRU',
    destino = 'GIG',
    data = new Date().toISOString().split('T')[0],
    adultos = '1',
    volta,
    criancas = '0',
  } = req.query;

  // Validações básicas
  if (!origem || !destino) {
    return res.status(400).json({ erro: 'Parâmetros origem e destino são obrigatórios.' });
  }
  if (origem === destino) {
    return res.status(400).json({ erro: 'Origem e destino não podem ser iguais.' });
  }

  try {
    const token = await getAmadeusToken();

    // ── MODO DEMO (sem API key) ──────────────────────────
    if (!token) {
      const voos = getMockFlights(origem, destino, data, parseInt(adultos));
      return res.status(200).json({
        modo: 'demo',
        aviso: 'Dados simulados. Configure AMADEUS_CLIENT_ID e AMADEUS_CLIENT_SECRET para dados reais.',
        total: voos.length,
        origem,
        destino,
        data,
        adultos: parseInt(adultos),
        voos,
      });
    }

    // ── MODO REAL (com API key Amadeus) ─────────────────
    const isProd = process.env.AMADEUS_ENV === 'production';
    const baseUrl = isProd
      ? 'https://api.amadeus.com'
      : 'https://test.api.amadeus.com';

    const params = new URLSearchParams({
      originLocationCode: origem,
      destinationLocationCode: destino,
      departureDate: data,
      adults: adultos,
      currencyCode: process.env.DEFAULT_CURRENCY || 'BRL',
      max: '10',
    });

    if (criancas && parseInt(criancas) > 0) {
      params.append('children', criancas);
    }
    if (volta) {
      params.append('returnDate', volta);
    }

    const amadeusRes = await fetch(
      `${baseUrl}/v2/shopping/flight-offers?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-HTTP-Method-Override': 'GET',
        },
      }
    );

    if (!amadeusRes.ok) {
      const errBody = await amadeusRes.text();
      console.error('Amadeus error:', errBody);
      // Fallback para mock em caso de erro
      const voos = getMockFlights(origem, destino, data, parseInt(adultos));
      return res.status(200).json({
        modo: 'fallback',
        aviso: 'API temporariamente indisponível. Mostrando dados estimados.',
        total: voos.length,
        voos,
      });
    }

    const amadeusData = await amadeusRes.json();
    const offers = amadeusData.data || [];

    // Formata resposta da Amadeus para o padrão Trekko
    const voos = offers.map((offer) => {
      const itinerary = offer.itineraries[0];
      const segments = itinerary.segments;
      const firstSeg = segments[0];
      const lastSeg = segments[segments.length - 1];
      const price = parseFloat(offer.price.total);
      const airlineCode = offer.validatingAirlineCodes?.[0] || firstSeg.carrierCode;

      return {
        id: offer.id,
        origem: firstSeg.departure.iataCode,
        destino: lastSeg.arrival.iataCode,
        companhia: airlineCode,
        companhiaNome: airlineName(airlineCode),
        preco: price,
        precoFormatado: `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        duracao: formatDuration(itinerary.duration),
        escalas: segments.length - 1,
        partida: firstSeg.departure.at,
        chegada: lastSeg.arrival.at,
        partidaFormatado: formatDateTime(firstSeg.departure.at),
        chegadaFormatado: formatDateTime(lastSeg.arrival.at),
        classe: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
        bagagem: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.quantity > 0
          ? `${offer.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.quantity} mala(s) incluída(s)`
          : 'Bagagem de mão',
        isMock: false,
      };
    });

    return res.status(200).json({
      modo: 'real',
      total: voos.length,
      origem,
      destino,
      data,
      adultos: parseInt(adultos),
      voos,
    });

  } catch (err) {
    console.error('Erro na API de voos:', err);
    // Nunca retorna 500 para o usuário — usa mock como fallback
    const voos = getMockFlights(origem, destino, data, parseInt(adultos));
    return res.status(200).json({
      modo: 'fallback',
      aviso: 'Erro interno. Mostrando dados estimados.',
      total: voos.length,
      voos,
    });
  }
}
