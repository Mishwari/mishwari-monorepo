import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async  (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        try {
            console.log('POST request: ', req.body);
            const response = await axios.post(`${apiBaseUrl}booking/`, req.body, {
                headers: {
                    Authorization: req.headers.authorization,
                },
            })
            console.log('response:', response.data)
            res.status(200).json(response.data);
        } catch (err: any) {
            console.error('Error Message: ', err.message);
            res.status(err.response?.status || 500 ).json(err.response?.data || {message: 'Something went wrong'});
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)

    }
}
            
