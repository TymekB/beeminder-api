import {Component, Input, OnInit} from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";
import * as moment from 'moment';
import {GoalInterface} from "../../interfaces/goal-interface";
import {DatapointInterface} from "../../interfaces/datapoint.interface";

@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

    @Input() goal: GoalInterface;
    streak: number | null = null;
    todayDatapoint: DatapointInterface[] = [];

    constructor(private beeminderService: BeeminderService) {

    }

    ngOnInit(): void {
        this.streak = this.countStreak(this.goal.datapoints, this.goal.dailyMin);
        this.todayDatapoint = this.goal.datapoints.filter((datapoint: DatapointInterface) => {
            return moment(datapoint.date).isSame(new Date(), "day");
        });
    }

    countStreak(datapoints: DatapointInterface[], dailyMin: number): number {
        let streak = 0;

        // if the difference between latest datapoint is greater than one return 0

        if (datapoints.length === 0) return streak;

        if (datapoints.length < 2 || moment().diff(moment(datapoints[0].date), "days") > 1) {
            const isToday = moment(datapoints[0].date).isSame(new Date(), "days");

            return isToday && datapoints[0].value >= dailyMin ? ++streak : streak;
        }

        // checks datapoints to have exactly one day difference between each other

        for (let i = 0; i < datapoints.length-1; i++) {
            const daysDifference = moment(datapoints[i].date).diff(moment(datapoints[i + 1].date), 'days');
            const isToday = moment(datapoints[i].date).isSame(new Date(), "days");

            if (isToday && daysDifference === 1 && datapoints[i].value < dailyMin) continue;

            if (daysDifference > 1 || datapoints[i].value < dailyMin) {
                if (datapoints[i].value >= dailyMin) streak++;

                break;
            }

            streak++;
        }

        return streak;
    }
}
