import {Component, Input, OnInit} from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";
import * as moment from 'moment';
import {GoalInterface} from "../../interfaces/GoalInterface";

@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

    @Input() name = '';
    datapoints: any;
    todayDatapoints: any;
    dailyMin: number;
    streak: number | null = null;

    constructor(private beeminderService: BeeminderService) {

    }

    async ngOnInit(): Promise<void> {
        this.datapoints = await this.beeminderService.fetchGoalDatapoints(this.name).toPromise();
        this.todayDatapoints = await this.beeminderService.fetchGoalDatapoints(this.name, "day").toPromise();
        this.dailyMin = await this.beeminderService.fetchGoalDailyMin(this.name).toPromise();

        this.streak = this.countStreak(this.datapoints, this.dailyMin);

    }

    countStreak(datapoints, dailyMin) {
        let streak = 0;

        // if the difference between latest datapoint is greater than one return 0

        if (typeof datapoints[0] === 'undefined' || moment().diff(moment(datapoints[0].date), "days") > 1 || datapoints.length < 2) {
            return streak;
        }

        // checks datapoints to have exactly one day difference between each other

        for (let i = 0; i < datapoints.length; i++) {
            const daysDifference = moment(datapoints[i].date).diff(moment(datapoints[i + 1].date), 'days');
            const isToday = moment(datapoints[i].date).isSame(new Date(), "days");

            if(isToday && daysDifference === 1 && datapoints[i].value < dailyMin) continue;

            if (daysDifference > 1 || datapoints[i].value < dailyMin) {
                datapoints[i].value >= dailyMin ? streak++ : streak;
                break;
            }

            streak++;
        }

        return streak;
    }
}
