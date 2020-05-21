/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { ElementRef, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapAnchorPoint } from '../map-anchor-point';
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
export declare class MapInfoWindow implements OnInit, OnDestroy {
    private readonly _googleMap;
    private _elementRef;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _position;
    private readonly _destroy;
    /**
     * Underlying google.maps.InfoWindow
     *
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     */
    infoWindow?: google.maps.InfoWindow;
    set options(options: google.maps.InfoWindowOptions);
    set position(position: google.maps.LatLngLiteral | google.maps.LatLng);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
     */
    closeclick: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.content_changed
     */
    contentChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
     */
    domready: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.position_changed
     */
    positionChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.zindex_changed
     */
    zindexChanged: Observable<void>;
    constructor(_googleMap: GoogleMap, _elementRef: ElementRef<HTMLElement>, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
     */
    close(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     */
    getContent(): string | Node;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     */
    getPosition(): google.maps.LatLng | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     */
    getZIndex(): number;
    /**
     * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     */
    open(anchor?: MapAnchorPoint): void;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPositionChanges;
    private _assertInitialized;
}
