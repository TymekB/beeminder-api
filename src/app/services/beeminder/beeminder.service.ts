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

    fetchGoalDailyMin(goal: string) {
        return this.http.get(`${environment.beeminderUrl}/users/me/goals/${goal}.json?auth_token=${environment.beeminderAuthToken}`).pipe(map((goal: { runits: string, rate: number }) => {

            let min = goal.rate;

            switch (goal.runits) {
                case 'w':
                    return min / 7;
                case 'm':
                    return min / 30;
                case 'y':
                    return min / 365;
            }

            return min;
        }));
    }

    fetchGoalDatapoints(goal: string, timeframe: string | null = null) {
        return this.http.get(`${environment.beeminderUrl}/users/me/goals/${goal}/datapoints.json?auth_token=${environment.beeminderAuthToken}`).pipe(map(goals => {

            if (!(goals instanceof Array)) return [];

            let goalsFormatted = goals.map((goal: BeeminderGoalInterface) => {
                // TODO: add goal model
                return {
                    date: goal.fulltext.match(new RegExp('[0-9]{4}-[A-z]{3}-[0-9]{2}'))[0],
                    value: goal.value
                }
            }).filter((v: GoalInterface) => {
                if (timeframe === 'day' || timeframe === 'month' || timeframe === 'year') {
                    return moment(v.date).isSame(new Date(), timeframe);
                }
                if (timeframe === 'week') {
                    return moment(v.date).isoWeek() == moment().isoWeek();
                }

                return true;
            });

            // makes datapoints array unique and sums the values

            const unique = goalsFormatted.map((goal: GoalInterface) => {

                let reduced = goalsFormatted.filter((v: GoalInterface) => v.date == goal.date)
                    .map((v: GoalInterface) => v.value)
                    .reduce((total, amount) => total + amount);

                return {date: goal.date, value: reduced};

            }).filter((value: GoalInterface, index) => goalsFormatted
                .map((v: GoalInterface) => v.date)
                .indexOf(value.date) == index);

            // sorts datapoints from oldest to latest

            if(timeframe === 'day') {
                return unique;
            }

            return unique.sort((a: GoalInterface, b: GoalInterface) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
        }));
    }

    fetchUser(): Observable<any> {
        return this.http.get(environment.beeminderUrl + `/users/me.json?auth_token=${environment.beeminderAuthToken}`);
    }
}
