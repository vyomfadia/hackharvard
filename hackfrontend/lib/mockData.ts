import { Patient } from "./types";

export const patients: Patient[] = [
  {
    name: "John Doe",
    age: 45,
    address: "123 Elm St, Springfield, IL",
    img: "/P1.jpg",
    alerts: [
      {
        datetime: new Date("2024-10-10T14:30:00Z"),
        description: "High blood sugar level",
        severity: "High",
      },
      {
        datetime: new Date("2024-09-25T10:00:00Z"),
        description: "Missed insulin dose",
        severity: "Medium",
      },
    ],
    recentData: 1,
  },
  {
    name: "Jane Smith",
    age: 32,
    address: "456 Oak Ave, Los Angeles, CA",
    img: "/P2.jpg",
    alerts: [
      {
        datetime: new Date("2024-10-05T09:15:00Z"),
        description: "Elevated glucose levels after meal",
        severity: "High",
      },
    ],
    recentData: 2,
  },
  {
    name: "Michael Johnson",
    age: 60,
    address: "789 Pine Rd, Miami, FL",
    img: "/P3.jpg",
    alerts: [
      {
        datetime: new Date("2024-10-12T07:45:00Z"),
        description: "Hypoglycemia detected",
        severity: "High",
      },
      {
        datetime: new Date("2024-09-20T15:30:00Z"),
        description: "Irregular blood sugar levels",
        severity: "Medium",
      },
      {
        datetime: new Date("2024-08-10T12:00:00Z"),
        description: "Fatigue related to low blood sugar",
        severity: "Low",
      },
    ],
    recentData: 3,
  },
];
