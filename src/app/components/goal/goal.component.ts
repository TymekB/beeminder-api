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
    dailyMin: number;
    streak: number;

    constructor(private beeminderService: BeeminderService) {

    }

    countStreak(datapoints, dailyMin) {

        let streak = 0;
        console.log(this.dailyMin);

        for (let i = 0; i < datapoints.length; i++) {
            const daysDifference = moment(datapoints[i].date).diff(moment(datapoints[i + 1].date), 'days');

            if (daysDifference > 1 && datapoints[i].value >= dailyMin) {
                return ++streak;
            }

            streak++;
        }

        return streak;
    }

    async ngOnInit(): Promise<void> {
        this.datapoints = await this.beeminderService.fetchGoalDatapoints(this.name).toPromise();
        this.dailyMin = await this.beeminderService.fetchGoalDailyMin(this.name).toPromise();

        this.streak = this.countStreak(this.datapoints, this.dailyMin);
    }

}
