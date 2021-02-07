import {GoalInterface} from "../interfaces/goal.interface";
import {GoalDatapointInterface} from "../interfaces/goal-datapoint.interface";

export class GoalModel implements GoalInterface {

    constructor(readonly name: string, public datapoints: GoalDatapointInterface[], public dailyMin: number) {
    }
}