import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { tripId } = req.query;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}trips/${tripId}/`);
            res.status(200).json(response.data);
        } catch (error: any) {
            console.error("Error fetching trip details:", error.message);
            res.status(500).json({ message: "Error fetching trip details" });
        }
    }
    else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: "Method not allowed" });
    }
}
