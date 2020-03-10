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
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
export declare class MapPolygon implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _paths;
    private readonly _destroyed;
    _polygon: google.maps.Polygon;
    set options(options: google.maps.PolygonOptions);
    set paths(paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> | google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]);
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
     */
    polygonClick: Observable<google.maps.PolyMouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
     */
    polygonDblclick: Observable<google.maps.PolyMouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
     */
    polygonDrag: Observable<google.maps.MouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
     */
    polygonDragend: Observable<google.maps.MouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
     */
    polygonDragstart: Observable<google.maps.MouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
     */
    polygonMousedown: Observable<google.maps.PolyMouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
     */
    polygonMousemove: Observable<google.maps.PolyMouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
     */
    polygonMouseout: Observable<google.maps.PolyMouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
     */
    polygonMouseover: Observable<google.maps.PolyMouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
     */
    polygonMouseup: Observable<google.maps.PolyMouseEvent>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
     */
    polygonRightclick: Observable<google.maps.PolyMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
     */
    getDraggable(): boolean;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
     */
    getEditable(): boolean;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
     */
    getPath(): google.maps.MVCArray<google.maps.LatLng>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
     */
    getPaths(): google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPathChanges;
}
