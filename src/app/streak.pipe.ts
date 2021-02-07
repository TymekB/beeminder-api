import {Pipe, PipeTransform} from '@angular/core';
import {GoalInterface} from "./interfaces/goal.interface";
import * as moment from "moment";

@Pipe({name: 'streak'})
export class StreakPipe implements PipeTransform {
    transform(goal: GoalInterface): number {
        let streak = 0;
        if (goal.datapoints.length === 0) return streak;

        // if the difference between latest datapoint is greater than one return 0
        if (goal.datapoints.length < 2 || moment().diff(moment(goal.datapoints[0].date), "days") > 1) {
            const isToday = moment(goal.datapoints[0].date).isSame(new Date(), "days");

            return isToday && goal.datapoints[0].value >= goal.dailyMin ? ++streak : streak;
        }

        // checks goal.datapoints to have exactly one day difference between each other
        for (let i = 0; i < goal.datapoints.length - 1; i++) {
            const daysDifference = moment(goal.datapoints[i].date).diff(moment(goal.datapoints[i + 1].date), 'days');
            const isToday = moment(goal.datapoints[i].date).isSame(new Date(), "days");

            if (isToday && daysDifference === 1 && goal.datapoints[i].value < goal.dailyMin) continue;

            if (daysDifference > 1 || goal.datapoints[i].value < goal.dailyMin) {
                if (goal.datapoints[i].value >= goal.dailyMin) streak++;

                break;
            }

            streak++;
        }

        return streak;
    }
}