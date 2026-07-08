import bcryptjs from 'bcryptjs';

export const hashPassword = async (password) => {
  return await bcryptjs.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};