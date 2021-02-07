import {Component, OnInit} from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";
import {GoalInterface} from "../../interfaces/goal.interface";
import {UserInterface} from "../../interfaces/user.interface";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    goals: GoalInterface[] = [];
    isLoading: boolean = false;

    constructor(private beeminderService: BeeminderService, private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.spinner.show();

        this.beeminderService.fetchUser().subscribe(async (user: UserInterface) => {
            for await (const name of user.goals) {
                const goal = await this.beeminderService.fetchGoal(name).toPromise();
                this.goals.push(goal);
            }
            this.isLoading = false;
            this.spinner.hide();
        });
    }
}
