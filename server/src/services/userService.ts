
import bcrypt from "bcrypt";
import prisma from "@utils/client";
import { signToken } from "@utils/jwt";
import { env } from 'envValidator';

export const registerUserService = async (email: string,
 password: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already registered");
  }

  const saltRounds = parseInt(env.BCRYPT_SALT_ROUNDS);  
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  const token = signToken({ id: user.id, email: user.email });

  return { user, token };
};


export const loginUserService = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      throw error; // Throw with a status code
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      const error: any = new Error("Invalid password");
      error.status = 401;
      throw error; // Throw with a status code
    }
  
    const token = signToken({ id: user.id, email: user.email });
  
    return { user, token };
  };