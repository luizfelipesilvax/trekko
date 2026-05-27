import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email, password, fullname, phone, birthday, cpf } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });
    }

    const sql = neon(process.env.DATABASE_URL);

    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`INSERT INTO users (email, password_hash, fullname, phone, birthday, cpf) VALUES (${email}, ${hashedPassword}, ${fullname}, ${phone}, ${birthday}, ${cpf})`;

    return res.status(201).json({ success: true, message: 'Conta criada com sucesso!' });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}