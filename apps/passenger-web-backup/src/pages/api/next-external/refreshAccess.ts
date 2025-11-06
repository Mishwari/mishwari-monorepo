import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            // const token = req.headers.authorization?.split(" ")[1];
            // if (!token) {
            //     return res.status(401).json({ message: "Missing or invalid token" });
            // }
            console.log("body",req.body);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}token/refresh/`, req.body)
            console.log('response:', response.data)
            res.status(200).json(response.data);
            
        } catch (error: any) {
            console.error("Error fetching access token:", error.message);
            res.setHeader('Allow', ['POST']);
            res.status(500).json({ message: "Error fetching access token" });
        }
    }
    else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: "Method not allowed" });
    }
}