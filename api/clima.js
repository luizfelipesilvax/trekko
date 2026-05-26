// ══════════════════════════════════════════════════════════
// api/clima.js — Clima em tempo real via wttr.in (sem API key!)
//
// Como usar:
//   GET /api/clima?cidade=Rio+de+Janeiro
//   GET /api/clima?cidade=São+Paulo&dias=7
//
// Parâmetros:
//   cidade — nome da cidade
//   dias   — número de dias de previsão (1-7, padrão: 3)
// ══════════════════════════════════════════════════════════

const WEATHER_ICONS = {
  113: '☀️',   // Ensolarado
  116: '⛅',   // Parcialmente nublado
  119: '☁️',   // Nublado
  122: '☁️',   // Encoberto
  143: '🌫️',   // Névoa
  176: '🌦️',   // Chuva isolada
  179: '🌨️',   // Neve isolada
  182: '🌧️',   // Chuva e granizo
  185: '🌧️',   // Garoa
  200: '⛈️',   // Trovoada isolada
  227: '❄️',   // Nevasca
  230: '❄️',   // Nevasca forte
  248: '🌫️',   // Nevoeiro
  260: '🌫️',   // Nevoeiro denso
  263: '🌦️',   // Garoa leve
  266: '🌦️',   // Garoa moderada
  281: '🌧️',   // Garoa congelante
  284: '🌧️',   // Garoa congelante intensa
  293: '🌧️',   // Chuva leve
  296: '🌧️',   // Chuva moderada
  299: '🌧️',   // Chuva
  302: '🌧️',   // Chuva forte
  305: '🌧️',   // Chuva muito forte
  308: '🌧️',   // Chuva torrencial
  311: '🌧️',   // Garoa congelante
  314: '🌧️',   // Garoa congelante intensa
  317: '🌧️',   // Chuva e neve
  320: '🌨️',   // Neve leve
  323: '🌨️',   // Neve moderada
  326: '🌨️',   // Neve forte
  329: '❄️',   // Nevasca
  332: '❄️',   // Nevasca intensa
  335: '❄️',   // Nevasca muito intensa
  338: '❄️',   // Blizzard
  350: '🧊',   // Granizo
  353: '🌦️',   // Chuva leve ocasional
  356: '🌧️',   // Chuva forte ocasional
  359: '🌧️',   // Chuva torrencial ocasional
  362: '🌧️',   // Chuva e granizo
  365: '🌧️',   // Chuva e granizo
  368: '🌨️',   // Neve leve ocasional
  371: '🌨️',   // Neve forte ocasional
  374: '🧊',   // Granizo leve
  377: '🧊',   // Granizo
  386: '⛈️',   // Trovoada com chuva leve
  389: '⛈️',   // Trovoada com chuva forte
  392: '⛈️',   // Trovoada com neve leve
  395: '⛈️',   // Trovoada com neve forte
};

function getIcon(code) {
  return WEATHER_ICONS[code] || '🌤️';
}

function getDayName(dateStr, offset = 0) {
  const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + offset);
  return names[d.getDay()];
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { cidade = 'São Paulo', dias = '3' } = req.query;

  try {
    const numDias = Math.min(7, Math.max(1, parseInt(dias)));

    const url = `https://wttr.in/${encodeURIComponent(cidade)}?format=j1&lang=pt`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Trekko-Weather/1.0' },
    });

    if (!response.ok) {
      throw new Error(`wttr.in error: ${response.status}`);
    }

    const data = await response.json();
    const cur = data.current_condition?.[0];
    const weather3 = data.weather || [];

    // Condição atual
    const atual = {
      temp_c: parseInt(cur?.temp_C || 25),
      temp_f: parseInt(cur?.temp_F || 77),
      sensacao: parseInt(cur?.FeelsLikeC || 25),
      umidade: parseInt(cur?.humidity || 70),
      vento_kmh: parseInt(cur?.windspeedKmph || 15),
      descricao: cur?.lang_pt?.[0]?.value || cur?.weatherDesc?.[0]?.value || 'Bom tempo',
      icone: getIcon(parseInt(cur?.weatherCode || 116)),
      visibilidade: `${cur?.visibility || 10} km`,
      pressao: `${cur?.pressure || 1013} hPa`,
      uv: cur?.uvIndex || 0,
    };

    // Previsão por dia
    const previsao = weather3.slice(0, numDias).map((day, i) => {
      const hourly = day.hourly || [];
      const morning = hourly[2] || hourly[0];
      const afternoon = hourly[5] || hourly[4];
      const evening = hourly[7] || hourly[6];

      return {
        data: day.date,
        dia: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : getDayName(day.date),
        max_c: parseInt(day.maxtempC),
        min_c: parseInt(day.mintempC),
        max_f: parseInt(day.maxtempF),
        min_f: parseInt(day.mintempF),
        icone: getIcon(parseInt(morning?.weatherCode || day.hourly?.[0]?.weatherCode || 116)),
        descricao: morning?.lang_pt?.[0]?.value || morning?.weatherDesc?.[0]?.value || 'Variável',
        chuva_mm: parseFloat(day.hourly?.reduce((acc, h) => acc + parseFloat(h.precipMM || 0), 0).toFixed(1)),
        chances_chuva: `${Math.max(...(day.hourly?.map(h => parseInt(h.chanceofrain || 0)) || [0]))}%`,
        horarios: [
          { periodo: '🌅 Manhã',  temp: `${morning?.tempC || '--'}°C`,  icone: getIcon(parseInt(morning?.weatherCode || 116)) },
          { periodo: '☀️ Tarde',  temp: `${afternoon?.tempC || '--'}°C`, icone: getIcon(parseInt(afternoon?.weatherCode || 113)) },
          { periodo: '🌙 Noite',  temp: `${evening?.tempC || '--'}°C`,  icone: getIcon(parseInt(evening?.weatherCode || 116)) },
        ],
      };
    });

    // Melhor época para cada city (heurística simples)
    const melhorEpoca = getMelhorEpoca(cidade);

    return res.status(200).json({
      cidade,
      atual,
      previsao,
      melhorEpoca,
      fonte: 'wttr.in',
      atualizadoEm: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Erro na API de clima:', err);

    // Retorna dados sintéticos se wttr.in falhar
    return res.status(200).json({
      cidade,
      atual: {
        temp_c: 25,
        sensacao: 26,
        umidade: 70,
        vento_kmh: 15,
        descricao: 'Parcialmente nublado',
        icone: '⛅',
        visibilidade: '10 km',
        pressao: '1013 hPa',
        uv: 6,
      },
      previsao: ['Hoje', 'Amanhã', 'Depois'].map((dia, i) => ({
        dia,
        max_c: 28 - i,
        min_c: 20 - i,
        icone: ['☀️', '⛅', '🌧️'][i],
        descricao: ['Ensolarado', 'Nublado', 'Chuva'][i],
        chuva_mm: i * 5,
        chances_chuva: `${i * 30}%`,
      })),
      melhorEpoca: getMelhorEpoca(cidade),
      aviso: 'Dados do serviço de clima indisponíveis. Dados estimados.',
      atualizadoEm: new Date().toISOString(),
    });
  }
}

function getMelhorEpoca(cidade) {
  const city = cidade.toLowerCase();
  if (city.includes('rio'))        return 'Abril a Outubro — clima ameno, menos chuva';
  if (city.includes('salvador'))   return 'Junho a Setembro — sol e pouco vento';
  if (city.includes('fortaleza'))  return 'Julho a Janeiro — ventos dos alisios';
  if (city.includes('florianó'))   return 'Dezembro a Março — verão catarinense';
  if (city.includes('gramado'))    return 'Junho a Agosto — frio europeu característico';
  if (city.includes('noronha'))    return 'Agosto a Março — mares mais calmos';
  if (city.includes('manaus'))     return 'Julho a Setembro — seco, fauna mais visível';
  if (city.includes('bonito'))     return 'Outubro a Março — águas mais cristalinas';
  return 'Todo o ano — consulte a previsão antes de viajar';
}
