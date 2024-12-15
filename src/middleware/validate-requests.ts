import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../utils/enums";
import { validationResult } from 'express-validator';


export const validate_request_schema = (req: Request, res: Response, next: NextFunction) => {

    const errors: any = validationResult( req );
    if ( !errors.isEmpty() )
    {
        return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
    }
    next();
}