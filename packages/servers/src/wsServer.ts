import { Server } from "./server";
import { Logger } from "@naxt/core";
import { WebSocket, WebSocketServer } from "ws";

export class WsServer<T extends Record<string, unknown>> {
  private readonly logger = new Logger("Servers.WebSocket");
  private readonly wsServer = new WebSocketServer({ noServer: true });
  private readonly wsEvents = {} as Record<keyof T, ((data: T[keyof T]) => void)[]>;
  private readonly emits = {} as Record<keyof T, ((ws: WebSocket) => void)[]>;

  constructor(private server: Server<any>) {}

  on<K extends keyof T>(event: K, handler: (data: T[K]) => void) {
    this.wsEvents[event] ||= [];
    this.wsEvents[event].push(handler);
    return this;
  }

  emit<K extends keyof T>(event: K, data: T[K]) {
    this.emits[event] ||= [];
    this.emits[event].push((ws: WebSocket) => ws.send(JSON.stringify({ event, data })));
    return this;
  }

  async inject() {
    this.logger.info("Injecting WebSocket server...");

    this.wsServer.on("connection", ws => {
      this.logger.info("WebSocket connection established...");

      for (const emit of Object.values(this.emits)) {
        for (const handler of emit) {
          handler(ws);
        }
      }

      ws.on("message", message => {
        try {
          const data = JSON.parse(message.toString());
          this.wsEvents[data.event]?.forEach(handler => handler(data.data));
        } catch {}
      });

      ws.on("close", () => {
        this.logger.log("WebSocket connection closed...");
      });
    });

    this.server.on("upgrade", (request, socket, head) => {
      if (request.url === "/naxt-ws") {
        this.wsServer.handleUpgrade(request, socket, head, ws =>
          this.wsServer.emit("connection", ws, request)
        );
      }
    });
  }
}
