import express, { Router } from "express";
import {
    createOrder,
    deleteOrder,
    updateOrder,
    getOrderById,
    getAllOrders
} from "../controllers/order";

import {
    create_order_checks,
    delete_order_checks,
    update_order_checks,
    get_order_by_id_checks,
    get_all_orders_checks
} from "../validation/order";

import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";

const router: Router = express.Router();

router.post('/add-order', create_order_checks, validate_request_schema, authenticateUser, createOrder);

router.post('/delete-order', delete_order_checks, validate_request_schema, authenticateUser, deleteOrder);

router.get('/get-orders', get_all_orders_checks, validate_request_schema, authenticateUser, getAllOrders);

router.get('/get-order/:id', get_order_by_id_checks, validate_request_schema, authenticateUser, getOrderById);

router.post('/edit-order', update_order_checks, validate_request_schema, authenticateUser, updateOrder);

export default router;
