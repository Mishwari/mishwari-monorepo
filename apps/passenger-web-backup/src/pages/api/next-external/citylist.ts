import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            // const token = req.headers.authorization?.split(" ")[1];
            // if (!token) {
            //     return res.status(401).json({ message: "Missing or invalid token" });
            // }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}city-list/`)
            console.log('hello from api')

            res.status(200).json(response.data);
            
        } catch (error: any) {
            console.error("Error fetching wallet balance:", error.message);
            res.setHeader('Allow', ['GET']);
            res.status(500).json({ message: "Error fetching wallet balance" });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: "Method not allowed" });
    }
}