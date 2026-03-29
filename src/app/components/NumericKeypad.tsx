import { Delete } from "lucide-react";

interface NumericKeypadProps {
  onNumberClick: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function NumericKeypad({ onNumberClick, onDelete, onClear }: NumericKeypadProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["C", "0", "⌫"],
  ];

  const handleClick = (value: string) => {
    if (value === "C") {
      onClear();
    } else if (value === "⌫") {
      onDelete();
    } else {
      onNumberClick(value);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-xs mx-auto">
      {numbers.flat().map((num, index) => (
        <button
          key={index}
          onClick={() => handleClick(num)}
          className="aspect-square rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] active:bg-[#FFD700] active:text-[#121212] transition-all border border-[#2A2A2A] text-2xl font-semibold text-white"
        >
          {num === "⌫" ? <Delete className="w-6 h-6 mx-auto" /> : num}
        </button>
      ))}
    </div>
  );
}
