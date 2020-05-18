import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, NgZone, Optional, Inject, PLATFORM_ID, Input, Output, Directive, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { map, take, shareReplay, takeUntil } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-event-manager.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Manages event on a Google Maps object, ensuring that events are added only when necessary.
 */
class MapEventManager {
    /**
     * @param {?} _ngZone
     */
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /**
         * Pending listeners that were added before the target was set.
         */
        this._pending = [];
        this._listeners = [];
    }
    /**
     * Clears all currently-registered event listeners.
     * @private
     * @return {?}
     */
    _clearListeners() {
        for (let listener of this._listeners) {
            listener.remove();
        }
        this._listeners = [];
    }
    /**
     * Gets an observable that adds an event listener to the map when a consumer subscribes to it.
     * @template T
     * @param {?} name
     * @return {?}
     */
    getLazyEmitter(name) {
        /** @type {?} */
        const observable = new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            // If the target hasn't been initialized yet, cache the observer so it can be added later.
            if (!this._target) {
                this._pending.push({ observable, observer });
                return undefined;
            }
            /** @type {?} */
            const listener = this._target.addListener(name, (/**
             * @param {?} event
             * @return {?}
             */
            (event) => {
                this._ngZone.run((/**
                 * @return {?}
                 */
                () => observer.next(event)));
            }));
            this._listeners.push(listener);
            return (/**
             * @return {?}
             */
            () => listener.remove());
        }));
        return observable;
    }
    /**
     * Sets the current target that the manager should bind events to.
     * @param {?} target
     * @return {?}
     */
    setTarget(target) {
        if (target === this._target) {
            return;
        }
        // Clear the listeners from the pre-existing target.
        if (this._target) {
            this._clearListeners();
            this._pending = [];
        }
        this._target = target;
        // Add the listeners that were bound before the map was initialized.
        this._pending.forEach((/**
         * @param {?} subscriber
         * @return {?}
         */
        subscriber => subscriber.observable.subscribe(subscriber.observer)));
        this._pending = [];
    }
    /**
     * Destroys the manager and clears the event listeners.
     * @return {?}
     */
    destroy() {
        this._clearListeners();
        this._pending = [];
        this._target = undefined;
    }
}
if (false) {
    /**
     * Pending listeners that were added before the target was set.
     * @type {?}
     * @private
     */
    MapEventManager.prototype._pending;
    /**
     * @type {?}
     * @private
     */
    MapEventManager.prototype._listeners;
    /**
     * @type {?}
     * @private
     */
    MapEventManager.prototype._target;
    /**
     * @type {?}
     * @private
     */
    MapEventManager.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/google-map/google-map.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
function GoogleMapsWindow() { }
if (false) {
    /** @type {?|undefined} */
    GoogleMapsWindow.prototype.google;
}
/**
 * default options set to the Googleplex
 * @type {?}
 */
const DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17
};
/**
 * Arbitrary default height for the map element
 * @type {?}
 */
const DEFAULT_HEIGHT = '500px';
/**
 * Arbitrary default width for the map element
 * @type {?}
 */
const DEFAULT_WIDTH = '500px';
/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
let GoogleMap = /** @class */ (() => {
    /**
     * Angular component that renders a Google Map via the Google Maps JavaScript
     * API.
     * @see https://developers.google.com/maps/documentation/javascript/reference/
     */
    class GoogleMap {
        /**
         * @param {?} _elementRef
         * @param {?} _ngZone
         * @param {?=} platformId
         */
        constructor(_elementRef, _ngZone, 
        /**
         * @deprecated `platformId` parameter to become required.
         * @breaking-change 10.0.0
         */
        platformId) {
            this._elementRef = _elementRef;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject(DEFAULT_OPTIONS);
            this._center = new BehaviorSubject(undefined);
            this._zoom = new BehaviorSubject(undefined);
            this._destroy = new Subject();
            /**
             * Height of the map.
             */
            this.height = DEFAULT_HEIGHT;
            /**
             * Width of the map.
             */
            this.width = DEFAULT_WIDTH;
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
             */
            this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
             */
            this.centerChanged = this._eventManager.getLazyEmitter('center_changed');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
             */
            this.mapClick = this._eventManager.getLazyEmitter('click');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
             */
            this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
             */
            this.mapDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
             */
            this.mapDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
             */
            this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
             */
            this.headingChanged = this._eventManager.getLazyEmitter('heading_changed');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
             */
            this.idle = this._eventManager.getLazyEmitter('idle');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
             */
            this.maptypeidChanged = this._eventManager.getLazyEmitter('maptypeid_changed');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
             */
            this.mapMousemove = this._eventManager.getLazyEmitter('mousemove');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
             */
            this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
             */
            this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
             */
            this.projectionChanged = this._eventManager.getLazyEmitter('projection_changed');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
             */
            this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
             */
            this.tilesloaded = this._eventManager.getLazyEmitter('tilesloaded');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
             */
            this.tiltChanged = this._eventManager.getLazyEmitter('tilt_changed');
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
             */
            this.zoomChanged = this._eventManager.getLazyEmitter('zoom_changed');
            // @breaking-change 10.0.0 Remove null check for `platformId`.
            this._isBrowser =
                platformId ? isPlatformBrowser(platformId) : typeof window === 'object' && !!window;
            if (this._isBrowser) {
                /** @type {?} */
                const googleMapsWindow = window;
                if (!googleMapsWindow.google) {
                    throw Error('Namespace google not found, cannot construct embedded google ' +
                        'map. Please install the Google Maps JavaScript API: ' +
                        'https://developers.google.com/maps/documentation/javascript/' +
                        'tutorial#Loading_the_Maps_API');
                }
            }
        }
        /**
         * @param {?} center
         * @return {?}
         */
        set center(center) {
            this._center.next(center);
        }
        /**
         * @param {?} zoom
         * @return {?}
         */
        set zoom(zoom) {
            this._zoom.next(zoom);
        }
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || DEFAULT_OPTIONS);
        }
        /**
         * @return {?}
         */
        ngOnChanges() {
            this._setSize();
            if (this.googleMap && this.mapTypeId) {
                this.googleMap.setMapTypeId(this.mapTypeId);
            }
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            // It should be a noop during server-side rendering.
            if (this._isBrowser) {
                this._mapEl = (/** @type {?} */ (this._elementRef.nativeElement.querySelector('.map-container')));
                this._setSize();
                this._googleMapChanges = this._initializeMap(this._combineOptions());
                this._googleMapChanges.subscribe((/**
                 * @param {?} googleMap
                 * @return {?}
                 */
                (googleMap) => {
                    this.googleMap = googleMap;
                    this._eventManager.setTarget(this.googleMap);
                }));
                this._watchForOptionsChanges();
                this._watchForCenterChanges();
                this._watchForZoomChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroy.next();
            this._destroy.complete();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
         * @param {?} bounds
         * @param {?=} padding
         * @return {?}
         */
        fitBounds(bounds, padding) {
            this._assertInitialized();
            this.googleMap.fitBounds(bounds, padding);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
         * @param {?} x
         * @param {?} y
         * @return {?}
         */
        panBy(x, y) {
            this._assertInitialized();
            this.googleMap.panBy(x, y);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
         * @param {?} latLng
         * @return {?}
         */
        panTo(latLng) {
            this._assertInitialized();
            this.googleMap.panTo(latLng);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
         * @param {?} latLngBounds
         * @param {?=} padding
         * @return {?}
         */
        panToBounds(latLngBounds, padding) {
            this._assertInitialized();
            this.googleMap.panToBounds(latLngBounds, padding);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
         * @return {?}
         */
        getBounds() {
            this._assertInitialized();
            return this.googleMap.getBounds() || null;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
         * @return {?}
         */
        getCenter() {
            this._assertInitialized();
            return this.googleMap.getCenter();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
         * @return {?}
         */
        getClickableIcons() {
            this._assertInitialized();
            return this.googleMap.getClickableIcons();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
         * @return {?}
         */
        getHeading() {
            this._assertInitialized();
            return this.googleMap.getHeading();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
         * @return {?}
         */
        getMapTypeId() {
            this._assertInitialized();
            return this.googleMap.getMapTypeId();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
         * @return {?}
         */
        getProjection() {
            this._assertInitialized();
            return this.googleMap.getProjection();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
         * @return {?}
         */
        getStreetView() {
            this._assertInitialized();
            return this.googleMap.getStreetView();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
         * @return {?}
         */
        getTilt() {
            this._assertInitialized();
            return this.googleMap.getTilt();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
         * @return {?}
         */
        getZoom() {
            this._assertInitialized();
            return this.googleMap.getZoom();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
         * @return {?}
         */
        get controls() {
            this._assertInitialized();
            return this.googleMap.controls;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
         * @return {?}
         */
        get data() {
            this._assertInitialized();
            return this.googleMap.data;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
         * @return {?}
         */
        get mapTypes() {
            this._assertInitialized();
            return this.googleMap.mapTypes;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
         * @return {?}
         */
        get overlayMapTypes() {
            this._assertInitialized();
            return this.googleMap.overlayMapTypes;
        }
        /**
         * @private
         * @return {?}
         */
        _setSize() {
            if (this._mapEl) {
                /** @type {?} */
                const styles = this._mapEl.style;
                styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
                styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
            }
        }
        /**
         * Combines the center and zoom and the other map options into a single object
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._center, this._zoom])
                .pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, center, zoom]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, zoom: zoom !== undefined ? zoom : options.zoom, mapTypeId: this.mapTypeId });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @param {?} optionsChanges
         * @return {?}
         */
        _initializeMap(optionsChanges) {
            return optionsChanges.pipe(take(1), map((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                return this._ngZone.runOutsideAngular((/**
                 * @return {?}
                 */
                () => new google.maps.Map(this._mapEl, options)));
            })), shareReplay(1));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            combineLatest([this._googleMapChanges, this._options])
                .pipe(takeUntil(this._destroy))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ([googleMap, options]) => {
                googleMap.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForCenterChanges() {
            combineLatest([this._googleMapChanges, this._center])
                .pipe(takeUntil(this._destroy))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ([googleMap, center]) => {
                if (center) {
                    googleMap.setCenter(center);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForZoomChanges() {
            combineLatest([this._googleMapChanges, this._zoom])
                .pipe(takeUntil(this._destroy))
                .subscribe((/**
             * @param {?} __0
             * @return {?}
             */
            ([googleMap, zoom]) => {
                if (zoom !== undefined) {
                    googleMap.setZoom(zoom);
                }
            }));
        }
        /**
         * Asserts that the map has been initialized.
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
        }
    }
    GoogleMap.decorators = [
        { type: Component, args: [{
                    selector: 'google-map',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<div class="map-container"></div><ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    GoogleMap.ctorParameters = () => [
        { type: ElementRef },
        { type: NgZone },
        { type: Object, decorators: [{ type: Optional }, { type: Inject, args: [PLATFORM_ID,] }] }
    ];
    GoogleMap.propDecorators = {
        height: [{ type: Input }],
        width: [{ type: Input }],
        mapTypeId: [{ type: Input }],
        center: [{ type: Input }],
        zoom: [{ type: Input }],
        options: [{ type: Input }],
        boundsChanged: [{ type: Output }],
        centerChanged: [{ type: Output }],
        mapClick: [{ type: Output }],
        mapDblclick: [{ type: Output }],
        mapDrag: [{ type: Output }],
        mapDragend: [{ type: Output }],
        mapDragstart: [{ type: Output }],
        headingChanged: [{ type: Output }],
        idle: [{ type: Output }],
        maptypeidChanged: [{ type: Output }],
        mapMousemove: [{ type: Output }],
        mapMouseout: [{ type: Output }],
        mapMouseover: [{ type: Output }],
        projectionChanged: [{ type: Output }],
        mapRightclick: [{ type: Output }],
        tilesloaded: [{ type: Output }],
        tiltChanged: [{ type: Output }],
        zoomChanged: [{ type: Output }]
    };
    return GoogleMap;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._googleMapChanges;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._options;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._center;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._zoom;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._destroy;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._mapEl;
    /**
     * The underlying google.maps.Map object
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#Map
     * @type {?}
     */
    GoogleMap.prototype.googleMap;
    /**
     * Whether we're currently rendering inside a browser.
     * @type {?}
     */
    GoogleMap.prototype._isBrowser;
    /**
     * Height of the map.
     * @type {?}
     */
    GoogleMap.prototype.height;
    /**
     * Width of the map.
     * @type {?}
     */
    GoogleMap.prototype.width;
    /**
     * Type of map that should be rendered. E.g. hybrid map, terrain map etc.
     * See: https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
     * @type {?}
     */
    GoogleMap.prototype.mapTypeId;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed
     * @type {?}
     */
    GoogleMap.prototype.boundsChanged;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.center_changed
     * @type {?}
     */
    GoogleMap.prototype.centerChanged;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.click
     * @type {?}
     */
    GoogleMap.prototype.mapClick;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dblclick
     * @type {?}
     */
    GoogleMap.prototype.mapDblclick;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.drag
     * @type {?}
     */
    GoogleMap.prototype.mapDrag;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragend
     * @type {?}
     */
    GoogleMap.prototype.mapDragend;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.dragstart
     * @type {?}
     */
    GoogleMap.prototype.mapDragstart;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.heading_changed
     * @type {?}
     */
    GoogleMap.prototype.headingChanged;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.idle
     * @type {?}
     */
    GoogleMap.prototype.idle;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.maptypeid_changed
     * @type {?}
     */
    GoogleMap.prototype.maptypeidChanged;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mousemove
     * @type {?}
     */
    GoogleMap.prototype.mapMousemove;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseout
     * @type {?}
     */
    GoogleMap.prototype.mapMouseout;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mouseover
     * @type {?}
     */
    GoogleMap.prototype.mapMouseover;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/map#Map.projection_changed
     * @type {?}
     */
    GoogleMap.prototype.projectionChanged;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.rightclick
     * @type {?}
     */
    GoogleMap.prototype.mapRightclick;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilesloaded
     * @type {?}
     */
    GoogleMap.prototype.tilesloaded;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.tilt_changed
     * @type {?}
     */
    GoogleMap.prototype.tiltChanged;
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.zoom_changed
     * @type {?}
     */
    GoogleMap.prototype.zoomChanged;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    GoogleMap.prototype._ngZone;
}
/** @type {?} */
const cssUnitsPattern = /([A-Za-z%]+)$/;
/**
 * Coerces a value to a CSS pixel value.
 * @param {?} value
 * @return {?}
 */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : `${value}px`;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-circle/map-circle.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
 */
let MapCircle = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     */
    class MapCircle {
        /**
         * @param {?} _map
         * @param {?} _ngZone
         */
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._center = new BehaviorSubject(undefined);
            this._radius = new BehaviorSubject(undefined);
            this._destroyed = new Subject();
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.center_changed
             */
            this.centerChanged = this._eventManager.getLazyEmitter('center_changed');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.click
             */
            this.circleClick = this._eventManager.getLazyEmitter('click');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dblclick
             */
            this.circleDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.drag
             */
            this.circleDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragend
             */
            this.circleDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragstart
             */
            this.circleDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousedown
             */
            this.circleMousedown = this._eventManager.getLazyEmitter('mousedown');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousemove
             */
            this.circleMousemove = this._eventManager.getLazyEmitter('mousemove');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseout
             */
            this.circleMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseover
             */
            this.circleMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseup
             */
            this.circleMouseup = this._eventManager.getLazyEmitter('mouseup');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.radius_changed
             */
            this.radiusChanged = this._eventManager.getLazyEmitter('radius_changed');
            /**
             * @see
             * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.rightclick
             */
            this.circleRightclick = this._eventManager.getLazyEmitter('rightclick');
        }
        // initialized in ngOnInit
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || {});
        }
        /**
         * @param {?} center
         * @return {?}
         */
        set center(center) {
            this._center.next(center);
        }
        /**
         * @param {?} radius
         * @return {?}
         */
        set radius(radius) {
            this._radius.next(radius);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this.circle = new google.maps.Circle(options);
                    }));
                    this._assertInitialized();
                    this.circle.setMap((/** @type {?} */ (this._map.googleMap)));
                    this._eventManager.setTarget(this.circle);
                }));
                this._watchForOptionsChanges();
                this._watchForCenterChanges();
                this._watchForRadiusChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.circle) {
                this.circle.setMap(null);
            }
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getBounds
         * @return {?}
         */
        getBounds() {
            this._assertInitialized();
            return this.circle.getBounds();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         * @return {?}
         */
        getCenter() {
            this._assertInitialized();
            return this.circle.getCenter();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
         * @return {?}
         */
        getDraggable() {
            this._assertInitialized();
            return this.circle.getDraggable();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
         * @return {?}
         */
        getEditable() {
            this._assertInitialized();
            return this.circle.getEditable();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         * @return {?}
         */
        getRadius() {
            this._assertInitialized();
            return this.circle.getRadius();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
         * @return {?}
         */
        getVisible() {
            this._assertInitialized();
            return this.circle.getVisible();
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._center, this._radius])
                .pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, center, radius]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, radius: radius !== undefined ? radius : options.radius });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                this._assertInitialized();
                this.circle.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForCenterChanges() {
            this._center.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} center
             * @return {?}
             */
            center => {
                if (center) {
                    this._assertInitialized();
                    this.circle.setCenter(center);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForRadiusChanges() {
            this._radius.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} radius
             * @return {?}
             */
            radius => {
                if (radius !== undefined) {
                    this._assertInitialized();
                    this.circle.setRadius(radius);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.circle) {
                throw Error('Cannot interact with a Google Map Circle before it has been ' +
                    'initialized. Please wait for the Circle to load before trying to interact with it.');
            }
        }
    }
    MapCircle.decorators = [
        { type: Directive, args: [{
                    selector: 'map-circle',
                },] }
    ];
    /** @nocollapse */
    MapCircle.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
    MapCircle.propDecorators = {
        options: [{ type: Input }],
        center: [{ type: Input }],
        radius: [{ type: Input }],
        centerChanged: [{ type: Output }],
        circleClick: [{ type: Output }],
        circleDblclick: [{ type: Output }],
        circleDrag: [{ type: Output }],
        circleDragend: [{ type: Output }],
        circleDragstart: [{ type: Output }],
        circleMousedown: [{ type: Output }],
        circleMousemove: [{ type: Output }],
        circleMouseout: [{ type: Output }],
        circleMouseover: [{ type: Output }],
        circleMouseup: [{ type: Output }],
        radiusChanged: [{ type: Output }],
        circleRightclick: [{ type: Output }]
    };
    return MapCircle;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._center;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._radius;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._destroyed;
    /**
     * Underlying google.maps.Circle object.
     *
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     * @type {?}
     */
    MapCircle.prototype.circle;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.center_changed
     * @type {?}
     */
    MapCircle.prototype.centerChanged;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.click
     * @type {?}
     */
    MapCircle.prototype.circleClick;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dblclick
     * @type {?}
     */
    MapCircle.prototype.circleDblclick;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.drag
     * @type {?}
     */
    MapCircle.prototype.circleDrag;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragend
     * @type {?}
     */
    MapCircle.prototype.circleDragend;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.dragstart
     * @type {?}
     */
    MapCircle.prototype.circleDragstart;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousedown
     * @type {?}
     */
    MapCircle.prototype.circleMousedown;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mousemove
     * @type {?}
     */
    MapCircle.prototype.circleMousemove;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseout
     * @type {?}
     */
    MapCircle.prototype.circleMouseout;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseover
     * @type {?}
     */
    MapCircle.prototype.circleMouseover;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.mouseup
     * @type {?}
     */
    MapCircle.prototype.circleMouseup;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.radius_changed
     * @type {?}
     */
    MapCircle.prototype.radiusChanged;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.rightclick
     * @type {?}
     */
    MapCircle.prototype.circleRightclick;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapCircle.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-ground-overlay/map-ground-overlay.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
let MapGroundOverlay = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     */
    class MapGroundOverlay {
        /**
         * @param {?} _map
         * @param {?} _ngZone
         */
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._opacity = new BehaviorSubject(1);
            this._url = new BehaviorSubject('');
            this._destroyed = new Subject();
            /**
             * Whether the overlay is clickable
             */
            this.clickable = false;
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
             */
            this.mapClick = this._eventManager.getLazyEmitter('click');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/image-overlay
             * #GroundOverlay.dblclick
             */
            this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
        }
        /**
         * URL of the image that will be shown in the overlay.
         * @param {?} url
         * @return {?}
         */
        set url(url) {
            this._url.next(url);
        }
        /**
         * Opacity of the overlay.
         * @param {?} opacity
         * @return {?}
         */
        set opacity(opacity) {
            this._opacity.next(opacity);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (!this.bounds) {
                throw Error('Image bounds are required');
            }
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this.groundOverlay =
                            new google.maps.GroundOverlay(this._url.getValue(), this.bounds, options);
                    }));
                    this._assertInitialized();
                    this.groundOverlay.setMap((/** @type {?} */ (this._map.googleMap)));
                    this._eventManager.setTarget(this.groundOverlay);
                }));
                this._watchForOpacityChanges();
                this._watchForUrlChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.groundOverlay) {
                this.groundOverlay.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getBounds
         * @return {?}
         */
        getBounds() {
            this._assertInitialized();
            return this.groundOverlay.getBounds();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getOpacity
         * @return {?}
         */
        getOpacity() {
            this._assertInitialized();
            return this.groundOverlay.getOpacity();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getUrl
         * @return {?}
         */
        getUrl() {
            this._assertInitialized();
            return this.groundOverlay.getUrl();
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return this._opacity.pipe(map((/**
             * @param {?} opacity
             * @return {?}
             */
            opacity => {
                /** @type {?} */
                const combinedOptions = {
                    clickable: this.clickable,
                    opacity,
                };
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOpacityChanges() {
            this._opacity.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} opacity
             * @return {?}
             */
            opacity => {
                if (opacity) {
                    this._assertInitialized();
                    this.groundOverlay.setOpacity(opacity);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForUrlChanges() {
            this._url.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} url
             * @return {?}
             */
            url => {
                this._assertInitialized();
                /** @type {?} */
                const overlay = this.groundOverlay;
                overlay.set('url', url);
                // Google Maps only redraws the overlay if we re-set the map.
                overlay.setMap(null);
                overlay.setMap((/** @type {?} */ (this._map.googleMap)));
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.groundOverlay) {
                throw Error('Cannot interact with a Google Map GroundOverlay before it has been initialized. ' +
                    'Please wait for the GroundOverlay to load before trying to interact with it.');
            }
        }
    }
    MapGroundOverlay.decorators = [
        { type: Directive, args: [{
                    selector: 'map-ground-overlay',
                },] }
    ];
    /** @nocollapse */
    MapGroundOverlay.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
    MapGroundOverlay.propDecorators = {
        url: [{ type: Input }],
        bounds: [{ type: Input }],
        clickable: [{ type: Input }],
        opacity: [{ type: Input }],
        mapClick: [{ type: Output }],
        mapDblclick: [{ type: Output }]
    };
    return MapGroundOverlay;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._opacity;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._url;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._destroyed;
    /**
     * The underlying google.maps.GroundOverlay object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
     * @type {?}
     */
    MapGroundOverlay.prototype.groundOverlay;
    /**
     * Bounds for the overlay.
     * @type {?}
     */
    MapGroundOverlay.prototype.bounds;
    /**
     * Whether the overlay is clickable
     * @type {?}
     */
    MapGroundOverlay.prototype.clickable;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay.click
     * @type {?}
     */
    MapGroundOverlay.prototype.mapClick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/image-overlay
     * #GroundOverlay.dblclick
     * @type {?}
     */
    MapGroundOverlay.prototype.mapDblclick;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapGroundOverlay.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-info-window/map-info-window.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
let MapInfoWindow = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/info-window
     */
    class MapInfoWindow {
        /**
         * @param {?} _googleMap
         * @param {?} _elementRef
         * @param {?} _ngZone
         */
        constructor(_googleMap, _elementRef, _ngZone) {
            this._googleMap = _googleMap;
            this._elementRef = _elementRef;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._position = new BehaviorSubject(undefined);
            this._destroy = new Subject();
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
             */
            this.closeclick = this._eventManager.getLazyEmitter('closeclick');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window
             * #InfoWindow.content_changed
             */
            this.contentChanged = this._eventManager.getLazyEmitter('content_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
             */
            this.domready = this._eventManager.getLazyEmitter('domready');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window
             * #InfoWindow.position_changed
             */
            this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/info-window
             * #InfoWindow.zindex_changed
             */
            this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
        }
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || {});
        }
        /**
         * @param {?} position
         * @return {?}
         */
        set position(position) {
            this._position.next(position);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._googleMap._isBrowser) {
                /** @type {?} */
                const combinedOptionsChanges = this._combineOptions();
                combinedOptionsChanges.pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this.infoWindow = new google.maps.InfoWindow(options);
                    }));
                    this._eventManager.setTarget(this.infoWindow);
                }));
                this._watchForOptionsChanges();
                this._watchForPositionChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroy.next();
            this._destroy.complete();
            // If no info window has been created on the server, we do not try closing it.
            // On the server, an info window cannot be created and this would cause errors.
            if (this.infoWindow) {
                this.close();
            }
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
         * @return {?}
         */
        close() {
            this._assertInitialized();
            this.infoWindow.close();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
         * @return {?}
         */
        getContent() {
            this._assertInitialized();
            return this.infoWindow.getContent();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.getPosition
         * @return {?}
         */
        getPosition() {
            this._assertInitialized();
            return this.infoWindow.getPosition();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
         * @return {?}
         */
        getZIndex() {
            this._assertInitialized();
            return this.infoWindow.getZIndex();
        }
        /**
         * Opens the MapInfoWindow using the provided MapMarker as the anchor. If the anchor is not set,
         * then the position property of the options input is used instead.
         * @param {?=} anchor
         * @return {?}
         */
        open(anchor) {
            this._assertInitialized();
            /** @type {?} */
            const marker = anchor ? anchor.marker : undefined;
            this._elementRef.nativeElement.style.display = '';
            this.infoWindow.open(this._googleMap.googleMap, marker);
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._position]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, position]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { position: position || options.position, content: this._elementRef.nativeElement });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                this._assertInitialized();
                this.infoWindow.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForPositionChanges() {
            this._position.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} position
             * @return {?}
             */
            position => {
                if (position) {
                    this._assertInitialized();
                    this.infoWindow.setPosition(position);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.infoWindow) {
                throw Error('Cannot interact with a Google Map Info Window before it has been ' +
                    'initialized. Please wait for the Info Window to load before trying to interact with ' +
                    'it.');
            }
        }
    }
    MapInfoWindow.decorators = [
        { type: Directive, args: [{
                    selector: 'map-info-window',
                    host: { 'style': 'display: none' },
                },] }
    ];
    /** @nocollapse */
    MapInfoWindow.ctorParameters = () => [
        { type: GoogleMap },
        { type: ElementRef },
        { type: NgZone }
    ];
    MapInfoWindow.propDecorators = {
        options: [{ type: Input }],
        position: [{ type: Input }],
        closeclick: [{ type: Output }],
        contentChanged: [{ type: Output }],
        domready: [{ type: Output }],
        positionChanged: [{ type: Output }],
        zindexChanged: [{ type: Output }]
    };
    return MapInfoWindow;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._position;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._destroy;
    /**
     * Underlying google.maps.InfoWindow
     *
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     * @type {?}
     */
    MapInfoWindow.prototype.infoWindow;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.closeclick
     * @type {?}
     */
    MapInfoWindow.prototype.closeclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.content_changed
     * @type {?}
     */
    MapInfoWindow.prototype.contentChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.domready
     * @type {?}
     */
    MapInfoWindow.prototype.domready;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.position_changed
     * @type {?}
     */
    MapInfoWindow.prototype.positionChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.zindex_changed
     * @type {?}
     */
    MapInfoWindow.prototype.zindexChanged;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._googleMap;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-marker/map-marker.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 * @type {?}
 */
const DEFAULT_MARKER_OPTIONS = {
    position: { lat: 37.421995, lng: -122.084092 },
};
/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/marker
 */
let MapMarker = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/marker
     */
    class MapMarker {
        /**
         * @param {?} _googleMap
         * @param {?} _ngZone
         */
        constructor(_googleMap, _ngZone) {
            this._googleMap = _googleMap;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject(DEFAULT_MARKER_OPTIONS);
            this._title = new BehaviorSubject(undefined);
            this._position = new BehaviorSubject(undefined);
            this._label = new BehaviorSubject(undefined);
            this._clickable = new BehaviorSubject(undefined);
            this._destroy = new Subject();
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
             */
            this.animationChanged = this._eventManager.getLazyEmitter('animation_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
             */
            this.mapClick = this._eventManager.getLazyEmitter('click');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
             */
            this.clickableChanged = this._eventManager.getLazyEmitter('clickable_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
             */
            this.cursorChanged = this._eventManager.getLazyEmitter('cursor_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
             */
            this.mapDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
             */
            this.mapDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
             */
            this.mapDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
             */
            this.draggableChanged = this._eventManager.getLazyEmitter('draggable_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
             */
            this.mapDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
             */
            this.flatChanged = this._eventManager.getLazyEmitter('flat_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
             */
            this.iconChanged = this._eventManager.getLazyEmitter('icon_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
             */
            this.mapMousedown = this._eventManager.getLazyEmitter('mousedown');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
             */
            this.mapMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
             */
            this.mapMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
             */
            this.mapMouseup = this._eventManager.getLazyEmitter('mouseup');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
             */
            this.positionChanged = this._eventManager.getLazyEmitter('position_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
             */
            this.mapRightclick = this._eventManager.getLazyEmitter('rightclick');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
             */
            this.shapeChanged = this._eventManager.getLazyEmitter('shape_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
             */
            this.titleChanged = this._eventManager.getLazyEmitter('title_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
             */
            this.visibleChanged = this._eventManager.getLazyEmitter('visible_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
             */
            this.zindexChanged = this._eventManager.getLazyEmitter('zindex_changed');
        }
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || DEFAULT_MARKER_OPTIONS);
        }
        /**
         * @param {?} title
         * @return {?}
         */
        set title(title) {
            this._title.next(title);
        }
        /**
         * @param {?} position
         * @return {?}
         */
        set position(position) {
            this._position.next(position);
        }
        /**
         * @param {?} label
         * @return {?}
         */
        set label(label) {
            this._label.next(label);
        }
        /**
         * @param {?} clickable
         * @return {?}
         */
        set clickable(clickable) {
            this._clickable.next(clickable);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._googleMap._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => this.marker = new google.maps.Marker(options)));
                    this._assertInitialized();
                    this.marker.setMap((/** @type {?} */ (this._googleMap.googleMap)));
                    this._eventManager.setTarget(this.marker);
                }));
                this._watchForOptionsChanges();
                this._watchForTitleChanges();
                this._watchForPositionChanges();
                this._watchForLabelChanges();
                this._watchForClickableChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._destroy.next();
            this._destroy.complete();
            this._eventManager.destroy();
            if (this.marker) {
                this.marker.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
         * @return {?}
         */
        getAnimation() {
            this._assertInitialized();
            return this.marker.getAnimation() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
         * @return {?}
         */
        getClickable() {
            this._assertInitialized();
            return this.marker.getClickable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
         * @return {?}
         */
        getCursor() {
            this._assertInitialized();
            return this.marker.getCursor() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
         * @return {?}
         */
        getDraggable() {
            this._assertInitialized();
            return !!this.marker.getDraggable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
         * @return {?}
         */
        getIcon() {
            this._assertInitialized();
            return this.marker.getIcon() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
         * @return {?}
         */
        getLabel() {
            this._assertInitialized();
            return this.marker.getLabel() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
         * @return {?}
         */
        getOpacity() {
            this._assertInitialized();
            return this.marker.getOpacity() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
         * @return {?}
         */
        getPosition() {
            this._assertInitialized();
            return this.marker.getPosition() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
         * @return {?}
         */
        getShape() {
            this._assertInitialized();
            return this.marker.getShape() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
         * @return {?}
         */
        getTitle() {
            this._assertInitialized();
            return this.marker.getTitle() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
         * @return {?}
         */
        getVisible() {
            this._assertInitialized();
            return this.marker.getVisible();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
         * @return {?}
         */
        getZIndex() {
            this._assertInitialized();
            return this.marker.getZIndex() || null;
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._title, this._position, this._label, this._clickable])
                .pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, title, position, label, clickable]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { title: title || options.title, position: position || options.position, label: label || options.label, clickable: clickable !== undefined ? clickable : options.clickable, map: this._googleMap.googleMap });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                if (this.marker) {
                    this._assertInitialized();
                    this.marker.setOptions(options);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForTitleChanges() {
            this._title.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} title
             * @return {?}
             */
            title => {
                if (this.marker && title !== undefined) {
                    this._assertInitialized();
                    this.marker.setTitle(title);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForPositionChanges() {
            this._position.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} position
             * @return {?}
             */
            position => {
                if (this.marker && position) {
                    this._assertInitialized();
                    this.marker.setPosition(position);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForLabelChanges() {
            this._label.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} label
             * @return {?}
             */
            label => {
                if (this.marker && label !== undefined) {
                    this._assertInitialized();
                    this.marker.setLabel(label);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForClickableChanges() {
            this._clickable.pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} clickable
             * @return {?}
             */
            clickable => {
                if (this.marker && clickable !== undefined) {
                    this._assertInitialized();
                    this.marker.setClickable(clickable);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.marker) {
                throw Error('Cannot interact with a Google Map Marker before it has been ' +
                    'initialized. Please wait for the Marker to load before trying to interact with it.');
            }
        }
    }
    MapMarker.decorators = [
        { type: Component, args: [{
                    selector: 'map-marker',
                    template: '<ng-content></ng-content>',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    MapMarker.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
    MapMarker.propDecorators = {
        options: [{ type: Input }],
        title: [{ type: Input }],
        position: [{ type: Input }],
        label: [{ type: Input }],
        clickable: [{ type: Input }],
        animationChanged: [{ type: Output }],
        mapClick: [{ type: Output }],
        clickableChanged: [{ type: Output }],
        cursorChanged: [{ type: Output }],
        mapDblclick: [{ type: Output }],
        mapDrag: [{ type: Output }],
        mapDragend: [{ type: Output }],
        draggableChanged: [{ type: Output }],
        mapDragstart: [{ type: Output }],
        flatChanged: [{ type: Output }],
        iconChanged: [{ type: Output }],
        mapMousedown: [{ type: Output }],
        mapMouseout: [{ type: Output }],
        mapMouseover: [{ type: Output }],
        mapMouseup: [{ type: Output }],
        positionChanged: [{ type: Output }],
        mapRightclick: [{ type: Output }],
        shapeChanged: [{ type: Output }],
        titleChanged: [{ type: Output }],
        visibleChanged: [{ type: Output }],
        zindexChanged: [{ type: Output }]
    };
    return MapMarker;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._title;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._position;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._label;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._clickable;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._destroy;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.animation_changed
     * @type {?}
     */
    MapMarker.prototype.animationChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.click
     * @type {?}
     */
    MapMarker.prototype.mapClick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.clickable_changed
     * @type {?}
     */
    MapMarker.prototype.clickableChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.cursor_changed
     * @type {?}
     */
    MapMarker.prototype.cursorChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dblclick
     * @type {?}
     */
    MapMarker.prototype.mapDblclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.drag
     * @type {?}
     */
    MapMarker.prototype.mapDrag;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragend
     * @type {?}
     */
    MapMarker.prototype.mapDragend;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.draggable_changed
     * @type {?}
     */
    MapMarker.prototype.draggableChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.dragstart
     * @type {?}
     */
    MapMarker.prototype.mapDragstart;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.flat_changed
     * @type {?}
     */
    MapMarker.prototype.flatChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.icon_changed
     * @type {?}
     */
    MapMarker.prototype.iconChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mousedown
     * @type {?}
     */
    MapMarker.prototype.mapMousedown;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseout
     * @type {?}
     */
    MapMarker.prototype.mapMouseout;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseover
     * @type {?}
     */
    MapMarker.prototype.mapMouseover;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.mouseup
     * @type {?}
     */
    MapMarker.prototype.mapMouseup;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.position_changed
     * @type {?}
     */
    MapMarker.prototype.positionChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.rightclick
     * @type {?}
     */
    MapMarker.prototype.mapRightclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.shape_changed
     * @type {?}
     */
    MapMarker.prototype.shapeChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.title_changed
     * @type {?}
     */
    MapMarker.prototype.titleChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.visible_changed
     * @type {?}
     */
    MapMarker.prototype.visibleChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.zindex_changed
     * @type {?}
     */
    MapMarker.prototype.zindexChanged;
    /**
     * The underlying google.maps.Marker object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/marker#Marker
     * @type {?}
     */
    MapMarker.prototype.marker;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._googleMap;
    /**
     * @type {?}
     * @private
     */
    MapMarker.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-polygon/map-polygon.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
let MapPolygon = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
     */
    class MapPolygon {
        /**
         * @param {?} _map
         * @param {?} _ngZone
         */
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._paths = new BehaviorSubject(undefined);
            this._destroyed = new Subject();
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
             */
            this.polygonClick = this._eventManager.getLazyEmitter('click');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
             */
            this.polygonDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
             */
            this.polygonDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
             */
            this.polygonDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
             */
            this.polygonDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
             */
            this.polygonMousedown = this._eventManager.getLazyEmitter('mousedown');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
             */
            this.polygonMousemove = this._eventManager.getLazyEmitter('mousemove');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
             */
            this.polygonMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
             */
            this.polygonMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
             */
            this.polygonMouseup = this._eventManager.getLazyEmitter('mouseup');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
             */
            this.polygonRightclick = this._eventManager.getLazyEmitter('rightclick');
        }
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || {});
        }
        /**
         * @param {?} paths
         * @return {?}
         */
        set paths(paths) {
            this._paths.next(paths);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this.polygon = new google.maps.Polygon(options);
                    }));
                    this._assertInitialized();
                    this.polygon.setMap((/** @type {?} */ (this._map.googleMap)));
                    this._eventManager.setTarget(this.polygon);
                }));
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.polygon) {
                this.polygon.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
         * @return {?}
         */
        getDraggable() {
            this._assertInitialized();
            return this.polygon.getDraggable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
         * @return {?}
         */
        getEditable() {
            this._assertInitialized();
            return this.polygon.getEditable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
         * @return {?}
         */
        getPath() {
            this._assertInitialized();
            return this.polygon.getPath();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
         * @return {?}
         */
        getPaths() {
            this._assertInitialized();
            return this.polygon.getPaths();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
         * @return {?}
         */
        getVisible() {
            this._assertInitialized();
            return this.polygon.getVisible();
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._paths]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, paths]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { paths: paths || options.paths });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                this._assertInitialized();
                this.polygon.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForPathChanges() {
            this._paths.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} paths
             * @return {?}
             */
            paths => {
                if (paths) {
                    this._assertInitialized();
                    this.polygon.setPaths(paths);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.polygon) {
                throw Error('Cannot interact with a Google Map Polygon before it has been ' +
                    'initialized. Please wait for the Polygon to load before trying to interact with it.');
            }
        }
    }
    MapPolygon.decorators = [
        { type: Directive, args: [{
                    selector: 'map-polygon',
                },] }
    ];
    /** @nocollapse */
    MapPolygon.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
    MapPolygon.propDecorators = {
        options: [{ type: Input }],
        paths: [{ type: Input }],
        polygonClick: [{ type: Output }],
        polygonDblclick: [{ type: Output }],
        polygonDrag: [{ type: Output }],
        polygonDragend: [{ type: Output }],
        polygonDragstart: [{ type: Output }],
        polygonMousedown: [{ type: Output }],
        polygonMousemove: [{ type: Output }],
        polygonMouseout: [{ type: Output }],
        polygonMouseover: [{ type: Output }],
        polygonMouseup: [{ type: Output }],
        polygonRightclick: [{ type: Output }]
    };
    return MapPolygon;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapPolygon.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapPolygon.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapPolygon.prototype._paths;
    /**
     * @type {?}
     * @private
     */
    MapPolygon.prototype._destroyed;
    /**
     * The underlying google.maps.Polygon object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
     * @type {?}
     */
    MapPolygon.prototype.polygon;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
     * @type {?}
     */
    MapPolygon.prototype.polygonClick;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
     * @type {?}
     */
    MapPolygon.prototype.polygonDblclick;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
     * @type {?}
     */
    MapPolygon.prototype.polygonDrag;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
     * @type {?}
     */
    MapPolygon.prototype.polygonDragend;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
     * @type {?}
     */
    MapPolygon.prototype.polygonDragstart;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
     * @type {?}
     */
    MapPolygon.prototype.polygonMousedown;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
     * @type {?}
     */
    MapPolygon.prototype.polygonMousemove;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
     * @type {?}
     */
    MapPolygon.prototype.polygonMouseout;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
     * @type {?}
     */
    MapPolygon.prototype.polygonMouseover;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
     * @type {?}
     */
    MapPolygon.prototype.polygonMouseup;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
     * @type {?}
     */
    MapPolygon.prototype.polygonRightclick;
    /**
     * @type {?}
     * @private
     */
    MapPolygon.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapPolygon.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-polyline/map-polyline.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
let MapPolyline = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
     */
    class MapPolyline {
        /**
         * @param {?} _map
         * @param {?} _ngZone
         */
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._path = new BehaviorSubject(undefined);
            this._destroyed = new Subject();
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
             */
            this.polylineClick = this._eventManager.getLazyEmitter('click');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
             */
            this.polylineDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
             */
            this.polylineDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
             */
            this.polylineDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
             */
            this.polylineDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
             */
            this.polylineMousedown = this._eventManager.getLazyEmitter('mousedown');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
             */
            this.polylineMousemove = this._eventManager.getLazyEmitter('mousemove');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
             */
            this.polylineMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
             */
            this.polylineMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
             */
            this.polylineMouseup = this._eventManager.getLazyEmitter('mouseup');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
             */
            this.polylineRightclick = this._eventManager.getLazyEmitter('rightclick');
        }
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || {});
        }
        /**
         * @param {?} path
         * @return {?}
         */
        set path(path) {
            this._path.next(path);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => this.polyline = new google.maps.Polyline(options)));
                    this._assertInitialized();
                    this.polyline.setMap((/** @type {?} */ (this._map.googleMap)));
                    this._eventManager.setTarget(this.polyline);
                }));
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.polyline) {
                this.polyline.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
         * @return {?}
         */
        getDraggable() {
            this._assertInitialized();
            return this.polyline.getDraggable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
         * @return {?}
         */
        getEditable() {
            this._assertInitialized();
            return this.polyline.getEditable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
         * @return {?}
         */
        getPath() {
            this._assertInitialized();
            // @breaking-change 11.0.0 Make the return value nullable.
            return this.polyline.getPath();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
         * @return {?}
         */
        getVisible() {
            this._assertInitialized();
            return this.polyline.getVisible();
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._path]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, path]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { path: path || options.path });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                this._assertInitialized();
                this.polyline.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForPathChanges() {
            this._path.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} path
             * @return {?}
             */
            path => {
                if (path) {
                    this._assertInitialized();
                    this.polyline.setPath(path);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.polyline) {
                throw Error('Cannot interact with a Google Map Polyline before it has been ' +
                    'initialized. Please wait for the Polyline to load before trying to interact with it.');
            }
        }
    }
    MapPolyline.decorators = [
        { type: Directive, args: [{
                    selector: 'map-polyline',
                },] }
    ];
    /** @nocollapse */
    MapPolyline.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
    MapPolyline.propDecorators = {
        options: [{ type: Input }],
        path: [{ type: Input }],
        polylineClick: [{ type: Output }],
        polylineDblclick: [{ type: Output }],
        polylineDrag: [{ type: Output }],
        polylineDragend: [{ type: Output }],
        polylineDragstart: [{ type: Output }],
        polylineMousedown: [{ type: Output }],
        polylineMousemove: [{ type: Output }],
        polylineMouseout: [{ type: Output }],
        polylineMouseover: [{ type: Output }],
        polylineMouseup: [{ type: Output }],
        polylineRightclick: [{ type: Output }]
    };
    return MapPolyline;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._path;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._destroyed;
    /**
     * The underlying google.maps.Polyline object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
     * @type {?}
     */
    MapPolyline.prototype.polyline;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
     * @type {?}
     */
    MapPolyline.prototype.polylineClick;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
     * @type {?}
     */
    MapPolyline.prototype.polylineDblclick;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
     * @type {?}
     */
    MapPolyline.prototype.polylineDrag;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
     * @type {?}
     */
    MapPolyline.prototype.polylineDragend;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
     * @type {?}
     */
    MapPolyline.prototype.polylineDragstart;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
     * @type {?}
     */
    MapPolyline.prototype.polylineMousedown;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
     * @type {?}
     */
    MapPolyline.prototype.polylineMousemove;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseout;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseover;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseup;
    /**
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
     * @type {?}
     */
    MapPolyline.prototype.polylineRightclick;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapPolyline.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/map-rectangle/map-rectangle.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
 */
let MapRectangle = /** @class */ (() => {
    /**
     * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
     */
    class MapRectangle {
        /**
         * @param {?} _map
         * @param {?} _ngZone
         */
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new BehaviorSubject({});
            this._bounds = new BehaviorSubject(undefined);
            this._destroyed = new Subject();
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.boundsChanged
             */
            this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
             */
            this.rectangleClick = this._eventManager.getLazyEmitter('click');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
             */
            this.rectangleDblclick = this._eventManager.getLazyEmitter('dblclick');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
             */
            this.rectangleDrag = this._eventManager.getLazyEmitter('drag');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
             */
            this.rectangleDragend = this._eventManager.getLazyEmitter('dragend');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
             */
            this.rectangleDragstart = this._eventManager.getLazyEmitter('dragstart');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
             */
            this.rectangleMousedown = this._eventManager.getLazyEmitter('mousedown');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
             */
            this.rectangleMousemove = this._eventManager.getLazyEmitter('mousemove');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
             */
            this.rectangleMouseout = this._eventManager.getLazyEmitter('mouseout');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
             */
            this.rectangleMouseover = this._eventManager.getLazyEmitter('mouseover');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
             */
            this.rectangleMouseup = this._eventManager.getLazyEmitter('mouseup');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.rightclick
             */
            this.rectangleRightclick = this._eventManager.getLazyEmitter('rightclick');
        }
        /**
         * @param {?} options
         * @return {?}
         */
        set options(options) {
            this._options.next(options || {});
        }
        /**
         * @param {?} bounds
         * @return {?}
         */
        set bounds(bounds) {
            this._bounds.next(bounds);
        }
        /**
         * @return {?}
         */
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe((/**
                 * @param {?} options
                 * @return {?}
                 */
                options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this.rectangle = new google.maps.Rectangle(options);
                    }));
                    this._assertInitialized();
                    this.rectangle.setMap((/** @type {?} */ (this._map.googleMap)));
                    this._eventManager.setTarget(this.rectangle);
                }));
                this._watchForOptionsChanges();
                this._watchForBoundsChanges();
            }
        }
        /**
         * @return {?}
         */
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.rectangle) {
                this.rectangle.setMap(null);
            }
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
         * @return {?}
         */
        getBounds() {
            this._assertInitialized();
            return this.rectangle.getBounds();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
         * @return {?}
         */
        getDraggable() {
            this._assertInitialized();
            return this.rectangle.getDraggable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
         * @return {?}
         */
        getEditable() {
            this._assertInitialized();
            return this.rectangle.getEditable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
         * @return {?}
         */
        getVisible() {
            this._assertInitialized();
            return this.rectangle.getVisible();
        }
        /**
         * @private
         * @return {?}
         */
        _combineOptions() {
            return combineLatest([this._options, this._bounds]).pipe(map((/**
             * @param {?} __0
             * @return {?}
             */
            ([options, bounds]) => {
                /** @type {?} */
                const combinedOptions = Object.assign(Object.assign({}, options), { bounds: bounds || options.bounds });
                return combinedOptions;
            })));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                this._assertInitialized();
                this.rectangle.setOptions(options);
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _watchForBoundsChanges() {
            this._bounds.pipe(takeUntil(this._destroyed)).subscribe((/**
             * @param {?} bounds
             * @return {?}
             */
            bounds => {
                if (bounds) {
                    this._assertInitialized();
                    this.rectangle.setBounds(bounds);
                }
            }));
        }
        /**
         * @private
         * @return {?}
         */
        _assertInitialized() {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.rectangle) {
                throw Error('Cannot interact with a Google Map Rectangle before it has been ' +
                    'initialized. Please wait for the Rectangle to load before trying to interact with it.');
            }
        }
    }
    MapRectangle.decorators = [
        { type: Directive, args: [{
                    selector: 'map-rectangle',
                },] }
    ];
    /** @nocollapse */
    MapRectangle.ctorParameters = () => [
        { type: GoogleMap },
        { type: NgZone }
    ];
    MapRectangle.propDecorators = {
        options: [{ type: Input }],
        bounds: [{ type: Input }],
        boundsChanged: [{ type: Output }],
        rectangleClick: [{ type: Output }],
        rectangleDblclick: [{ type: Output }],
        rectangleDrag: [{ type: Output }],
        rectangleDragend: [{ type: Output }],
        rectangleDragstart: [{ type: Output }],
        rectangleMousedown: [{ type: Output }],
        rectangleMousemove: [{ type: Output }],
        rectangleMouseout: [{ type: Output }],
        rectangleMouseover: [{ type: Output }],
        rectangleMouseup: [{ type: Output }],
        rectangleRightclick: [{ type: Output }]
    };
    return MapRectangle;
})();
if (false) {
    /**
     * @type {?}
     * @private
     */
    MapRectangle.prototype._eventManager;
    /**
     * @type {?}
     * @private
     */
    MapRectangle.prototype._options;
    /**
     * @type {?}
     * @private
     */
    MapRectangle.prototype._bounds;
    /**
     * @type {?}
     * @private
     */
    MapRectangle.prototype._destroyed;
    /**
     * The underlying google.maps.Rectangle object.
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
     * @type {?}
     */
    MapRectangle.prototype.rectangle;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.boundsChanged
     * @type {?}
     */
    MapRectangle.prototype.boundsChanged;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
     * @type {?}
     */
    MapRectangle.prototype.rectangleClick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
     * @type {?}
     */
    MapRectangle.prototype.rectangleDblclick;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
     * @type {?}
     */
    MapRectangle.prototype.rectangleDrag;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
     * @type {?}
     */
    MapRectangle.prototype.rectangleDragend;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
     * @type {?}
     */
    MapRectangle.prototype.rectangleDragstart;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
     * @type {?}
     */
    MapRectangle.prototype.rectangleMousedown;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
     * @type {?}
     */
    MapRectangle.prototype.rectangleMousemove;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
     * @type {?}
     */
    MapRectangle.prototype.rectangleMouseout;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
     * @type {?}
     */
    MapRectangle.prototype.rectangleMouseover;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
     * @type {?}
     */
    MapRectangle.prototype.rectangleMouseup;
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.rightclick
     * @type {?}
     */
    MapRectangle.prototype.rectangleRightclick;
    /**
     * @type {?}
     * @private
     */
    MapRectangle.prototype._map;
    /**
     * @type {?}
     * @private
     */
    MapRectangle.prototype._ngZone;
}

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/google-maps-module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const COMPONENTS = [
    GoogleMap,
    MapCircle,
    MapGroundOverlay,
    MapInfoWindow,
    MapMarker,
    MapPolygon,
    MapPolyline,
    MapRectangle,
];
let GoogleMapsModule = /** @class */ (() => {
    class GoogleMapsModule {
    }
    GoogleMapsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: COMPONENTS,
                    exports: COMPONENTS,
                },] }
    ];
    return GoogleMapsModule;
})();

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { GoogleMap, GoogleMapsModule, MapCircle, MapGroundOverlay, MapInfoWindow, MapMarker, MapPolygon, MapPolyline, MapRectangle };
//# sourceMappingURL=google-maps.js.map
