// ══════════════════════════════════════════════════════════
// api/hoteis.js — Busca de hotéis via RapidAPI (Booking.com)
// Vercel Serverless Function
//
// Como usar:
//   GET /api/hoteis?cidade=Rio+de+Janeiro&checkin=2025-08-15&checkout=2025-08-18&adultos=2
//
// Parâmetros:
//   cidade    — nome da cidade (ex: "Rio de Janeiro", "Salvador")
//   checkin   — data de check-in (YYYY-MM-DD)
//   checkout  — data de check-out (YYYY-MM-DD)
//   adultos   — número de adultos (padrão: 2)
//   quartos   — número de quartos (padrão: 1)
//   estrelas  — mínimo de estrelas (1-5, opcional)
// ══════════════════════════════════════════════════════════

// ── Mapa de IDs do Booking.com por cidade brasileira ────
// (destination_id necessário para a API do Booking)
const CITY_IDS = {
  'rio de janeiro':  -672986,
  'são paulo':       -3291,
  'salvador':        -625073,
  'florianópolis':   -3004,
  'fortaleza':       -640375,
  'recife':          -640424,
  'porto alegre':    -3454,
  'manaus':          -3017,
  'belém':           -614,
  'brasília':        -668,
  'belo horizonte':  -638234,
  'natal':           -3344,
  'maceió':          -630,
  'gramado':         -3009,
  'foz do iguaçu':   -631338,
  'bonito':          -3002,
  'campos do jordão': -630000,
  'jericoacoara':    -630001,
};

// ── Dados mock de hotéis por cidade ─────────────────────
const MOCK_HOTELS = {
  'rio de janeiro': [
    { nome: 'Copacabana Palace', estrelas: 5, nota: 9.2, avaliacao: 'Excepcional', bairro: 'Copacabana', preco_noite: 1800, url_img: 'copacabana-palace,rio,luxury' },
    { nome: 'Fasano Ipanema',    estrelas: 5, nota: 9.4, avaliacao: 'Excepcional', bairro: 'Ipanema',    preco_noite: 2100, url_img: 'ipanema,rio,luxury,hotel' },
    { nome: 'Hotel Emiliano Rio', estrelas: 5, nota: 9.0, avaliacao: 'Excepcional', bairro: 'Copacabana', preco_noite: 1400, url_img: 'hotel,rio-de-janeiro,pool' },
    { nome: 'JW Marriott Rio',   estrelas: 5, nota: 8.8, avaliacao: 'Ótimo',        bairro: 'Copacabana', preco_noite: 950,  url_img: 'marriott,copacabana,beach' },
    { nome: 'Windsor Excelsior', estrelas: 4, nota: 8.5, avaliacao: 'Ótimo',        bairro: 'Copacabana', preco_noite: 480,  url_img: 'hotel,copacabana,rio' },
    { nome: 'Ibis Ipanema',      estrelas: 3, nota: 8.0, avaliacao: 'Muito bom',    bairro: 'Ipanema',    preco_noite: 280,  url_img: 'ipanema,hotel,budget' },
  ],
  'são paulo': [
    { nome: 'Hotel Emiliano SP',  estrelas: 5, nota: 9.1, avaliacao: 'Excepcional', bairro: 'Jardins',    preco_noite: 1200, url_img: 'sao-paulo,hotel,luxury,pool' },
    { nome: 'Grand Hyatt SP',     estrelas: 5, nota: 8.9, avaliacao: 'Ótimo',        bairro: 'Itaim',      preco_noite: 850,  url_img: 'hyatt,sao-paulo,hotel' },
    { nome: 'Rosewood SP',        estrelas: 5, nota: 9.3, avaliacao: 'Excepcional', bairro: 'Paulista',   preco_noite: 1500, url_img: 'sao-paulo,luxury,hotel,design' },
    { nome: 'Ibis Paulista',      estrelas: 3, nota: 8.2, avaliacao: 'Muito bom',   bairro: 'Paulista',   preco_noite: 180,  url_img: 'hotel,paulista,sao-paulo' },
    { nome: 'Tivoli Mofarrej',    estrelas: 5, nota: 9.0, avaliacao: 'Excepcional', bairro: 'Jardins',    preco_noite: 980,  url_img: 'tivoli,hotel,sao-paulo' },
  ],
  'salvador': [
    { nome: 'Fera Palace Hotel',  estrelas: 4, nota: 8.8, avaliacao: 'Ótimo',        bairro: 'Pelourinho', preco_noite: 380, url_img: 'salvador,bahia,hotel,colonial' },
    { nome: 'Convento do Carmo',  estrelas: 5, nota: 9.2, avaliacao: 'Excepcional', bairro: 'Pelourinho', preco_noite: 650, url_img: 'salvador,convento,boutique,hotel' },
    { nome: 'Ibis Salvador',      estrelas: 3, nota: 7.9, avaliacao: 'Bom',          bairro: 'Barra',      preco_noite: 160, url_img: 'salvador,barra,hotel' },
    { nome: 'Pestana Bahia',      estrelas: 5, nota: 8.7, avaliacao: 'Ótimo',        bairro: 'Pelourinho', preco_noite: 520, url_img: 'pelourinho,hotel,bahia' },
  ],
  'florianópolis': [
    { nome: 'Costão do Santinho', estrelas: 5, nota: 8.7, avaliacao: 'Ótimo',        bairro: 'Santinho',   preco_noite: 480, url_img: 'florianopolis,resort,beach' },
    { nome: 'Majestic Palace',    estrelas: 4, nota: 8.4, avaliacao: 'Ótimo',        bairro: 'Centro',     preco_noite: 280, url_img: 'florianopolis,hotel,centro' },
    { nome: 'Blue Tree Towers',   estrelas: 4, nota: 8.1, avaliacao: 'Muito bom',   bairro: 'Beira-Mar',  preco_noite: 340, url_img: 'florianopolis,hotel,beira-mar' },
  ],
  'gramado': [
    { nome: 'Saint Andrews',      estrelas: 5, nota: 9.0, avaliacao: 'Excepcional', bairro: 'Centro',     preco_noite: 680, url_img: 'gramado,hotel,luxury,serra' },
    { nome: 'Gramado Palace',     estrelas: 4, nota: 8.8, avaliacao: 'Ótimo',        bairro: 'Centro',     preco_noite: 420, url_img: 'gramado,hotel,palace,gaúcho' },
    { nome: 'Ritta Höppner',      estrelas: 4, nota: 8.5, avaliacao: 'Ótimo',        bairro: 'Centro',     preco_noite: 320, url_img: 'gramado,hotel,european' },
    { nome: 'Laghetto Vivace',    estrelas: 4, nota: 8.6, avaliacao: 'Ótimo',        bairro: 'Centro',     preco_noite: 360, url_img: 'gramado,pousada,montanha' },
  ],
  'default': [
    { nome: 'Hotel Central',        estrelas: 3, nota: 8.0, avaliacao: 'Muito bom',   bairro: 'Centro',   preco_noite: 180, url_img: 'hotel,brazil,travel' },
    { nome: 'Pousada das Flores',   estrelas: 3, nota: 8.3, avaliacao: 'Muito bom',   bairro: 'Centro',   preco_noite: 220, url_img: 'pousada,brasil,flores' },
    { nome: 'Grand Hotel',          estrelas: 4, nota: 8.6, avaliacao: 'Ótimo',        bairro: 'Centro',   preco_noite: 350, url_img: 'hotel,grand,brazil' },
    { nome: 'Resort & Spa',         estrelas: 5, nota: 9.0, avaliacao: 'Excepcional', bairro: 'Orla',     preco_noite: 650, url_img: 'resort,spa,brazil,pool' },
  ],
};

// ── Calcula número de noites ─────────────────────────────
function calcNoites(checkin, checkout) {
  const a = new Date(checkin);
  const b = new Date(checkout);
  return Math.max(1, Math.round((b - a) / 86400000));
}

// ── Formata data para Booking API (YYYY-MM-DD) ───────────
function formatDate(dateStr) {
  return dateStr?.split('T')[0] || dateStr;
}

// ── Handler principal ────────────────────────────────────
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const {
    cidade = 'Rio de Janeiro',
    checkin = new Date().toISOString().split('T')[0],
    checkout = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    adultos = '2',
    quartos = '1',
    estrelas,
  } = req.query;

  const noites = calcNoites(checkin, checkout);
  const cidadeLower = cidade.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const rapidApiKey = process.env.RAPIDAPI_KEY;
  const useMock = !rapidApiKey || rapidApiKey === 'cole_sua_rapidapi_key_aqui';

  try {
    // ── MODO DEMO ──────────────────────────────────────────
    if (useMock) {
      const cidadeKey = Object.keys(MOCK_HOTELS).find(k =>
        cidadeLower.includes(k.replace(/[àáâãä]/g,'a').replace(/[éê]/g,'e').replace(/[ó]/g,'o').replace(/[ú]/g,'u'))
      ) || 'default';

      let hoteis = MOCK_HOTELS[cidadeKey] || MOCK_HOTELS.default;

      // Filtro de estrelas
      if (estrelas) {
        hoteis = hoteis.filter(h => h.estrelas >= parseInt(estrelas));
      }

      const result = hoteis.map(h => ({
        id: `MOCK-${h.nome.replace(/\s/g, '-')}`,
        nome: h.nome,
        estrelas: h.estrelas,
        nota: h.nota,
        avaliacao: h.avaliacao,
        bairro: h.bairro,
        cidade,
        preco_noite: h.preco_noite * parseInt(quartos),
        preco_total: h.preco_noite * noites * parseInt(quartos),
        preco_noite_formatado: `R$ ${h.preco_noite.toLocaleString('pt-BR')}`,
        preco_total_formatado: `R$ ${(h.preco_noite * noites * parseInt(quartos)).toLocaleString('pt-BR')}`,
        noites,
        imagem: `https://source.unsplash.com/400x260/?${h.url_img}`,
        comodidades: ['Wi-Fi grátis', 'Café da manhã', 'Piscina', 'Ar-condicionado', 'Estacionamento'].slice(0, 2 + h.estrelas),
        cancelamento: h.estrelas >= 4 ? 'Cancelamento gratuito' : 'Não reembolsável',
        isMock: true,
      }));

      return res.status(200).json({
        modo: 'demo',
        aviso: 'Dados simulados. Configure RAPIDAPI_KEY para buscar hotéis reais do Booking.com.',
        cidade,
        checkin,
        checkout,
        noites,
        adultos: parseInt(adultos),
        total: result.length,
        hoteis: result.sort((a, b) => a.preco_noite - b.preco_noite),
      });
    }

    // ── MODO REAL (RapidAPI/Booking.com) ──────────────────
    // Passo 1: busca o destination_id da cidade
    const cityNormalized = cidade.toLowerCase();
    const destId = Object.entries(CITY_IDS).find(([k]) => cityNormalized.includes(k))?.[1];

    if (!destId) {
      // Se não temos o ID da cidade, usa mock com aviso
      return res.status(200).json({
        modo: 'fallback',
        aviso: `Cidade "${cidade}" não mapeada. Mostrando dados estimados.`,
        hoteis: MOCK_HOTELS.default.map(h => ({
          ...h,
          preco_noite_formatado: `R$ ${h.preco_noite.toLocaleString('pt-BR')}`,
          isMock: true,
        })),
      });
    }

    // Passo 2: busca hotéis
    const bookingRes = await fetch(
      `https://booking-com.p.rapidapi.com/v1/hotels/search?` +
      new URLSearchParams({
        checkin_date: formatDate(checkin),
        checkout_date: formatDate(checkout),
        dest_id: destId,
        dest_type: 'city',
        adults_number: adultos,
        room_number: quartos,
        order_by: 'popularity',
        currency: 'BRL',
        locale: 'pt-br',
        filter_by_currency: 'BRL',
        page_number: '0',
        units: 'metric',
        ...(estrelas ? { categories_filter_ids: `class::${estrelas}` } : {}),
      }),
      {
        headers: {
          'X-RapidAPI-Key': rapidApiKey,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
        },
      }
    );

    if (!bookingRes.ok) {
      throw new Error(`Booking API error: ${bookingRes.status}`);
    }

    const bookingData = await bookingRes.json();
    const results = bookingData.result || [];

    const hoteis = results.slice(0, 10).map(h => {
      const precoNoite = h.min_total_price
        ? Math.round(h.min_total_price / noites)
        : h.composite_price_breakdown?.gross_amount?.value || 0;

      return {
        id: h.hotel_id,
        nome: h.hotel_name,
        estrelas: h.class || 0,
        nota: parseFloat(h.review_score || 0).toFixed(1),
        avaliacao: h.review_score_word || 'Sem avaliações',
        bairro: h.district || h.city_name_en || cidade,
        cidade,
        preco_noite: Math.round(precoNoite),
        preco_total: Math.round(h.min_total_price || precoNoite * noites),
        preco_noite_formatado: `R$ ${Math.round(precoNoite).toLocaleString('pt-BR')}`,
        preco_total_formatado: `R$ ${Math.round(h.min_total_price || precoNoite * noites).toLocaleString('pt-BR')}`,
        noites,
        imagem: h.main_photo_url || `https://source.unsplash.com/400x260/?hotel,${encodeURIComponent(cidade)}`,
        comodidades: h.amenities_data?.slice(0, 5).map(a => a.amenity) || [],
        cancelamento: h.is_free_cancellable ? 'Cancelamento gratuito' : 'Não reembolsável',
        url_booking: h.url || `https://booking.com/hotel/${h.hotel_id}`,
        isMock: false,
      };
    });

    return res.status(200).json({
      modo: 'real',
      cidade,
      checkin,
      checkout,
      noites,
      adultos: parseInt(adultos),
      total: hoteis.length,
      hoteis,
    });

  } catch (err) {
    console.error('Erro na API de hotéis:', err);
    const cidadeKey = Object.keys(MOCK_HOTELS).find(k => cidadeLower.includes(k)) || 'default';
    const hoteis = (MOCK_HOTELS[cidadeKey] || MOCK_HOTELS.default).map(h => ({
      ...h,
      preco_noite_formatado: `R$ ${h.preco_noite.toLocaleString('pt-BR')}`,
      noites,
      isMock: true,
    }));
    return res.status(200).json({
      modo: 'fallback',
      aviso: 'API de hotéis indisponível. Mostrando dados estimados.',
      hoteis,
    });
  }
}
