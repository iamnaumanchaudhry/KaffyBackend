import { Request, Response, NextFunction } from "express";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/order_item";
import { Product } from "../entities/product";
import { APIError } from "../errors/api-error";
import { create_json_response, error_formatting } from "../utils/helper";
import { HttpStatusCode } from "../utils/enums";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { order_items, phone, address, is_paid = false } = req.body;

        if (!order_items || order_items.length === 0) {
            return next(new APIError("[Create Order]", HttpStatusCode.BAD_REQUEST, true, "Order items are required", "Order items are required"));
        }

        const newOrder = Order.create({ phone, address, is_paid, created_at: new Date(), updated_at: new Date() });
        await newOrder.save();

        for (const item of order_items) {
            const product = await Product.findOne({ where: { id: item.productId } });
            if (!product) {
                return next(new APIError("[Create Order]", HttpStatusCode.NOT_FOUND, true, `Product not found: ${item.productId}`, `Product not found: ${item.productId}`));
            }

            const newOrderItem = OrderItem.create({ order: newOrder, product, created_at: new Date(), updated_at: new Date() });
            await newOrderItem.save();
        }

        return res.status(HttpStatusCode.OK).json(create_json_response(newOrder, true, "Order created successfully"));
    } catch (err: any) {
        next(new APIError("[Create Order]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to create order"));
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.find({ relations: ["order_items", "order_items.product"] });
        return res.status(HttpStatusCode.OK).json(create_json_response(orders, true, "Orders fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get All Orders]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch orders"));
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ where: { id }, relations: ["order_items", "order_items.product"] });

        if (!order) {
            return next(new APIError("[Get Order By ID]", HttpStatusCode.NOT_FOUND, true, "Order not found", "Order not found"));
        }

        return res.status(HttpStatusCode.OK).json(create_json_response(order, true, "Order fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get Order By ID]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch order"));
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { phone, address, is_paid } = req.body;

        const order = await Order.findOne({ where: { id } });
        if (!order) {
            return next(new APIError("[Update Order]", HttpStatusCode.NOT_FOUND, true, "Order not found", "Order not found"));
        }

        order.phone = phone || order.phone;
        order.address = address || order.address;
        order.is_paid = is_paid !== undefined ? is_paid : order.is_paid;
        order.updated_at = new Date();

        await order.save();
        return res.status(HttpStatusCode.OK).json(create_json_response(order, true, "Order updated successfully"));
    } catch (err: any) {
        next(new APIError("[Update Order]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to update order"));
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const order = await Order.findOne({ where: { id }, relations: ["order_items"] });

        if (!order) {
            return next(new APIError("[Delete Order]", HttpStatusCode.NOT_FOUND, true, "Order not found", "Order not found"));
        }

        await OrderItem.delete({ order: { id: order.id } });
        await order.remove();

        return res.status(HttpStatusCode.OK).json(create_json_response({}, true, "Order deleted successfully"));
    } catch (err: any) {
        next(new APIError("[Delete Order]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to delete order"));
    }
};
