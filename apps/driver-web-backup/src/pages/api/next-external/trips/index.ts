import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  if (req.method === 'GET') {
    try {
      const response = await axios.get(`${apiBaseUrl}trips/`, {
        headers: { Authorization: authorization },
        params: req.query
      });
      res.status(200).json(response.data);
    } catch (err: any) {
      res.status(err.response?.status || 500).json(err.response?.data || { message: 'Failed to fetch trips' });
    }
  } else if (req.method === 'POST') {
    try {
      const response = await axios.post(`${apiBaseUrl}trips/`, req.body, {
        headers: { Authorization: authorization }
      });
      res.status(200).json(response.data);
    } catch (err: any) {
      res.status(err.response?.status || 500).json(err.response?.data || { message: 'Failed to create trip' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
