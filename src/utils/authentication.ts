import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RANDOM_STRING } from '../constants/constants-info';

const tokenPrivateKey = 'DoFfAIrE';
const tokenExpiry = '30d';

//creates an HMAC (Hash-based Message Authentication Code) object using the SHA-256
export const authentication = async (password) => {
  const salt = await bcrypt.genSaltSync(8);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = async (password, encryptedPassword) => {
  return bcrypt.compare(password, encryptedPassword);
};

export const createAuthToken = async (data) => {
  return jwt.sign(data, tokenPrivateKey, {
    expiresIn: tokenExpiry
  });
};

// ToDo: check for headers
export const verifyAuthToken = async (req, res, next) => {
  try {
    if (req.header('Authorization')) {
      try {
        const userDetails = jwt.verify(req.header('Authorization'), tokenPrivateKey);
        req.user = userDetails;
        next();
      } catch (err) {
        return res.json({ success: false, isInvalidToken: true, message: 'Token Invalid' });
      }
    }
    return res.json({ success: false, isInvalidToken: true, message: 'Unauthorised Request' });
  } catch (err) {
    return res.json({ success: false, message: 'Issue Processing Token ' });
  }
};

export const generatePassword = async () => {
  const string_length = 8;
  let randomstring = '';
  for (let i = 0; i < string_length; i++) {
    const rnum = Math.floor(Math.random() * RANDOM_STRING.length);
    randomstring += RANDOM_STRING.substring(rnum, rnum + 1);
  }
  return randomstring;
}
