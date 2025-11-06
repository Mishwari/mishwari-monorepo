import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;



export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({message:'Authorization header missing'});
    }
    
    try {
        const response = await axios.get(`${apiBaseUrl}profile/`, {
            headers: {
                Authorization: authorization
            }
        })
        res.status(200).json(response.data)
    }catch (err: any) {
        res.status(err.response?.status||500).json( err.response?.data || { message: 'Something went wrong'} )
    }
    

}