import express, { Router } from "express";
import { checkout, sendOptions, webhook, } from "../controllers/stripe";

import { checkout_checks } from "../validation/stripe";

import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";

const router: Router = express.Router();

router.options('/options', validate_request_schema, authenticateUser, sendOptions);
router.options('/checkout', checkout_checks, validate_request_schema, authenticateUser, checkout);
router.options('/webhook', validate_request_schema, authenticateUser, webhook);

export default router;