/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="googlemaps" />
import { MapBaseLayer } from '../map-base-layer';
/**
 * Angular component that renders a Google Maps Transit Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
 */
export declare class MapTransitLayer extends MapBaseLayer {
    /**
     * The underlying google.maps.TransitLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
     */
    transitLayer?: google.maps.TransitLayer;
    protected _initializeObject(): void;
    protected _setMap(): void;
    protected _unsetMap(): void;
    private _assertLayerInitialized;
}
