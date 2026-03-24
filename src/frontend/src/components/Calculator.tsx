import { useCallback, useState } from "react";

interface CalculatorProps {
  darkMode?: boolean;
}

type ButtonType =
  | "number"
  | "operator"
  | "function"
  | "shift"
  | "equals"
  | "clear"
  | "special";

interface CalcButton {
  label: string;
  shiftLabel?: string;
  value: string;
  shiftValue?: string;
  type: ButtonType;
}

const BUTTONS: CalcButton[][] = [
  [
    { label: "SHIFT", value: "shift", type: "shift" },
    { label: "ALPHA", value: "alpha", type: "shift" },
    { label: "MODE", value: "mode", type: "function" },
    { label: "ON", value: "on", type: "clear" },
  ],
  [
    {
      label: "x\u207b\u00b9",
      shiftLabel: "x!",
      value: "inv",
      shiftValue: "fact",
      type: "function",
    },
    {
      label: "sin",
      shiftLabel: "sin\u207b\u00b9",
      value: "sin(",
      shiftValue: "asin(",
      type: "function",
    },
    {
      label: "cos",
      shiftLabel: "cos\u207b\u00b9",
      value: "cos(",
      shiftValue: "acos(",
      type: "function",
    },
    {
      label: "tan",
      shiftLabel: "tan\u207b\u00b9",
      value: "tan(",
      shiftValue: "atan(",
      type: "function",
    },
  ],
  [
    {
      label: "log",
      shiftLabel: "10\u02e3",
      value: "log(",
      shiftValue: "pow10(",
      type: "function",
    },
    {
      label: "ln",
      shiftLabel: "e\u02e3",
      value: "ln(",
      shiftValue: "exp(",
      type: "function",
    },
    {
      label: "\u221a",
      shiftLabel: "x\u00b2",
      value: "sqrt(",
      shiftValue: "sq(",
      type: "function",
    },
    {
      label: "x\u00b3",
      shiftLabel: "\u221b",
      value: "cube(",
      shiftValue: "cbrt(",
      type: "function",
    },
  ],
  [
    { label: "(", value: "(", type: "special" },
    { label: ")", value: ")", type: "special" },
    { label: "%", value: "%", type: "special" },
    { label: "DEL", value: "del", type: "clear" },
  ],
  [
    { label: "7", value: "7", type: "number" },
    { label: "8", value: "8", type: "number" },
    { label: "9", value: "9", type: "number" },
    { label: "AC", value: "ac", type: "clear" },
  ],
  [
    { label: "4", value: "4", type: "number" },
    { label: "5", value: "5", type: "number" },
    { label: "6", value: "6", type: "number" },
    { label: "\u00d7", value: "*", type: "operator" },
  ],
  [
    { label: "1", value: "1", type: "number" },
    { label: "2", value: "2", type: "number" },
    { label: "3", value: "3", type: "number" },
    { label: "\u00f7", value: "/", type: "operator" },
  ],
  [
    { label: "0", value: "0", type: "number" },
    { label: ".", value: ".", type: "number" },
    { label: "EXP", value: "e", type: "special" },
    { label: "+", value: "+", type: "operator" },
  ],
  [
    { label: "\u03c0", value: "pi", type: "special" },
    { label: "e", value: "euler", type: "special" },
    { label: "ANS", value: "ans", type: "special" },
    { label: "\u2212", value: "-", type: "operator" },
  ],
  [{ label: "=", value: "=", type: "equals" }],
];

function evaluateExpression(expr: string, ans: string): string {
  try {
    let e = expr
      .replace(/pi/g, String(Math.PI))
      .replace(/euler/g, String(Math.E))
      .replace(/ans/g, ans || "0")
      .replace(/ANS/g, ans || "0")
      .replace(/sqrt\(/g, "Math.sqrt(")
      .replace(/cbrt\(/g, "Math.cbrt(")
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/asin\(/g, "Math.asin(")
      .replace(/acos\(/g, "Math.acos(")
      .replace(/atan\(/g, "Math.atan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ln\(/g, "Math.log(")
      .replace(/exp\(/g, "Math.exp(")
      .replace(/pow10\(/g, "Math.pow(10,");

    // Handle sq( x^2
    e = e.replace(/sq\(([^)]+)\)/g, (_, n) => `Math.pow(${n},2)`);
    // Handle cube(
    e = e.replace(/cube\(([^)]+)\)/g, (_, n) => `Math.pow(${n},3)`);

    // Handle fact
    e = e.replace(/fact\((\d+)\)/g, (_, n) => {
      let num = Number.parseInt(n);
      let f = 1;
      for (let i = 2; i <= num; i++) f *= i;
      return String(f);
    });

    // Handle %
    e = e.replace(/(\d+(?:\.\d+)?)%/g, (_, n) => `(${n}/100)`);

    // biome-ignore lint/security/noGlobalEval: calculator requires dynamic expression eval
    const result = eval(e);
    if (typeof result !== "number" || !Number.isFinite(result)) return "Error";
    const s = Number.parseFloat(result.toPrecision(10)).toString();
    return s;
  } catch {
    return "Error";
  }
}

export default function Calculator({ darkMode }: CalculatorProps) {
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [ans, setAns] = useState("0");
  const [shifted, setShifted] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const handleButton = useCallback(
    (btn: CalcButton) => {
      const value = shifted && btn.shiftValue ? btn.shiftValue : btn.value;
      if (shifted && btn.shiftValue) setShifted(false);

      if (value === "shift") {
        setShifted((s) => !s);
        return;
      }
      if (value === "alpha" || value === "mode" || value === "on") {
        setExpression("");
        setDisplay("0");
        setShifted(false);
        setJustEvaluated(false);
        return;
      }
      if (value === "ac") {
        setExpression("");
        setDisplay("0");
        setShifted(false);
        setJustEvaluated(false);
        return;
      }
      if (value === "del") {
        if (justEvaluated) {
          setExpression("");
          setDisplay("0");
          setJustEvaluated(false);
          return;
        }
        setExpression((prev) => {
          const next = prev.slice(0, -1);
          setDisplay(next || "0");
          return next;
        });
        return;
      }
      if (value === "=") {
        const result = evaluateExpression(expression || display, ans);
        setAns(result === "Error" ? ans : result);
        setDisplay(result);
        setExpression("");
        setJustEvaluated(true);
        return;
      }

      let append = value;
      if (value === "pi") append = "\u03c0";
      else if (value === "euler") append = "e";
      else if (value === "ans") append = "ANS";
      else if (value === "inv") {
        setExpression((prev) => `1/(${prev || display})`);
        setDisplay(`1/(${expression || display})`);
        setJustEvaluated(false);
        return;
      } else if (value === "fact") {
        setExpression((prev) => `fact(${prev || display})`);
        setDisplay(`fact(${expression || display})`);
        setJustEvaluated(false);
        return;
      }

      if (justEvaluated) {
        if (["+", "-", "*", "/"].includes(value)) {
          setExpression(`ANS${value}`);
          setDisplay(`ANS${value}`);
        } else {
          setExpression(append);
          setDisplay(append);
        }
        setJustEvaluated(false);
        return;
      }

      setExpression((prev) => {
        const next = prev + append;
        setDisplay(next);
        return next;
      });
    },
    [shifted, expression, display, ans, justEvaluated],
  );

  const getButtonStyle = (btn: CalcButton, isShifted: boolean): string => {
    const base =
      "relative flex flex-col items-center justify-center rounded font-bold cursor-pointer select-none transition-all duration-75 active:scale-95 active:brightness-75 text-[11px] leading-tight";

    switch (btn.type) {
      case "equals":
        return `${base} bg-[#e05c00] text-white shadow-[0_2px_0_#8a3800] text-base font-extrabold`;
      case "operator":
        return `${base} bg-[#1a6bb5] text-white shadow-[0_2px_0_#0d3d6b]`;
      case "clear":
        if (btn.value === "ac")
          return `${base} bg-[#c0392b] text-white shadow-[0_2px_0_#7b241c]`;
        if (btn.value === "del")
          return `${base} bg-[#e67e22] text-white shadow-[0_2px_0_#a04000]`;
        return `${base} bg-[#2c3e50] text-white shadow-[0_2px_0_#1a252f]`;
      case "shift":
        if (btn.value === "shift")
          return `${base} ${
            isShifted
              ? "bg-[#f39c12] text-black"
              : "bg-[#f39c12] text-black opacity-90"
          } shadow-[0_2px_0_#8e6000]`;
        return `${base} bg-[#7f8c8d] text-white shadow-[0_2px_0_#555]`;
      case "function":
        return `${base} bg-[#2d2d2d] text-[#a8d8ff] shadow-[0_2px_0_#111]`;
      case "special":
        return `${base} bg-[#3a3a3a] text-[#ffd700] shadow-[0_2px_0_#222]`;
      default:
        return `${base} bg-[#4a4a4a] text-white shadow-[0_2px_0_#222]`;
    }
  };

  return (
    <div
      className={`rounded-2xl p-3 shadow-2xl border ${
        darkMode ? "border-gray-600" : "border-gray-700"
      }`}
      style={{
        background: "linear-gradient(160deg, #1c1c1c 0%, #2a2a2a 100%)",
        minWidth: 280,
        maxWidth: 320,
        fontFamily: "'JetBrains Mono', monospace",
      }}
      data-ocid="calculator.panel"
    >
      {/* Header branding */}
      <div className="text-center mb-2">
        <div className="text-[10px] text-gray-400 tracking-widest uppercase">
          CASIO
        </div>
        <div className="text-[11px] text-[#a8d8ff] font-bold tracking-wider">
          fx-991EX
        </div>
        <div className="text-[9px] text-gray-500">CLASSWIZ</div>
      </div>

      {/* Display */}
      <div
        className="rounded-lg mb-3 p-2 text-right overflow-hidden"
        style={{
          background: "#c8d8a0",
          border: "2px solid #8a9a60",
          minHeight: 56,
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.4)",
        }}
      >
        <div className="text-[9px] text-gray-600 min-h-[14px] truncate">
          {shifted ? "[SHIFT]" : "\u00a0"}
        </div>
        <div
          className="text-[#1a2800] font-bold tracking-wide overflow-x-auto whitespace-nowrap"
          style={{
            fontSize: display.length > 14 ? 11 : display.length > 10 ? 14 : 18,
          }}
        >
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-[5px]">
        {BUTTONS.map((row) => (
          <div
            key={row.map((b) => b.value).join("-")}
            className={`grid gap-[5px] ${
              row.length === 1 ? "grid-cols-1" : "grid-cols-4"
            }`}
          >
            {row.map((btn) => (
              <button
                type="button"
                key={btn.value}
                className={getButtonStyle(btn, shifted)}
                style={{ height: 38, fontSize: 11 }}
                onClick={() => handleButton(btn)}
                data-ocid={`calculator.${btn.value === "=" ? "equals" : btn.type}_button`}
              >
                {btn.shiftLabel && (
                  <span className="absolute top-[2px] left-0 right-0 text-center text-[8px] text-[#f39c12] leading-none">
                    {btn.shiftLabel}
                  </span>
                )}
                <span className={btn.shiftLabel ? "mt-2" : ""}>
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
