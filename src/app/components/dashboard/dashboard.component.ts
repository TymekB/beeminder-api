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
    loading: boolean = false;

    constructor(private beeminderService: BeeminderService) {
    }

    ngOnInit(): void {
        this.loading = true;
        this.beeminderService.fetchUser().subscribe(async (user: UserInterface) => {
            for await (const name of user.goals) {
                const goal = await this.beeminderService.fetchGoal(name).toPromise();
                this.goals.push(goal);
            }
            this.loading = false;

            // user.goals.forEach((name) => {
            //     this.beeminderService.fetchGoal(name).subscribe((goal: GoalInterface) => {
            //         this.goals.push(goal);
            //     });
            // });
        });
    }
}
