import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BeeminderService {

    constructor(private http: HttpClient) {
    }

    fetchGoal(goal: string) {
        console.log('fetching ' + goal);
    }

    fetchUser(): Observable<any> {
        return this.http.get(environment.beeminderUrl + `/users/me.json?auth_token=${environment.beeminderAuthToken}`);
    }
}
