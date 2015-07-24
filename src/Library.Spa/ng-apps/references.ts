/// <reference path="../bower_components/dt-angular/angular.d.ts" /> 
/// <reference path="../bower_components/dt-angular/angular-route.d.ts" />
/// <reference path="../bower_components/dt-angular-ui-bootstrap/angular-ui-bootstrap.d.ts" /> 
/// <reference path="../definitions/dt-es6-promise.d.ts" />

declare module ng {
    export interface ILogProvider {
        debugEnabled(enabled: boolean);
    }
}