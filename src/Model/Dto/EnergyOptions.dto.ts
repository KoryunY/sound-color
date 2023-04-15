import { Optional } from "@nestjs/common";
import { ObjectId } from "mongoose";
import { ConvertingType, Energy, Genre, Instrument } from "src/Defaults/types";

export interface EnergyOptionsDto {
    name: string,
    type: ConvertingType,
    user: ObjectId,
    useIntervals: false;
    intervalCount?: number | 128,
    energyLevel?: Energy;
    config?: string
}