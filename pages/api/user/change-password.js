import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import prisma from '../../../db';
import bcrypt from 'bcrypt';

export default async function changePassword(req, res) {
  try {
    if (req.method !== 'PATCH') return res.status(405).json('Method not allowed');

    const session = await unstable_getServerSession(req, res, authOptions);

    if (session) {
      const authUser = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        }
      });
      
      if (authUser) {
        const { currentPassword, newPassword } = req.body;
        const match = await bcrypt.compare(currentPassword, authUser.password);

        if (match) {
          await prisma.user.update({
            where: {
              email: session.user.email,
            },
            data: {
              password: await bcrypt.hash(newPassword, 10),
            }
          });

          return res.status(200).json({ message: 'Password updated!' });

        } else {
          return res.status(422).json('Incorrect password');
        }

      } else {
        return res.status(404).json('User doesn\'t exist');
      }

    } else {
      return res.status(401).json('Unauthenticated');
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'There was an error on our side.' });
  }
}