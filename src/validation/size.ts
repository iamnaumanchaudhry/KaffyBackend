import { check } from "express-validator";

export const add_size_checks = [
    check('name', 'Size name is required.').not().isEmpty(),
    check('value', 'Size value is required.').not().isEmpty(),
    check('storeId', 'Store ID is required.').not().isEmpty()
];

export const delete_size_checks = [
    check('sizeId', 'Size ID is required.').not().isEmpty(),
];

export const edit_size_checks = [
    check('sizeId', 'Size ID is required.').not().isEmpty(),
    check('name', 'Size name is required.').optional().not().isEmpty(),
    check('value', 'Size value is required.').optional().not().isEmpty()
];

export const get_size_by_id_checks = [
    check('id', 'Size ID is required.').not().isEmpty()
];