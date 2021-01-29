import {DatapointInterface} from "./datapoint.interface";

export interface GoalInterface {
     readonly datapoints: DatapointInterface[];
     readonly dailyMin: number;
     readonly name: string;
}