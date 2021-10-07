/// <reference types="google.maps" />
import { MapBaseLayer } from '../map-base-layer';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<MapTransitLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapTransitLayer, "map-transit-layer", ["mapTransitLayer"], {}, {}, never>;
}
