import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("===== ERROR =====");
    console.error(err);
    console.error("=================");

    const statusCode = err?.status || err?.statusCode || 500;
    res.status(statusCode).json({
        message: err?.message || "Something went Wrong",
    });
};