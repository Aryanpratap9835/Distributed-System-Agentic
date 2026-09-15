import { Request, Response, NextFunction } from 'express'
const requests = new Map<string, { count: number, windowStart: number }>();
const LIMIT = 5;
const WINDOWTIME = 5 * 1000;
export const ratelimit = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    if (!ip) {
        return res.status(400).json({
            message: "Unable to Identify the Client"
        });
    }
    const record = requests.get(ip);
    if (!record) {
        const newRecord = {
            count: 1,
            windowStart: Date.now()
        }
        requests.set(ip, newRecord);
        next()
    } else {
        if (Date.now() - record.windowStart >= WINDOWTIME) {
            const newRecord = {
                count: 1,
                windowStart: Date.now()
            }
            requests.set(ip, newRecord);
            next()

        }
        else if (record.count >= LIMIT) {
            return res.status(429).json({ message: "Too Many Request" });
        }
        else {
            record.count += 1;

            requests.set(ip, record);
            next();
        }
    }
};