// Passport configuration commented out as authentication is not required
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import { User } from "../entities/User";
// import { AppDataSource } from "./data-source";
// import { logger } from "../utils/logger";

// dotenv.config();

// const userRepository = AppDataSource.getRepository(User);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//     },
//     async (_, __, profile, done) => {
//       try {
//         let user = await userRepository.findOne({
//           where: { googleId: profile.id },
//         });
//         if (!user) {
//           // Create new user with required fields
//           const newUser = userRepository.create({
//             googleId: profile.id,
//             username: profile.displayName || `user_${profile.id}`,
//             email: profile.emails?.[0].value,
//             firstName:
//               profile.name?.givenName ||
//               profile.displayName?.split(" ")[0] ||
//               "Unknown",
//             lastName:
//               profile.name?.familyName ||
//               profile.displayName?.split(" ").slice(1).join(" ") ||
//               "User",
//             password: "", // Empty password for OAuth users
//           });

//           // Save the user to database
//           user = await userRepository.save(newUser);
//         }
//         done(null, user);
//       } catch (err) {
//         logger.error("Error in Google OAuth strategy:", err);
//         done(err, false);
//       }
//     }
//   )
// );

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   const user = await userRepository.findOne({ where: { id } });
//   done(null, user);
// });
