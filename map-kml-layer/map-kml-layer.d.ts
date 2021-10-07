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
 * Angular component that renders a Google Maps KML Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer
 */
export declare class MapKmlLayer implements OnInit, OnDestroy {
    private readonly _map;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _url;
    private readonly _destroyed;
    /**
     * The underlying google.maps.KmlLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer
     */
    kmlLayer?: google.maps.KmlLayer;
    set options(options: google.maps.KmlLayerOptions);
    set url(url: string);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.click
     */
    readonly kmlClick: Observable<google.maps.KmlMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/kml
     * #KmlLayer.defaultviewport_changed
     */
    readonly defaultviewportChanged: Observable<void>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.status_changed
     */
    readonly statusChanged: Observable<void>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getDefaultViewport
     */
    getDefaultViewport(): google.maps.LatLngBounds | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getMetadata
     */
    getMetadata(): google.maps.KmlLayerMetadata | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getStatus
     */
    getStatus(): google.maps.KmlLayerStatus;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getUrl
     */
    getUrl(): string;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getZIndex
     */
    getZIndex(): number;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForUrlChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapKmlLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapKmlLayer, "map-kml-layer", ["mapKmlLayer"], { "options": "options"; "url": "url"; }, { "kmlClick": "kmlClick"; "defaultviewportChanged": "defaultviewportChanged"; "statusChanged": "statusChanged"; }, never>;
}
