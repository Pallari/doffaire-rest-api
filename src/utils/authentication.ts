import bcrypt from "bcryptjs";
import { crossOriginResourcePolicy } from "helmet";

const SECRET = "DOAFFAIRE-REST-API";

//creates an HMAC (Hash-based Message Authentication Code) object using the SHA-256
export const authentication = async (password) => {
  const salt = await bcrypt.genSaltSync(8);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = async (password, encryptedPassword) => {
  return bcrypt.compare(password, encryptedPassword);
};
