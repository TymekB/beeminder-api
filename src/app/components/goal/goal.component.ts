import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {GoalInterface} from "../../interfaces/goal.interface";
import {GoalDatapointInterface} from "../../interfaces/goal-datapoint.interface";

@Component({
    selector: 'app-goal',
    templateUrl: './goal.component.html',
    styleUrls: ['./goal.component.scss']
})
export class GoalComponent implements OnInit {

    @Input() goal: GoalInterface;
    todayDatapoint: GoalDatapointInterface[] = [];

    constructor() {

    }

    ngOnInit(): void {
        this.todayDatapoint = this.goal.datapoints.filter((datapoint: GoalDatapointInterface) => {
            return moment(datapoint.date).isSame(new Date(), "day");
        });
    }
}
