import express, { Router } from "express";
import {
    checkout,
} from "../controllers/stripe";

import {
    checkout_checks
} from "../validation/stripe";

import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";

const router: Router = express.Router();

router.options('/options', checkout_checks, validate_request_schema, authenticateUser, checkout);


export default router;
