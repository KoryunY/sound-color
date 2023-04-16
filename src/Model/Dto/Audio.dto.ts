import { ObjectId, Types } from "mongoose";
import { IData } from "src/Defaults/types";

export interface AudioDto {
    name: string,
    user: ObjectId,
    data: Types.Array<IData>;
}