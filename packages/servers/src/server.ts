import { config, Logger } from "@naxt/runtime";
import type { Endpoint } from "@naxt/types";
import express, { Express, RequestHandler } from "express";
import http from "http";

export class Server<T extends Record<string, Endpoint>> {
  private readonly endpoints: T;
  private readonly app: Express;
  private readonly middlewares: RequestHandler[] = [];
  private readonly headers: Record<string, string> = {};
  private readonly logger = new Logger("Servers.Core     ");
  private readonly httpEvents: Record<string, ((...args: any[]) => void)[]> = {};

  constructor() {
    this.app = express();
    this.endpoints = {} as T;
  }

  endpoint<K extends keyof T>(path: K, handler: T[K]) {
    this.endpoints[path] = handler;
    return this;
  }

  middleware(middleware: RequestHandler) {
    this.middlewares.push(middleware);
    return this;
  }

  setHeader(name: string, value: string) {
    this.headers[name] = value;
    return this;
  }

  on(event: string, handler: (...args: any[]) => void) {
    this.httpEvents[event] ||= [];
    this.httpEvents[event].push(handler);
    return this;
  }

  async start() {
    const port = config.getConfig("port");

    if (Object.keys(this.headers).length > 0) {
      this.middleware((req, res, next) => {
        Object.entries(this.headers).forEach(([name, value]) => {
          res.setHeader(name, value);
        });
        next();
      });
    }

    const endpointEntries = Object.entries(this.endpoints);
    if (endpointEntries.length > 0) {
      this.middleware((req, res, next) => {
        for (const entry of endpointEntries) {
          const [path, endpoint] = entry;
          if (req.path === path) return endpoint(req, res);
        }

        res.end(`Path ${req.path} not found`);
      });
    }

    this.middlewares.forEach(middleware => this.app.use(middleware));
    let server: http.Server;
    await new Promise<void>(res => {
      server = this.app.listen(port, () => {
        this.logger.info(`Server started on port ${port}`);
        res();
      });
    });

    for (const event in this.httpEvents) {
      const handlers = this.httpEvents[event];
      handlers.forEach(handler => server.on(event, handler));
    }

    return this;
  }
}
