import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { HttpStatusCode } from "../utils/enums";
import { APIError } from "../errors/api-error";
import { create_json_response, error_formatting } from "../utils/helper";
import { Product } from "../entities/product";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/order_item";
import { getManager } from "typeorm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-11-20.acacia",
    typescript: true,
});

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
    const { product_ids } = req.body;

    const entityManager = getManager();

    try {
        // Validate input
        if (!Array.isArray(product_ids) || product_ids.length === 0) {
            throw new APIError("[Checkout]", HttpStatusCode.BAD_REQUEST, true, "Invalid product IDs", "Product IDs must be a non-empty array");
        }

        const products = await Product.findByIds(product_ids);

        if (!products.length) {
            throw new APIError("[Checkout]", HttpStatusCode.NOT_FOUND, true, "Products not found", "The provided product IDs do not exist in the database");
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((product) => ({
            quantity: 1,
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                },
                unit_amount: Number(product.price) * 100,
            },
        }));

        await entityManager.transaction(async (transactionalEntityManager) => {
            // Create Order
            const order = transactionalEntityManager.create(Order, {
                is_paid: false,
                created_at: new Date(),
                updated_at: new Date(),
            });

            // Create Order Items
            const order_items = products.map((product) =>
                transactionalEntityManager.create(OrderItem, {
                    product,
                    order,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
            );

            order.order_items = order_items;

            // Save order and order items
            await transactionalEntityManager.save(order);
            await transactionalEntityManager.save(order_items);

            // Create Stripe session
            const session = await stripe.checkout.sessions.create({
                line_items,
                mode: "payment",
                billing_address_collection: "required",
                phone_number_collection: {
                    enabled: true,
                },
                success_url: `${process.env.FRONTEND_URL}/cart?success=1`,
                cancel_url: `${process.env.FRONTEND_URL}/cart?cancelled=1`,
                metadata: {
                    order_id: order.id,
                },
            });

            // Send response with session URL
            return res
                .status(HttpStatusCode.OK)
                .json(create_json_response({ url: session.url }, true, "Checkout session created successfully"));
        });
    } catch (err: unknown) {
        next(new APIError("[Checkout]", HttpStatusCode.INTERNAL_SERVER, true, error_formatting(err), "Failed to process checkout"));
    }
};


const CORSHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
}

export const sendOptions = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Send pre-flight CORS headers
        res.set(CORSHeaders);
        return res.status(HttpStatusCode.OK).end();
    } catch (err: unknown) {
        next(new APIError("[Send Options]", HttpStatusCode.INTERNAL_SERVER, true, error_formatting(err), "Failed to send options response"));
    }
};

export const webhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore: Ensure rawBody middleware is in place
        const rawBody = req.rawBody;
        const sig = req.headers['stripe-signature'];

        if (!rawBody || !sig) {
            throw new APIError(
                "[Webhook]",
                HttpStatusCode.BAD_REQUEST,
                true,
                "Missing raw body or Stripe signature"
            );
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
        } catch (err: unknown) {
            if (err instanceof Error) {
                return res.status(HttpStatusCode.BAD_REQUEST).json(`Webhook Error: ${err.message}`);
            }
            throw err;
        }

        const session = event.data.object as Stripe.Checkout.Session;

        if (event.type === "checkout.session.completed") {
            await getManager().transaction(async (transactionalEntityManager) => {
                const order = await transactionalEntityManager.findOne(Order, {
                    where: { id: session.metadata?.order_id },
                    relations: ["order_items"],
                });

                if (!order) {
                    throw new APIError("[Webhook]", HttpStatusCode.NOT_FOUND, true, "Order not found");
                }

                const address = session.customer_details?.address;
                const address_components = [
                    address?.line1,
                    address?.line2,
                    address?.city,
                    address?.state,
                    address?.postal_code,
                    address?.country,
                ];
                const formattedAddress = address_components.filter(Boolean).join(", ");

                // Update order details
                order.is_paid = true;
                order.updated_at = new Date();
                order.address = formattedAddress;
                order.phone = session.customer_details?.phone || "";

                await transactionalEntityManager.save(order);

                // Update product stock
                const product_ids = order.order_items.map((order_item) => order_item.product.id);
                const products = await Product.findByIds(product_ids);

                products.forEach((product) => {
                    product.stock = Math.max(product.stock - 1, 0); // Prevent negative stock
                });

                await transactionalEntityManager.save(products);
            });
        }

        return res.status(HttpStatusCode.OK).json(create_json_response({}, true, "Webhook received successfully"));
    } catch (err: unknown) {
        next(new APIError("[Webhook]", HttpStatusCode.INTERNAL_SERVER, true, error_formatting(err), "Failed to process webhook"));
    }
};
