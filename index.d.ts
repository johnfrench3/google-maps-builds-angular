/// <reference types="google.maps" />

import { AfterContentInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { QueryList } from '@angular/core';
import { SimpleChanges } from '@angular/core';

/**
 * Function type alias for determining the aria label on a Google Maps marker cluster.
 *
 * See googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#arialabelfn
 */
export declare type AriaLabelFn = (text: string) => string;

/**
 * Function type alias for calculating how a marker cluster is displayed.
 *
 * See googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#calculator
 */
export declare type Calculator = (markers: google.maps.Marker[], clusterIconStylesCount: number) => ClusterIconInfo;

/**
 * Cluster class from the @google/markerclustererplus library.
 *
 * See googlemaps.github.io/v3-utility-library/classes/_google_markerclustererplus.cluster.html
 */
declare class Cluster {
    constructor(markerClusterer: MarkerClusterer);
    getCenter(): google.maps.LatLng;
    getMarkers(): google.maps.Marker[];
    getSize(): number;
    updateIcon(): void;
}

/**
 * Info interface for a marker cluster icon.
 *
 * See
 * googlemaps.github.io/v3-utility-library/interfaces/
 * _google_markerclustererplus.clustericoninfo.html
 */
declare interface ClusterIconInfo {
    index: number;
    text: string;
    title: string;
}

/**
 * Style interface for a marker cluster icon.
 *
 * See
 * googlemaps.github.io/v3-utility-library/interfaces/
 * _google_markerclustererplus.clustericonstyle.html
 */
export declare interface ClusterIconStyle {
    anchorIcon?: [number, number];
    anchorText?: [number, number];
    backgroundPosition?: string;
    className?: string;
    fontFamily?: string;
    fontStyle?: string;
    fontWeight?: string;
    height: number;
    textColor?: string;
    textDecoration?: string;
    textLineHeight?: number;
    textSize?: number;
    url?: string;
    width: number;
}

/** Arbitrary default height for the map element */
declare const DEFAULT_HEIGHT = "500px";

/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 */
declare const DEFAULT_MARKER_OPTIONS: {
    position: {
        lat: number;
        lng: number;
    };
};

/** default options set to the Googleplex */
declare const DEFAULT_OPTIONS: google.maps.MapOptions;

/** Arbitrary default width for the map element */
declare const DEFAULT_WIDTH = "500px";

/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
export declare class GoogleMap implements OnChanges, OnInit, OnDestroy {
    private readonly _elementRef;
    private _ngZone;
    private _eventManager;
    private _mapEl;
    private _existingAuthFailureCallback;
    /**
     * The underlying google.maps.Map object
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#Map
     */
    googleMap?: google.maps.Map;
    /** Whether we're currently rendering inside a browser. */
    _isBrowser: boolean;
    /** Height of the map. Set this to `null` if you'd like to control the height through CSS. */
    height: string | number | null;
    /** Width of the map. Set this to `null` if you'd like to control the width through CSS. */
    width: string | number | null;
    /**
     * Type of map that should be rendered. E.g. hybrid map, terrain map etc.
     * See: https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
     */
    mapTypeId: google.maps.MapTypeId | undefined;
    set center(center: google.maps.LatLngLiteral | google.maps.LatLng);
    private _center;
    set zoom(zoom: number);
    private _zoom;
    set options(options: google.maps.MapOptions);
    private _options;
    /** Event emitted when the map is initialized. */
    readonly mapInitialized: EventEmitter<google.maps.Map>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/events#auth-errors
     */
    readonly authFailure: EventEmitter<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
     */
    readonly boundsChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
     */
    readonly centerChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
     */
    readonly mapClick: Observable<google.maps.MapMouseEvent | google.maps.IconMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
     */
    readonly mapDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
     */
    readonly mapDrag: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
     */
    readonly mapDragend: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
     */
    readonly mapDragstart: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
     */
    readonly headingChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
     */
    readonly idle: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
     */
    readonly maptypeidChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
     */
    readonly mapMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
     */
    readonly mapMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
     */
    readonly mapMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
     */
    readonly projectionChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
     */
    readonly mapRightclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
     */
    readonly tilesloaded: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
     */
    readonly tiltChanged: Observable<void>;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
     */
    readonly zoomChanged: Observable<void>;
    constructor(_elementRef: ElementRef, _ngZone: NgZone, platformId: Object);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     */
    fitBounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
     */
    panBy(x: number, y: number): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     */
    panTo(latLng: google.maps.LatLng | google.maps.LatLngLiteral): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
     */
    panToBounds(latLngBounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral, padding?: number | google.maps.Padding): void;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     */
    getCenter(): google.maps.LatLng | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     */
    getClickableIcons(): boolean | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     */
    getHeading(): number | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     */
    getMapTypeId(): google.maps.MapTypeId | string | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     */
    getProjection(): google.maps.Projection | null;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     */
    getStreetView(): google.maps.StreetViewPanorama;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     */
    getTilt(): number | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     */
    getZoom(): number | undefined;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
     */
    get controls(): google.maps.MVCArray<Node>[];
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
     */
    get data(): google.maps.Data;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
     */
    get mapTypes(): google.maps.MapTypeRegistry;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
     */
    get overlayMapTypes(): google.maps.MVCArray<google.maps.MapType>;
    private _setSize;
    /** Combines the center and zoom and the other map options into a single object */
    private _combineOptions;
    /** Asserts that the map has been initialized. */
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoogleMap, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GoogleMap, "google-map", ["googleMap"], { "height": "height"; "width": "width"; "mapTypeId": "mapTypeId"; "center": "center"; "zoom": "zoom"; "options": "options"; }, { "mapInitialized": "mapInitialized"; "authFailure": "authFailure"; "boundsChanged": "boundsChanged"; "centerChanged": "centerChanged"; "mapClick": "mapClick"; "mapDblclick": "mapDblclick"; "mapDrag": "mapDrag"; "mapDragend": "mapDragend"; "mapDragstart": "mapDragstart"; "headingChanged": "headingChanged"; "idle": "idle"; "maptypeidChanged": "maptypeidChanged"; "mapMousemove": "mapMousemove"; "mapMouseout": "mapMouseout"; "mapMouseover": "mapMouseover"; "projectionChanged": "projectionChanged"; "mapRightclick": "mapRightclick"; "tilesloaded": "tilesloaded"; "tiltChanged": "tiltChanged"; "zoomChanged": "zoomChanged"; }, never, ["*"], false, never>;
}

export declare class GoogleMapsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<GoogleMapsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<GoogleMapsModule, [typeof i1.GoogleMap, typeof i2.MapBaseLayer, typeof i3.MapBicyclingLayer, typeof i4.MapCircle, typeof i5.MapDirectionsRenderer, typeof i6.MapGroundOverlay, typeof i7.MapInfoWindow, typeof i8.MapKmlLayer, typeof i9.MapMarker, typeof i10.MapMarkerClusterer, typeof i11.MapPolygon, typeof i12.MapPolyline, typeof i13.MapRectangle, typeof i14.MapTrafficLayer, typeof i15.MapTransitLayer, typeof i16.MapHeatmapLayer], never, [typeof i1.GoogleMap, typeof i2.MapBaseLayer, typeof i3.MapBicyclingLayer, typeof i4.MapCircle, typeof i5.MapDirectionsRenderer, typeof i6.MapGroundOverlay, typeof i7.MapInfoWindow, typeof i8.MapKmlLayer, typeof i9.MapMarker, typeof i10.MapMarkerClusterer, typeof i11.MapPolygon, typeof i12.MapPolyline, typeof i13.MapRectangle, typeof i14.MapTrafficLayer, typeof i15.MapTransitLayer, typeof i16.MapHeatmapLayer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<GoogleMapsModule>;
}

/** Possible data that can be shown on a heatmap layer. */
export declare type HeatmapData = google.maps.MVCArray<google.maps.LatLng | google.maps.visualization.WeightedLocation | google.maps.LatLngLiteral> | (google.maps.LatLng | google.maps.visualization.WeightedLocation | google.maps.LatLngLiteral)[];

declare namespace i1 {
    export {
        DEFAULT_OPTIONS,
        DEFAULT_HEIGHT,
        DEFAULT_WIDTH,
        GoogleMap
    }
}

declare namespace i10 {
    export {
        MapMarkerClusterer
    }
}

declare namespace i11 {
    export {
        MapPolygon
    }
}

declare namespace i12 {
    export {
        MapPolyline
    }
}

declare namespace i13 {
    export {
        MapRectangle
    }
}

declare namespace i14 {
    export {
        MapTrafficLayer
    }
}

declare namespace i15 {
    export {
        MapTransitLayer
    }
}

declare namespace i16 {
    export {
        HeatmapData,
        MapHeatmapLayer
    }
}

declare namespace i2 {
    export {
        MapBaseLayer
    }
}

declare namespace i3 {
    export {
        MapBicyclingLayer
    }
}

declare namespace i4 {
    export {
        MapCircle
    }
}

declare namespace i5 {
    export {
        MapDirectionsRenderer
    }
}

declare namespace i6 {
    export {
        MapGroundOverlay
    }
}

declare namespace i7 {
    export {
        MapInfoWindow
    }
}

declare namespace i8 {
    export {
        MapKmlLayer
    }
}

declare namespace i9 {
    export {
        DEFAULT_MARKER_OPTIONS,
        MapMarker
    }
}


/// <reference types="google.maps" />
export declare interface MapAnchorPoint {
    getAnchor(): google.maps.MVCObject;
}

export declare class MapBaseLayer implements OnInit, OnDestroy {
    protected readonly _map: GoogleMap;
    protected readonly _ngZone: NgZone;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _assertInitialized;
    protected _initializeObject(): void;
    protected _setMap(): void;
    protected _unsetMap(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapBaseLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapBaseLayer, "map-base-layer", ["mapBaseLayer"], {}, {}, never, never, false, never>;
}

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
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapBicyclingLayer, "map-bicycling-layer", ["mapBicyclingLayer"], {}, {}, never, never, false, never>;
}

/**
 * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
 */
export declare class MapCircle implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _center;
    private readonly _radius;
    private readonly _destroyed;
    /**
     * Underlying google.maps.Circle object.
     *
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     */
    circle?: google.maps.Circle;
    set options(options: google.maps.CircleOptions);
    set center(center: google.maps.LatLng | google.maps.LatLngLiteral);
    set radius(radius: number);
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.center_changed
     */
    readonly centerChanged: Observable<void>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.click
     */
    readonly circleClick: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dblclick
     */
    readonly circleDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.drag
     */
    readonly circleDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragend
     */
    readonly circleDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragstart
     */
    readonly circleDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousedown
     */
    readonly circleMousedown: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousemove
     */
    readonly circleMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseout
     */
    readonly circleMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseover
     */
    readonly circleMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseup
     */
    readonly circleMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.radius_changed
     */
    readonly radiusChanged: Observable<void>;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.rightclick
     */
    readonly circleRightclick: Observable<google.maps.MapMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
     */
    getCenter(): google.maps.LatLng | null;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
     */
    getDraggable(): boolean;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
     */
    getEditable(): boolean;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getRadius
     */
    getRadius(): number;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForCenterChanges;
    private _watchForRadiusChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapCircle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapCircle, "map-circle", ["mapCircle"], { "options": "options"; "center": "center"; "radius": "radius"; }, { "centerChanged": "centerChanged"; "circleClick": "circleClick"; "circleDblclick": "circleDblclick"; "circleDrag": "circleDrag"; "circleDragend": "circleDragend"; "circleDragstart": "circleDragstart"; "circleMousedown": "circleMousedown"; "circleMousemove": "circleMousemove"; "circleMouseout": "circleMouseout"; "circleMouseover": "circleMouseover"; "circleMouseup": "circleMouseup"; "radiusChanged": "radiusChanged"; "circleRightclick": "circleRightclick"; }, never, never, false, never>;
}

/**
 * Angular component that renders a Google Maps Directions Renderer via the Google Maps
 * JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer
 */
export declare class MapDirectionsRenderer implements OnInit, OnChanges, OnDestroy {
    private readonly _googleMap;
    private _ngZone;
    private _eventManager;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions.directions
     */
    set directions(directions: google.maps.DirectionsResult);
    private _directions;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRendererOptions
     */
    set options(options: google.maps.DirectionsRendererOptions);
    private _options;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.directions_changed
     */
    readonly directionsChanged: Observable<void>;
    /** The underlying google.maps.DirectionsRenderer object. */
    directionsRenderer?: google.maps.DirectionsRenderer;
    constructor(_googleMap: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getDirections
     */
    getDirections(): google.maps.DirectionsResult | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getPanel
     */
    getPanel(): Node | null;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsRenderer.getRouteIndex
     */
    getRouteIndex(): number;
    private _combineOptions;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapDirectionsRenderer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapDirectionsRenderer, "map-directions-renderer", ["mapDirectionsRenderer"], { "directions": "directions"; "options": "options"; }, { "directionsChanged": "directionsChanged"; }, never, never, false, never>;
}

export declare interface MapDirectionsResponse {
    status: google.maps.DirectionsStatus;
    result?: google.maps.DirectionsResult;
}

/**
 * Angular service that wraps the Google Maps DirectionsService from the Google Maps JavaScript
 * API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsService
 */
export declare class MapDirectionsService {
    private readonly _ngZone;
    private _directionsService;
    constructor(_ngZone: NgZone);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/directions
     * #DirectionsService.route
     */
    route(request: google.maps.DirectionsRequest): Observable<MapDirectionsResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapDirectionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapDirectionsService>;
}

/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
export declare class MapEventManager {
    private _ngZone;
    /** Pending listeners that were added before the target was set. */
    private _pending;
    private _listeners;
    private _targetStream;
    /** Clears all currently-registered event listeners. */
    private _clearListeners;
    constructor(_ngZone: NgZone);
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    getLazyEmitter<T>(name: string): Observable<T>;
    /** Sets the current target that the manager should bind events to. */
    setTarget(target: MapEventManagerTarget): void;
    /** Destroys the manager and clears the event listeners. */
    destroy(): void;
}

declare type MapEventManagerTarget = {
    addListener: (name: string, callback: (...args: any[]) => void) => google.maps.MapsEventListener | undefined;
} | undefined;

/**
 * Angular service that wraps the Google Maps Geocoder from the Google Maps JavaScript API.
 * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder
 */
export declare class MapGeocoder {
    private readonly _ngZone;
    private _geocoder;
    constructor(_ngZone: NgZone);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder.geocode
     */
    geocode(request: google.maps.GeocoderRequest): Observable<MapGeocoderResponse>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapGeocoder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapGeocoder>;
}

export declare interface MapGeocoderResponse {
    status: google.maps.GeocoderStatus;
    results: google.maps.GeocoderResult[];
}

/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
export declare class MapGroundOverlay implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _opacity;
    private readonly _url;
    private readonly _bounds;
    private readonly _destroyed;
    /**
     * The underlying google.maps.GroundOverlay object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     */
    groundOverlay?: google.maps.GroundOverlay;
    /** URL of the image that will be shown in the overlay. */
    set url(url: string);
    /** Bounds for the overlay. */
    get bounds(): google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    set bounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral);
    /** Whether the overlay is clickable */
    clickable: boolean;
    /** Opacity of the overlay. */
    set opacity(opacity: number);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
     */
    readonly mapClick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.dblclick
     */
    readonly mapDblclick: Observable<google.maps.MapMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getOpacity
     */
    getOpacity(): number;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.getUrl
     */
    getUrl(): string;
    private _watchForOpacityChanges;
    private _watchForUrlChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapGroundOverlay, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapGroundOverlay, "map-ground-overlay", ["mapGroundOverlay"], { "url": "url"; "bounds": "bounds"; "clickable": "clickable"; "opacity": "opacity"; }, { "mapClick": "mapClick"; "mapDblclick": "mapDblclick"; }, never, never, false, never>;
}

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
    static ɵfac: i0.ɵɵFactoryDeclaration<MapHeatmapLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapHeatmapLayer, "map-heatmap-layer", ["mapHeatmapLayer"], { "data": "data"; "options": "options"; }, {}, never, never, false, never>;
}

/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
export declare class MapInfoWindow implements OnInit, OnDestroy {
    private readonly _googleMap;
    private _elementRef;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _position;
    private readonly _destroy;
    /**
     * Underlying google.maps.InfoWindow
     *
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     */
    infoWindow?: google.maps.InfoWindow;
    set options(options: google.maps.InfoWindowOptions);
    set position(position: google.maps.LatLngLiteral | google.maps.LatLng);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
     */
    readonly closeclick: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.content_changed
     */
    readonly contentChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
     */
    readonly domready: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.position_changed
     */
    readonly positionChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.zindex_changed
     */
    readonly zindexChanged: Observable<void>;
    constructor(_googleMap: GoogleMap, _elementRef: ElementRef<HTMLElement>, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
     */
    close(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     */
    getContent(): string | Node | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     */
    getPosition(): google.maps.LatLng | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     */
    getZIndex(): number;
    /**
     * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     */
    open(anchor?: MapAnchorPoint, shouldFocus?: boolean): void;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPositionChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapInfoWindow, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapInfoWindow, "map-info-window", ["mapInfoWindow"], { "options": "options"; "position": "position"; }, { "closeclick": "closeclick"; "contentChanged": "contentChanged"; "domready": "domready"; "positionChanged": "positionChanged"; "zindexChanged": "zindexChanged"; }, never, never, false, never>;
}

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
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapKmlLayer, "map-kml-layer", ["mapKmlLayer"], { "options": "options"; "url": "url"; }, { "kmlClick": "kmlClick"; "defaultviewportChanged": "defaultviewportChanged"; "statusChanged": "statusChanged"; }, never, never, false, never>;
}

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
    static ɵfac: i0.ɵɵFactoryDeclaration<MapMarker, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapMarker, "map-marker", ["mapMarker"], { "title": "title"; "position": "position"; "label": "label"; "clickable": "clickable"; "options": "options"; "icon": "icon"; "visible": "visible"; }, { "animationChanged": "animationChanged"; "mapClick": "mapClick"; "clickableChanged": "clickableChanged"; "cursorChanged": "cursorChanged"; "mapDblclick": "mapDblclick"; "mapDrag": "mapDrag"; "mapDragend": "mapDragend"; "draggableChanged": "draggableChanged"; "mapDragstart": "mapDragstart"; "flatChanged": "flatChanged"; "iconChanged": "iconChanged"; "mapMousedown": "mapMousedown"; "mapMouseout": "mapMouseout"; "mapMouseover": "mapMouseover"; "mapMouseup": "mapMouseup"; "positionChanged": "positionChanged"; "mapRightclick": "mapRightclick"; "shapeChanged": "shapeChanged"; "titleChanged": "titleChanged"; "visibleChanged": "visibleChanged"; "zindexChanged": "zindexChanged"; }, never, never, false, never>;
}

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
    static ɵfac: i0.ɵɵFactoryDeclaration<MapMarkerClusterer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MapMarkerClusterer, "map-marker-clusterer", ["mapMarkerClusterer"], { "ariaLabelFn": "ariaLabelFn"; "averageCenter": "averageCenter"; "batchSize": "batchSize"; "batchSizeIE": "batchSizeIE"; "calculator": "calculator"; "clusterClass": "clusterClass"; "enableRetinaIcons": "enableRetinaIcons"; "gridSize": "gridSize"; "ignoreHidden": "ignoreHidden"; "imageExtension": "imageExtension"; "imagePath": "imagePath"; "imageSizes": "imageSizes"; "maxZoom": "maxZoom"; "minimumClusterSize": "minimumClusterSize"; "styles": "styles"; "title": "title"; "zIndex": "zIndex"; "zoomOnClick": "zoomOnClick"; "options": "options"; }, { "clusteringbegin": "clusteringbegin"; "clusteringend": "clusteringend"; "clusterClick": "clusterClick"; }, ["_markers"], ["*"], false, never>;
}

/**
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
export declare class MapPolygon implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _paths;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Polygon object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
     */
    polygon?: google.maps.Polygon;
    set options(options: google.maps.PolygonOptions);
    set paths(paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>> | google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
     */
    readonly polygonClick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
     */
    readonly polygonDblclick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
     */
    readonly polygonDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
     */
    readonly polygonDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
     */
    readonly polygonDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
     */
    readonly polygonMousedown: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
     */
    readonly polygonMousemove: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
     */
    readonly polygonMouseout: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
     */
    readonly polygonMouseover: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
     */
    readonly polygonMouseup: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
     */
    readonly polygonRightclick: Observable<google.maps.PolyMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
     */
    getEditable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
     */
    getPath(): google.maps.MVCArray<google.maps.LatLng>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
     */
    getPaths(): google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPathChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapPolygon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapPolygon, "map-polygon", ["mapPolygon"], { "options": "options"; "paths": "paths"; }, { "polygonClick": "polygonClick"; "polygonDblclick": "polygonDblclick"; "polygonDrag": "polygonDrag"; "polygonDragend": "polygonDragend"; "polygonDragstart": "polygonDragstart"; "polygonMousedown": "polygonMousedown"; "polygonMousemove": "polygonMousemove"; "polygonMouseout": "polygonMouseout"; "polygonMouseover": "polygonMouseover"; "polygonMouseup": "polygonMouseup"; "polygonRightclick": "polygonRightclick"; }, never, never, false, never>;
}

/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
export declare class MapPolyline implements OnInit, OnDestroy {
    private readonly _map;
    private _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _path;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Polyline object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
     */
    polyline?: google.maps.Polyline;
    set options(options: google.maps.PolylineOptions);
    set path(path: google.maps.MVCArray<google.maps.LatLng> | google.maps.LatLng[] | google.maps.LatLngLiteral[]);
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
     */
    readonly polylineClick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
     */
    readonly polylineDblclick: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
     */
    readonly polylineDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
     */
    readonly polylineDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
     */
    readonly polylineDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
     */
    readonly polylineMousedown: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
     */
    readonly polylineMousemove: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
     */
    readonly polylineMouseout: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
     */
    readonly polylineMouseover: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
     */
    readonly polylineMouseup: Observable<google.maps.PolyMouseEvent>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
     */
    readonly polylineRightclick: Observable<google.maps.PolyMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
     */
    getEditable(): boolean;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
     */
    getPath(): google.maps.MVCArray<google.maps.LatLng>;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForPathChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapPolyline, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapPolyline, "map-polyline", ["mapPolyline"], { "options": "options"; "path": "path"; }, { "polylineClick": "polylineClick"; "polylineDblclick": "polylineDblclick"; "polylineDrag": "polylineDrag"; "polylineDragend": "polylineDragend"; "polylineDragstart": "polylineDragstart"; "polylineMousedown": "polylineMousedown"; "polylineMousemove": "polylineMousemove"; "polylineMouseout": "polylineMouseout"; "polylineMouseover": "polylineMouseover"; "polylineMouseup": "polylineMouseup"; "polylineRightclick": "polylineRightclick"; }, never, never, false, never>;
}

/**
 * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
 */
export declare class MapRectangle implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private _eventManager;
    private readonly _options;
    private readonly _bounds;
    private readonly _destroyed;
    /**
     * The underlying google.maps.Rectangle object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
     */
    rectangle?: google.maps.Rectangle;
    set options(options: google.maps.RectangleOptions);
    set bounds(bounds: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral);
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.boundsChanged
     */ readonly boundsChanged: Observable<void>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
     */
    readonly rectangleClick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
     */
    readonly rectangleDblclick: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
     */
    readonly rectangleDrag: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
     */
    readonly rectangleDragend: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
     */
    readonly rectangleDragstart: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
     */
    readonly rectangleMousedown: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
     */
    readonly rectangleMousemove: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
     */
    readonly rectangleMouseout: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
     */
    readonly rectangleMouseover: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
     */
    readonly rectangleMouseup: Observable<google.maps.MapMouseEvent>;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.rightclick
     */
    readonly rectangleRightclick: Observable<google.maps.MapMouseEvent>;
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
     */
    getBounds(): google.maps.LatLngBounds | null;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
     */
    getDraggable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
     */
    getEditable(): boolean;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
     */
    getVisible(): boolean;
    private _combineOptions;
    private _watchForOptionsChanges;
    private _watchForBoundsChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapRectangle, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapRectangle, "map-rectangle", ["mapRectangle"], { "options": "options"; "bounds": "bounds"; }, { "boundsChanged": "boundsChanged"; "rectangleClick": "rectangleClick"; "rectangleDblclick": "rectangleDblclick"; "rectangleDrag": "rectangleDrag"; "rectangleDragend": "rectangleDragend"; "rectangleDragstart": "rectangleDragstart"; "rectangleMousedown": "rectangleMousedown"; "rectangleMousemove": "rectangleMousemove"; "rectangleMouseout": "rectangleMouseout"; "rectangleMouseover": "rectangleMouseover"; "rectangleMouseup": "rectangleMouseup"; "rectangleRightclick": "rectangleRightclick"; }, never, never, false, never>;
}

/**
 * Angular component that renders a Google Maps Traffic Layer via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
 */
export declare class MapTrafficLayer implements OnInit, OnDestroy {
    private readonly _map;
    private readonly _ngZone;
    private readonly _autoRefresh;
    private readonly _destroyed;
    /**
     * The underlying google.maps.TrafficLayer object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
     */
    trafficLayer?: google.maps.TrafficLayer;
    /**
     * Whether the traffic layer refreshes with updated information automatically.
     */
    set autoRefresh(autoRefresh: boolean);
    constructor(_map: GoogleMap, _ngZone: NgZone);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _combineOptions;
    private _watchForAutoRefreshChanges;
    private _assertInitialized;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapTrafficLayer, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapTrafficLayer, "map-traffic-layer", ["mapTrafficLayer"], { "autoRefresh": "autoRefresh"; }, {}, never, never, false, never>;
}

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
    static ɵdir: i0.ɵɵDirectiveDeclaration<MapTransitLayer, "map-transit-layer", ["mapTransitLayer"], {}, {}, never, never, false, never>;
}


/// <reference types="google.maps" />
/**
 * Class for clustering markers on a Google Map.
 *
 * See
 * googlemaps.github.io/v3-utility-library/classes/_google_markerclustererplus.markerclusterer.html
 */
declare class MarkerClusterer {
    constructor(map: google.maps.Map, markers?: google.maps.Marker[], options?: MarkerClustererOptions);
    ariaLabelFn: AriaLabelFn;
    static BATCH_SIZE: number;
    static BATCH_SIZE_IE: number;
    static IMAGE_EXTENSION: string;
    static IMAGE_PATH: string;
    static IMAGE_SIZES: number[];
    addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
    addMarker(marker: MarkerClusterer, nodraw: boolean): void;
    addMarkers(markers: google.maps.Marker[], nodraw?: boolean): void;
    bindTo(key: string, target: google.maps.MVCObject, targetKey: string, noNotify: boolean): void;
    changed(key: string): void;
    clearMarkers(): void;
    fitMapToMarkers(padding: number | google.maps.Padding): void;
    get(key: string): any;
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
    getMap(): google.maps.Map | google.maps.StreetViewPanorama;
    getMarkers(): google.maps.Marker[];
    getMaxZoom(): number;
    getMinimumClusterSize(): number;
    getPanes(): google.maps.MapPanes;
    getProjection(): google.maps.MapCanvasProjection;
    getStyles(): ClusterIconStyle[];
    getTitle(): string;
    getTotalClusters(): number;
    getTotalMarkers(): number;
    getZIndex(): number;
    getZoomOnClick(): boolean;
    notify(key: string): void;
    removeMarker(marker: google.maps.Marker, nodraw: boolean): boolean;
    removeMarkers(markers: google.maps.Marker[], nodraw?: boolean): boolean;
    repaint(): void;
    set(key: string, value: any): void;
    setAverageCenter(averageCenter: boolean): void;
    setBatchSizeIE(batchSizeIE: number): void;
    setCalculator(calculator: Calculator): void;
    setClusterClass(clusterClass: string): void;
    setEnableRetinaIcons(enableRetinaIcons: boolean): void;
    setGridSize(gridSize: number): void;
    setIgnoreHidden(ignoreHidden: boolean): void;
    setImageExtension(imageExtension: string): void;
    setImagePath(imagePath: string): void;
    setImageSizes(imageSizes: number[]): void;
    setMap(map: google.maps.Map | null): void;
    setMaxZoom(maxZoom: number): void;
    setMinimumClusterSize(minimumClusterSize: number): void;
    setStyles(styles: ClusterIconStyle[]): void;
    setTitle(title: string): void;
    setValues(values: any): void;
    setZIndex(zIndex: number): void;
    setZoomOnClick(zoomOnClick: boolean): void;
    setOptions(options: MarkerClustererOptions): void;
    unbind(key: string): void;
    unbindAll(): void;
    static CALCULATOR(markers: google.maps.Marker[], numStyles: number): ClusterIconInfo;
    static withDefaultStyle(overrides: ClusterIconStyle): ClusterIconStyle;
}

/**
 * Options for constructing a MarkerClusterer from the @google/markerclustererplus library.
 *
 * See
 * googlemaps.github.io/v3-utility-library/classes/
 * _google_markerclustererplus.markerclustereroptions.html
 */
export declare interface MarkerClustererOptions {
    ariaLabelFn?: AriaLabelFn;
    averageCenter?: boolean;
    batchSize?: number;
    batchSizeIE?: number;
    calculator?: Calculator;
    clusterClass?: string;
    enableRetinaIcons?: boolean;
    gridSize?: number;
    ignoreHidden?: boolean;
    imageExtension?: string;
    imagePath?: string;
    imageSizes?: number[];
    maxZoom?: number;
    minimumClusterSize?: number;
    styles?: ClusterIconStyle[];
    title?: string;
    zIndex?: number;
    zoomOnClick?: boolean;
}

export { }
