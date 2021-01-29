import {GoalInterface} from "../interfaces/goal-interface";
import {DatapointInterface} from "../interfaces/datapoint.interface";

export class GoalModel implements GoalInterface {

    constructor(readonly name: string, public datapoints: DatapointInterface[], public dailyMin: number) {
    }
}