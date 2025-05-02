import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// You should connect this to your real DB
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin", // Admin role
  },
  {
    id: "2",
    name: "Doctor Jane",
    email: "jane@example.com",
    password: "doctor123",
    role: "doctor", // Doctor role
  },
  {
    id: "3",
    name: "Driver John",
    email: "john.driver@example.com",
    password: "driver123",
    role: "driver", // Driver role
  },
  {
    id: "4",
    name: "Supervisor Mike",
    email: "mike.supervisor@example.com",
    password: "supervisor123",
    role: "supervisor", // Supervisor role
  },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        throw new Error("Invalid email or password");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Add role to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string; // Add role to the session
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/", // Redirect to login on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure the secret is set
};
