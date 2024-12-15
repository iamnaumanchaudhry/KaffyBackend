import { Request, Response, NextFunction } from "express";
import { Size } from "../entities/size";
import { APIError } from "../errors/api-error";
import { create_json_response, error_formatting } from "../utils/helper";
import { HttpStatusCode } from "../utils/enums";

export const createSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, value } = req.body;

        const size = Size.create({ name, value, created_at: new Date(), updated_at: new Date() });
        await size.save();

        return res.status(HttpStatusCode.OK).json(create_json_response(size, true, "Size created successfully"));
    } catch (err: any) {
        next(new APIError("[Create Size]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to create size"));
    }
};

export const getAllSizes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sizes = await Size.find({ relations: ["store"] });
        return res.status(HttpStatusCode.OK).json(create_json_response(sizes, true, "Sizes fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get All Sizes]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch sizes"));
    }
};

export const getSizeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const size = await Size.findOne({ where: { id }, relations: ["store"] });

        if (!size) {
            return next(new APIError("[Get Size By ID]", HttpStatusCode.NOT_FOUND, true, "Size not found", "Size not found"));
        }

        return res.status(HttpStatusCode.OK).json(create_json_response(size, true, "Size fetched successfully"));
    } catch (err: any) {
        next(new APIError("[Get Size By ID]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to fetch size"));
    }
};

export const updateSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, value } = req.body;

        const size = await Size.findOne({ where: { id }, relations: ["store"] });

        if (!size) {
            return next(new APIError("[Update Size]", HttpStatusCode.NOT_FOUND, true, "Size not found", "Size not found"));
        }

        size.name = name;
        size.value = value;
        size.updated_at = new Date();
        await size.save();

        return res.status(HttpStatusCode.OK).json(create_json_response(size, true, "Size updated successfully"));
    } catch (err: any) {
        next(new APIError("[Update Size]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to update size"));
    }
};

export const deleteSize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const size = await Size.findOne({ where: { id }, relations: ["store"] });

        if (!size) {
            return next(new APIError("[Delete Size]", HttpStatusCode.NOT_FOUND, true, "Size not found", "Size not found"));
        }

        await size.remove();
        return res.status(HttpStatusCode.OK).json(create_json_response({}, true, "Size deleted successfully"));
    } catch (err: any) {
        next(new APIError("[Delete Size]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Failed to delete size"));
    }
};
