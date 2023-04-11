import { Optional } from "@nestjs/common";
import { ObjectId, Types } from "mongoose";
import { ConvertingType, IData } from "src/Defaults/types";

export interface AudioDto {
    name: string,
    user: ObjectId,
    data: Types.Array<IData>;
}