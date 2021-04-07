/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference path="marker-clusterer-types.d.ts" />
/// <reference types="googlemaps" />
import { AfterContentInit, NgZone, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapMarker } from '../map-marker/map-marker';
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export declare class MapMarkerClusterer implements OnInit, AfterContentInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private readonly _ngZone;
    private readonly _currentMarkers;
    private readonly _eventManager;
    private readonly _destroy;
    /** Whether the clusterer is allowed to be initialized. */
    private readonly _canInitialize;
    ariaLabelFn: AriaLabelFn;
    set averageCenter(averageCenter: boolean);
    private _averageCenter;
    batchSize?: number;
    set batchSizeIE(batchSizeIE: number);
    private _batchSizeIE;
    set calculator(calculator: Calculator);
    private _calculator;
    set clusterClass(clusterClass: string);
    private _clusterClass;
    set enableRetinaIcons(enableRetinaIcons: boolean);
    private _enableRetinaIcons;
    set gridSize(gridSize: number);
    private _gridSize;
    set ignoreHidden(ignoreHidden: boolean);
    private _ignoreHidden;
    set imageExtension(imageExtension: string);
    private _imageExtension;
    set imagePath(imagePath: string);
    private _imagePath;
    set imageSizes(imageSizes: number[]);
    private _imageSizes;
    set maxZoom(maxZoom: number);
    private _maxZoom;
    set minimumClusterSize(minimumClusterSize: number);
    private _minimumClusterSize;
    set styles(styles: ClusterIconStyle[]);
    private _styles;
    set title(title: string);
    private _title;
    set zIndex(zIndex: number);
    private _zIndex;
    set zoomOnClick(zoomOnClick: boolean);
    private _zoomOnClick;
    set options(options: MarkerClustererOptions);
    private _options;
    /**
     * See
     * googlemaps.github.io/v3-utility-library/modules/
     * _google_markerclustererplus.html#clusteringbegin
     */
    readonly clusteringbegin: Observable<void>;
    /**
     * See
     * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
     */
    readonly clusteringend: Observable<void>;
    /** Emits when a cluster has been clicked. */
    readonly clusterClick: Observable<Cluster>;
    _markers: QueryList<MapMarker>;
    /**
     * The underlying MarkerClusterer object.
     *
     * See
     * googlemaps.github.io/v3-utility-library/classes/
     * _google_markerclustererplus.markerclusterer.html
     */
    markerClusterer?: MarkerClusterer;
    constructor(_googleMap: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    fitMapToMarkers(padding: number | google.maps.Padding): void;
    getAverageCenter(): boolean;
    getBatchSizeIE(): number;
    getCalculator(): Calculator;
    getClusterClass(): string;
    getClusters(): Cluster[];
    getEnableRetinaIcons(): boolean;
    getGridSize(): number;
    getIgnoreHidden(): boolean;
    getImageExtension(): string;
    getImagePath(): string;
    getImageSizes(): number[];
    getMaxZoom(): number;
    getMinimumClusterSize(): number;
    getStyles(): ClusterIconStyle[];
    getTitle(): string;
    getTotalClusters(): number;
    getTotalMarkers(): number;
    getZIndex(): number;
    getZoomOnClick(): boolean;
    private _combineOptions;
    private _watchForMarkerChanges;
    private _getInternalMarkers;
    private _assertInitialized;
}
