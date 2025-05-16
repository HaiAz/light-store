
import { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { comparedAsync, hash } from '@/lib/crypto';
import { prisma as prismadb } from '@/lib/prisma';
import { userWithoutPasswordSchema } from '@/schemas/user';

declare module 'next-auth' {
  // Adding the new field to the User interface
    interface User extends DefaultUser {
      id: string;
      role: string;
    }
  
  // Here I add the user object to the session object so I can access it easily.
    interface Session extends DefaultSession {
      user: User;
    }
  }

// TODO: move some of the settings to env
export const authOptions: NextAuthOptions = {
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 300,
  },
  providers: [
    Credentials({
      id: 'credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Email', type: 'text', placeholder: 'jsmith@gmail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const loggingUser = await prismadb.user.findUnique({ where: { email: credentials.username } });

        if (!loggingUser || typeof loggingUser.password !== 'string') {
          return null;
        }

        const verified = await comparedAsync(credentials.password, loggingUser.password);

        if (!verified) {
          return null;
        }

        const parsedUser = userWithoutPasswordSchema.safeParse(loggingUser);
        return parsedUser.success ? {
          name: `${parsedUser.data.firstName} ${parsedUser.data.lastName}`,
          email: parsedUser.data.email,
          id: parsedUser.data.id,
          role: parsedUser.data.role,
        } : null;
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub ?? '';
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;

        if (token.role) {
          session.user.role = token.role as string;
        }
      }
      
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days

  },
  pages: {
    signIn: '/auth/signIn',
  },
};

export function hashPassword(password: string) {
  return hash(password);
}
