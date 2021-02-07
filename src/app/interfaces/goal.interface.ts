import {GoalDatapointInterface} from "./goal-datapoint.interface";

export interface GoalInterface {
     readonly datapoints: GoalDatapointInterface[];
     readonly dailyMin: number;
     readonly name: string;
}