import prisma from '../../../db';
import bcrypt from 'bcrypt';

export default async function Register(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.json(405).json({ message: `${req.method} method is not allowed.` });
    }

    const { email, name, password, role } = req.body;

    if (!email || !email.includes('@') || !role || !name || !password || password.trim().length < 7) {
      return res.status(422).json({ message: 'Invalid input!' });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'E-mail already in use.' });
    }

    await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 10),
        role,
        updatedAt: null,
      },
    });

    return res.status(201).json({ message: 'User was created!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'There was an error.' });
  }
}