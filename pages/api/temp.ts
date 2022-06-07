import CryptoJS from 'crypto-js';
import { NextApiResponse, NextApiRequest } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.SECRET_KEY) throw new Error('Secret is not defined');

  const cipher = CryptoJS.AES.encrypt(
    JSON.stringify({
      recordId: 'recJKsJKSrjBVziHh',
      App: 'Test',
      Key: 'QY0pxYDB9AVj6Zy2IwsBeYWsPFJVK8Rt',
    }),
    process.env.SECRET_KEY
  );

  res.status(200).json(cipher.toString());
}
