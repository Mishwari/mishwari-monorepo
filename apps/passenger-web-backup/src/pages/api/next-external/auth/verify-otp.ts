import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



export default async (req: NextApiRequest, res: NextApiResponse) => {
    console.log(req.body)
 if (req.method === 'PATCH') {
  console.log(req.body)
  try {
    const response = await axios.patch(`${apiBaseUrl}mobile-login/verify-otp/`, req.body)
    res.status(200).json(response.data)
  }catch (err: any) {
    res.status(err.response?.status||500).json( err.response?.data || { message: 'Something went wrong'} )
  }
} else{
    res.setHeader('Allow',['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

}