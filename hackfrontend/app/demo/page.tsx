/* eslint-disable react/display-name */
"use client";

import {
  useEffect,
  useRef,
  useState,
  memo,
  createContext,
  useContext,
} from "react";
import { floodfill } from "@/lib/floodfill";

// Create a context to manage the state of whether numbers are enabled
const NumberContext = createContext<{
  showNumbers: boolean;
  toggleNumbers: () => void;
}>({
  showNumbers: true,
  toggleNumbers: () => {},
});

// eslint-disable-next-line react/display-name
const MatrixCell = memo(({ value }: { value: number }) => {
  const { showNumbers } = useContext(NumberContext);
  return (
    <div className="flex justify-center w-6 h-6 text-[8px] relative">
      <div
        className={`transition-all duration-200 items-center w-full h-full rounded-full `}
        style={{
          backgroundColor: `rgb(${Math.max(255 - value * 2, 150)}, ${Math.max(255 - value * 2, 150)}, 255)`,
          scale: value / 50,
        }}
      ></div>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {showNumbers ? value.toFixed(2) : null}
      </span>
    </div>
  );
});

const Matrix = memo(({ matrix }: { matrix: number[][] }) => (
  <div className="grid grid-rows-21 grid-flow-col">
    {matrix.map((sub, i) => (
      <>
        {sub.map((v, j) => (
          <MatrixCell key={i * 21 + j} value={v} />
        ))}
      </>
    ))}
  </div>
));

export default function Home() {
  const [matrixLeftFoot, setMatrixLeftFoot] = useState<number[][] | null>(null);
  const flipper = useRef<boolean>(false);
  const [baseV, setBaseV] = useState(0);
  const [showNumbers, setShowNumbers] = useState(true);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const toggleNumbers = () => setShowNumbers((prev) => !prev);

  useEffect(() => {
    const initialMatrix = Array.from({ length: 8 }, () =>
      new Array(21).fill(0)
    );
    setMatrixLeftFoot(initialMatrix);

    const updateMatrix = async () => {
      await sleep(100);

      setBaseV((prev) => {
        if (prev >= 25) flipper.current = true;
        if (prev <= 0) flipper.current = false;

        const newVal = prev + (flipper.current ? -1 : 1);
        const newMatrix = Array.from({ length: 8 }, () =>
          new Array(21).fill(0)
        );

        floodfill(newMatrix, 2, 5, newVal * 1.6);
        floodfill(newMatrix, 4, 18, newVal );
        setMatrixLeftFoot(newMatrix);
        
        return newVal;
      });

      requestAnimationFrame(updateMatrix);
    };

    requestAnimationFrame(updateMatrix);
  }, []);

  return (
    <NumberContext.Provider value={{ showNumbers, toggleNumbers }}>
      <div className="min-h-screen min-w-full flex justify-center items-center">
        <div className="flex border-gray-500 rounded-2xl justify-between p-2">
          <div
            className="flex flex-row relative"
            style={{ WebkitClipPath: "url('#right-foot')" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="1.827 0 176.614 500"
              width="192"
              height="384px"
              className="absolute top-0 left-0"
            >
              <clipPath
                id="right-foot"
                transform="matrix(1.05, 0, 0, 1, 147.237444, 179.743747)"
              >
                <path
                  className="st0 fill-black"
                  d="M -93.233 174.082 L 13.601 184.973 C 13.601 197.938 13.601 210.386 13.601 223.351 C 13.601 238.39 13.083 253.949 6.86 267.951 C 1.674 280.398 -6.106 294.919 -16.478 303.735 C -28.925 314.107 -39.816 318.257 -53.818 317.22 C -84.935 314.107 -101.011 282.991 -105.161 254.986 C -110.864 221.907 -100.492 200.014 -93.233 174.082 Z"
                />
                <path
                  className="st0 fill-black"
                  d="M 36.939 14.87 C 35.902 45.985 32.272 69.843 26.048 100.439 C 21.9 120.147 15.676 138.817 14.12 159.043 C 14.12 160.08 14.12 161.117 14.12 162.155 L -89.083 151.782 C -89.083 150.745 -88.564 149.19 -88.564 148.152 C -84.416 103.552 -103.086 75.028 -120.718 35.613 C -142.5 -13.136 -138.87 -54.106 -129.016 -105.449 C -121.868 -126.712 -111.902 -153.161 -94.27 -166.644 C -84.935 -173.905 -73.525 -177.017 -61.597 -178.054 C -22.701 -181.685 4.785 -149.012 16.714 -114.783 C 32.272 -70.701 38.496 -32.325 36.939 14.87 Z"
                />
              </clipPath>
            </svg>
            {matrixLeftFoot && <Matrix matrix={matrixLeftFoot} />}
          </div>
        </div>
        <button
          onClick={toggleNumbers}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Toggle Numbers
        </button>
      </div>
    </NumberContext.Provider>
  );
}