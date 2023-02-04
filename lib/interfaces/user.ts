import { ILocation } from "./common";

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    street: string;
    state: string;
    country: string;
    landmark: string;
    location: ILocation
}