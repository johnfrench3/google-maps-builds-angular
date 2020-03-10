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
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 */
export declare const DEFAULT_MARKER_OPTIONS: {
    position: {
        lat: number;
        lng: number;
    };
};
/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/marker
 */
export declare class MapMarker implements OnInit, OnDestroy {
    private readonly _googleMap;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _title;
    private readonly _position;
    private readonly _label;
    private readonly _clickable;
    private readonly _destroy;
    set options(options: google.maps.MarkerOptions);
    set title(title: string);
    set position(position: google.maps.LatLngLiteral | google.maps.LatLng);
    set label(label: string | google.maps.MarkerLabel);
    set clickable(clickable: boolean);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
     */
    animationChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
     */
    mapClick: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
     */
    clickableChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
     */
    cursorChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
     */
    mapDblclick: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
     */
    mapDrag: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
     */
    mapDragend: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
     */
    draggableChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
     */
    mapDragstart: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
     */
    flatChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
     */
    iconChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
     */
    mapMousedown: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
     */
    mapMouseout: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
     */
    mapMouseover: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
     */
    mapMouseup: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
     */
    positionChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
     */
    mapRightclick: Observable<google.maps.MouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
     */
    shapeChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
     */
    titleChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
     */
    visibleChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
     */
    zindexChanged: Observable<void>;
    _marker?: google.maps.Marker;
    constructor(_googleMap: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
     */
    getAnimation(): google.maps.Animation | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
     */
    getClickable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
     */
    getCursor(): string | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
     */
    getIcon(): string | google.maps.Icon | google.maps.Symbol | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
     */
    getLabel(): google.maps.MarkerLabel | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
     */
    getOpacity(): number | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
     */
    getPosition(): google.maps.LatLng | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
     */
    getShape(): google.maps.MarkerShape | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
     */
    getTitle(): string | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
     */
    getVisible(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
     */
    getZIndex(): number | null;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForTitleChanges;
    private _watchForPositionChanges;
    private _watchForLabelChanges;
    private _watchForClickableChanges;
}
