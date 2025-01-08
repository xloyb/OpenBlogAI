
const required = (key: string, value?: string): string => {
    if (!value) {
      console.error(`Missing required environment variable: ${key}`);
      process.exit(1);
    }
    return value;
  };
  
  export const config = {
    port: required('PORT', process.env.PORT),
    jwtSecret: required('JWT_SECRET', process.env.JWT_SECRET),
    dbUrl: required('DATABASE_URL', process.env.DATABASE_URL),
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10'),
    NODE_ENV: process.env.NODE_ENV || 'development',
  };