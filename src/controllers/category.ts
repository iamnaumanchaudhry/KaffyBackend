import { Request, Response, NextFunction } from "express";
import { Category } from "../entities/category";
import { APIError } from "../errors/api-error";
import { create_json_response, error_formatting } from "../utils/helper";
import { HttpStatusCode } from "../utils/enums";

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        const category = Category.create({ name, created_at: new Date(), updated_at: new Date() });
        await category.save();

        return res.status(HttpStatusCode.OK).json(create_json_response(category, true, "Category created successfully"));
    } catch (err: any) {
        next(new APIError("[Create Category]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to create category"));
    }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
        return res.status(HttpStatusCode.OK).json(create_json_response(categories, true, "Categories fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get All Categories]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch categories"));
    }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return next(new APIError("[Get Category By ID]", HttpStatusCode.NOT_FOUND, true, "Category not found", "Category not found"));
        }

        return res.status(HttpStatusCode.OK).json(create_json_response(category, true, "Category fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get Category By ID]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch category"));
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return next(new APIError("[Update Category]", HttpStatusCode.NOT_FOUND, true, "Category not found", "Category not found"));
        }

        category.name = name;
        category.updated_at = new Date();
        await category.save();

        return res.status(HttpStatusCode.OK).json(create_json_response(category, true, "Category updated successfully"));
    } catch (err: any) {
        next(new APIError("[Update Category]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to update category"));
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return next(new APIError("[Delete Category]", HttpStatusCode.NOT_FOUND, true, "Category not found", "Category not found"));
        }

        await category.remove();
        return res.status(HttpStatusCode.OK).json(create_json_response({}, true, "Category deleted successfully"));
    } catch (err: any) {
        next(new APIError("[Delete Category]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to delete category"));
    }
};
