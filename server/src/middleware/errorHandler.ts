
import {Request, Response } from "express";

import { NewsPostServiceError } from "../Errors/newsPostServiceError";
import { ValidationError } from "../Errors/validationError";


export function errorHandler (err: Error, req: Request, res:Response){
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

