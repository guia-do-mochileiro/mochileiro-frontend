
export type NorthStateRuntime = {
  id: string;              
  name: string;
  abbreviation: string;
  center: { lng: number; lat: number };
  bounds: [[number, number],[number, number]];
};

export type NorthRuntime = Record<string, NorthStateRuntime>; 

