/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { NgZone, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
export declare class MapGroundOverlay implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _opacity;
    private readonly _url;
    private readonly _bounds;
    private readonly _destroyed;
    /**
     * The underlying google.maps.GroundOverlay object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     */
    groundOverlay?: google.maps.GroundOverlay;
    /** URL of the image that will be shown in the overlay. */
    set url(url: string);
    /** Bounds for the overlay. */
    get bounds(): google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    set bounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral);
    /** Whether the overlay is clickable */
    clickable: boolean;
    /** Opacity of the overlay. */
    set opacity(opacity: number);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
     */
    mapClick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.dblclick
     */
    mapDblclick: Observable<google.maps.MapMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getBounds
     */
    getBounds(): google.maps.LatLngBounds;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getOpacity
     */
    getOpacity(): number;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getUrl
     */
    getUrl(): string;
    private _watchForOpacityChanges;
    private _watchForUrlChanges;
    private _assertInitialized;
}
