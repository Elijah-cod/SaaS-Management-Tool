import crypto from "crypto";

export const hashPassword = async (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");

  const derivedKey = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key.toString("hex"));
    });
  });

  return `${salt}:${derivedKey}`;
};

export const verifyPassword = async (
  password: string,
  passwordHash: string
) => {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const derivedKey = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key.toString("hex"));
    });
  });

  return crypto.timingSafeEqual(
    Buffer.from(derivedKey, "hex"),
    Buffer.from(storedHash, "hex")
  );
};
