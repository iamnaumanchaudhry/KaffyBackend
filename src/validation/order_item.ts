import { check } from "express-validator";

export const create_order_item_checks = [
    check('orderId', 'Order ID is required.').not().isEmpty(),
    check('productId', 'Product ID is required.').not().isEmpty(),
    check('quantity', 'Quantity is required.').not().isEmpty().isInt().withMessage('Quantity must be a number.')
];

export const delete_order_item_checks = [
    check('orderItemId', 'Order Item ID is required.').not().isEmpty(),
];

export const update_order_item_checks = [
    check('orderItemId', 'Order Item ID is required.').not().isEmpty(),
    check('quantity', 'Quantity is required.').optional().isInt().withMessage('Quantity must be a number.')
];

export const get_order_item_by_id_checks = [
    check('id', 'Order Item ID is required.').not().isEmpty()
];

export const get_all_order_items_checks = [
    check('orderId', 'Order ID is required.').optional().not().isEmpty()
];
