import { useState } from "react";
import { PixelCanvas } from "@/components/PixelCanvas";
import { ColorPalette } from "@/components/ColorPalette";
import WalletBar from "@/components/WalletBar";

const Index = () => {
  const [activeColor, setActiveColor] = useState("#FF4500");

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center">Pixel War</h1>
        <div className="flex flex-col items-center gap-8">
          <WalletBar />
          <PixelCanvas activeColor={activeColor} />
          <ColorPalette activeColor={activeColor} onColorSelect={setActiveColor} />
        </div>
      </div>
    </div>
  );
};

export default Index;