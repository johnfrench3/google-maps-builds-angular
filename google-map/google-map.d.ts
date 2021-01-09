/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { ElementRef, OnChanges, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
/** default options set to the Googleplex */
export declare const DEFAULT_OPTIONS: google.maps.MapOptions;
/** Arbitrary default height for the map element */
export declare const DEFAULT_HEIGHT = "500px";
/** Arbitrary default width for the map element */
export declare const DEFAULT_WIDTH = "500px";
/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
export declare class GoogleMap implements OnChanges, OnInit, OnDestroy {
    private readonly _elementRef;
    private _ngZone;
    private _eventManager;
    private _googleMapChanges;
    private readonly _options;
    private readonly _center;
    private readonly _zoom;
    private readonly _destroy;
    private _mapEl;
    /**
     * The underlying google.maps.Map object
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#Map
     */
    googleMap?: google.maps.Map;
    /** Whether we're currently rendering inside a browser. */
    _isBrowser: boolean;
    /** Height of the map. Set this to `null` if you'd like to control the height through CSS. */
    height: string | number | null;
    /** Width of the map. Set this to `null` if you'd like to control the width through CSS. */
    width: string | number | null;
    /**
     * Type of map that should be rendered. E.g. hybrid map, terrain map etc.
     * See: https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
     */
    mapTypeId: google.maps.MapTypeId | undefined;
    set center(center: google.maps.LatLngLiteral | google.maps.LatLng);
    set zoom(zoom: number);
    set options(options: google.maps.MapOptions);
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
     */
    boundsChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
     */
    centerChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
     */
    mapClick: Observable<google.maps.MapMouseEvent | google.maps.IconMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
     */
    mapDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
     */
    mapDrag: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
     */
    mapDragend: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
     */
    mapDragstart: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
     */
    headingChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
     */
    idle: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
     */
    maptypeidChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
     */
    mapMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
     */
    mapMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
     */
    mapMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
     */
    projectionChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
     */
    mapRightclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
     */
    tilesloaded: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
     */
    tiltChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
     */
    zoomChanged: Observable<void>;
    constructor(_elementRef: ElementRef, _ngZone: NgZone, platformId: Object);
    ngOnChanges(): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     */
    fitBounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
     */
    panBy(x: number, y: number): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     */
    panTo(latLng: google.maps.LatLng | google.maps.LatLngLiteral): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
     */
    panToBounds(latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     */
    getCenter(): google.maps.LatLng;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     */
    getClickableIcons(): boolean;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     */
    getHeading(): number;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     */
    getMapTypeId(): google.maps.MapTypeId | string;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     */
    getProjection(): google.maps.Projection | null;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     */
    getStreetView(): google.maps.StreetViewPanorama;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     */
    getTilt(): number;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     */
    getZoom(): number;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
     */
    get controls(): google.maps.MVCArray<Node>[];
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
     */
    get data(): google.maps.Data;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
     */
    get mapTypes(): google.maps.MapTypeRegistry;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
     */
    get overlayMapTypes(): google.maps.MVCArray<google.maps.MapType>;
    private _setSize;
    /** Combines the center and zoom and the other map options into a single object */
    private _combineOptions;
    private _initializeMap;
    private _watchForOptionsChanges;
    private _watchForCenterChanges;
    private _watchForZoomChanges;
    /** Asserts that the map has been initialized. */
    private _assertInitialized;
}
