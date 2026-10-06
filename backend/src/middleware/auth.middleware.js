import {getAuth} from "@clerk/express"
import {prisma} from "../config/database.js"
import {ApiError} from "../utils/ApiError.js"

export async function authenticate(req,res,next){
    const {userId} = getAuth(req)
    if (!userId) throw new ApiError(401, "Not authenticated");

    const user = await prisma.user.findUnique({where : {clerkId : userId}});
    
    req.clerkId = userId;
    req.user = user;
    next();
}

export async function onboarded(req,res,next){
    if(!req.user) throw new ApiError(403, "Incomplete Onboarding");
    next();
}