import config from "config";
import jwt from "jsonwebtoken";

export interface AuthHandlerData {
  hasToken: boolean;
  userType?: String;
}

export type TokenValidateResult = { [name: string]: any } | undefined;

export enum TokenType {
  "ACCESS",
  "REFRESH",
}

export function generateAccessToken(
  payload: { [name: string]: string },
  expireTimeInMinutes: number
): string {
  return jwt.sign(payload, config.get("ACCESS_TOKEN_SECRET"), {
    expireIn: `${expireTimeInMinutes}m`,
  });
}

export function generateRefreshToken(payload: {
  [name: string]: string;
}): string {
  return jwt.sign(payload, config.get("REFRESH_TOKEN_SECRET"));
}

export async function validateToken(
  token: string,
  type: TokenType
): Promise<TokenValidateResult> {
  const payload = await jwt.verify(token, config.get(`${type}_TOKEN_SECRET`));
  return payload;
}
