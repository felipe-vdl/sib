import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '../../../db';
import bcrypt from 'bcrypt';

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      authorize: async (credentials, req) => {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('O usuário não existe.');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Credenciais inválidas.');

        return user;
      },
    }),
  ],
}

export default NextAuth(authOptions);