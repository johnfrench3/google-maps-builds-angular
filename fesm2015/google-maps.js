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
 * Extends the Google Map interface due to the Definitely Typed implementation
 * missing "getClickableIcons".
 * @record
 */
function UpdatedGoogleMap() { }
if (false) {
    /** @type {?} */
    UpdatedGoogleMap.prototype.getClickableIcons;
}
/**
 * default options set to the Googleplex
 * @type {?}
 */
const DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17,
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
        this.height = DEFAULT_HEIGHT;
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
                this._googleMap = (/** @type {?} */ (googleMap));
                this._eventManager.setTarget(this._googleMap);
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
        this._googleMap.fitBounds(bounds, padding);
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
        this._googleMap.panBy(x, y);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     * @param {?} latLng
     * @return {?}
     */
    panTo(latLng) {
        this._assertInitialized();
        this._googleMap.panTo(latLng);
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
        this._googleMap.panToBounds(latLngBounds, padding);
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     * @return {?}
     */
    getBounds() {
        this._assertInitialized();
        return this._googleMap.getBounds() || null;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     * @return {?}
     */
    getCenter() {
        this._assertInitialized();
        return this._googleMap.getCenter();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     * @return {?}
     */
    getClickableIcons() {
        this._assertInitialized();
        return this._googleMap.getClickableIcons();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     * @return {?}
     */
    getHeading() {
        this._assertInitialized();
        return this._googleMap.getHeading();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     * @return {?}
     */
    getMapTypeId() {
        this._assertInitialized();
        return this._googleMap.getMapTypeId();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     * @return {?}
     */
    getProjection() {
        this._assertInitialized();
        return this._googleMap.getProjection();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     * @return {?}
     */
    getStreetView() {
        this._assertInitialized();
        return this._googleMap.getStreetView();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     * @return {?}
     */
    getTilt() {
        this._assertInitialized();
        return this._googleMap.getTilt();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     * @return {?}
     */
    getZoom() {
        this._assertInitialized();
        return this._googleMap.getZoom();
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
     * @return {?}
     */
    get controls() {
        this._assertInitialized();
        return this._googleMap.controls;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
     * @return {?}
     */
    get data() {
        this._assertInitialized();
        return this._googleMap.data;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
     * @return {?}
     */
    get mapTypes() {
        this._assertInitialized();
        return this._googleMap.mapTypes;
    }
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
     * @return {?}
     */
    get overlayMapTypes() {
        this._assertInitialized();
        return this._googleMap.overlayMapTypes;
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
            const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, zoom: zoom !== undefined ? zoom : options.zoom });
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
        if (!this._googleMap) {
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
    /** @type {?} */
    GoogleMap.prototype._googleMap;
    /**
     * Whether we're currently rendering inside a browser.
     * @type {?}
     */
    GoogleMap.prototype._isBrowser;
    /** @type {?} */
    GoogleMap.prototype.height;
    /** @type {?} */
    GoogleMap.prototype.width;
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
 * Generated from: src/google-maps/map-info-window/map-info-window.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/info-window
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
            this._combineOptions().pipe(takeUntil(this._destroy)).subscribe((/**
             * @param {?} options
             * @return {?}
             */
            options => {
                if (this._infoWindow) {
                    this._infoWindow.setOptions(options);
                }
                else {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular((/**
                     * @return {?}
                     */
                    () => {
                        this._infoWindow = new google.maps.InfoWindow(options);
                    }));
                    this._eventManager.setTarget(this._infoWindow);
                }
            }));
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._eventManager.destroy();
        this._destroy.next();
        this._destroy.complete();
        this.close();
    }
    /**
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
     * @return {?}
     */
    close() {
        if (this._infoWindow) {
            this._infoWindow.close();
        }
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     * @return {?}
     */
    getContent() {
        return this._infoWindow ? this._infoWindow.getContent() : '';
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     * @return {?}
     */
    getPosition() {
        return this._infoWindow ? this._infoWindow.getPosition() : null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     * @return {?}
     */
    getZIndex() {
        return this._infoWindow ? this._infoWindow.getZIndex() : -1;
    }
    /**
     * Opens the MapInfoWindow using the provided MapMarker as the anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     * @param {?=} anchor
     * @return {?}
     */
    open(anchor) {
        /** @type {?} */
        const marker = anchor ? anchor._marker : undefined;
        if (this._googleMap._googleMap && this._infoWindow) {
            this._elementRef.nativeElement.style.display = '';
            (/** @type {?} */ (this._infoWindow)).open(this._googleMap._googleMap, marker);
        }
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
     * @type {?}
     * @private
     */
    MapInfoWindow.prototype._infoWindow;
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
 * @see developers.google.com/maps/documentation/javascript/reference/marker
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
                () => this._marker = new google.maps.Marker(options)));
                (/** @type {?} */ (this._marker)).setMap(this._googleMap._googleMap);
                this._eventManager.setTarget(this._marker);
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
        if (this._marker) {
            this._marker.setMap(null);
        }
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
     * @return {?}
     */
    getAnimation() {
        return (this._marker && this._marker.getAnimation()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
     * @return {?}
     */
    getClickable() {
        return this._marker ? this._marker.getClickable() : false;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
     * @return {?}
     */
    getCursor() {
        return (this._marker && this._marker.getCursor()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
     * @return {?}
     */
    getDraggable() {
        return this._marker ? !!this._marker.getDraggable() : false;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
     * @return {?}
     */
    getIcon() {
        return (this._marker && this._marker.getIcon()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
     * @return {?}
     */
    getLabel() {
        return (this._marker && this._marker.getLabel()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
     * @return {?}
     */
    getOpacity() {
        return (this._marker && this._marker.getOpacity()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
     * @return {?}
     */
    getPosition() {
        return (this._marker && this._marker.getPosition()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
     * @return {?}
     */
    getShape() {
        return (this._marker && this._marker.getShape()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
     * @return {?}
     */
    getTitle() {
        return (this._marker && this._marker.getTitle()) || null;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
     * @return {?}
     */
    getVisible() {
        return this._marker ? this._marker.getVisible() : false;
    }
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
     * @return {?}
     */
    getZIndex() {
        return (this._marker && this._marker.getZIndex()) || null;
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
            const combinedOptions = Object.assign(Object.assign({}, options), { title: title || options.title, position: position || options.position, label: label || options.label, clickable: clickable !== undefined ? clickable : options.clickable, map: this._googleMap._googleMap || null });
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
            if (this._marker) {
                this._marker.setOptions(options);
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
            if (this._marker && title !== undefined) {
                this._marker.setTitle(title);
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
            if (this._marker && position) {
                this._marker.setPosition(position);
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
            if (this._marker && label !== undefined) {
                this._marker.setLabel(label);
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
            if (this._marker && clickable !== undefined) {
                this._marker.setClickable(clickable);
            }
        }));
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
    /** @type {?} */
    MapMarker.prototype._marker;
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
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
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
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
         */
        this.polygonClick = this._eventManager.getLazyEmitter('click');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
         */
        this.polygonDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
         */
        this.polygonDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
         */
        this.polygonDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
         */
        this.polygonDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
         */
        this.polygonMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
         */
        this.polygonMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
         */
        this.polygonMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
         */
        this.polygonMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
         */
        this.polygonMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
         */
        this.polygonRightclick = this._eventManager.getLazyEmitter('rightclick');
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
                    this._polygon = new google.maps.Polygon(options);
                }));
                this._polygon.setMap(this._map._googleMap);
                this._eventManager.setTarget(this._polygon);
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
        if (this._polygon) {
            this._polygon.setMap(null);
        }
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
     * @return {?}
     */
    getDraggable() {
        return this._polygon.getDraggable();
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
     * @return {?}
     */
    getEditable() {
        return this._polygon.getEditable();
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
     * @return {?}
     */
    getPath() {
        return this._polygon.getPath();
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
     * @return {?}
     */
    getPaths() {
        return this._polygon.getPaths();
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
     * @return {?}
     */
    getVisible() {
        return this._polygon.getVisible();
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
            this._polygon.setOptions(options);
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
                this._polygon.setPaths(paths);
            }
        }));
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
    /** @type {?} */
    MapPolygon.prototype._polygon;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.click
     * @type {?}
     */
    MapPolygon.prototype.polygonClick;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dblclick
     * @type {?}
     */
    MapPolygon.prototype.polygonDblclick;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.drag
     * @type {?}
     */
    MapPolygon.prototype.polygonDrag;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragend
     * @type {?}
     */
    MapPolygon.prototype.polygonDragend;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.dragstart
     * @type {?}
     */
    MapPolygon.prototype.polygonDragstart;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousedown
     * @type {?}
     */
    MapPolygon.prototype.polygonMousedown;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mousemove
     * @type {?}
     */
    MapPolygon.prototype.polygonMousemove;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseout
     * @type {?}
     */
    MapPolygon.prototype.polygonMouseout;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseover
     * @type {?}
     */
    MapPolygon.prototype.polygonMouseover;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.mouseup
     * @type {?}
     */
    MapPolygon.prototype.polygonMouseup;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.rightclick
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
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
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
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
         */
        this.polylineClick = this._eventManager.getLazyEmitter('click');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
         */
        this.polylineDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
         */
        this.polylineDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
         */
        this.polylineDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
         */
        this.polylineDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
         */
        this.polylineMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
         */
        this.polylineMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
         */
        this.polylineMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
         */
        this.polylineMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
         */
        this.polylineMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
         */
        this.polylineRightclick = this._eventManager.getLazyEmitter('rightclick');
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
                () => this._polyline = new google.maps.Polyline(options)));
                (/** @type {?} */ (this._polyline)).setMap(this._map._googleMap);
                this._eventManager.setTarget(this._polyline);
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
        if (this._polyline) {
            this._polyline.setMap(null);
        }
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
     * @return {?}
     */
    getDraggable() {
        return this._polyline ? this._polyline.getDraggable() : false;
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
     * @return {?}
     */
    getEditable() {
        return this._polyline ? this._polyline.getEditable() : false;
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
     * @return {?}
     */
    getPath() {
        // @breaking-change 11.0.0 Make the return value nullable.
        return this._polyline ? this._polyline.getPath() : (/** @type {?} */ (null));
    }
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
     * @return {?}
     */
    getVisible() {
        return this._polyline ? this._polyline.getVisible() : false;
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
            if (this._polyline) {
                this._polyline.setOptions(options);
            }
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
            if (path && this._polyline) {
                this._polyline.setPath(path);
            }
        }));
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
    /** @type {?} */
    MapPolyline.prototype._polyline;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.click
     * @type {?}
     */
    MapPolyline.prototype.polylineClick;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dblclick
     * @type {?}
     */
    MapPolyline.prototype.polylineDblclick;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.drag
     * @type {?}
     */
    MapPolyline.prototype.polylineDrag;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragend
     * @type {?}
     */
    MapPolyline.prototype.polylineDragend;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.dragstart
     * @type {?}
     */
    MapPolyline.prototype.polylineDragstart;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousedown
     * @type {?}
     */
    MapPolyline.prototype.polylineMousedown;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mousemove
     * @type {?}
     */
    MapPolyline.prototype.polylineMousemove;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseout
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseout;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseover
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseover;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.mouseup
     * @type {?}
     */
    MapPolyline.prototype.polylineMouseup;
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.rightclick
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
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
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
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.boundsChanged
         */
        this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
         */
        this.rectangleClick = this._eventManager.getLazyEmitter('click');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
         */
        this.rectangleDblclick = this._eventManager.getLazyEmitter('dblclick');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
         */
        this.rectangleDrag = this._eventManager.getLazyEmitter('drag');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
         */
        this.rectangleDragend = this._eventManager.getLazyEmitter('dragend');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
         */
        this.rectangleDragstart = this._eventManager.getLazyEmitter('dragstart');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
         */
        this.rectangleMousedown = this._eventManager.getLazyEmitter('mousedown');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
         */
        this.rectangleMousemove = this._eventManager.getLazyEmitter('mousemove');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
         */
        this.rectangleMouseout = this._eventManager.getLazyEmitter('mouseout');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
         */
        this.rectangleMouseover = this._eventManager.getLazyEmitter('mouseover');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
         */
        this.rectangleMouseup = this._eventManager.getLazyEmitter('mouseup');
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.rightclick
         */
        this.rectangleRightclick = this._eventManager.getLazyEmitter('rightclick');
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
                    this._rectangle = new google.maps.Rectangle(options);
                }));
                this._rectangle.setMap(this._map._googleMap);
                this._eventManager.setTarget(this._rectangle);
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
        if (this._rectangle) {
            this._rectangle.setMap(null);
        }
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
     * @return {?}
     */
    getBounds() {
        return this._rectangle.getBounds();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
     * @return {?}
     */
    getDraggable() {
        return this._rectangle.getDraggable();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
     * @return {?}
     */
    getEditable() {
        return this._rectangle.getEditable();
    }
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
     * @return {?}
     */
    getVisible() {
        return this._rectangle.getVisible();
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
            this._rectangle.setOptions(options);
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
                this._rectangle.setBounds(bounds);
            }
        }));
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
    /** @type {?} */
    MapRectangle.prototype._rectangle;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.boundsChanged
     * @type {?}
     */
    MapRectangle.prototype.boundsChanged;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.click
     * @type {?}
     */
    MapRectangle.prototype.rectangleClick;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dblclick
     * @type {?}
     */
    MapRectangle.prototype.rectangleDblclick;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.drag
     * @type {?}
     */
    MapRectangle.prototype.rectangleDrag;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragend
     * @type {?}
     */
    MapRectangle.prototype.rectangleDragend;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.dragstart
     * @type {?}
     */
    MapRectangle.prototype.rectangleDragstart;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousedown
     * @type {?}
     */
    MapRectangle.prototype.rectangleMousedown;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mousemove
     * @type {?}
     */
    MapRectangle.prototype.rectangleMousemove;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseout
     * @type {?}
     */
    MapRectangle.prototype.rectangleMouseout;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseover
     * @type {?}
     */
    MapRectangle.prototype.rectangleMouseover;
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.mouseup
     * @type {?}
     */
    MapRectangle.prototype.rectangleMouseup;
    /**
     * @see
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
    MapInfoWindow,
    MapMarker,
    MapPolyline,
    MapPolygon,
    MapRectangle,
];
class GoogleMapsModule {
}
GoogleMapsModule.decorators = [
    { type: NgModule, args: [{
                declarations: COMPONENTS,
                exports: COMPONENTS,
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: src/google-maps/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker, MapPolygon, MapPolyline, MapRectangle };
//# sourceMappingURL=google-maps.js.map
