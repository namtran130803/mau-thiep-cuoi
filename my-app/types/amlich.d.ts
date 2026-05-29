declare module "amlich" {
  export function convertSolar2Lunar(
    day: number,
    month: number,
    year: number,
    timeZone: number,
  ): [number, number, number, number];
}
