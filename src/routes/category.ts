import express, { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, } from "../controllers/category";
import { add_category_checks, delete_category_checks, edit_category_checks, get_all_categories_checks, get_category_by_id_checks, } from "../validation/category";
import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";

const router: Router = express.Router();

router.post('/add-category', add_category_checks, validate_request_schema, authenticateUser, createCategory);

router.post('/delete-category', delete_category_checks, validate_request_schema, authenticateUser, deleteCategory);

router.get('/get-categories', get_all_categories_checks, validate_request_schema, authenticateUser, getAllCategories);

router.get('/get-category/:id', get_category_by_id_checks, validate_request_schema, authenticateUser, getCategoryById);

router.post('/edit-category', edit_category_checks, validate_request_schema, authenticateUser, updateCategory);

export default router;
