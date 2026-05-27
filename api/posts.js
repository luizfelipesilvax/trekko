import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    // Busca os posts no banco de dados
    const posts = await sql`SELECT * FROM posts`;
    
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
