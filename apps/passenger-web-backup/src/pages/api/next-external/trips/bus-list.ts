import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { pickup, destination, date } = req.query;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}trips/`, {
                params: { 
                    pickup: pickup || req.query.from_city, 
                    destination: destination || req.query.to_city,
                    date: date || new Date().toISOString().split('T')[0]
                }
            })
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error("Error fetching trips:", error.message);
            res.status(500).json({ message: "Error fetching trips" });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: "Method not allowed" });
    }
}
