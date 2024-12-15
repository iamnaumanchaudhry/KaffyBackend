import { Request, Response, NextFunction } from "express";
import { OrderItem } from "../entities/order_item";
import { Order } from "../entities/order";
import { Product } from "../entities/product";
import { APIError } from "../errors/api-error";
import { create_json_response, error_formatting } from "../utils/helper";
import { HttpStatusCode } from "../utils/enums";

export const createOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId, productId } = req.body;

        const order = await Order.findOne({ where: { id: orderId } });
        if (!order) {
            return next(new APIError("[Create Order Item]", HttpStatusCode.NOT_FOUND, true, "Order not found", "Order not found"));
        }

        const product = await Product.findOne({ where: { id: productId } });
        if (!product) {
            return next(new APIError("[Create Order Item]", HttpStatusCode.NOT_FOUND, true, "Product not found", "Product not found"));
        }

        const orderItem = OrderItem.create({
            order,
            product,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await orderItem.save();
        return res.status(HttpStatusCode.OK).json(create_json_response(orderItem, true, "Order item created successfully"));
    } catch (err: any) {
        next(new APIError("[Create Order Item]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to create order item"));
    }
};

export const getAllOrderItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order_items = await OrderItem.find({ relations: ["order", "product"] });
        return res.status(HttpStatusCode.OK).json(create_json_response(order_items, true, "Order items fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get All Order Items]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch order items"));
    }
};

export const getOrderItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const orderItem = await OrderItem.findOne({ where: { id }, relations: ["order", "product"] });

        if (!orderItem) {
            return next(new APIError("[Get Order Item By ID]", HttpStatusCode.NOT_FOUND, true, "Order item not found", "Order item not found"));
        }

        return res.status(HttpStatusCode.OK).json(create_json_response(orderItem, true, "Order item fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get Order Item By ID]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch order item"));
    }
};

export const updateOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { orderId, productId } = req.body;

        const orderItem = await OrderItem.findOne({ where: { id }, relations: ["order", "product"] });
        if (!orderItem) {
            return next(new APIError("[Update Order Item]", HttpStatusCode.NOT_FOUND, true, "Order item not found", "Order item not found"));
        }

        if (orderId) {
            const order = await Order.findOne({ where: { id: orderId } });
            if (!order) {
                return next(new APIError("[Update Order Item]", HttpStatusCode.NOT_FOUND, true, "Order not found", "Order not found"));
            }
            orderItem.order = order;
        }

        if (productId) {
            const product = await Product.findOne({ where: { id: productId } });
            if (!product) {
                return next(new APIError("[Update Order Item]", HttpStatusCode.NOT_FOUND, true, "Product not found", "Product not found"));
            }
            orderItem.product = product;
        }

        orderItem.updated_at = new Date();
        await orderItem.save();

        return res.status(HttpStatusCode.OK).json(create_json_response(orderItem, true, "Order item updated successfully"));
    } catch (err: any) {
        next(new APIError("[Update Order Item]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to update order item"));
    }
};

export const deleteOrderItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const orderItem = await OrderItem.findOne({ where: { id } });

        if (!orderItem) {
            return next(new APIError("[Delete Order Item]", HttpStatusCode.NOT_FOUND, true, "Order item not found", "Order item not found"));
        }

        await orderItem.remove();
        return res.status(HttpStatusCode.OK).json(create_json_response({}, true, "Order item deleted successfully"));
    } catch (err: any) {
        next(new APIError("[Delete Order Item]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to delete order item"));
    }
};
