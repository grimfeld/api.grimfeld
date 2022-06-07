import { NextApiRequest, NextApiResponse } from 'next'
import { base } from '../../../airtableConfig'
import verifyToken from '../../../utils/verifyToken'
import HttpError from '../../../utils/HttpError'
import { Showcase } from '../../../types/Showcase'

export default async function handleShowcaseListing (
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

    if (auth !== "Authorized") throw new HttpError(401, 'Unauthorized')

    const output = await base<Showcase>("Showcases").select().all()

    const data = output.map(record => {
      return { ...record.fields, id: record.id }
    })

    res.status(200).json(data)

  } catch (error) {
    if (error instanceof HttpError) return res.status(error.status).json({ error: error.message })
    if (error instanceof Error) return res.status(500).json({ error: error.message })
    return res.status(500).json("Internal Server Error")
  }
}