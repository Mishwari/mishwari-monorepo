import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.body)
 if (req.method === 'POST') {
    console.log(req.body)
    try {
        const response = await axios.post(`${apiBaseUrl}mobile-login/complete-profile/`, req.body,
        {
            headers: {
                Authorization: req.headers.authorization,
            },
        }
        )
        res.status(200).json(response.data)
    }catch (err: any) {
        res.status(err.response?.status||500).json( err.response?.data || { message: 'Something went wrong'} )
    }
    } else{
        res.setHeader('Allow',['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}