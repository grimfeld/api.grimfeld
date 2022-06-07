import { Showcase } from './../../../types/Showcase'
import { NextApiRequest, NextApiResponse } from 'next'
import { base } from '../../../airtableConfig'
import HttpError from '../../../utils/HttpError'
import verifyToken from '../../../utils/verifyToken'

export default async function handleShowcaseGetting(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { headers, method } = req

    if (method !== 'GET') throw new HttpError(405, 'Method not allowed')

    const token = headers.authorization?.split(' ')[1]

    if (!token) throw new HttpError(401, 'Unauthorized')

    const secret = process.env.SECRET_KEY

    if (!secret) throw new HttpError(500, 'Secret is not defined')

    const auth = await verifyToken(secret, token)

    if (auth !== 'Authorized') throw new HttpError(401, 'Unauthorized')

    const id = req.query.id

    if (typeof id !== 'string') throw new HttpError(400, 'Bad request')

    const output = await base<Showcase>('Showcases').find(id)

    if (!output) throw new HttpError(404, 'Not found')

    const data = { ...output.fields, id: output.id }

    res.status(200).json(data)
  } catch (error) {
    if (error instanceof HttpError)
      return res.status(error.status).json({ error: error.message })
    if (error instanceof Error)
      return res.status(500).json({ error: error.message })
    return res.status(500).json('Internal Server Error')
  }
}
