/// <reference types="google.maps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export interface MapDirectionsResponse {
    status: google.maps.DirectionsStatus;
    result?: google.maps.DirectionsResult;
}
/**
 * Angular service that wraps the Google Maps DirectionsService from the Google Maps JavaScript
 * API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsService
 */
export declare class MapDirectionsService {
    private readonly _ngZone;
    private _directionsService;
    constructor(_ngZone: NgZone);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsService.route
     */
    route(request: google.maps.DirectionsRequest): Observable<MapDirectionsResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapDirectionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapDirectionsService>;
}
