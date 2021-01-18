import {Component, Input, OnInit} from '@angular/core';
import {BeeminderService} from "../../services/beeminder/beeminder.service";

@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

    @Input() name = '';

    constructor(private beeminderService: BeeminderService) {
    }

    ngOnInit(): void {
        this.beeminderService.fetchGoal(this.name).subscribe(response => {
            console.log(response);
        });
    }

}
