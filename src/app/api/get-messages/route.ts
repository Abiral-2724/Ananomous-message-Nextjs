import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(JSON.stringify({
            success: false,
            message: "Not authenticated"
        }), { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(session.user._id);

    try {
        const userData = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!userData || userData.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 404 });
        }

        return new Response(JSON.stringify({
            success: true,
            messages: userData[0].messages
        }), { status: 200 });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(JSON.stringify({
            message: 'Internal server error',
            success: false
        }), { status: 500 });
    }
}
