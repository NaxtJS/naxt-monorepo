import { Logger } from "@naxt/core";

export class WS {
  private readonly logger = new Logger("Client");

  constructor(private ws: WebSocket) {}
}
