import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgxSpinnerModule} from "ngx-spinner";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {HttpClientModule} from '@angular/common/http';
import {GoalComponent} from './components/goal/goal.component';


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        GoalComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        NgxSpinnerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
