"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.hashPassword = void 0;
const crypto_1 = __importDefault(require("crypto"));
const hashPassword = async (password) => {
    const salt = crypto_1.default.randomBytes(16).toString("hex");
    const derivedKey = await new Promise((resolve, reject) => {
        crypto_1.default.scrypt(password, salt, 64, (error, key) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(key.toString("hex"));
        });
    });
    return `${salt}:${derivedKey}`;
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, passwordHash) => {
    const [salt, storedHash] = passwordHash.split(":");
    if (!salt || !storedHash) {
        return false;
    }
    const derivedKey = await new Promise((resolve, reject) => {
        crypto_1.default.scrypt(password, salt, 64, (error, key) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(key.toString("hex"));
        });
    });
    return crypto_1.default.timingSafeEqual(Buffer.from(derivedKey, "hex"), Buffer.from(storedHash, "hex"));
};
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=password.js.map