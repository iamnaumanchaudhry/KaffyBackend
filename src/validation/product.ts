import { check } from "express-validator";

export const add_product_checks = [
    check('name', 'Product name is required.').not().isEmpty(),
    check('price', 'Product price is required.').not().isEmpty().isDecimal().withMessage('Price must be a valid number.'),
    check('categoryId', 'Category ID is required.').not().isEmpty(),
    check('sizeId', 'Size ID is required.').not().isEmpty(),
    check('colorId', 'Color ID is required.').not().isEmpty(),
    check('storeId', 'Store ID is required.').not().isEmpty()
];

export const delete_product_checks = [
    check('productId', 'Product ID is required.').not().isEmpty(),
];

export const edit_product_checks = [
    check('productId', 'Product ID is required.').not().isEmpty(),
    check('name', 'Product name is required.').optional().not().isEmpty(),
    check('price', 'Product price is required.').optional().not().isEmpty().isDecimal().withMessage('Price must be a valid number.'),
    check('categoryId', 'Category ID is required.').optional().not().isEmpty(),
    check('sizeId', 'Size ID is required.').optional().not().isEmpty(),
    check('colorId', 'Color ID is required.').optional().not().isEmpty()
];

export const get_product_by_id_checks = [
    check('id', 'Product ID is required.').not().isEmpty()
];

export const get_all_products_checks = [
    check('storeId', 'Store ID is required.').optional().not().isEmpty()
];
