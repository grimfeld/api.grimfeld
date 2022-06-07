import CryptoJS from "crypto-js"
import { base } from '../airtableConfig'
import HttpError from './HttpError'

export default async function verifyToken (secret: string, token: string) {
  const res = CryptoJS.AES.decrypt(token, secret)
  const decrypted = JSON.parse(res.toString(CryptoJS.enc.Utf8))

  if (!decrypted.recordId || !decrypted.App || !decrypted.Key) throw new HttpError(400, 'Invalid token')

  const data = await base<{ App: string, Key: string }>('API Keys').find(decrypted.recordId)

  if (data.get('App') !== decrypted.App) throw new HttpError(400, 'Invalid App Name')
  if (data.get('Key') !== decrypted.Key) throw new HttpError(400, 'Invalid API Key')

  return "Authorized"

} 