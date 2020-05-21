import { __decorate, __metadata, __param } from 'tslib';
import { Input, Output, Component, ChangeDetectionStrategy, ViewEncapsulation, Optional, Inject, PLATFORM_ID, ElementRef, NgZone, Directive, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { map, take, shareReplay, takeUntil } from 'rxjs/operators';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
class MapEventManager {
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /** Pending listeners that were added before the target was set. */
        this._pending = [];
        this._listeners = [];
    }
    /** Clears all currently-registered event listeners. */
    _clearListeners() {
        for (let listener of this._listeners) {
            listener.remove();
        }
        this._listeners = [];
    }
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    getLazyEmitter(name) {
        const observable = new Observable(observer => {
            // If the target hasn't been initialized yet, cache the observer so it can be added later.
            if (!this._target) {
                this._pending.push({ observable, observer });
                return undefined;
            }
            const listener = this._target.addListener(name, (event) => {
                this._ngZone.run(() => observer.next(event));
            });
            this._listeners.push(listener);
            return () => listener.remove();
        });
        return observable;
    }
    /** Sets the current target that the manager should bind events to. */
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
        this._pending.forEach(subscriber => subscriber.observable.subscribe(subscriber.observer));
        this._pending = [];
    }
    /** Destroys the manager and clears the event listeners. */
    destroy() {
        this._clearListeners();
        this._pending = [];
        this._target = undefined;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** default options set to the Googleplex */
const DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17
};
/** Arbitrary default height for the map element */
const DEFAULT_HEIGHT = '500px';
/** Arbitrary default width for the map element */
const DEFAULT_WIDTH = '500px';
/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
let GoogleMap = /** @class */ (() => {
    let GoogleMap = class GoogleMap {
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
            /** Height of the map. */
            this.height = DEFAULT_HEIGHT;
            /** Width of the map. */
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
                const googleMapsWindow = window;
                if (!googleMapsWindow.google) {
                    throw Error('Namespace google not found, cannot construct embedded google ' +
                        'map. Please install the Google Maps JavaScript API: ' +
                        'https://developers.google.com/maps/documentation/javascript/' +
                        'tutorial#Loading_the_Maps_API');
                }
            }
        }
        set center(center) {
            this._center.next(center);
        }
        set zoom(zoom) {
            this._zoom.next(zoom);
        }
        set options(options) {
            this._options.next(options || DEFAULT_OPTIONS);
        }
        ngOnChanges() {
            this._setSize();
            if (this.googleMap && this.mapTypeId) {
                this.googleMap.setMapTypeId(this.mapTypeId);
            }
        }
        ngOnInit() {
            // It should be a noop during server-side rendering.
            if (this._isBrowser) {
                this._mapEl = this._elementRef.nativeElement.querySelector('.map-container');
                this._setSize();
                this._googleMapChanges = this._initializeMap(this._combineOptions());
                this._googleMapChanges.subscribe((googleMap) => {
                    this.googleMap = googleMap;
                    this._eventManager.setTarget(this.googleMap);
                });
                this._watchForOptionsChanges();
                this._watchForCenterChanges();
                this._watchForZoomChanges();
            }
        }
        ngOnDestroy() {
            this._eventManager.destroy();
            this._destroy.next();
            this._destroy.complete();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
         */
        fitBounds(bounds, padding) {
            this._assertInitialized();
            this.googleMap.fitBounds(bounds, padding);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
         */
        panBy(x, y) {
            this._assertInitialized();
            this.googleMap.panBy(x, y);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
         */
        panTo(latLng) {
            this._assertInitialized();
            this.googleMap.panTo(latLng);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
         */
        panToBounds(latLngBounds, padding) {
            this._assertInitialized();
            this.googleMap.panToBounds(latLngBounds, padding);
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
         */
        getBounds() {
            this._assertInitialized();
            return this.googleMap.getBounds() || null;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
         */
        getCenter() {
            this._assertInitialized();
            return this.googleMap.getCenter();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
         */
        getClickableIcons() {
            this._assertInitialized();
            return this.googleMap.getClickableIcons();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
         */
        getHeading() {
            this._assertInitialized();
            return this.googleMap.getHeading();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
         */
        getMapTypeId() {
            this._assertInitialized();
            return this.googleMap.getMapTypeId();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
         */
        getProjection() {
            this._assertInitialized();
            return this.googleMap.getProjection();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
         */
        getStreetView() {
            this._assertInitialized();
            return this.googleMap.getStreetView();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
         */
        getTilt() {
            this._assertInitialized();
            return this.googleMap.getTilt();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
         */
        getZoom() {
            this._assertInitialized();
            return this.googleMap.getZoom();
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
         */
        get controls() {
            this._assertInitialized();
            return this.googleMap.controls;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
         */
        get data() {
            this._assertInitialized();
            return this.googleMap.data;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
         */
        get mapTypes() {
            this._assertInitialized();
            return this.googleMap.mapTypes;
        }
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
         */
        get overlayMapTypes() {
            this._assertInitialized();
            return this.googleMap.overlayMapTypes;
        }
        _setSize() {
            if (this._mapEl) {
                const styles = this._mapEl.style;
                styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
                styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
            }
        }
        /** Combines the center and zoom and the other map options into a single object */
        _combineOptions() {
            return combineLatest([this._options, this._center, this._zoom])
                .pipe(map(([options, center, zoom]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, zoom: zoom !== undefined ? zoom : options.zoom, mapTypeId: this.mapTypeId });
                return combinedOptions;
            }));
        }
        _initializeMap(optionsChanges) {
            return optionsChanges.pipe(take(1), map(options => {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                return this._ngZone.runOutsideAngular(() => new google.maps.Map(this._mapEl, options));
            }), shareReplay(1));
        }
        _watchForOptionsChanges() {
            combineLatest([this._googleMapChanges, this._options])
                .pipe(takeUntil(this._destroy))
                .subscribe(([googleMap, options]) => {
                googleMap.setOptions(options);
            });
        }
        _watchForCenterChanges() {
            combineLatest([this._googleMapChanges, this._center])
                .pipe(takeUntil(this._destroy))
                .subscribe(([googleMap, center]) => {
                if (center) {
                    googleMap.setCenter(center);
                }
            });
        }
        _watchForZoomChanges() {
            combineLatest([this._googleMapChanges, this._zoom])
                .pipe(takeUntil(this._destroy))
                .subscribe(([googleMap, zoom]) => {
                if (zoom !== undefined) {
                    googleMap.setZoom(zoom);
                }
            });
        }
        /** Asserts that the map has been initialized. */
        _assertInitialized() {
            if (!this.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GoogleMap.prototype, "height", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GoogleMap.prototype, "width", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], GoogleMap.prototype, "mapTypeId", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], GoogleMap.prototype, "center", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], GoogleMap.prototype, "zoom", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], GoogleMap.prototype, "options", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "boundsChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "centerChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "headingChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "idle", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "maptypeidChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "projectionChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "mapRightclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "tilesloaded", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "tiltChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], GoogleMap.prototype, "zoomChanged", void 0);
    GoogleMap = __decorate([
        Component({
            selector: 'google-map',
            changeDetection: ChangeDetectionStrategy.OnPush,
            template: '<div class="map-container"></div><ng-content></ng-content>',
            encapsulation: ViewEncapsulation.None
        }),
        __param(2, Optional()), __param(2, Inject(PLATFORM_ID)),
        __metadata("design:paramtypes", [ElementRef,
            NgZone,
            Object])
    ], GoogleMap);
    return GoogleMap;
})();
const cssUnitsPattern = /([A-Za-z%]+)$/;
/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : `${value}px`;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
 */
let MapCircle = /** @class */ (() => {
    let MapCircle = class MapCircle {
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
        set options(options) {
            this._options.next(options || {});
        }
        set center(center) {
            this._center.next(center);
        }
        set radius(radius) {
            this._radius.next(radius);
        }
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => {
                        this.circle = new google.maps.Circle(options);
                    });
                    this._assertInitialized();
                    this.circle.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.circle);
                });
                this._watchForOptionsChanges();
                this._watchForCenterChanges();
                this._watchForRadiusChanges();
            }
        }
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
         */
        getBounds() {
            this._assertInitialized();
            return this.circle.getBounds();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         */
        getCenter() {
            this._assertInitialized();
            return this.circle.getCenter();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
         */
        getDraggable() {
            this._assertInitialized();
            return this.circle.getDraggable();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
         */
        getEditable() {
            this._assertInitialized();
            return this.circle.getEditable();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         */
        getRadius() {
            this._assertInitialized();
            return this.circle.getRadius();
        }
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
         */
        getVisible() {
            this._assertInitialized();
            return this.circle.getVisible();
        }
        _combineOptions() {
            return combineLatest([this._options, this._center, this._radius])
                .pipe(map(([options, center, radius]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, radius: radius !== undefined ? radius : options.radius });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
                this._assertInitialized();
                this.circle.setOptions(options);
            });
        }
        _watchForCenterChanges() {
            this._center.pipe(takeUntil(this._destroyed)).subscribe(center => {
                if (center) {
                    this._assertInitialized();
                    this.circle.setCenter(center);
                }
            });
        }
        _watchForRadiusChanges() {
            this._radius.pipe(takeUntil(this._destroyed)).subscribe(radius => {
                if (radius !== undefined) {
                    this._assertInitialized();
                    this.circle.setRadius(radius);
                }
            });
        }
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapCircle.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapCircle.prototype, "center", null);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MapCircle.prototype, "radius", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "centerChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "radiusChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapCircle.prototype, "circleRightclick", void 0);
    MapCircle = __decorate([
        Directive({
            selector: 'map-circle',
        }),
        __metadata("design:paramtypes", [GoogleMap, NgZone])
    ], MapCircle);
    return MapCircle;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Ground Overlay via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/image-overlay#GroundOverlay
 */
let MapGroundOverlay = /** @class */ (() => {
    let MapGroundOverlay = class MapGroundOverlay {
        constructor(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._opacity = new BehaviorSubject(1);
            this._url = new BehaviorSubject('');
            this._destroyed = new Subject();
            /** Whether the overlay is clickable */
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
        /** URL of the image that will be shown in the overlay. */
        set url(url) {
            this._url.next(url);
        }
        /** Opacity of the overlay. */
        set opacity(opacity) {
            this._opacity.next(opacity);
        }
        ngOnInit() {
            if (!this.bounds) {
                throw Error('Image bounds are required');
            }
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => {
                        this.groundOverlay =
                            new google.maps.GroundOverlay(this._url.getValue(), this.bounds, options);
                    });
                    this._assertInitialized();
                    this.groundOverlay.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.groundOverlay);
                });
                this._watchForOpacityChanges();
                this._watchForUrlChanges();
            }
        }
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
         */
        getBounds() {
            this._assertInitialized();
            return this.groundOverlay.getBounds();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getOpacity
         */
        getOpacity() {
            this._assertInitialized();
            return this.groundOverlay.getOpacity();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getUrl
         */
        getUrl() {
            this._assertInitialized();
            return this.groundOverlay.getUrl();
        }
        _combineOptions() {
            return this._opacity.pipe(map(opacity => {
                const combinedOptions = {
                    clickable: this.clickable,
                    opacity,
                };
                return combinedOptions;
            }));
        }
        _watchForOpacityChanges() {
            this._opacity.pipe(takeUntil(this._destroyed)).subscribe(opacity => {
                if (opacity) {
                    this._assertInitialized();
                    this.groundOverlay.setOpacity(opacity);
                }
            });
        }
        _watchForUrlChanges() {
            this._url.pipe(takeUntil(this._destroyed)).subscribe(url => {
                this._assertInitialized();
                const overlay = this.groundOverlay;
                overlay.set('url', url);
                // Google Maps only redraws the overlay if we re-set the map.
                overlay.setMap(null);
                overlay.setMap(this._map.googleMap);
            });
        }
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
    };
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MapGroundOverlay.prototype, "url", null);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MapGroundOverlay.prototype, "bounds", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MapGroundOverlay.prototype, "clickable", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MapGroundOverlay.prototype, "opacity", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapGroundOverlay.prototype, "mapClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapGroundOverlay.prototype, "mapDblclick", void 0);
    MapGroundOverlay = __decorate([
        Directive({
            selector: 'map-ground-overlay',
        }),
        __metadata("design:paramtypes", [GoogleMap, NgZone])
    ], MapGroundOverlay);
    return MapGroundOverlay;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/info-window
 */
let MapInfoWindow = /** @class */ (() => {
    let MapInfoWindow = class MapInfoWindow {
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
        set options(options) {
            this._options.next(options || {});
        }
        set position(position) {
            this._position.next(position);
        }
        ngOnInit() {
            if (this._googleMap._isBrowser) {
                const combinedOptionsChanges = this._combineOptions();
                combinedOptionsChanges.pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => {
                        this.infoWindow = new google.maps.InfoWindow(options);
                    });
                    this._eventManager.setTarget(this.infoWindow);
                });
                this._watchForOptionsChanges();
                this._watchForPositionChanges();
            }
        }
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
         */
        close() {
            this._assertInitialized();
            this.infoWindow.close();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
         */
        getContent() {
            this._assertInitialized();
            return this.infoWindow.getContent();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.getPosition
         */
        getPosition() {
            this._assertInitialized();
            return this.infoWindow.getPosition();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
         */
        getZIndex() {
            this._assertInitialized();
            return this.infoWindow.getZIndex();
        }
        /**
         * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
         * then the position property of the options input is used instead.
         */
        open(anchor) {
            this._assertInitialized();
            this._elementRef.nativeElement.style.display = '';
            this.infoWindow.open(this._googleMap.googleMap, anchor ? anchor.getAnchor() : undefined);
        }
        _combineOptions() {
            return combineLatest([this._options, this._position]).pipe(map(([options, position]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { position: position || options.position, content: this._elementRef.nativeElement });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroy)).subscribe(options => {
                this._assertInitialized();
                this.infoWindow.setOptions(options);
            });
        }
        _watchForPositionChanges() {
            this._position.pipe(takeUntil(this._destroy)).subscribe(position => {
                if (position) {
                    this._assertInitialized();
                    this.infoWindow.setPosition(position);
                }
            });
        }
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapInfoWindow.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapInfoWindow.prototype, "position", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapInfoWindow.prototype, "closeclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapInfoWindow.prototype, "contentChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapInfoWindow.prototype, "domready", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapInfoWindow.prototype, "positionChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapInfoWindow.prototype, "zindexChanged", void 0);
    MapInfoWindow = __decorate([
        Directive({
            selector: 'map-info-window',
            host: { 'style': 'display: none' },
        }),
        __metadata("design:paramtypes", [GoogleMap,
            ElementRef,
            NgZone])
    ], MapInfoWindow);
    return MapInfoWindow;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
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
    let MapMarker = class MapMarker {
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
        set options(options) {
            this._options.next(options || DEFAULT_MARKER_OPTIONS);
        }
        set title(title) {
            this._title.next(title);
        }
        set position(position) {
            this._position.next(position);
        }
        set label(label) {
            this._label.next(label);
        }
        set clickable(clickable) {
            this._clickable.next(clickable);
        }
        ngOnInit() {
            if (this._googleMap._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => this.marker = new google.maps.Marker(options));
                    this._assertInitialized();
                    this.marker.setMap(this._googleMap.googleMap);
                    this._eventManager.setTarget(this.marker);
                });
                this._watchForOptionsChanges();
                this._watchForTitleChanges();
                this._watchForPositionChanges();
                this._watchForLabelChanges();
                this._watchForClickableChanges();
            }
        }
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
         */
        getAnimation() {
            this._assertInitialized();
            return this.marker.getAnimation() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
         */
        getClickable() {
            this._assertInitialized();
            return this.marker.getClickable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
         */
        getCursor() {
            this._assertInitialized();
            return this.marker.getCursor() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
         */
        getDraggable() {
            this._assertInitialized();
            return !!this.marker.getDraggable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
         */
        getIcon() {
            this._assertInitialized();
            return this.marker.getIcon() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
         */
        getLabel() {
            this._assertInitialized();
            return this.marker.getLabel() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
         */
        getOpacity() {
            this._assertInitialized();
            return this.marker.getOpacity() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
         */
        getPosition() {
            this._assertInitialized();
            return this.marker.getPosition() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
         */
        getShape() {
            this._assertInitialized();
            return this.marker.getShape() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
         */
        getTitle() {
            this._assertInitialized();
            return this.marker.getTitle() || null;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
         */
        getVisible() {
            this._assertInitialized();
            return this.marker.getVisible();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
         */
        getZIndex() {
            this._assertInitialized();
            return this.marker.getZIndex() || null;
        }
        /** Gets the anchor point that can be used to attach other Google Maps objects. */
        getAnchor() {
            this._assertInitialized();
            return this.marker;
        }
        _combineOptions() {
            return combineLatest([this._options, this._title, this._position, this._label, this._clickable])
                .pipe(map(([options, title, position, label, clickable]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { title: title || options.title, position: position || options.position, label: label || options.label, clickable: clickable !== undefined ? clickable : options.clickable, map: this._googleMap.googleMap });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroy)).subscribe(options => {
                if (this.marker) {
                    this._assertInitialized();
                    this.marker.setOptions(options);
                }
            });
        }
        _watchForTitleChanges() {
            this._title.pipe(takeUntil(this._destroy)).subscribe(title => {
                if (this.marker && title !== undefined) {
                    this._assertInitialized();
                    this.marker.setTitle(title);
                }
            });
        }
        _watchForPositionChanges() {
            this._position.pipe(takeUntil(this._destroy)).subscribe(position => {
                if (this.marker && position) {
                    this._assertInitialized();
                    this.marker.setPosition(position);
                }
            });
        }
        _watchForLabelChanges() {
            this._label.pipe(takeUntil(this._destroy)).subscribe(label => {
                if (this.marker && label !== undefined) {
                    this._assertInitialized();
                    this.marker.setLabel(label);
                }
            });
        }
        _watchForClickableChanges() {
            this._clickable.pipe(takeUntil(this._destroy)).subscribe(clickable => {
                if (this.marker && clickable !== undefined) {
                    this._assertInitialized();
                    this.marker.setClickable(clickable);
                }
            });
        }
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapMarker.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MapMarker.prototype, "title", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapMarker.prototype, "position", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapMarker.prototype, "label", null);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MapMarker.prototype, "clickable", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "animationChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "clickableChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "cursorChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "draggableChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "flatChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "iconChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "positionChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "mapRightclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "shapeChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "titleChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "visibleChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapMarker.prototype, "zindexChanged", void 0);
    MapMarker = __decorate([
        Component({
            selector: 'map-marker',
            template: '<ng-content></ng-content>',
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [GoogleMap,
            NgZone])
    ], MapMarker);
    return MapMarker;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
let MapPolygon = /** @class */ (() => {
    let MapPolygon = class MapPolygon {
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
        set options(options) {
            this._options.next(options || {});
        }
        set paths(paths) {
            this._paths.next(paths);
        }
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => {
                        this.polygon = new google.maps.Polygon(options);
                    });
                    this._assertInitialized();
                    this.polygon.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.polygon);
                });
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        }
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
         */
        getDraggable() {
            this._assertInitialized();
            return this.polygon.getDraggable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
         */
        getEditable() {
            this._assertInitialized();
            return this.polygon.getEditable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
         */
        getPath() {
            this._assertInitialized();
            return this.polygon.getPath();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
         */
        getPaths() {
            this._assertInitialized();
            return this.polygon.getPaths();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
         */
        getVisible() {
            this._assertInitialized();
            return this.polygon.getVisible();
        }
        _combineOptions() {
            return combineLatest([this._options, this._paths]).pipe(map(([options, paths]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { paths: paths || options.paths });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
                this._assertInitialized();
                this.polygon.setOptions(options);
            });
        }
        _watchForPathChanges() {
            this._paths.pipe(takeUntil(this._destroyed)).subscribe(paths => {
                if (paths) {
                    this._assertInitialized();
                    this.polygon.setPaths(paths);
                }
            });
        }
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolygon.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolygon.prototype, "paths", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolygon.prototype, "polygonRightclick", void 0);
    MapPolygon = __decorate([
        Directive({
            selector: 'map-polygon',
        }),
        __metadata("design:paramtypes", [GoogleMap, NgZone])
    ], MapPolygon);
    return MapPolygon;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
let MapPolyline = /** @class */ (() => {
    let MapPolyline = class MapPolyline {
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
        set options(options) {
            this._options.next(options || {});
        }
        set path(path) {
            this._path.next(path);
        }
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => this.polyline = new google.maps.Polyline(options));
                    this._assertInitialized();
                    this.polyline.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.polyline);
                });
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        }
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
         */
        getDraggable() {
            this._assertInitialized();
            return this.polyline.getDraggable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
         */
        getEditable() {
            this._assertInitialized();
            return this.polyline.getEditable();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
         */
        getPath() {
            this._assertInitialized();
            // @breaking-change 11.0.0 Make the return value nullable.
            return this.polyline.getPath();
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
         */
        getVisible() {
            this._assertInitialized();
            return this.polyline.getVisible();
        }
        _combineOptions() {
            return combineLatest([this._options, this._path]).pipe(map(([options, path]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { path: path || options.path });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
                this._assertInitialized();
                this.polyline.setOptions(options);
            });
        }
        _watchForPathChanges() {
            this._path.pipe(takeUntil(this._destroyed)).subscribe(path => {
                if (path) {
                    this._assertInitialized();
                    this.polyline.setPath(path);
                }
            });
        }
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolyline.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapPolyline.prototype, "path", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapPolyline.prototype, "polylineRightclick", void 0);
    MapPolyline = __decorate([
        Directive({
            selector: 'map-polyline',
        }),
        __metadata("design:paramtypes", [GoogleMap,
            NgZone])
    ], MapPolyline);
    return MapPolyline;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
 *
 * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
 */
let MapRectangle = /** @class */ (() => {
    let MapRectangle = class MapRectangle {
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
        set options(options) {
            this._options.next(options || {});
        }
        set bounds(bounds) {
            this._bounds.next(bounds);
        }
        ngOnInit() {
            if (this._map._isBrowser) {
                this._combineOptions().pipe(take(1)).subscribe(options => {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    this._ngZone.runOutsideAngular(() => {
                        this.rectangle = new google.maps.Rectangle(options);
                    });
                    this._assertInitialized();
                    this.rectangle.setMap(this._map.googleMap);
                    this._eventManager.setTarget(this.rectangle);
                });
                this._watchForOptionsChanges();
                this._watchForBoundsChanges();
            }
        }
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
         */
        getBounds() {
            this._assertInitialized();
            return this.rectangle.getBounds();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
         */
        getDraggable() {
            this._assertInitialized();
            return this.rectangle.getDraggable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
         */
        getEditable() {
            this._assertInitialized();
            return this.rectangle.getEditable();
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
         */
        getVisible() {
            this._assertInitialized();
            return this.rectangle.getVisible();
        }
        _combineOptions() {
            return combineLatest([this._options, this._bounds]).pipe(map(([options, bounds]) => {
                const combinedOptions = Object.assign(Object.assign({}, options), { bounds: bounds || options.bounds });
                return combinedOptions;
            }));
        }
        _watchForOptionsChanges() {
            this._options.pipe(takeUntil(this._destroyed)).subscribe(options => {
                this._assertInitialized();
                this.rectangle.setOptions(options);
            });
        }
        _watchForBoundsChanges() {
            this._bounds.pipe(takeUntil(this._destroyed)).subscribe(bounds => {
                if (bounds) {
                    this._assertInitialized();
                    this.rectangle.setBounds(bounds);
                }
            });
        }
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
    };
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapRectangle.prototype, "options", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MapRectangle.prototype, "bounds", null);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "boundsChanged", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleClick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleDblclick", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleDrag", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleDragend", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleDragstart", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleMousedown", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleMousemove", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleMouseout", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleMouseover", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleMouseup", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Observable)
    ], MapRectangle.prototype, "rectangleRightclick", void 0);
    MapRectangle = __decorate([
        Directive({
            selector: 'map-rectangle',
        }),
        __metadata("design:paramtypes", [GoogleMap, NgZone])
    ], MapRectangle);
    return MapRectangle;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
    let GoogleMapsModule = class GoogleMapsModule {
    };
    GoogleMapsModule = __decorate([
        NgModule({
            declarations: COMPONENTS,
            exports: COMPONENTS,
        })
    ], GoogleMapsModule);
    return GoogleMapsModule;
})();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { GoogleMap, GoogleMapsModule, MapCircle, MapGroundOverlay, MapInfoWindow, MapMarker, MapPolygon, MapPolyline, MapRectangle };
//# sourceMappingURL=google-maps.js.map
