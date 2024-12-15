import { Request, Response, NextFunction } from "express";
import { Product } from "../entities/product";
import { Category } from "../entities/category";
import { Size } from "../entities/size";
import { APIError } from "../errors/api-error";
import { create_json_response, error_formatting } from "../utils/helper";
import { HttpStatusCode } from "../utils/enums";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, categoryId, sizeId, colorId, images } = req.body;

        const category = await Category.findOne({ where: { id: categoryId } });
        if (!category) {
            return next(new APIError("[Create Product]", HttpStatusCode.NOT_FOUND, true, "Category not found", "Category not found"));
        }

        const size = await Size.findOne({ where: { id: sizeId } });
        if (!size) {
            return next(new APIError("[Create Product]", HttpStatusCode.NOT_FOUND, true, "Size not found", "Size not found"));
        }
        
        const product = Product.create({
            name,
            price,
            category,
            size,
            images,
            order_items: [],
            created_at: new Date(),
            updated_at: new Date(),
        });
        await product.save();

        return res.status(HttpStatusCode.OK).json(create_json_response(product, true, "Product created successfully"));
    } catch (err: any) {
        next(new APIError("[Create Product]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to create product"));
    }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find({ relations: ["store", "category", "size", "color"] });
        return res.status(HttpStatusCode.OK).json(create_json_response(products, true, "Products fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get All Products]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch products"));
    }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ where: { id }, relations: ["store", "category", "size", "color"] });

        if (!product) {
            return next(new APIError("[Get Product By ID]", HttpStatusCode.NOT_FOUND, true, "Product not found", "Product not found"));
        }

        return res.status(HttpStatusCode.OK).json(create_json_response(product, true, "Product fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get Product By ID]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch product"));
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, price, categoryId, sizeId, colorId, images } = req.body;

        const product = await Product.findOne({ where: { id }, relations: ["category", "size", "color"] });
        if (!product) {
            return next(new APIError("[Update Product]", HttpStatusCode.NOT_FOUND, true, "Product not found", "Product not found"));
        }

        if (categoryId) {
            const category = await Category.findOne({ where: { id: categoryId } });
            if (!category) {
                return next(new APIError("[Update Product]", HttpStatusCode.NOT_FOUND, true, "Category not found", "Category not found"));
            }
            product.category = category;
        }

        if (sizeId) {
            const size = await Size.findOne({ where: { id: sizeId } });
            if (!size) {
                return next(new APIError("[Update Product]", HttpStatusCode.NOT_FOUND, true, "Size not found", "Size not found"));
            }
            product.size = size;
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.images = images || product.images;
        product.updated_at = new Date();

        await product.save();
        return res.status(HttpStatusCode.OK).json(create_json_response(product, true, "Product updated successfully"));
    } catch (err: any) {
        next(new APIError("[Update Product]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to update product"));
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ where: { id } });

        if (!product) {
            return next(new APIError("[Delete Product]", HttpStatusCode.NOT_FOUND, true, "Product not found", "Product not found"));
        }

        await product.remove();
        return res.status(HttpStatusCode.OK).json(create_json_response({}, true, "Product deleted successfully"));
    } catch (err: any) {
        next(new APIError("[Delete Product]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to delete product"));
    }
};
