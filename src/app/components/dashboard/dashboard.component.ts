import { Component, OnInit } from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    goals = [];

    constructor(private beeminderService: BeeminderService) {
    }

    ngOnInit(): void {
        this.beeminderService.fetchUser().subscribe(response => {
            this.goals = response.goals
        });
    }

}
