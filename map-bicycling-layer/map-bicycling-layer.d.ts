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
 * Angular component that renders a Google Maps Bicycling Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
 */
export declare class MapBicyclingLayer extends MapBaseLayer {
    /**
     * The underlying google.maps.BicyclingLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
     */
    bicyclingLayer?: google.maps.BicyclingLayer;
    protected _initializeObject(): void;
    protected _setMap(): void;
    protected _unsetMap(): void;
    private _assertLayerInitialized;
}
