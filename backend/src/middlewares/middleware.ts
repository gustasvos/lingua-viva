import { type RequestHandler } from "express";

export const noopMiddleware: RequestHandler = (_req, _res, next) => {
    next();
};