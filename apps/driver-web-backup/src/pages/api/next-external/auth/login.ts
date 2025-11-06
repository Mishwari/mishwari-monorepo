import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const response = await axios.post(`${apiBaseUrl}token/`, req.body);
      res.status(200).json(response.data);
    } catch (err: any) {
      res.status(err.response?.status || 500).json(err.response?.data || { message: 'Login failed' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
