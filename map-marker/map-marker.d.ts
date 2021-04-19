/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { OnDestroy, OnInit, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapAnchorPoint } from '../map-anchor-point';
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
 *
 * See developers.google.com/maps/documentation/javascript/reference/marker
 */
export declare class MapMarker implements OnInit, OnChanges, OnDestroy, MapAnchorPoint {
    private readonly _googleMap;
    private _ngZone;
    private _eventManager;
    /**
     * Title of the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.title
     */
    set title(title: string);
    private _title;
    /**
     * Position of the marker. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.position
     */
    set position(position: google.maps.LatLngLiteral | google.maps.LatLng);
    private _position;
    /**
     * Label for the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.label
     */
    set label(label: string | google.maps.MarkerLabel);
    private _label;
    /**
     * Whether the marker is clickable. See:
     * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.clickable
     */
    set clickable(clickable: boolean);
    private _clickable;
    /**
     * Options used to configure the marker.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
     */
    set options(options: google.maps.MarkerOptions);
    private _options;
    /**
     * Icon to be used for the marker.
     * See: https://developers.google.com/maps/documentation/javascript/reference/marker#Icon
     */
    set icon(icon: string | google.maps.Icon | google.maps.Symbol);
    private _icon;
    /**
     * Whether the marker is visible.
     * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.visible
     */
    set visible(value: boolean);
    private _visible;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
     */
    readonly animationChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
     */
    readonly mapClick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
     */
    readonly clickableChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
     */
    readonly cursorChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
     */
    readonly mapDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
     */
    readonly mapDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
     */
    readonly mapDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
     */
    readonly draggableChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
     */
    readonly mapDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
     */
    readonly flatChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
     */
    readonly iconChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
     */
    readonly mapMousedown: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
     */
    readonly mapMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
     */
    readonly mapMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
     */
    readonly mapMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
     */
    readonly positionChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
     */
    readonly mapRightclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
     */
    readonly shapeChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
     */
    readonly titleChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
     */
    readonly visibleChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
     */
    readonly zindexChanged: Observable<void>;
    /**
     * The underlying google.maps.Marker object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/marker#Marker
     */
    marker?: google.maps.Marker;
    constructor(_googleMap: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
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
    /** Gets the anchor point that can be used to attach other Google Maps objects. */
    getAnchor(): google.maps.MVCObject;
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    private _combineOptions;
    private _assertInitialized;
}
