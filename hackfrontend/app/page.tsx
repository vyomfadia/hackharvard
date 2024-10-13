/* eslint-disable react/display-name */
"use client";

import RealtimeSvg from "./svgs/realtime.svg";
import QuerySVG from "./svgs/query.svg";
import NotesSVG from "./svgs/notifications.svg";
import LogoutSVG from "./svgs/logout.svg";
import React, {
    createContext,
    memo,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {floodfill} from "@/lib/floodfill";
import {patients} from "@/lib/mockData";
import Image from "next/image";
import {Patient} from "@/lib/types";
import {TrendingUp, X} from "lucide-react";
import {CartesianGrid, Dot, Line, LineChart, XAxis} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import Radial from "./radial";
import Cube from "./three";

function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

const chartData = (seed) => {
    const days = ["Wed", "Thu", "Fri", "Sat", "Sun"];
    const chartData = [];

    days.forEach((day, index) => {
        const accuracy = Math.floor(seededRandom(seed + index) * 100); // random accuracy between 0 and 100
        const fill = "#00ffff"; // fixed fill color
        chartData.push({day, accuracy, fill});
    });

    return chartData;
};

const chartConfig = {
    Wed: {
        label: "Wednesday",
        color: "#00ffff",
    },
    Thu: {
        label: "Thursday",
        color: "#00ffff",
    },
    Fri: {
        label: "Friday",
        color: "#00ffff",
    },
    Sat: {
        label: "Saturday",
        color: "#00ffff",
    },
    Sun: {
        label: "Sunday",
        color: "#00ffff",
    },
} satisfies ChartConfig;

interface PatientContextValue {
    patient: Patient | null;
    setPatient: (patient: Patient) => void;
}

const PatientContext = createContext<PatientContextValue | undefined>(
    undefined
);

const MatrixCell = memo(({value}: { value: number }) => {
    return (
        <div className="flex justify-center w-5 h-5 text-[8px] relative">
            <div
                className={`transition-all duration-200 items-center w-full h-full rounded-full `}
                style={{
                    backgroundColor: `rgb(${Math.max(255 - value * 2, 150)}, ${Math.max(
                        255 - value * 2,
                        150
                    )}, 255)`,
                    scale: value / 50,
                }}
            ></div>
        </div>
    );
});

const Matrix = memo(({matrix}: { matrix: number[][] }) => (
    <div className="grid grid-rows-21 grid-flow-col">
        {matrix.map((sub, i) => (
            <React.Fragment key={i}>
                {sub.map((v, j) => (
                    <MatrixCell key={i * 21 + j} value={v}/>
                ))}
            </React.Fragment>
        ))}
    </div>
));

export default function Home() {
    const points = [
        {x: 50, y: 100},
        {x: 150, y: 200},
        {x: 250, y: 150},
        {x: 350, y: 250},
        {x: 450, y: 100},
    ];

    const sectionHeaderRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];
    const viewPointerRef = useRef<HTMLDivElement>(null);
    const scrollContainer = useRef<HTMLDivElement>(null);
    const [scrollDepth, setScrollDepth] = useState(0);
    const [currentView, setCurrentView] = useState(0);
    const [_patient, setPatient] = useState<Patient | null>(patients[0]);

    useLayoutEffect(() => {
        if (!viewPointerRef.current) return;
        for (let i = 0; i < 3; i++) {
            if (!sectionHeaderRefs[i].current) return;
        }

        const currentView = sectionHeaderRefs.filter((ref) => {
            if (!ref.current) return false;
            if (ref.current.getBoundingClientRect().bottom < 0) return true;
        }).length;

        setCurrentView(currentView);
    }, [scrollDepth]);

    const [matrixLeftFoot, setMatrixLeftFoot] = useState<number[][] | null>(Array.from({length: 8}, () => new Array(21).fill(0)));
    const [matrixRightFoot, setMatrixRightFoot] = useState<number[][] | null>(Array.from({length: 8}, () => new Array(21).fill(0)));

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const ws = useRef<WebSocket | null>(null);
    const dataPoint = useRef<Object | null>(null);

    useLayoutEffect(() => {
        const updateMatrix = async () => {
            await sleep(100);
            const data = []
            for (let i = 0; i < 8; i++) {
                data.push(new Array(21).fill(0));
            }

            const bindings = {
                "heel": [5, 18],
                "left": [2, 5],
                "right": [6, 11],
            }

            for (const [key, value] of Object.entries(dataPoint.current ?? {})) {
                const pos = bindings[key];
                floodfill(data, pos[0], pos[1], value * 10);
            }

            setMatrixLeftFoot(data);
            requestAnimationFrame(updateMatrix);
        };

        requestAnimationFrame(updateMatrix);
    }, []);

    return (
        <PatientContext.Provider value={{_patient, setPatient}}>
            <div className="flex justify-between">
                <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white"/>
                    <p className="text-white text-2xl">Diabeteasy</p>
                </div>
                <div className="flex gap-4 items-center">
                    <p className="text-white text-2xl font-light">Dr. Mathew</p>
                    <Image
                        width={40}
                        height={40}
                        src="/Dr.png"
                        alt="Dr. Mathew"
                        className="w-10 h-10 rounded-full"
                    />
                </div>
            </div>

            <div
                className="grid grid-cols-[60px_3fr_1fr] gap-10 flex-grow mx-auto w-full max-w-[1 280px] overflow-hidden ">
                <div className="h-full flex flex-col pt-12 justify-between">
                    <div className="rounded-full backdrop-blur-sm bg-white/5 h-fit relative">
                        <div
                            className="bg-white rounded-full w-[60px] h-[60px] absolute shadow-lg transition-all z-[-50] ease-in-out"
                            ref={viewPointerRef}
                            style={{top: currentView * 33.33 + "%"}}
                        />
                        <div
                            className="w-[60px] h-[60px] rounded-full flex justify-center items-center cursor-pointer"
                            onClick={() => {
                                scrollContainer.current?.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                        >
                            <RealtimeSvg fill={currentView != 0 ? "#fff" : "#2C7E85"}/>
                            >>>>>>> origin/Front-end
                        </div>

                        <div
                            className="w-[60px] h-[60px] shadow-sm rounded-full flex justify-center items-center cursor-pointer"
                            onClick={() => {
                                sectionHeaderRefs[1].current?.scrollIntoView();
                            }}
                        >
                            <QuerySVG fill={currentView != 1 ? "#fff" : "#2C7E85"}/>
                        </div>
                        <div
                            className="w-[60px] h-[60px] shadow-sm rounded-full flex justify-center items-center cursor-pointer"
                            onClick={() => {
                                sectionHeaderRefs[2].current?.scrollIntoView();
                            }}
                        >
                            <NotesSVG fill={currentView != 2 ? "#fff" : "#2C7E85"}/>
                        </div>
                    </div>
                    <div
                        className="rounded-full opacity-50 hover:opacity-25 backdrop-blur-sm bg-white/5 h-[60px] border border-white/40 flex justify-center items-center">
                        <LogoutSVG/>
                    </div>
                </div>
                <div
                    className="overflow-y-scroll pt-12 h-full no-scrollbar mask-top "
                    ref={scrollContainer}
                    onScroll={(e) => {
                        setScrollDepth(e.currentTarget.scrollTop);
                    }}
                >
                    <div
                        className="text-white text-4xl flex items-center mb-5 snap-start"
                        ref={sectionHeaderRefs[0]}
                    >
                        <div className="bg-red-600 mr-4 w-3 h-3 rounded-full blink"/>
                        Live Data
                    </div>
                    <div className="w-full flex backdrop-blur-sm bg-white/5 p-6 rounded-2xl shadow-lg mb-10 relative">
                                <span className=" absolute left-5 top-5 text-white/50 text-[24px] font-light">
                                L
                                </span>
                        <span className=" absolute right-5 top-5 text-white/50 text-[24px] font-light">
                                R
                                </span>
                        <div
                            className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient-2 rounded-2xl"/>
                        <div className="text-white text-xl font-light h-fit w-[80%] mx-auto flex justify-evenly">
                            <div
                                className="flex flex-row relative -scale-x-100"
                                style={{WebkitClipPath: "url('#left-foot')"}}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="1.827 0 176.614 500"
                                    width="192"
                                    height="384px"
                                    className="absolute top-0 left-0"
                                >
                                    <clipPath
                                        id="left-foot"
                                        transform="matrix(0.9, 0, 0, 0.8, 147.237444, 169.743747)"
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
                                {matrixLeftFoot && <Matrix matrix={matrixLeftFoot}/>}
                            </div>
                            <div
                                className="flex flex-row relative"
                                style={{WebkitClipPath: "url('#right-foot')"}}
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
                                        transform="matrix(0.9, 0, 0, 0.8, 147.237444, 169.743747)"
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
                                {matrixLeftFoot && <Matrix matrix={matrixLeftFoot}/>}
                            </div>
                        </div>
                    </div>
                    <div
                        className="text-white text-3xl flex items-center mb-5 gap-2 snap-start"
                        ref={sectionHeaderRefs[1]}
                    >
                        Recent Activity
                        <div className="flex-grow h-[1px] bg-white/40 rounded-r-full"/>
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] grid-rows-[300px_300px] gap-5 mb-10">
                        <div
                            className="w-full h-full backdrop-blur-sm bg-white/5 p-6 rounded-2xl shadow-lg relative col-span-1 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient-2 rounded-2xl"/>
                            <span className="text-white/80">Step Accuracy</span>

                            <ChartContainer config={chartConfig} className="w-full h-full">
                                <LineChart
                                    accessibilityLayer
                                    data={chartData(_patient?.recentData)}
                                    margin={{
                                        top: 40,
                                        bottom: 10,
                                        left: 20,
                                        right: 20,
                                    }}
                                >
                                    <XAxis dataKey="day" stroke="white" fill="white"/>
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                indicator="line"
                                                nameKey="accuracy"
                                                hideLabel
                                                hideIndicator
                                            />
                                        }
                                    />
                                    <Line
                                        dataKey="accuracy"
                                        type="natural"
                                        stroke="#00ffff"
                                        strokeWidth={1}
                                        dot={({payload, ...props}) => {
                                            return (
                                                <Dot
                                                    key={payload.day}
                                                    r={3}
                                                    cx={props.cx}
                                                    cy={props.cy}
                                                    fill={payload.fill}
                                                    stroke={"transparent"}
                                                />
                                            );
                                        }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </div>
                        <div
                            className="w-full h-full backdrop-blur-sm bg-white/5 p-6 rounded-2xl shadow-lg relative row-span-2 col-span-1">
                            <span className="text-white/80">Average Pressure Distribution</span>
                            <Cube/>
                        </div>
                        <div
                            className="w-full h-full backdrop-blur-sm bg-white/5 p-6 rounded-2xl shadow-lg relative col-span-1">
                            <div
                                className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient-2 rounded-2xl"/>
                            <span className="text-white/80">Daily Steps</span>
                            <Radial seed={_patient?.recentData}/>
                        </div>
                    </div>
                    <div
                        className="text-white text-3xl flex items-center mb-5 gap-2 snap-start"
                        ref={sectionHeaderRefs[2]}
                    >
                        Alerts
                        <div className="flex-grow h-[1px] bg-white/40 rounded-r-full"/>
                    </div>
                    <div className="flex flex-col gap-5">
                        {_patient?.alerts.map((alert, i) => (
                            <div
                                key={i}
                                className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm"
                            >
                                <div
                                    className="absolute top-0 left-0 w-full h-full border border-[#d0ffffa1] mask-gradient-2 rounded-2xl"/>

                                <div className="text-white text-sm flex justify-between mb-2">
                                    <p
                                        className={
                                            (alert.severity == "High"
                                                ? "border-red-600"
                                                : alert.severity == "Medium"
                                                    ? "border-amber-500"
                                                    : "border-cyan-500") + " border-2  px-2 rounded-full"
                                        }
                                    >
                                        {alert.severity + " Severity"}
                                    </p>
                                    <p>
                                        {alert.datetime.toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="text-white text-[16px]">
                                    {alert.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full h-full flex flex-col pt-12">
                    <div className="text-white text-4xl flex items-center mb-5 snap-start">
                        Patients
                    </div>
                    <div
                        className="w-full flex-grow backdrop-blur-sm bg-white/5 p-6  rounded-2xl shadow-lg relative flex flex-col gap-8">
                        <div
                            className="absolute top-0 left-0 w-full h-full pointer-events-none border border-[#d0ffffa1] mask-gradient rounded-2xl"/>
                        {patients.map((patient) => (
                            <div
                                onClick={() => setPatient(patient)}
                                className={
                                    "flex gap-6 items-center cursor-pointer transition-all " +
                                    (_patient == patient && "bg-white/5 rounded-full")
                                }
                                key={patient.name}
                            >
                                <Image
                                    className="rounded-full"
                                    width={50}
                                    height={50}
                                    src={patient.img}
                                    alt={patient.name}
                                />
                                <span className="text-white text-[16px]">{patient.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PatientContext.Provider>
    );
}
