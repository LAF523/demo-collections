const pub_key_name = import.meta.env.VITE_PUB_KEY;
const token_name = import.meta.env.VITE_TOKEN_NAME;
const refresh_token_name = import.meta.env.VITE_REFRESH_TOKEN_NAME;

export function setKeyInLocal(pubkey: string) {
  return localStorage.setItem(pub_key_name, pubkey);
}
export function getKeyByLocal() {
  return localStorage.getItem(pub_key_name);
}

export function setTokenInLocal(token: string) {
  return localStorage.setItem(token_name, token);
}
export function getTokenByLocal() {
  return localStorage.getItem(token_name);
}

export function setRefreshTokenInLocal(token: string) {
  return localStorage.setItem(refresh_token_name, token);
}
export function getRefreshTokenByLocal() {
  return localStorage.getItem(refresh_token_name);
}

export const parseJwt = () => {
  const token = getTokenByLocal();
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  // 解码Payload部分（第二部分）
  const decodedPayload = window.atob(parts[1]);
  try {
    // 将解码后的Payload转换成JSON对象
    return JSON.parse(decodedPayload);
  } catch (err) {
    return null;
  }
};
