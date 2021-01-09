/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { OnDestroy, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
export declare class MapPolyline implements OnInit, OnDestroy {
    private readonly _map;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _path;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Polyline object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
     */
    polyline?: google.maps.Polyline;
    set options(options: google.maps.PolylineOptions);
    set path(path: google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
     */
    polylineClick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
     */
    polylineDblclick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
     */
    polylineDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
     */
    polylineDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
     */
    polylineDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
     */
    polylineMousedown: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
     */
    polylineMousemove: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
     */
    polylineMouseout: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
     */
    polylineMouseover: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
     */
    polylineMouseup: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
     */
    polylineRightclick: Observable<google.maps.PolyMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
     */
    getEditable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
     */
    getPath(): google.maps.MVCArray<google.maps.LatLng>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPathChanges;
    private _assertInitialized;
}
