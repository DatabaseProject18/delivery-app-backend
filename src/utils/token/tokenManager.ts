import config from "config";
import jwt from "jsonwebtoken";

export interface AuthHandlerData {
  hasToken?: boolean;
  hasRefreshToken?: boolean;
  hasAccessToken?: boolean;
  userType?: String;
}

export enum TokenType {
  "ACCESS",
  "REFRESH",
}

export function generateAccessToken(
  payload: { [name: string]: any },
  expireTimeInMinutes: number
): string {
  return jwt.sign(payload, config.get("ACCESS_TOKEN_SECRET"), {
    expiresIn: `${expireTimeInMinutes}m`,
  });
}

export function generateRefreshToken(payload: { [name: string]: any }): string {
  return jwt.sign(payload, config.get("REFRESH_TOKEN_SECRET"));
}

export function validateToken(
  token: string,
  type: TokenType
): { [name: string]: any } {
  let secret: string;
  if (type === TokenType.ACCESS) secret = config.get(`ACCESS_TOKEN_SECRET`);
  else secret = config.get(`REFRESH_TOKEN_SECRET`);

  try {
    const payload: { [name: string]: any } = jwt.verify(
      token,
      secret
    ) as object;
    return payload;
  } catch (ex) {
    return undefined;
  }
}
