/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference path="marker-clusterer-types.d.ts" />
/// <reference types="googlemaps" />
import { AfterContentInit, NgZone, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleMap } from '../google-map/google-map';
import { MapMarker } from '../map-marker/map-marker';
/**
 * Angular component for implementing a Google Maps Marker Clusterer.
 *
 * See https://developers.google.com/maps/documentation/javascript/marker-clustering
 */
export declare class MapMarkerClusterer implements OnInit, AfterContentInit, OnDestroy {
    private readonly _googleMap;
    private readonly _ngZone;
    private readonly _ariaLabelFn;
    private readonly _averageCenter;
    private readonly _batchSizeIE;
    private readonly _calculator;
    private readonly _clusterClass;
    private readonly _enableRetinaIcons;
    private readonly _gridSize;
    private readonly _ignoreHidden;
    private readonly _imageExtension;
    private readonly _imagePath;
    private readonly _imageSizes;
    private readonly _maxZoom;
    private readonly _minimumClusterSize;
    private readonly _styles;
    private readonly _title;
    private readonly _zIndex;
    private readonly _zoomOnClick;
    private readonly _currentMarkers;
    private readonly _eventManager;
    private readonly _destroy;
    /** Whether the clusterer is allowed to be initialized. */
    private readonly _canInitialize;
    get ariaLabelFn(): AriaLabelFn;
    set ariaLabelFn(ariaLabelFn: AriaLabelFn);
    set averageCenter(averageCenter: boolean);
    batchSize?: number;
    set batchSizeIE(batchSizeIE: number);
    set calculator(calculator: Calculator);
    set clusterClass(clusterClass: string);
    set enableRetinaIcons(enableRetinaIcons: boolean);
    set gridSize(gridSize: number);
    set ignoreHidden(ignoreHidden: boolean);
    set imageExtension(imageExtension: string);
    set imagePath(imagePath: string);
    set imageSizes(imageSizes: number[]);
    set maxZoom(maxZoom: number);
    set minimumClusterSize(minimumClusterSize: number);
    set styles(styles: ClusterIconStyle[]);
    set title(title: string);
    set zIndex(zIndex: number);
    set zoomOnClick(zoomOnClick: boolean);
    /**
     * See
     * googlemaps.github.io/v3-utility-library/modules/
     * _google_markerclustererplus.html#clusteringbegin
     */
    clusteringbegin: Observable<void>;
    /**
     * See
     * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
     */
    clusteringend: Observable<void>;
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
    private _watchForAriaLabelFnChanges;
    private _watchForAverageCenterChanges;
    private _watchForBatchSizeIEChanges;
    private _watchForCalculatorChanges;
    private _watchForClusterClassChanges;
    private _watchForEnableRetinaIconsChanges;
    private _watchForGridSizeChanges;
    private _watchForIgnoreHiddenChanges;
    private _watchForImageExtensionChanges;
    private _watchForImagePathChanges;
    private _watchForImageSizesChanges;
    private _watchForMaxZoomChanges;
    private _watchForMinimumClusterSizeChanges;
    private _watchForStylesChanges;
    private _watchForTitleChanges;
    private _watchForZIndexChanges;
    private _watchForZoomOnClickChanges;
    private _watchForMarkerChanges;
    private _getInternalMarkers;
    private _assertInitialized;
}
