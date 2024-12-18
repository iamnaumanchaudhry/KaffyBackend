import express, { Router } from "express";
import {
    createSize,
    getAllSizes,
    getSizeById,
    updateSize,
    deleteSize,
} from "../controllers/size";

import {
    add_size_checks,
    delete_size_checks,
    edit_size_checks,
    get_size_by_id_checks
} from "../validation/size";

import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";

const router: Router = express.Router();

router.post('/add-size', add_size_checks, validate_request_schema, authenticateUser, createSize);

router.post('/delete-size', delete_size_checks, validate_request_schema, authenticateUser, deleteSize);

router.get('/get-sizes', validate_request_schema, getAllSizes);

router.get('/get-size/:id', get_size_by_id_checks, validate_request_schema, authenticateUser, getSizeById);

router.post('/edit-size', edit_size_checks, validate_request_schema, authenticateUser, updateSize);

export default router;
