import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routes } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepperEditableComponent } from './components/stepper-editable/stepper-editable.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CombinationsTableComponent } from './components/combinations-table/combinations-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
    declarations: [
        AppComponent,
        NavigationComponent,

    ],
    providers: [provideRouter(routes)],
    bootstrap: [AppComponent],
    imports: [
        CombinationsTableComponent,
        StepperEditableComponent,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ToolbarComponent,
        BrowserAnimationsModule,
        LayoutModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatPaginatorModule,
        RouterOutlet,
        CommonModule,
        RouterLink,
        RouterLinkActive,
        MatIconModule,
    ]
})
export class AppModule { }
