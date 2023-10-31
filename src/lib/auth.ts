import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import { db } from "./db";

import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { nanoid } from "nanoid";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  //   pages: {
  //     signIn: "/login",
  //   },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.name = token.name;
        // @ts-ignore
        session.user.email = token.email;
        // @ts-ignore
        session.user.image = token.picture;
        // @ts-ignore
        session.user.username = token.username;
      }

      return session;
    },
    redirect() {
      return "/";
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
