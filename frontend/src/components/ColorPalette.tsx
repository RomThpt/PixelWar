import { cn } from "@/lib/utils";

const COLORS = [
  "#FF4500", // Orange Red
  "#FFA800", // Orange
  "#FFD635", // Yellow
  "#00A368", // Green
  "#7EED56", // Light Green
  "#2450A4", // Blue
  "#3690EA", // Light Blue
  "#51E9F4", // Cyan
  "#811E9F", // Purple
  "#FF99AA", // Pink
  "#9C6926", // Brown
  "#898D90", // Gray
  "#D4D7D9", // Light Gray
  "#FFFFFF", // White
];

interface ColorPaletteProps {
  activeColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorPalette = ({ activeColor, onColorSelect }: ColorPaletteProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-900 rounded-lg shadow-xl">
      {COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={cn(
            "w-8 h-8 rounded transition-transform hover:scale-110",
            activeColor === color && "ring-2 ring-white ring-offset-2 ring-offset-gray-900"
          )}
          style={{ backgroundColor: color }}
          aria-label={`Select ${color} color`}
        />
      ))}
    </div>
  );
};