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
export interface MapGeocoderResponse {
    status: google.maps.GeocoderStatus;
    results: google.maps.GeocoderResult[];
}
/**
 * Angular service that wraps the Google Maps Geocoder from the Google Maps JavaScript API.
 * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder
 */
export declare class MapGeocoder {
    private readonly _ngZone;
    private _geocoder;
    constructor(_ngZone: NgZone);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder.geocode
     */
    geocode(request: google.maps.GeocoderRequest): Observable<MapGeocoderResponse>;
}
