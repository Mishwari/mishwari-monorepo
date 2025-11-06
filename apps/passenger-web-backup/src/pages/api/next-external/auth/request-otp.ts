import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



export default async (req: NextApiRequest, res: NextApiResponse) => {
 if (req.method === 'POST') {
  console.log(req.body)
  try {
    console.log("url", apiBaseUrl)
    const response = await axios.post(`${apiBaseUrl}mobile-login/request-otp/`, req.body)
    console.log("response", response)
    res.status(200).json(response.data)
  }catch (err: any) {
    res.status(err.response?.status||500).json( err.response?.data || { message: 'Something went wrong'} )
  }
} else{
    res.setHeader('Allow',['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}

}