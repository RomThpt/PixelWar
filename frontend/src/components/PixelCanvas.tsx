import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Line, Rect } from "fabric";
import { toast } from "sonner";

const GRID_SIZE = 50;
const PIXEL_SIZE = 16;

export const PixelCanvas = ({ activeColor }: { activeColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const currentColorRef = useRef(activeColor);

  // Update the ref when activeColor changes
  useEffect(() => {
    currentColorRef.current = activeColor;
  }, [activeColor]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: GRID_SIZE * PIXEL_SIZE,
      height: GRID_SIZE * PIXEL_SIZE,
      backgroundColor: "#1A1F2C",
      selection: false,
    });

    // Draw grid
    for (let i = 0; i <= GRID_SIZE; i++) {
      fabricCanvas.add(
        new Line([i * PIXEL_SIZE, 0, i * PIXEL_SIZE, GRID_SIZE * PIXEL_SIZE], {
          stroke: "#333333",
          selectable: false,
        })
      );
      fabricCanvas.add(
        new Line([0, i * PIXEL_SIZE, GRID_SIZE * PIXEL_SIZE, i * PIXEL_SIZE], {
          stroke: "#333333",
          selectable: false,
        })
      );
    }

    fabricCanvas.on("mouse:down", (options) => {
      const pointer = fabricCanvas.getPointer(options.e);
      const x = Math.floor(pointer.x / PIXEL_SIZE) * PIXEL_SIZE;
      const y = Math.floor(pointer.y / PIXEL_SIZE) * PIXEL_SIZE;

      // Find if there's already a pixel at this position
      const objects = fabricCanvas.getObjects('rect');
      const existingPixel = objects.find(obj => 
        obj.left === x && obj.top === y && obj.width === PIXEL_SIZE
      );

      // If there's an existing pixel, remove it
      if (existingPixel) {
        fabricCanvas.remove(existingPixel);
      }

      // Add new pixel with current active color from the ref
      const rect = new Rect({
        left: x,
        top: y,
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
        fill: currentColorRef.current,
        selectable: false,
      });

      fabricCanvas.add(rect);
      fabricCanvas.renderAll();
      toast("Pixel placed!", { duration: 1000 });
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleZoom = (delta: number) => {
    if (!canvas) return;
    const newZoom = zoom + delta;
    if (newZoom > 0.2 && newZoom < 5) {
      canvas.setZoom(newZoom);
      setZoom(newZoom);
    }
  };

  return (
    <div className="relative border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
      <canvas ref={canvasRef} className="max-w-full" />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => handleZoom(0.1)}
          className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700 transition-colors"
        >
          -
        </button>
      </div>
    </div>
  );
};