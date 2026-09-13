import "temporal-polyfill/full/global";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../prisma/contract.d";
import contractJson from "../prisma/contract.json";

export const db = postgres<Contract>({
    contractJson,
    url: process.env["DATABASE_URL"] || "",
});

export default db;