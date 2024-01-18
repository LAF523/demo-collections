import JSEncrypt from 'jsencrypt';
import { setKeyInLocal, getKeyByLocal, getTokenByLocal } from '@/common/locallstorage';
import { getPubKey } from '@/service/login';

export const getRsaKey = async () => {
  const key = getKeyByLocal();
  if (['undefined', null, undefined].includes(key)) {
    const [data, err] = await getPubKey();
    if (err) return;
    setKeyInLocal(data.pub_key);
    return data.pub_key;
  }
  return key;
};

export const encryptParam = async (param: object) => {
  const key = await getRsaKey();
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(key);
  return encryptor.encrypt(JSON.stringify(param));
};

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
