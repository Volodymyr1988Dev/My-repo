import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { UserTable } from './UserTable';

const userTable = new UserTable();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'supersecret',
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    const user = await userTable.findById(jwt_payload.id);
    if (user) return done(null, user);
    else return done(null, false);
  })
);

export default passport;