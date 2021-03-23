/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
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
}
