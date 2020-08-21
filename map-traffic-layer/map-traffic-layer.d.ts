/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { NgZone, OnDestroy, OnInit } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
/**
 * Angular component that renders a Google Maps Traffic Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
 */
export declare class MapTrafficLayer implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private readonly _autoRefresh;
    private readonly _destroyed;
    /**
     * The underlying google.maps.TrafficLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
     */
    trafficLayer?: google.maps.TrafficLayer;
    /**
     * Whether the traffic layer refreshes with updated information automatically.
     */
    set autoRefresh(autoRefresh: boolean);
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _combineOptions;
    private _watchForAutoRefreshChanges;
    private _assertInitialized;
}
