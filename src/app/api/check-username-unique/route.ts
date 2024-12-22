import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";


const UsernameQuerySchema = z.object({
    username:usernameValidation
}) 


export async function GET(request : Request) {

    

    await dbConnect() ;

    try{

        // finding query parameter 
        const {searchParams} = new URL(request.url) ;

        const queryParam = {
            username : searchParams.get('username')
        }

        // valicadte with zod
     const result = UsernameQuerySchema.safeParse(queryParam)  ;

     console.log(result) ;

     if(!result.success){
        const usernameErrors = result.error.format().username?._errors || [] ;
        return Response.json({
            success : false ,
            message : "Invalid query parameter"
        }  ,
        {
            status : 400
        })
    
     }


     const {username} = result.data ;

  const existingVerifiedUser = await UserModel.findOne({username ,isVerified:true}) ;

  if(existingVerifiedUser){
    return Response.json({
        success : false ,
        message : "Username is already taken"
    }  ,
    {
        status : 400
    })

  }
  return Response.json({
    success : true ,
    message : "Username is unique"
}  ,
{
    status : 201
})



    }
    catch(error){
        console.log("Error checking username" ,error) ;
        return Response.json({
            success : false ,
            message : "Error checking username"
        }  ,
        {
            status : 500
        }
    
    )
    }
    
}