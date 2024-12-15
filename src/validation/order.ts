import { check } from "express-validator";

export const create_order_checks = [
    check('phone', 'Phone number is required.').not().isEmpty(),
    check('address', 'Address is required.').not().isEmpty(),
    check('order_items', 'Order items are required.').isArray().withMessage('Order items must be an array.')
];

export const delete_order_checks = [
    check('orderId', 'Order ID is required.').not().isEmpty(),
];

export const update_order_checks = [
    check('orderId', 'Order ID is required.').not().isEmpty(),
    check('is_paid', 'Payment status is required.').optional().isBoolean().withMessage('is_paid must be a boolean value.')
];

export const get_order_by_id_checks = [
    check('id', 'Order ID is required.').not().isEmpty()
];

export const get_all_orders_checks = [
    check('storeId', 'Store ID is required.').optional().not().isEmpty()
];
