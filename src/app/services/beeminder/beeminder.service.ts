import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class BeeminderService {

    constructor(private http: HttpClient) {
    }

    fetchGoal(goal: string) {
        return this.http.get(`${environment.beeminderUrl}/users/me/goals/${goal}/datapoints.json?auth_token=${environment.beeminderAuthToken}`).pipe(map(goals => {

            return goals.map((el) => {
                return {
                    date: el.fulltext.match(new RegExp('[0-9]{4}-[A-z]{3}-[0-9]{2}'))[0],
                    value: el.value
                }
            });
        }));
    }

    fetchUser(): Observable<any> {
        return this.http.get(environment.beeminderUrl + `/users/me.json?auth_token=${environment.beeminderAuthToken}`);
    }
}
