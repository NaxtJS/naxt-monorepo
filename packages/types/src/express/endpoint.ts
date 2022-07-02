import type { Request, Response } from "express";

export type Endpoint = (req: Request, res: Response) => void;
