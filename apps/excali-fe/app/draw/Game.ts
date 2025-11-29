import axios from "axios";
import { BE_URL } from "../config";
import { getExistingShapes } from "./http";
import { Tool } from "../components/Canvas";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    }
  | {
      type: "square";
      x: number;
      y: number;
      length: number;
    }
  | {
      type: "line";
      x: number;
      y: number;
      endX: number;
      endY: number;
      length: number;
    };

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
  strokeRoundRect(
  x: number,
  y: number,
  width: number,
  height: number
) {
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
      console.log("raw event data: " + event.data);
      const mssg = JSON.parse(event.data);
      if (mssg.type == "chat") {
        const message = JSON.parse(mssg.message);
        console.log("message : " + message);
        this.existingShapes.push(message.shape);
        this.clearCanvas();
      }
    };
  }

  handleMouseDown = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };
  handleMouseUp = (e: MouseEvent) => {
    this.clicked = false;

    this.endX = e.clientX;
    console.log("endX iiiiis " + e.clientX);
    this.endY = e.clientY;
    this.width = e.clientX - this.startX;
    this.height = e.clientY - this.startY;
    //@ts-ignore
    let shape: Shape = {};
    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
      };
    } else if (this.selectedTool === "circle") {
      console.log("tooooool is " + this.selectedTool);
      const radius = this.endY - this.startY;
      shape = {
        type: "circle",
        x: this.startX,
        y: this.startY,
        radius: radius,
      };
    } else if (this.selectedTool === "sqaure") {
      shape = {
        type: "square",
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
        x: this.startX,
        y: this.startY,
        endX: this.endX,
        endY: this.endY,
        length: length,
      };
    }
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(this.roomId),
        message: JSON.stringify({
          shape,
        }),
      })
    );
    //   console.log("Existing shapes" + existingShapes)
    this.clearCanvas();
  };
  handleMouseMove = (e: MouseEvent) => {
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
      } else if (this.selectedTool === "sqaure") {
        this.width = e.clientX - this.startX;
        this.ctx.strokeRect(this.startX, this.startY, this.width, this.width);
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);

    this.canvas.addEventListener("mouseup", this.handleMouseUp);

    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }
}
