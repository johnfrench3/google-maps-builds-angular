/// <reference types="google.maps" />
import { MapBaseLayer } from '../map-base-layer';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<MapBicyclingLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapBicyclingLayer, "map-bicycling-layer", ["mapBicyclingLayer"], {}, {}, never>;
}
