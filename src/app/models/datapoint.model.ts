import {GoalDatapointInterface} from "../interfaces/goal-datapoint.interface";

export class DatapointModel implements GoalDatapointInterface {

    constructor(readonly date: string, readonly value: number) {
    }
}
