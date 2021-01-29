import {DatapointInterface} from "../interfaces/datapoint.interface";

export class DatapointModel implements DatapointInterface {

    constructor(readonly date: string, readonly value: number) {
    }
}
