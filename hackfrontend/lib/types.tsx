export interface Alert {
  datetime: Date;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface Patient {
  name: string;
  img: string;
  age: number;
  address: string;
  alerts: Alert[];
  recentData: number;
}
