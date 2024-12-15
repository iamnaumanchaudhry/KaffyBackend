import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import  { error_handler } from "../errors/error-handler";


export const error_handler_middleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (!error_handler.is_trusted_error(err)) {        
        logger.error(err)
        process.exit(1);
    } 
    error_handler.handle_error(err, res)
    next()
}
