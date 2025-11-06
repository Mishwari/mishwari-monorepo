import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { BookingSchema } from "@/types/booking";
import { decryptToken, encryptToken } from "@/utils/tokenUtils";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { authorization } = req.headers as any
  console.log(authorization)
  if(req.method === 'GET'){
    try {
        const response = await axios.get(`${apiBaseUrl}booking/`,{
          headers:{
            Authorization: authorization
          }
        })
        const bookings = response.data 
        
        const validatedBookings = bookings.map((booking: any) => {
          try {
            return BookingSchema.parse(booking);
          } catch (validationError) {
            console.error('Validation error for booking:', booking, validationError);
            throw validationError; // Rethrow the error to handle it in the outer catch
          }
        });

        res.status(200).json(validatedBookings);
    }catch (err:any) {
        res.status(500).json({message: "Error fetching or validating bookings", error: err.message})
    }
  }else{
    res.status(405).end()
  }
}
