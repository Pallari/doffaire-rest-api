import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        return res.status(401).json({ success: false, isInvalidToken: true, message: 'Token Invalid' });
      }
    }
    return res.status(403).json({ success: false, isInvalidToken: true, message: 'Unauthorised Request' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Issue Processing Token ' });
  }
};
