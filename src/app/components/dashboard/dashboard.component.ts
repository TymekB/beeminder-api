import {Component, OnInit} from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";
import {GoalInterface} from "../../interfaces/goal-interface";
import {UserInterface} from "../../interfaces/user.interface";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    goals: GoalInterface[] = [];

    constructor(private beeminderService: BeeminderService) {
    }

    ngOnInit(): void {
        this.beeminderService.fetchUser().subscribe((user: UserInterface) => {
            user.goals.forEach((name) => {
                this.beeminderService.fetchGoal(name, "day").subscribe((goal: GoalInterface) => {
                    this.goals.push(goal);
                });
            });
        });
    }
}
