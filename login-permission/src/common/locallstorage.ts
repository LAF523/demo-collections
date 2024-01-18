const pub_key_name = import.meta.env.VITE_PUB_KEY;
const token_name = import.meta.env.VITE_TOKEN_NAME;
const refresh_token_name = import.meta.env.VITE_REFRESH_TOKEN_NAME;
const role = import.meta.env.VITE_ROLE;

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

export function setRoleInLocal(currentRole: string[]) {
  return localStorage.setItem(role, JSON.stringify(currentRole));
}
export function getRoleByBlocal() {
  return (localStorage.getItem(role) && JSON.parse(localStorage.getItem(role) as string)) || [];
}
