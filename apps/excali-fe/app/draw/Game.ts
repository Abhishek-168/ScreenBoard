import axios from "axios";
import { BE_URL } from "../config";
import { getExistingShapes } from "./http";
import { Tool } from "../components/Canvas";

type BaseShape = { id: string; editing?: boolean };

type Shape =
  | (BaseShape & {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    })
  | (BaseShape & { type: "circle"; x: number; y: number; radius: number })
  | (BaseShape & { type: "square"; x: number; y: number; length: number })
  | (BaseShape & {
      type: "line";
      x: number;
      y: number;
      endX: number;
      endY: number;
      length: number;
    });

export class Game {
  private roomId: string;
  private socket: WebSocket;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private selectedTool: Tool = "circle";
  private existingShapes: Shape[] = [];
  private startX: number = 0;
  private startY: number = 0;
  private endX: number = 0;
  private endY: number = 0;
  private width: number = 0;
  private height: number = 0;
  private clicked: boolean = false;
  private selectedElement: Shape | null = null;
  private elementClicked: boolean = false;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.roomId = roomId;
    this.socket = socket;
    this.canvas = canvas;
    this.existingShapes = [];
    this.ctx = canvas.getContext("2d")!;

    this.initDraw();
    this.initHandlers();
    this.initMouseHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);

    this.canvas.removeEventListener("mouseup", this.handleMouseUp);

    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async initDraw() {
    this.existingShapes = await getExistingShapes(this.roomId);

    if (!this.ctx) return;

    this.clearCanvas();

    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
  }
  strokeRoundRect(x: number, y: number, width: number, height: number) {
    // Normalize negative sizes
    if (width < 0) {
      x += width;
      width = -width;
    }
    if (height < 0) {
      y += height;
      height = -height;
    }

    const r = Math.min(10, width / 2, height / 2);

    const x0 = x;
    const x1 = x + r;
    const x2 = x + width - r;
    const x3 = x + width;

    const y0 = y;
    const y1 = y + r;
    const y2 = y + height - r;
    const y3 = y + height;

    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(x1, y0);
    ctx.lineTo(x2, y0);
    ctx.arcTo(x3, y0, x3, y1, r);
    ctx.lineTo(x3, y2);
    ctx.arcTo(x3, y3, x2, y3, r);
    ctx.lineTo(x1, y3);
    ctx.arcTo(x0, y3, x0, y2, r);
    ctx.lineTo(x0, y1);
    ctx.arcTo(x0, y0, x1, y0, r);
    ctx.closePath();
    ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.map((shape) => {
      if (shape.type == "rect") {
        this.strokeRoundRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type == "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (shape.type == "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x, shape.y);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
      } else if (shape.type == "square") {
        this.ctx.strokeRect(shape.x, shape.y, shape.length, shape.length);
      }
    });
  }

initHandlers() {
  this.socket.onmessage = (event) => {
    console.log("raw event data: ", event.data);
    const mssg = JSON.parse(event.data);

    // helper to upsert incoming shape into this.existingShapes
    const upsertIncomingShape = (incoming: any) => {
      if (!incoming || !incoming.shape || !incoming.shape.id) return;
      const incomingShape = incoming.shape;
      const idx = this.existingShapes.findIndex((s) => s.id === incomingShape.id);
      if (idx !== -1) {
        // replace existing
        this.existingShapes[idx] = incomingShape;
      } else {
        // add new
        this.existingShapes.push(incomingShape);
      }
    };

    if (mssg.type == "chat") {
      const message = JSON.parse(mssg.message);

      console.log("New shape received (chat):", message);

      // Upsert instead of blindly pushing to avoid duplicates
      upsertIncomingShape(message);
      this.clearCanvas();
    } else if (mssg.type == "update-shape") {
      const message = JSON.parse(mssg.message);
      console.log("Updated shape received:", message);

      // Replace the existing one (or add if missing)
      upsertIncomingShape(message);
      this.clearCanvas();
    }
  };
}


  isEnclosedBySelect(x: number, y: number, shape: Shape): boolean {
    if (shape.type == "rect") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );
    }
    return false;
  }

  getContainedElement(x: number, y: number): Shape | undefined {
    return this.existingShapes.find((shape) =>
      this.isEnclosedBySelect(x, y, shape)
    );
  }

  handleMouseDown = (e: MouseEvent) => {
    this.startX = e.clientX;
    this.startY = e.clientY;
    if (this.selectedTool != "select") {
      this.clicked = true;
    } else {
      const element = this.getContainedElement(this.startX, this.startY);
      if (!element) {
        console.log("Select but element not found");
        return;
      } else {
        this.selectedElement = element;
        this.elementClicked = true;
        (this.selectedElement as any).__origX = (this.selectedElement as any).x;
        (this.selectedElement as any).__origY = (this.selectedElement as any).y;
        console.log("selected element is ", element);
      }
    }
  };
  handleMouseUp = (e: MouseEvent) => {
    // stop any drawing
    this.clicked = false;

    // capture client coords
    this.endX = e.clientX;
    this.endY = e.clientY;
    this.width = e.clientX - this.startX;
    this.height = e.clientY - this.startY;

    //@ts-ignore
    let shape: Shape | null = null;

    // Handle shape dragging first
    if (
      this.selectedTool === "select" &&
      this.selectedElement &&
      this.elementClicked
    ) {
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const origX =
        (this.selectedElement as any).__origX ?? this.selectedElement.x;
      const origY =
        (this.selectedElement as any).__origY ?? this.selectedElement.y;
      const existingId = (this.selectedElement as any).id;

      // Create the updated shape
      if (this.selectedElement.type === "rect") {
        shape = {
          type: "rect",
          editing: true,
          id: existingId,
          x: origX + dx,
          y: origY + dy,
          width: this.selectedElement.width,
          height: this.selectedElement.height,
        };
      } else if (this.selectedElement.type === "circle") {
        shape = {
          type: "circle",
          editing: true,
          id: existingId,
          x: origX + dx,
          y: origY + dy,
          radius: this.selectedElement.radius,
        };
      } else if (this.selectedElement.type === "square") {
        shape = {
          type: "square",
          editing: true,
          id: existingId,
          x: origX + dx,
          y: origY + dy,
          length: this.selectedElement.length,
        };
      } else if (this.selectedElement.type === "line") {
        shape = {
          type: "line",
          editing: true,
          id: existingId,
          x: origX + dx,
          y: origY + dy,
          endX: this.selectedElement.endX + dx,
          endY: this.selectedElement.endY + dy,
          length: this.selectedElement.length,
        };
      }

      // Update the shape in existingShapes
      if (shape) {
        const idx = this.existingShapes.findIndex(
          (s: any) => s.id === shape!.id
        );
        if (idx !== -1) {
          this.existingShapes[idx] = shape;
        }

        // Send update to server
        this.socket.send(
          JSON.stringify({
            type: "update-shape",
            roomId: Number(this.roomId),
            message: JSON.stringify({ shape }),
            fid: shape.id,
          })
        );

        // Clean up
        delete (this.selectedElement as any).__origX;
        delete (this.selectedElement as any).__origY;
      }

      // Clear selection state
      this.elementClicked = false;
      this.selectedElement = null;

      // Redraw and return - don't proceed to new shape creation
      this.clearCanvas();
      return;
    }

    // Handle new shape creation (only for non-select tools)
    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
      };
    } else if (this.selectedTool === "circle") {
      const radius = this.endY - this.startY;
      shape = {
        type: "circle",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        radius,
      };
    } else if (this.selectedTool === "square") {
      shape = {
        type: "square",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        length: this.width,
      };
    } else if (this.selectedTool === "line") {
      const length = Math.sqrt(
        Math.pow(this.endX - this.startX, 2) +
          Math.pow(this.endY - this.startY, 2)
      );
      shape = {
        type: "line",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        endX: this.endX,
        endY: this.endY,
        length,
      };
    }

    // If no shape was produced, just redraw and return
    if (!shape) {
      this.clearCanvas();
      return;
    }

    // Push new shape and send to server
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(this.roomId),
        message: JSON.stringify({ shape }),
        fid: shape.id,
      })
    );

    // Final redraw
    this.clearCanvas();
  };

  handleMouseMove = (e: MouseEvent) => {
    // cursor aesthetics
    if (this.selectedTool === "select" && this.elementClicked) {
    this.canvas.style.cursor = "move";
  } else {
    this.canvas.style.cursor = "default";
  }


    if (this.clicked) {
      console.log("tool is " + this.selectedTool);
      this.clearCanvas();
      //   this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (this.selectedTool == "rect") {
        this.width = e.clientX - this.startX;
        this.height = e.clientY - this.startY;
        this.strokeRoundRect(this.startX, this.startY, this.width, this.height);
      } else if (this.selectedTool == "circle") {
        this.ctx.beginPath();
        const radius = e.clientY - this.startY;
        console.log("endX is " + this.endX + "startX is " + this.startX);
        console.log("radius is " + radius);
        this.ctx.arc(
          this.startX,
          this.startY,
          Math.abs(radius),
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
      } else if (this.selectedTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
      } else if (this.selectedTool === "square") {
        this.width = e.clientX - this.startX;
        this.ctx.strokeRect(this.startX, this.startY, this.width, this.width);
      }
    } else {
      if (
        this.selectedTool == "select" &&
        this.elementClicked &&
        this.selectedElement
      ) {

        if (this.selectedElement.type == "rect") {
          // this.width = e.clientX - this.startX;
          // this.height = e.clientY - this.startY;
          const dx = e.clientX - this.startX;
          const dy = e.clientY - this.startY;
          const origX =
            (this.selectedElement as any).__origX ?? this.selectedElement.x;
          const origY =
            (this.selectedElement as any).__origY ?? this.selectedElement.y;
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          for (const shape of this.existingShapes) {
            // skip the dragged shape to avoid drawing original + preview
            if (shape.id == this.selectedElement.id) continue;

            if (shape.type === "rect") {
              this.strokeRoundRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
              this.ctx.beginPath();
              this.ctx.arc(
                shape.x,
                shape.y,
                Math.abs(shape.radius),
                0,
                Math.PI * 2
              );
              this.ctx.stroke();
            } else if (shape.type === "line") {
              this.ctx.beginPath();
              this.ctx.moveTo(shape.x, shape.y);
              this.ctx.lineTo(shape.endX, shape.endY);
              this.ctx.stroke();
            } else if (shape.type === "square") {
              this.ctx.strokeRect(shape.x, shape.y, shape.length, shape.length);
            }
          }
          this.strokeRoundRect(
            origX + dx,
            origY + dy,
            this.selectedElement.width,
            this.selectedElement.height
          );
        }
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);

    this.canvas.addEventListener("mouseup", this.handleMouseUp);

    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }
}
