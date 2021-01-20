import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {BeeminderGoalInterface} from "../../interfaces/BeeminderGoalInterface";
import {GoalInterface} from "../../interfaces/GoalInterface";
import * as moment from "moment";

@Injectable({
    providedIn: 'root'
})
export class BeeminderService {

    constructor(private http: HttpClient) {
    }

    fetchGoal(goal: string, timeframe: string | null = null) {
        return this.http.get(`${environment.beeminderUrl}/users/me/goals/${goal}/datapoints.json?auth_token=${environment.beeminderAuthToken}`).pipe(map(goals => {

            if (!(goals instanceof Array)) return [];

            let goalsFormatted = goals.map((goal: BeeminderGoalInterface) => {
                return {
                    date: goal.fulltext.match(new RegExp('[0-9]{4}-[A-z]{3}-[0-9]{2}'))[0],
                    value: goal.value
                }
            }).filter((v: GoalInterface) => {

                // TODO: move this to pipe

                if (timeframe === null) return true;
                if (timeframe === 'day' || timeframe === 'month' || timeframe === 'year') {
                    return moment(v.date).isSame(new Date(), timeframe);
                }
                if (timeframe === 'week') {
                    return moment(v.date).isoWeek() == moment().isoWeek();
                }
                // TODO: add throwing exception
            });

            // makes datapoints array unique and sums the values

            return goalsFormatted.map((goal: GoalInterface) => {
                let reduced = goalsFormatted.filter((v: GoalInterface) => v.date == goal.date)
                    .map((v: GoalInterface) => v.value)
                    .reduce((total, amount) => total + amount);

                return {date: goal.date, value: reduced};
            }).filter((value: GoalInterface, index) => goalsFormatted
                .map((v: GoalInterface) => v.date)
                .indexOf(value.date) == index);
        }));
    }

    fetchUser(): Observable<any> {
        return this.http.get(environment.beeminderUrl + `/users/me.json?auth_token=${environment.beeminderAuthToken}`);
    }
}
