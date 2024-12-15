import express, { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/product";

import {
    add_product_checks,
    delete_product_checks,
    edit_product_checks,
    get_product_by_id_checks,
    get_all_products_checks,
} from "../validation/product";

import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";

const router: Router = express.Router();

router.post('/add-product', add_product_checks, validate_request_schema, authenticateUser, createProduct);

router.post('/delete-product', delete_product_checks, validate_request_schema, authenticateUser, getAllProducts);

router.get('/get-products', edit_product_checks, validate_request_schema, authenticateUser, getProductById);

router.get('/get-product/:id', get_product_by_id_checks, validate_request_schema, authenticateUser, updateProduct);

router.post('/edit-product', get_all_products_checks, validate_request_schema, authenticateUser, deleteProduct);

export default router;
