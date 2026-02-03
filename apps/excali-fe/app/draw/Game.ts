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
  | (BaseShape & {
      type: "circle";
      x: number;
      y: number;
      radius: number;
    })
  | (BaseShape & {
      type: "square";
      x: number;
      y: number;
      length: number;
    })
  | (BaseShape & {
      type: "line";
      x: number;
      y: number;
      endX: number;
      endY: number;
      length: number;
    })
  | (BaseShape & {
      type: "text";
      x: number;
      y: number;
      text: string;
      fontSize: number;
    });

export class Game {
  private roomId: string;
  private socket: WebSocket;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private selectedTool: Tool = "circle";
  private existingShapes: Shape[] = [];

  private startX = 0;
  private startY = 0;
  private clicked = false;

  private selectedElement: Shape | null = null;
  private elementClicked = false;
  
  private editingText: Shape | null = null;
  private lastClickTime = 0;
  private lastClickX = 0;
  private lastClickY = 0;
  private cursorVisible = true;
  private cursorInterval: NodeJS.Timeout | null = null;
  private cursorPosition = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.ctx = canvas.getContext("2d")!;

    this.initDraw();
    this.initHandlers();
    this.initMouseHandlers();
    this.initKeyboardHandlers();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
    this.canvas.removeEventListener("dblclick", this.handleDoubleClick);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.stopCursorBlink();
  }

  setTool(tool: Tool) {
    this.selectedTool = tool;
  }

  async initDraw() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 1.2;
    this.clearCanvas();
  }

  private getCanvasCoords(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private isPointInCircle(
    px: number,
    py: number,
    cx: number,
    cy: number,
    r: number,
  ) {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
  }

  private distancePointToSegment(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) {
      return Math.hypot(px - x1, py - y1);
    }

    const t = ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy);
    const clamped = Math.max(0, Math.min(1, t));

    const cx = x1 + clamped * dx;
    const cy = y1 + clamped * dy;

    return Math.hypot(px - cx, py - cy);
  }

  isEnclosedBySelect(x: number, y: number, shape: Shape): boolean {
    if (shape.type === "rect") {
      return (
        x >= Math.min(shape.x, shape.x + shape.width) &&
        x <= Math.max(shape.x, shape.x + shape.width) &&
        y >= Math.min(shape.y, shape.y + shape.height) &&
        y <= Math.max(shape.y, shape.y + shape.height)
      );
    }

    if (shape.type === "square") {
      return (
        x >= shape.x &&
        x <= shape.x + shape.length &&
        y >= shape.y &&
        y <= shape.y + shape.length
      );
    }

    if (shape.type === "circle") {
      return this.isPointInCircle(
        x,
        y,
        shape.x,
        shape.y,
        Math.abs(shape.radius),
      );
    }

    if (shape.type === "line") {
      return (
        this.distancePointToSegment(
          x,
          y,
          shape.x,
          shape.y,
          shape.endX,
          shape.endY,
        ) <= 5
      );
    }

    if (shape.type === "text") {
      this.ctx.font = `${shape.fontSize}px Arial`;
      const metrics = this.ctx.measureText(shape.text);
      const textWidth = metrics.width;
      const textHeight = shape.fontSize;
      return (
        x >= shape.x &&
        x <= shape.x + textWidth &&
        y >= shape.y - textHeight * 0.85 &&
        y <= shape.y + textHeight * 0.25
      );
    }

    return false;
  }

  getContainedElement(x: number, y: number) {
    return [...this.existingShapes]
      .reverse()
      .find((shape) => this.isEnclosedBySelect(x, y, shape));
  }

  strokeRoundRect(x: number, y: number, w: number, h: number) {
    if (w < 0) ((x += w), (w = -w));
    if (h < 0) ((y += h), (h = -h));

    const r = Math.min(10, w / 2, h / 2);
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.stroke();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const shape of this.existingShapes) {
      if (shape.type === "rect") {
        this.strokeRoundRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(shape.x, shape.y, Math.abs(shape.radius), 0, Math.PI * 2);
        this.ctx.stroke();
      } else if (shape.type === "square") {
        this.ctx.strokeRect(shape.x, shape.y, shape.length, shape.length);
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x, shape.y);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
      } else if (shape.type === "text") {
        this.ctx.font = `${shape.fontSize}px Arial`;
        this.ctx.fillStyle = "white";
        this.ctx.fillText(shape.text, shape.x, shape.y);
        

        if (this.editingText && this.editingText.id === shape.id && this.cursorVisible) {
          const textBeforeCursor = shape.text.substring(0, this.cursorPosition);
          const cursorX = shape.x + this.ctx.measureText(textBeforeCursor).width;
          this.ctx.fillRect(cursorX, shape.y - shape.fontSize * 0.85, 2, shape.fontSize * 1.1);
        }
      }
    }
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const { shape } = JSON.parse(msg.message);

      const idx = this.existingShapes.findIndex((s) => s.id === shape.id);
      if (idx !== -1) this.existingShapes[idx] = shape;
      else this.existingShapes.push(shape);

      this.clearCanvas();
    };
  }

  handleMouseDown = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);
    
  
    if (this.editingText) {
      const el = this.getContainedElement(x, y);
      if (!el || el.id !== this.editingText.id) {
        this.finishTextEditing();
      }
    }
    
    this.startX = x;
    this.startY = y;

    
    const now = Date.now();
    const timeDiff = now - this.lastClickTime;
    const distance = Math.hypot(x - this.lastClickX, y - this.lastClickY);
    
    if (timeDiff < 300 && distance < 10) {
      this.handleDoubleClick(e);
      this.lastClickTime = 0;
      return;
    }
    
    this.lastClickTime = now;
    this.lastClickX = x;
    this.lastClickY = y;

    if (this.selectedTool === "text") {
      this.createTextAtPosition(x, y);
      return;
    }

    if (this.selectedTool === "select") {
      const el = this.getContainedElement(x, y);
      if (!el) return;

      this.selectedElement = el;
      this.elementClicked = true;
      (el as any).__origX = el.x;
      (el as any).__origY = el.y;
    } else {
      this.clicked = true;
    }
  };

  handleMouseUp = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);
    this.clicked = false;

    if (
      this.selectedTool === "select" &&
      this.selectedElement &&
      this.elementClicked
    ) {
      const dx = x - this.startX;
      const dy = y - this.startY;

      const origX = (this.selectedElement as any).__origX;
      const origY = (this.selectedElement as any).__origY;

      const updated = { ...this.selectedElement } as any;
      updated.x = origX + dx;
      updated.y = origY + dy;

      if (updated.type === "line") {
        updated.endX += dx;
        updated.endY += dy;
      }

      const idx = this.existingShapes.findIndex((s) => s.id === updated.id);
      this.existingShapes[idx] = updated;

      this.socket.send(
        JSON.stringify({
          type: "update-shape",
          roomId: Number(this.roomId),
          message: JSON.stringify({ shape: updated }),
          fid: updated.id,
        }),
      );

      this.selectedElement = null;
      this.elementClicked = false;
      this.clearCanvas();
      return;
    }

    let shape: Shape | null = null;

    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        width: x - this.startX,
        height: y - this.startY,
      };
    } else if (this.selectedTool === "circle") {
      shape = {
        type: "circle",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        radius: y - this.startY,
      };
    } else if (this.selectedTool === "square") {
      shape = {
        type: "square",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        length: x - this.startX,
      };
    } else if (this.selectedTool === "line") {
      shape = {
        type: "line",
        id: crypto.randomUUID(),
        x: this.startX,
        y: this.startY,
        endX: x,
        endY: y,
        length: Math.hypot(x - this.startX, y - this.startY),
      };
    }

    if (!shape) return;

    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        roomId: Number(this.roomId),
        message: JSON.stringify({ shape }),
        fid: shape.id,
      }),
    );

    this.clearCanvas();
  };

  handleMouseMove = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);

    if (this.selectedTool === "select" && this.elementClicked) {
      this.canvas.style.cursor = "move";
    } else {
      this.canvas.style.cursor = "default";
    }

    if (this.clicked) {
      this.clearCanvas();

      if (this.selectedTool === "rect") {
        this.strokeRoundRect(
          this.startX,
          this.startY,
          x - this.startX,
          y - this.startY,
        );
      } else if (this.selectedTool === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          this.startX,
          this.startY,
          Math.abs(y - this.startY),
          0,
          Math.PI * 2,
        );
        this.ctx.stroke();
      } else if (this.selectedTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
      } else if (this.selectedTool === "square") {
        this.ctx.strokeRect(
          this.startX,
          this.startY,
          x - this.startX,
          x - this.startX,
        );
      }
      return;
    }

    if (
      this.selectedTool === "select" &&
      this.elementClicked &&
      this.selectedElement
    ) {
      const dx = x - this.startX;
      const dy = y - this.startY;

      const origX = (this.selectedElement as any).__origX;
      const origY = (this.selectedElement as any).__origY;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (const shape of this.existingShapes) {
        if (shape.id === this.selectedElement.id) continue;

        if (shape.type === "rect") {
          this.strokeRoundRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
          this.ctx.beginPath();
          this.ctx.arc(
            shape.x,
            shape.y,
            Math.abs(shape.radius),
            0,
            Math.PI * 2,
          );
          this.ctx.stroke();
        } else if (shape.type === "square") {
          this.ctx.strokeRect(shape.x, shape.y, shape.length, shape.length);
        } else if (shape.type === "line") {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.x, shape.y);
          this.ctx.lineTo(shape.endX, shape.endY);
          this.ctx.stroke();
        } else if (shape.type === "text") {
          this.ctx.font = `${shape.fontSize}px Arial`;
          this.ctx.fillStyle = "white";
          this.ctx.fillText(shape.text, shape.x, shape.y);
        }
      }

      const s = this.selectedElement;

      if (s.type === "rect") {
        this.strokeRoundRect(origX + dx, origY + dy, s.width, s.height);
      } else if (s.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          origX + dx,
          origY + dy,
          Math.abs(s.radius),
          0,
          Math.PI * 2,
        );
        this.ctx.stroke();
      } else if (s.type === "square") {
        this.ctx.strokeRect(origX + dx, origY + dy, s.length, s.length);
      } else if (s.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(origX + dx, origY + dy);
        this.ctx.lineTo(s.endX + dx, s.endY + dy);
        this.ctx.stroke();
      } else if (s.type === "text") {
        this.ctx.font = `${s.fontSize}px Arial`;
        this.ctx.fillStyle = "white";
        this.ctx.fillText(s.text, origX + dx, origY + dy);
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("dblclick", this.handleDoubleClick);
  }

  handleDoubleClick = (e: MouseEvent) => {
    const { x, y } = this.getCanvasCoords(e);
    const el = this.getContainedElement(x, y);
    
    if (el && el.type === "text") {
      this.editText(el);
    } else {
      this.createTextAtPosition(x, y);
    }
  };

  createTextAtPosition(x: number, y: number) {
    const fontSize = 20;
    const textShape: Shape = {
      type: "text",
      id: crypto.randomUUID(),
      x,
      y: y + fontSize, // Offset y by fontSize so text appears at click position
      text: "",
      fontSize: fontSize,
    };
    
    this.editingText = textShape;
    this.cursorPosition = 0;
    this.existingShapes.push(textShape);
    this.startCursorBlink();
    this.clearCanvas();
  }

  editText(textShape: Shape & { type: "text" }) {
    this.editingText = textShape;
    this.cursorPosition = textShape.text.length;
    this.startCursorBlink();
    this.clearCanvas();
  }

  finishTextEditing() {
    if (!this.editingText || this.editingText.type !== "text") return;
    
    const textShape = this.editingText;
    const newText = textShape.text.trim();
    
    if (newText) {
      const idx = this.existingShapes.findIndex((s) => s.id === textShape.id);
      if (idx !== -1) {
        this.existingShapes[idx] = textShape;
      }
      
      this.socket.send(
        JSON.stringify({
          type: textShape.text === "" ? "chat" : "update-shape",
          roomId: Number(this.roomId),
          message: JSON.stringify({ shape: textShape }),
          fid: textShape.id,
        }),
      );
    } else {
      // Remove empty text
      const idx = this.existingShapes.findIndex((s) => s.id === textShape.id);
      if (idx !== -1) {
        this.existingShapes.splice(idx, 1);
      }
    }
    
    this.stopCursorBlink();
    this.editingText = null;
    this.clearCanvas();
  }

  startCursorBlink() {
    this.stopCursorBlink();
    this.cursorVisible = true;
    this.cursorInterval = setInterval(() => {
      this.cursorVisible = !this.cursorVisible;
      this.clearCanvas();
    }, 500);
  }

  stopCursorBlink() {
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
      this.cursorInterval = null;
    }
    this.cursorVisible = true;
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (!this.editingText || this.editingText.type !== "text") return;

    if (e.key === "Enter") {
      e.preventDefault();
      this.finishTextEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      const idx = this.existingShapes.findIndex((s) => s.id === this.editingText!.id);
      if (idx !== -1 && this.editingText.text === "") {
        this.existingShapes.splice(idx, 1);
      }
      this.stopCursorBlink();
      this.editingText = null;
      this.clearCanvas();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.cursorPosition = Math.max(0, this.cursorPosition - 1);
      this.clearCanvas();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      this.cursorPosition = Math.min(this.editingText.text.length, this.cursorPosition + 1);
      this.clearCanvas();
    } else if (e.key === "Home") {
      e.preventDefault();
      this.cursorPosition = 0;
      this.clearCanvas();
    } else if (e.key === "End") {
      e.preventDefault();
      this.cursorPosition = this.editingText.text.length;
      this.clearCanvas();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      if (this.cursorPosition > 0) {
        this.editingText.text = 
          this.editingText.text.slice(0, this.cursorPosition - 1) + 
          this.editingText.text.slice(this.cursorPosition);
        this.cursorPosition--;
        const idx = this.existingShapes.findIndex((s) => s.id === this.editingText!.id);
        if (idx !== -1) {
          this.existingShapes[idx] = { ...this.editingText };
        }
        this.clearCanvas();
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      if (this.cursorPosition < this.editingText.text.length) {
        this.editingText.text = 
          this.editingText.text.slice(0, this.cursorPosition) + 
          this.editingText.text.slice(this.cursorPosition + 1);
        const idx = this.existingShapes.findIndex((s) => s.id === this.editingText!.id);
        if (idx !== -1) {
          this.existingShapes[idx] = { ...this.editingText };
        }
        this.clearCanvas();
      }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      this.editingText.text = 
        this.editingText.text.slice(0, this.cursorPosition) + 
        e.key + 
        this.editingText.text.slice(this.cursorPosition);
      this.cursorPosition++;
      const idx = this.existingShapes.findIndex((s) => s.id === this.editingText!.id);
      if (idx !== -1) {
        this.existingShapes[idx] = { ...this.editingText };
      }
      this.clearCanvas();
    }
  };

  initKeyboardHandlers() {
    document.addEventListener("keydown", this.handleKeyDown);
  }
}
