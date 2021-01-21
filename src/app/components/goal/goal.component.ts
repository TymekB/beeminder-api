import {Component, Input, OnInit} from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";
import * as moment from 'moment';

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

    countStreak(datapoints) {
        let streak = 0;

        if (moment(datapoints[0].date).isSame(new Date(), "day")) {

            datapoints.forEach((datapoint, index) => {

                if (index < datapoints.length - 1) {

                    if (moment(datapoint.date).diff(moment(datapoints[index+1].date), 'days')) {
                        streak++;
                    }
                }
            });
        }

        return streak;
    }

    ngOnInit(): void {
        this.beeminderService.fetchGoalDatapoints(this.name).subscribe(response => {
            this.datapoints = response;
            console.log(this.name + " streak: " + this.countStreak(response));
        });

        this.beeminderService.fetchGoalDailyMin(this.name).subscribe(res => {
            this.dailyMin = res;
        });
    }

}
