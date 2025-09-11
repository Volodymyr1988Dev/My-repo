import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import passport from 'passport';
import { AppDataSource } from './middleware/DataSource';
//import { UserTable } from './UserTable';
import { User } from './entities/User';

const opts : StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'supersecret',
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try{
      console.log("jwt_payload:", jwt_payload);
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: jwt_payload.id });
      if (user) return done(null, user);
      else return done(null, false);
    }
    catch(err){
      return done(err, false);
    }
  })
);
export default passport;