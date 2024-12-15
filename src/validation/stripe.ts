import { check } from "express-validator";

export const checkout_checks = [
    check('product_ids', 'product_ids is required.').not().isEmpty(),
];
