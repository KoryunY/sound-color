import { Injectable } from "@nestjs/common";
import * as wad from "web-audio-daw"

@Injectable()
export class WebApiService {
 test() {
    wad.default.audioContext()
 }
}