// ══════════════════════════════════════════════════════════
// api/aeroportos.js — Busca de aeroportos brasileiros por nome
//
// Como usar:
//   GET /api/aeroportos?q=São Paulo
//   GET /api/aeroportos?q=GRU
// ══════════════════════════════════════════════════════════

const AEROPORTOS_BR = [
  { iata: 'GRU', nome: 'São Paulo – Guarulhos (Internacional)', cidade: 'São Paulo', estado: 'SP' },
  { iata: 'CGH', nome: 'São Paulo – Congonhas', cidade: 'São Paulo', estado: 'SP' },
  { iata: 'VCP', nome: 'Campinas – Viracopos', cidade: 'Campinas', estado: 'SP' },
  { iata: 'GIG', nome: 'Rio de Janeiro – Galeão (Internacional)', cidade: 'Rio de Janeiro', estado: 'RJ' },
  { iata: 'SDU', nome: 'Rio de Janeiro – Santos Dumont', cidade: 'Rio de Janeiro', estado: 'RJ' },
  { iata: 'CNF', nome: 'Belo Horizonte – Tancredo Neves (Confins)', cidade: 'Confins', estado: 'MG' },
  { iata: 'PLU', nome: 'Belo Horizonte – Pampulha Carlos Drummond', cidade: 'Belo Horizonte', estado: 'MG' },
  { iata: 'BSB', nome: 'Brasília – Presidente Juscelino Kubitschek', cidade: 'Brasília', estado: 'DF' },
  { iata: 'SSA', nome: 'Salvador – Deputado Luís Eduardo Magalhães', cidade: 'Salvador', estado: 'BA' },
  { iata: 'FOR', nome: 'Fortaleza – Pinto Martins (Internacional)', cidade: 'Fortaleza', estado: 'CE' },
  { iata: 'REC', nome: 'Recife – Guararapes (Internacional)', cidade: 'Recife', estado: 'PE' },
  { iata: 'POA', nome: 'Porto Alegre – Salgado Filho', cidade: 'Porto Alegre', estado: 'RS' },
  { iata: 'CWB', nome: 'Curitiba – Afonso Pena (Internacional)', cidade: 'São José dos Pinhais', estado: 'PR' },
  { iata: 'FLN', nome: 'Florianópolis – Hercílio Luz', cidade: 'Florianópolis', estado: 'SC' },
  { iata: 'MAO', nome: 'Manaus – Eduardo Gomes (Internacional)', cidade: 'Manaus', estado: 'AM' },
  { iata: 'BEL', nome: 'Belém – Val de Cans (Internacional)', cidade: 'Belém', estado: 'PA' },
  { iata: 'NAT', nome: 'Natal – Aeroporto Internacional Governador Aluízio Alves', cidade: 'São Gonçalo do Amarante', estado: 'RN' },
  { iata: 'MCZ', nome: 'Maceió – Zumbi dos Palmares', cidade: 'Maceió', estado: 'AL' },
  { iata: 'GYN', nome: 'Goiânia – Santa Genoveva', cidade: 'Goiânia', estado: 'GO' },
  { iata: 'VIX', nome: 'Vitória – Eurico de Aguiar Salles', cidade: 'Vitória', estado: 'ES' },
  { iata: 'FEN', nome: 'Fernando de Noronha', cidade: 'Fernando de Noronha', estado: 'PE' },
  { iata: 'IGU', nome: 'Foz do Iguaçu – Cataratas (Internacional)', cidade: 'Foz do Iguaçu', estado: 'PR' },
  { iata: 'CGR', nome: 'Campo Grande (Internacional)', cidade: 'Campo Grande', estado: 'MS' },
  { iata: 'PMW', nome: 'Palmas – Brigadeiro Lysias Rodrigues', cidade: 'Palmas', estado: 'TO' },
  { iata: 'THE', nome: 'Teresina – Senador Petrônio Portela', cidade: 'Teresina', estado: 'PI' },
  { iata: 'SLZ', nome: 'São Luís – Marechal Cunha Machado (Internacional)', cidade: 'São Luís', estado: 'MA' },
  { iata: 'AJU', nome: 'Aracaju – Santa Maria', cidade: 'Aracaju', estado: 'SE' },
  { iata: 'JPA', nome: 'João Pessoa – Presidente Castro Pinto', cidade: 'João Pessoa', estado: 'PB' },
  { iata: 'STM', nome: 'Santarém – Maestro Wilson Fonseca', cidade: 'Santarém', estado: 'PA' },
  { iata: 'PVH', nome: 'Porto Velho – Governador Jorge Teixeira de Oliveira', cidade: 'Porto Velho', estado: 'RO' },
  { iata: 'CGB', nome: 'Cuiabá – Marechal Rondon (Internacional)', cidade: 'Cuiabá', estado: 'MT' },
  { iata: 'BVB', nome: 'Boa Vista – Héros de Boa Vista', cidade: 'Boa Vista', estado: 'RR' },
  { iata: 'MCP', nome: 'Macapá – Alberto Alcolumbre', cidade: 'Macapá', estado: 'AP' },
  { iata: 'RBR', nome: 'Rio Branco – Plácido de Castro', cidade: 'Rio Branco', estado: 'AC' },
];

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { q = '' } = req.query;

  if (!q || q.length < 2) {
    return res.status(400).json({ erro: 'Parâmetro "q" deve ter pelo menos 2 caracteres.' });
  }

  const query = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const results = AEROPORTOS_BR.filter(a => {
    const search = `${a.iata} ${a.nome} ${a.cidade} ${a.estado}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return search.includes(query);
  }).slice(0, 8);

  return res.status(200).json({
    total: results.length,
    aeroportos: results.map(a => ({
      ...a,
      label: `${a.cidade} (${a.iata})`,
      sublabel: a.nome,
    })),
  });
}
