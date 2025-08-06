
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../Errors/validationError";
import { NewsPostServiceError } from "../Errors/newsPostServiceError";


export function errorHandler (err: Error, req: Request, res:Response, next: NextFunction){
    const isDev = process.env.NODE_ENV === 'development' 
if (err instanceof ValidationError) {
    return res.status(400).json({
        message: err.message,
        ...(isDev && {stack: err.stack})
    })
}
if (err instanceof NewsPostServiceError){
    return res.status(500).json({
        message: err.message,
        ...(isDev && {stack: err.stack}),
    })
}
}

