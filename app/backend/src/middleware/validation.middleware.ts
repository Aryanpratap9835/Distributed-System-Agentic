import { Request, Response, NextFunction } from "express"
export const validationHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (typeof req.body.name !== "string") {
        res.status(400).json({ message: "Check the Body type" })
        return;
    }
    else if (req.body.name.trim() === "") {
        res.status(400).json({ message: "it have Void" })
        return;
    }
    else
        next();

}