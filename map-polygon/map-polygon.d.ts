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
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
export declare class MapPolygon implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _paths;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Polygon object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
     */
    polygon?: google.maps.Polygon;
    set options(options: google.maps.PolygonOptions);
    set paths(paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> | google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
     */
    readonly polygonClick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
     */
    readonly polygonDblclick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
     */
    readonly polygonDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
     */
    readonly polygonDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
     */
    readonly polygonDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
     */
    readonly polygonMousedown: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
     */
    readonly polygonMousemove: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
     */
    readonly polygonMouseout: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
     */
    readonly polygonMouseover: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
     */
    readonly polygonMouseup: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
     */
    readonly polygonRightclick: Observable<google.maps.PolyMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
     */
    getEditable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
     */
    getPath(): google.maps.MVCArray<google.maps.LatLng>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
     */
    getPaths(): google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPathChanges;
    private _assertInitialized;
}
