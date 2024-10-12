"use client";

import {useEffect, useRef, useState} from "react";
import {floodfill} from "@/lib/floodfill";

export default function Home() {
    const [matrixLeftFoot, setMatrixLeftFoot] = useState<number[][] | null>(null);
    const [matrixRightFoot, setMatrixRightFoot] = useState<number[][] | null>(null);
    const flipper = useRef<bool>(false);

    const [baseV, setBaseV] = useState(0);

    useEffect(() => {
        setMatrixLeftFoot(() => {
            const data = []
            for (let i = 0; i < 8; i++) {
                data.push(new Array(16).fill(0));
            }

            return data;
        })

        function f() {
            setBaseV((prev) => {
                if (prev >= 25) flipper.current = true;
                if (prev <= 0) flipper.current = false;

                const newVal = prev + (flipper.current ? -1 : 1);
                setMatrixLeftFoot((prev) => {
                    const data = []
                    for (let i = 0; i < 8; i++) {
                        data.push(new Array(16).fill(0));
                    }

                    floodfill(data, 5, 5, newVal);
                    floodfill(data, 1, 15, newVal * 2);
                    return data;
                });

                return newVal;
            })

            setTimeout(() => f(), 100);
        }

        setTimeout(() => f(), 100);
    }, []);

    return (
        <div className="min-h-screen min-w-full flex justify-center items-center">
            <div
                className="flex min-h-[50vh] min-w-[50rem] border-[1px] border-gray-500 rounded-2xl justify-between p-2">
                {/* we need an 'led matrix' */}
                <div className="flex flex-row">
                    {
                        matrixLeftFoot?.map((sub, i) => {
                            return (
                                <div key={i} className="flex flex-col">
                                    {
                                        sub.map((v, j) => (
                                            <div key={i * 16 + j}
                                                 className="flex justify-center items-center w-12 h-12 border-[1px] border-gray-500" style={{backgroundColor: `rgb(${Math.max(255 - v * 2, 150)}, ${Math.max(255 - v * 2, 150)}, ${255})`}}>
                                                {v.toFixed(2)}
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        })
                    }
                </div>

                <div className="flex flex-row">
                    {
                        matrixRightFoot?.map((sub, i) => {
                            return (
                                <div key={i} className="flex flex-col">
                                    {
                                        sub.map((v, j) => (
                                            <div key={i * 16 + j}
                                                 className="flex justify-center items-center w-6 h-6 border-[1px] border-gray-500">
                                                {v}
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}
