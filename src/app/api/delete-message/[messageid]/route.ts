import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest } from "next/server";


export async function DELETE(request : NextRequest ,{params} : {params : {messageid : string}}){
  const messageId = await params.messageid ;
    await dbConnect()  ;
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


    try{
       const updateResult =  await UserModel.updateOne(
            {
            _id : user._id
        } ,
        {
            $pull : {messages : {_id : messageId}}
        }
)
if(updateResult.modifiedCount === 0){
    return Response.json({
        success: false,
        message: "Message not found or already deleted"
    },
        {
            status: 404
        })
}

return Response.json({
    success: true,
    message: "Message deleted"
},
    {
        status: 200
    })
        

    }
    catch(error){
        console.log('error coming while deleting message' ,error)
        return Response.json({
            success: false,
            message: "error deleting message"
        },
            {
                status: 500
            })
    }

   
}