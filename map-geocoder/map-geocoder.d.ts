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
    static ɵfac: i0.ɵɵFactoryDeclaration<MapGeocoder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapGeocoder>;
}
