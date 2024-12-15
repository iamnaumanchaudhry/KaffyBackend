import express, { Router } from "express";
import {
    createOrderItem,
    deleteOrderItem,
    updateOrderItem,
    getOrderItemById,
    getAllOrderItems
} from "../controllers/order_item";

import {
    create_order_item_checks,
    delete_order_item_checks,
    update_order_item_checks,
    get_order_item_by_id_checks,
    get_all_order_items_checks
} from "../validation/order_item";

import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";

const router: Router = express.Router();

router.post('/add-order-item', create_order_item_checks, validate_request_schema, authenticateUser, createOrderItem);

router.post('/delete-order-item', delete_order_item_checks, validate_request_schema, authenticateUser, deleteOrderItem);

router.get('/get-order-items', get_all_order_items_checks, validate_request_schema, authenticateUser, getAllOrderItems);

router.get('/get-order-item/:id', get_order_item_by_id_checks, validate_request_schema, authenticateUser, getOrderItemById);

router.post('/edit-order-item', update_order_item_checks, validate_request_schema, authenticateUser, updateOrderItem);

export default router;
