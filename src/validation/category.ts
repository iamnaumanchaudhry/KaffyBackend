import { check } from "express-validator";

export const add_category_checks = [
    check('name', 'Category name is required.').not().isEmpty(),
];

export const delete_category_checks = [
    check('categoryId', 'Category ID is required.').not().isEmpty(),
];

export const edit_category_checks = [
    check('categoryId', 'Category ID is required.').not().isEmpty(),
    check('name', 'Category name is required.').optional().not().isEmpty()
];

export const get_category_by_id_checks = [
    check('id', 'Category ID is required.').not().isEmpty()
];

export const get_all_categories_checks = [
    check('storeId', 'Store ID is required.').optional().not().isEmpty()
];
