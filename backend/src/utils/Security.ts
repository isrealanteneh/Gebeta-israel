import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

async function hashPassword(password: string) {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
}

function genVerifCode() {
	const hexCode = parseInt(crypto.randomBytes(3).toString('hex'), 16) % 1000000;
	return hexCode.toString().padStart(6, '0');
}

// function genJwtToken(payload, secret, expiresIn = 3600) {
// 	return new Promise((resolve, reject) => {
// 		jwt.sign(payload, secret, { expiresIn }, (err, token) => {
// 			if (err) {
// 				reject(err);
// 			} else {
// 				resolve(token);
// 			}
// 		});
// 	});
// }

// function verifyJwtToken(token, secret) {
// 	return new Promise((resolve, reject) => {
// 		jwt.verify(token, secret, (err, decoded) => {
// 			if (err) {
// 				reject(err);
// 			} else {
// 				resolve(decoded);
// 			}
// 		});
// 	});
// }

export const signToken = (payload: string | Buffer | object, secret: jwt.Secret, options?: jwt.SignOptions) => jwt.sign(payload, secret, options);
export const verifyToken = (token: string, secret: jwt.Secret, options?: jwt.VerifyOptions) => jwt.verify(token, secret, options);
export { genVerifCode, hashPassword };