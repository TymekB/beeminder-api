import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {BeeminderDatapointInterface} from "../../interfaces/beeminder-datapoint.interface";
import {GoalDatapointInterface} from "../../interfaces/goal-datapoint.interface";
import * as moment from "moment";
import {GoalInterface} from "../../interfaces/goal.interface";
import {BeeminderGoalInterface} from "../../interfaces/beeminder-goal.interface";
import {DatapointModel} from "../../models/datapoint.model";
import {GoalModel} from "../../models/goal.model";
import {UserInterface} from "../../interfaces/user.interface";

@Injectable({
    providedIn: 'root'
})
export class BeeminderService {

    constructor(private http: HttpClient) {
    }

    fetchGoalDailyMin(goal: string): Observable<number> {
        const url = `${environment.beeminderUrl}/users/me/goals/${goal}.json?auth_token=${environment.beeminderAuthToken}`;

        return this.http.get(url).pipe(map((goal: BeeminderGoalInterface) => {

            switch (goal.runits) {
                case 'w':
                    return goal.rate / 7;
                case 'm':
                    return goal.rate / 30;
                case 'y':
                    return goal.rate / 365;
                default:
                    return goal.rate
            }
        }));
    }

    fetchGoalDatapoints(goal: string, timeframe: string | null = null): Observable<GoalDatapointInterface[]> {
        const url = `${environment.beeminderUrl}/users/me/goals/${goal}/datapoints.json?auth_token=${environment.beeminderAuthToken}`;

        return this.http.get(url).pipe(map((goals: BeeminderDatapointInterface[]): DatapointModel[] => {

            let datapointsFormatted = goals.map<GoalDatapointInterface>((goal: BeeminderDatapointInterface) => {
                const date = goal.fulltext.match(new RegExp('[0-9]{4}-[A-z]{3}-[0-9]{2}'))[0];

                return new DatapointModel(date, goal.value);

            }).filter((v: GoalDatapointInterface) => {
                if (timeframe === 'day' || timeframe === 'month' || timeframe === 'year') {
                    return moment(v.date).isSame(new Date(), timeframe);
                }
                if (timeframe === 'week') {
                    return moment(v.date).isoWeek() == moment().isoWeek();
                }

                return true;
            });

            // makes datapoints array unique and sums the values

            const uniqueDatapoints = datapointsFormatted.map<GoalDatapointInterface>((goal: GoalDatapointInterface) => {

                let reduced = datapointsFormatted.filter((v: GoalDatapointInterface) => v.date == goal.date)
                    .map((v: GoalDatapointInterface) => v.value)
                    .reduce((total, amount) => total + amount);

                return new DatapointModel(goal.date, reduced);

            }).filter((value: GoalDatapointInterface, index) => datapointsFormatted
                .map((v: GoalDatapointInterface) => v.date)
                .indexOf(value.date) == index);

            // sorts datapoints from latest to oldest

            if (timeframe === 'day') {
                return uniqueDatapoints;
            }

            return uniqueDatapoints.sort((a: GoalDatapointInterface, b: GoalDatapointInterface) => {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
        }));
    }

    fetchGoal(name, timeframe = null): Observable<GoalInterface> {
        return this.fetchGoalDatapoints(name, timeframe).pipe(switchMap((datapoints: any) => {
            return this.fetchGoalDailyMin(name).pipe(map((dailyMin) => {
                return new GoalModel(name, datapoints, dailyMin);
            }));
        }));
    }

    fetchUser(): Observable<UserInterface> {
        const url = environment.beeminderUrl + `/users/me.json?auth_token=${environment.beeminderAuthToken}`;

        return this.http.get<UserInterface>(url);
    }
}
