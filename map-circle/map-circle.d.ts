/// <reference types="google.maps" />
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgZone, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import * as i0 from "@angular/core";
/**
 * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
 */
export declare class MapCircle implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _center;
    private readonly _radius;
    private readonly _destroyed;
    /**
     * Underlying google.maps.Circle object.
     *
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     */
    circle?: google.maps.Circle;
    set options(options: google.maps.CircleOptions);
    set center(center: google.maps.LatLng | google.maps.LatLngLiteral);
    set radius(radius: number);
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.center_changed
     */
    readonly centerChanged: Observable<void>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.click
     */
    readonly circleClick: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dblclick
     */
    readonly circleDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.drag
     */
    readonly circleDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragend
     */
    readonly circleDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragstart
     */
    readonly circleDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousedown
     */
    readonly circleMousedown: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousemove
     */
    readonly circleMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseout
     */
    readonly circleMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseover
     */
    readonly circleMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseup
     */
    readonly circleMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.radius_changed
     */
    readonly radiusChanged: Observable<void>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.rightclick
     */
    readonly circleRightclick: Observable<google.maps.MapMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
     */
    getCenter(): google.maps.LatLng | null;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
     */
    getDraggable(): boolean;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
     */
    getEditable(): boolean;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getRadius
     */
    getRadius(): number;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForCenterChanges;
    private _watchForRadiusChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapCircle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapCircle, "map-circle", ["mapCircle"], { "options": "options"; "center": "center"; "radius": "radius"; }, { "centerChanged": "centerChanged"; "circleClick": "circleClick"; "circleDblclick": "circleDblclick"; "circleDrag": "circleDrag"; "circleDragend": "circleDragend"; "circleDragstart": "circleDragstart"; "circleMousedown": "circleMousedown"; "circleMousemove": "circleMousemove"; "circleMouseout": "circleMouseout"; "circleMouseover": "circleMouseover"; "circleMouseup": "circleMouseup"; "radiusChanged": "radiusChanged"; "circleRightclick": "circleRightclick"; }, never>;
}
