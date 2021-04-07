/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
/**
 * Angular component that renders a Google Maps Directions Renderer via the Google Maps
 * JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer
 */
export declare class MapDirectionsRenderer implements OnInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private _ngZone;
    private _eventManager;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions.directions
     */
    set directions(directions: google.maps.DirectionsResult);
    private _directions;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions
     */
    set options(options: google.maps.DirectionsRendererOptions);
    private _options;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.directions_changed
     */
    readonly directionsChanged: Observable<void>;
    /** The underlying google.maps.DirectionsRenderer object. */
    directionsRenderer?: google.maps.DirectionsRenderer;
    constructor(_googleMap: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getDirections
     */
    getDirections(): google.maps.DirectionsResult;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getPanel
     */
    getPanel(): Node;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getRouteIndex
     */
    getRouteIndex(): number;
    private _combineOptions;
    private _assertInitialized;
}
