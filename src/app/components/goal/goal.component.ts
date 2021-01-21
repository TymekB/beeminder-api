import {Component, Input, OnInit} from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";

@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

    @Input() name = '';
    datapoints: any;
    dailyMin: number;

    constructor(private beeminderService: BeeminderService) {

    }

    ngOnInit(): void {
        this.beeminderService.fetchGoalDatapoints(this.name, "week").subscribe(response => {
            this.datapoints = response;
        });

        this.beeminderService.fetchGoalDailyMin(this.name).subscribe(res => {
            this.dailyMin = res;
        });
    }

}
