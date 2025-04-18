import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { env } from "../env.js";
import { Student, Institution, InstitutionAuthor, InstitutionPublisher } from "../models/index.js";
import jwt from "jsonwebtoken";


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      let user;
      switch (jwtPayload.userType) {
        case "student":
          user = await Student.findOne({ _id: jwtPayload._id });
          break;
        case "institution":
          user = await Institution.findOne({ _id: jwtPayload._id });
          break;
        case "institutionAuthor":
          user = await InstitutionAuthor.findOne({ _id: jwtPayload._id });
          break;
        case "institutionPublisher":
          user = await InstitutionPublisher.findOne({ _id: jwtPayload._id });
          break;
        default:
          return done(new Error("Invalid user type"));
      }
      if (!user) {
        return done(null, false);
      }
      user.userType = jwtPayload.userType;

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }),
);


export const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION });
}

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET);
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) {
      return null;
    }
    return user;
  }
  )
};

export const authenticateUser = passport.authenticate("jwt", {
  session: false,
});
