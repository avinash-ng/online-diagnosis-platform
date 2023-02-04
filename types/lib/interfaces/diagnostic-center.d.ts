import { ILocation } from "./common";
export interface IDiagnosticCenter {
    _id?: string;
    name: string;
    tests: [string];
    technician: string;
    phone: string;
    street: string;
    state: string;
    country: string;
    landmark: string;
    location: ILocation;
}
