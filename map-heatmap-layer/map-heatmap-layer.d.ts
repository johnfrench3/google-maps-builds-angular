/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { OnDestroy, OnInit, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
/** Possible data that can be shown on a heatmap layer. */
export declare type HeatmapData = google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation | google.maps.LatLngLiteral> | (google.maps.LatLng | google.maps.visualization.WeightedLocation | google.maps.LatLngLiteral)[];
/**
 * Angular directive that renders a Google Maps heatmap via the Google Maps JavaScript API.
 *
 * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
 */
export declare class MapHeatmapLayer implements OnInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private _ngZone;
    /**
     * Data shown on the heatmap.
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    set data(data: HeatmapData);
    private _data;
    /**
     * Options used to configure the heatmap. See:
     * developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions
     */
    set options(options: Partial<google.maps.visualization.HeatmapLayerOptions>);
    private _options;
    /**
     * The underlying google.maps.visualization.HeatmapLayer object.
     *
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    heatmap?: google.maps.visualization.HeatmapLayer;
    constructor(_googleMap: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * Gets the data that is currently shown on the heatmap.
     * See: developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayer
     */
    getData(): HeatmapData;
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    private _combineOptions;
    /**
     * Most Google Maps APIs support both `LatLng` objects and `LatLngLiteral`. The latter is more
     * convenient to write out, because the Google Maps API doesn't have to have been loaded in order
     * to construct them. The `HeatmapLayer` appears to be an exception that only allows a `LatLng`
     * object, or it throws a runtime error. Since it's more convenient and we expect that Angular
     * users will load the API asynchronously, we allow them to pass in a `LatLngLiteral` and we
     * convert it to a `LatLng` object before passing it off to Google Maps.
     */
    private _normalizeData;
    /** Asserts that the heatmap object has been initialized. */
    private _assertInitialized;
}
