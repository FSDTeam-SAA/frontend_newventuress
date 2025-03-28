// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { LoginResponse, SessionUser } from "./types/auth";

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         if (!credentials) return null;

//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
//           {
//             method: "POST",
//             headers: {
//               "content-type": "application/json",
//             },
//             body: JSON.stringify({
//               email: credentials.email,
//               password: credentials.password,
//             }),
//           }
//         );

//         const data: LoginResponse = await response.json();



//         if (!response.ok || !data.status) {
//           throw new Error(data.message || "Network issue");
//         }

//         return {
//           id: data.userData.id,
//           email: data.userData.email,
//           fullName: data.userData.fullName,
//           industry: data.userData.industry,
//           profession: data.userData.profession,
//           token: data.token,
//         } as SessionUser;
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//     signOut: "/",
//   },
//   callbacks: {
//     async signIn({ user }) {
//       if (user) return true;
//       return false;
//     },
//     async session({ session, token }) {
//       if (token.user) {
//         session.user = {
//           ...session.user,
//           ...token.user,
//         };
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.user = user;
//       }
//       return token;
//     },
//   },
//   secret: process.env.AUTH_SECRET,
// });



import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { LoginResponse, SessionUser } from "./types/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials) return null

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        const data: LoginResponse = await response.json()

        if (!response.ok || !data.status) {
          throw new Error(data.message || "Network issue")
        }

        return {
          id: data.userData.id,
          email: data.userData.email,
          fullName: data.userData.fullName,
          industry: data.userData.industry,
          profession: data.userData.profession,
          token: data.token,
        } as SessionUser
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async signIn({ user }) {
      if (user) return true
      return false
    },
    async session({ session, token }) {
      // Make sure we're properly transferring all user data from token to session
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        }
      }
      return session
    },
    async jwt({ token, user }) {
      // Only update the token when we have a user (during sign in)
      if (user) {
        token.user = user
      }
      return token
    },
  },
  // Add explicit session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Add explicit cookie configuration
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.AUTH_SECRET,
  trustHost: true,
})


