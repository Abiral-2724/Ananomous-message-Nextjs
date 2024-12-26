import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // issue ho skta ha
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenicated"
        },
            {
                status: 401
            })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId
            , { isAcceptingMessage: acceptMessages }
            , { new: true });

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to updaate user status to accept message"
            },
                {
                    status: 401
                })
        }

        return Response.json({
            success: true,
            message: "Message accepting status updated successfully",
            updatedUser
        },
            {
                status: 200
            })

    }
    catch (error) {
        console.log("failed to updaate user status to accept message",error)
        return Response.json({
            success: false,
            message: "failed to updaate user status to accept message"
        },
            {
                status: 500
            })
    }


}

export async function GET() {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // issue ho skta ha
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not authenicated"
        },
            {
                status: 401
            })
    }

    const userId = user._id;

    try{
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 404
                })
        }
    
        return Response.json({
            success: true,
            isAcceptingMessages : foundUser.isAcceptingMessage
        },
            {
                status: 200
            })
    
    }
    catch(error){
        console.log("Error in getting message acceptaing status",error)
        return Response.json({
            success: false,
            message: "Error in getting message acceptaing status"
        },
            {
                status: 500
            })
    }
}

