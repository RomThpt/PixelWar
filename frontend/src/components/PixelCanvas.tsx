import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas as FabricCanvas, Line, Rect } from "fabric";
import { toast } from "sonner";
import { cairo } from "starknet"
import { useAccount, useContract, useSendTransaction, useTransactionReceipt } from "@starknet-react/core";
import { ABI } from "@/abis/Abi";
import { type Abi } from "starknet";

const GRID_SIZE = 100;
const PIXEL_SIZE = 10;

export const PixelCanvas = ({ activeColor }: { activeColor: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [zoom, setZoom] = useState(1);
  const currentColorRef = useRef(activeColor);

  const x = useRef(-1);
  const y = useRef(-1);

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const { address: userAddress } = useAccount();
  const CONTRACT_ADDRESS = "0x07c0c2f9df7aa843254f03931ce1031158328b0df69a5bd42c1f74188155a08a";
  const { contract } = useContract({
    abi: ABI as Abi,
    address: CONTRACT_ADDRESS,
  });

  const calls = useMemo(() => {
    if (!userAddress || !contract) return [];
    try {
      console.log(hexToRgb(currentColorRef.current).r, hexToRgb(currentColorRef.current).g, hexToRgb(currentColorRef.current).b, x.current / 10, y.current / 10);
      const colorTpl = cairo.tuple(hexToRgb(currentColorRef.current).r, hexToRgb(currentColorRef.current).g, hexToRgb(currentColorRef.current).b);
      return [contract.populate("changeColor", [colorTpl, x.current / 10, y.current / 10])];
    } catch (error) {
      console.error("Error populating changeColor call:", error);
      return [];
    }
  }, [x.current, y.current]);

  const {
    send: writeAsync,
    data: writeData,
    isPending: writeIsPending,
  } = useSendTransaction({
    calls,
  });
  const {
    data: waitData,
    status: waitStatus,
    isLoading: waitIsLoading,
    isError: waitIsError,
    error: waitError
  } = useTransactionReceipt({ hash: writeData?.transaction_hash, watch: true })

  useEffect(() => {
    if (waitStatus === "success") {
      toast("Pixel color changed!", { duration: 1000 });
    }
    if (writeIsPending) {
      toast("Tx is pending")
    }
  }, [waitStatus]);


  // Update the ref when activeColor changes
  useEffect(() => {
    currentColorRef.current = activeColor;
  }, [activeColor]);

  useEffect(() => {
    if (!canvasRef.current && !userAddress) {
      toast("Connect account plz", { duration: 1500 });
      return;
    }

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: GRID_SIZE * PIXEL_SIZE,
      height: GRID_SIZE * PIXEL_SIZE,
      backgroundColor: "#000000",
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
      const pointer = fabricCanvas.getViewportPoint(options.e);
      x.current = (Math.floor(pointer.x / PIXEL_SIZE) * PIXEL_SIZE);
      console.log("x: ", x.current);
      y.current = Math.floor(pointer.y / PIXEL_SIZE) * PIXEL_SIZE;
      console.log('y: ', y.current);
      writeAsync();

      // Find if there's already a pixel at this position
      const objects = fabricCanvas.getObjects('rect');
      const existingPixel = objects.find(obj =>
        obj.left === x.current && obj.top === y.current && obj.width === PIXEL_SIZE
      );
      // If there's an existing pixel, remove it
      if (existingPixel) {
        fabricCanvas.remove(existingPixel);
      }
      // Add new pixel with current active color from the ref
      const rect = new Rect({
        left: x.current,
        top: y.current,
        width: PIXEL_SIZE,
        height: PIXEL_SIZE,
        fill: currentColorRef.current,
        selectable: false,
      });

      fabricCanvas.add(rect);
      fabricCanvas.renderAll();
      toast("Pixel placed!", { duration: 500 });
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [userAddress]);

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