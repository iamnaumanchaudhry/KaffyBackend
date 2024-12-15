import { Response } from 'express';
import { HttpStatusCode } from '../utils/enums';
import { create_json_response } from '../utils/helper';
import {logger} from '../utils/logger';
import { APIError } from './api-error';
import {BaseError} from './base-error';
import { UnauthenticatedError } from './unauthentication-error';


class ErrorHandler {
    public handle_error(error: Error, res: Response) {
      logger.error(
        'Error message from the centralized error-handling component',
        error
      );
      if (error instanceof APIError) {
        res.status(error.httpCode).json(create_json_response({}, false, error.user_description))
      }  else {
        res.status(HttpStatusCode.BAD_REQUEST).json(create_json_response({}, false, error.message))
      }
    }
    
    public is_trusted_error(error: Error) {
      if (error instanceof BaseError) {
        return error.isOperational;
      }
      return false;
    }
   }


export const error_handler = new ErrorHandler();
