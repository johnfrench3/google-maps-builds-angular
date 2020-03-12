import { __values, __read, __assign } from 'tslib';
import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, NgZone, Optional, Inject, PLATFORM_ID, Input, Output, Directive, NgModule } from '@angular/core';
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
var MapEventManager = /** @class */ (function () {
    function MapEventManager(_ngZone) {
        this._ngZone = _ngZone;
        /** Pending listeners that were added before the target was set. */
        this._pending = [];
        this._listeners = [];
    }
    /** Clears all currently-registered event listeners. */
    MapEventManager.prototype._clearListeners = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this._listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener.remove();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._listeners = [];
    };
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    MapEventManager.prototype.getLazyEmitter = function (name) {
        var _this = this;
        var observable = new Observable(function (observer) {
            // If the target hasn't been initialized yet, cache the observer so it can be added later.
            if (!_this._target) {
                _this._pending.push({ observable: observable, observer: observer });
                return undefined;
            }
            var listener = _this._target.addListener(name, function (event) {
                _this._ngZone.run(function () { return observer.next(event); });
            });
            _this._listeners.push(listener);
            return function () { return listener.remove(); };
        });
        return observable;
    };
    /** Sets the current target that the manager should bind events to. */
    MapEventManager.prototype.setTarget = function (target) {
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
        this._pending.forEach(function (subscriber) { return subscriber.observable.subscribe(subscriber.observer); });
        this._pending = [];
    };
    /** Destroys the manager and clears the event listeners. */
    MapEventManager.prototype.destroy = function () {
        this._clearListeners();
        this._pending = [];
        this._target = undefined;
    };
    return MapEventManager;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** default options set to the Googleplex */
var DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17,
};
/** Arbitrary default height for the map element */
var DEFAULT_HEIGHT = '500px';
/** Arbitrary default width for the map element */
var DEFAULT_WIDTH = '500px';
/**
 * Angular component that renders a Google Map via the Google Maps JavaScript
 * API.
 * @see https://developers.google.com/maps/documentation/javascript/reference/
 */
var GoogleMap = /** @class */ (function () {
    function GoogleMap(_elementRef, _ngZone, 
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
            var googleMapsWindow = window;
            if (!googleMapsWindow.google) {
                throw Error('Namespace google not found, cannot construct embedded google ' +
                    'map. Please install the Google Maps JavaScript API: ' +
                    'https://developers.google.com/maps/documentation/javascript/' +
                    'tutorial#Loading_the_Maps_API');
            }
        }
    }
    Object.defineProperty(GoogleMap.prototype, "center", {
        set: function (center) {
            this._center.next(center);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoogleMap.prototype, "zoom", {
        set: function (zoom) {
            this._zoom.next(zoom);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoogleMap.prototype, "options", {
        set: function (options) {
            this._options.next(options || DEFAULT_OPTIONS);
        },
        enumerable: true,
        configurable: true
    });
    GoogleMap.prototype.ngOnChanges = function () {
        this._setSize();
    };
    GoogleMap.prototype.ngOnInit = function () {
        var _this = this;
        // It should be a noop during server-side rendering.
        if (this._isBrowser) {
            this._mapEl = this._elementRef.nativeElement.querySelector('.map-container');
            this._setSize();
            this._googleMapChanges = this._initializeMap(this._combineOptions());
            this._googleMapChanges.subscribe(function (googleMap) {
                _this._googleMap = googleMap;
                _this._eventManager.setTarget(_this._googleMap);
            });
            this._watchForOptionsChanges();
            this._watchForCenterChanges();
            this._watchForZoomChanges();
        }
    };
    GoogleMap.prototype.ngOnDestroy = function () {
        this._eventManager.destroy();
        this._destroy.next();
        this._destroy.complete();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     */
    GoogleMap.prototype.fitBounds = function (bounds, padding) {
        this._assertInitialized();
        this._googleMap.fitBounds(bounds, padding);
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
     */
    GoogleMap.prototype.panBy = function (x, y) {
        this._assertInitialized();
        this._googleMap.panBy(x, y);
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
     */
    GoogleMap.prototype.panTo = function (latLng) {
        this._assertInitialized();
        this._googleMap.panTo(latLng);
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
     */
    GoogleMap.prototype.panToBounds = function (latLngBounds, padding) {
        this._assertInitialized();
        this._googleMap.panToBounds(latLngBounds, padding);
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
     */
    GoogleMap.prototype.getBounds = function () {
        this._assertInitialized();
        return this._googleMap.getBounds() || null;
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
     */
    GoogleMap.prototype.getCenter = function () {
        this._assertInitialized();
        return this._googleMap.getCenter();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
     */
    GoogleMap.prototype.getClickableIcons = function () {
        this._assertInitialized();
        return this._googleMap.getClickableIcons();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
     */
    GoogleMap.prototype.getHeading = function () {
        this._assertInitialized();
        return this._googleMap.getHeading();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
     */
    GoogleMap.prototype.getMapTypeId = function () {
        this._assertInitialized();
        return this._googleMap.getMapTypeId();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
     */
    GoogleMap.prototype.getProjection = function () {
        this._assertInitialized();
        return this._googleMap.getProjection();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
     */
    GoogleMap.prototype.getStreetView = function () {
        this._assertInitialized();
        return this._googleMap.getStreetView();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
     */
    GoogleMap.prototype.getTilt = function () {
        this._assertInitialized();
        return this._googleMap.getTilt();
    };
    /**
     * See
     * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
     */
    GoogleMap.prototype.getZoom = function () {
        this._assertInitialized();
        return this._googleMap.getZoom();
    };
    Object.defineProperty(GoogleMap.prototype, "controls", {
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
         */
        get: function () {
            this._assertInitialized();
            return this._googleMap.controls;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoogleMap.prototype, "data", {
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.data
         */
        get: function () {
            this._assertInitialized();
            return this._googleMap.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoogleMap.prototype, "mapTypes", {
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.mapTypes
         */
        get: function () {
            this._assertInitialized();
            return this._googleMap.mapTypes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GoogleMap.prototype, "overlayMapTypes", {
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.overlayMapTypes
         */
        get: function () {
            this._assertInitialized();
            return this._googleMap.overlayMapTypes;
        },
        enumerable: true,
        configurable: true
    });
    GoogleMap.prototype._setSize = function () {
        if (this._mapEl) {
            var styles = this._mapEl.style;
            styles.height = coerceCssPixelValue(this.height) || DEFAULT_HEIGHT;
            styles.width = coerceCssPixelValue(this.width) || DEFAULT_WIDTH;
        }
    };
    /** Combines the center and zoom and the other map options into a single object */
    GoogleMap.prototype._combineOptions = function () {
        return combineLatest([this._options, this._center, this._zoom])
            .pipe(map(function (_a) {
            var _b = __read(_a, 3), options = _b[0], center = _b[1], zoom = _b[2];
            var combinedOptions = __assign(__assign({}, options), { center: center || options.center, zoom: zoom !== undefined ? zoom : options.zoom });
            return combinedOptions;
        }));
    };
    GoogleMap.prototype._initializeMap = function (optionsChanges) {
        var _this = this;
        return optionsChanges.pipe(take(1), map(function (options) {
            // Create the object outside the zone so its events don't trigger change detection.
            // We'll bring it back in inside the `MapEventManager` only for the events that the
            // user has subscribed to.
            return _this._ngZone.runOutsideAngular(function () { return new google.maps.Map(_this._mapEl, options); });
        }), shareReplay(1));
    };
    GoogleMap.prototype._watchForOptionsChanges = function () {
        combineLatest([this._googleMapChanges, this._options])
            .pipe(takeUntil(this._destroy))
            .subscribe(function (_a) {
            var _b = __read(_a, 2), googleMap = _b[0], options = _b[1];
            googleMap.setOptions(options);
        });
    };
    GoogleMap.prototype._watchForCenterChanges = function () {
        combineLatest([this._googleMapChanges, this._center])
            .pipe(takeUntil(this._destroy))
            .subscribe(function (_a) {
            var _b = __read(_a, 2), googleMap = _b[0], center = _b[1];
            if (center) {
                googleMap.setCenter(center);
            }
        });
    };
    GoogleMap.prototype._watchForZoomChanges = function () {
        combineLatest([this._googleMapChanges, this._zoom])
            .pipe(takeUntil(this._destroy))
            .subscribe(function (_a) {
            var _b = __read(_a, 2), googleMap = _b[0], zoom = _b[1];
            if (zoom !== undefined) {
                googleMap.setZoom(zoom);
            }
        });
    };
    /** Asserts that the map has been initialized. */
    GoogleMap.prototype._assertInitialized = function () {
        if (!this._googleMap) {
            throw Error('Cannot access Google Map information before the API has been initialized. ' +
                'Please wait for the API to load before trying to interact with it.');
        }
    };
    GoogleMap.decorators = [
        { type: Component, args: [{
                    selector: 'google-map',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    template: '<div class="map-container"></div><ng-content></ng-content>',
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    GoogleMap.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: Object, decorators: [{ type: Optional }, { type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
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
    return GoogleMap;
}());
var cssUnitsPattern = /([A-Za-z%]+)$/;
/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : value + "px";
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps info window via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/info-window
 */
var MapInfoWindow = /** @class */ (function () {
    function MapInfoWindow(_googleMap, _elementRef, _ngZone) {
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
    Object.defineProperty(MapInfoWindow.prototype, "options", {
        set: function (options) {
            this._options.next(options || {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapInfoWindow.prototype, "position", {
        set: function (position) {
            this._position.next(position);
        },
        enumerable: true,
        configurable: true
    });
    MapInfoWindow.prototype.ngOnInit = function () {
        var _this = this;
        if (this._googleMap._isBrowser) {
            this._combineOptions().pipe(takeUntil(this._destroy)).subscribe(function (options) {
                if (_this._infoWindow) {
                    _this._infoWindow.setOptions(options);
                }
                else {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () {
                        _this._infoWindow = new google.maps.InfoWindow(options);
                    });
                    _this._eventManager.setTarget(_this._infoWindow);
                }
            });
        }
    };
    MapInfoWindow.prototype.ngOnDestroy = function () {
        this._eventManager.destroy();
        this._destroy.next();
        this._destroy.complete();
        this.close();
    };
    /**
     * See developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.close
     */
    MapInfoWindow.prototype.close = function () {
        if (this._infoWindow) {
            this._infoWindow.close();
        }
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
     */
    MapInfoWindow.prototype.getContent = function () {
        return this._infoWindow ? this._infoWindow.getContent() : '';
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window
     * #InfoWindow.getPosition
     */
    MapInfoWindow.prototype.getPosition = function () {
        return this._infoWindow ? this._infoWindow.getPosition() : null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
     */
    MapInfoWindow.prototype.getZIndex = function () {
        return this._infoWindow ? this._infoWindow.getZIndex() : -1;
    };
    /**
     * Opens the MapInfoWindow using the provided MapMarker as the anchor. If the anchor is not set,
     * then the position property of the options input is used instead.
     */
    MapInfoWindow.prototype.open = function (anchor) {
        var marker = anchor ? anchor._marker : undefined;
        if (this._googleMap._googleMap && this._infoWindow) {
            this._elementRef.nativeElement.style.display = '';
            this._infoWindow.open(this._googleMap._googleMap, marker);
        }
    };
    MapInfoWindow.prototype._combineOptions = function () {
        var _this = this;
        return combineLatest([this._options, this._position]).pipe(map(function (_a) {
            var _b = __read(_a, 2), options = _b[0], position = _b[1];
            var combinedOptions = __assign(__assign({}, options), { position: position || options.position, content: _this._elementRef.nativeElement });
            return combinedOptions;
        }));
    };
    MapInfoWindow.decorators = [
        { type: Directive, args: [{
                    selector: 'map-info-window',
                    host: { 'style': 'display: none' },
                },] }
    ];
    /** @nocollapse */
    MapInfoWindow.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: ElementRef },
        { type: NgZone }
    ]; };
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
}());

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
var DEFAULT_MARKER_OPTIONS = {
    position: { lat: 37.421995, lng: -122.084092 },
};
/**
 * Angular component that renders a Google Maps marker via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/marker
 */
var MapMarker = /** @class */ (function () {
    function MapMarker(_googleMap, _ngZone) {
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
    Object.defineProperty(MapMarker.prototype, "options", {
        set: function (options) {
            this._options.next(options || DEFAULT_MARKER_OPTIONS);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapMarker.prototype, "title", {
        set: function (title) {
            this._title.next(title);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapMarker.prototype, "position", {
        set: function (position) {
            this._position.next(position);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapMarker.prototype, "label", {
        set: function (label) {
            this._label.next(label);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapMarker.prototype, "clickable", {
        set: function (clickable) {
            this._clickable.next(clickable);
        },
        enumerable: true,
        configurable: true
    });
    MapMarker.prototype.ngOnInit = function () {
        var _this = this;
        if (this._googleMap._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(function (options) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                _this._ngZone.runOutsideAngular(function () { return _this._marker = new google.maps.Marker(options); });
                _this._marker.setMap(_this._googleMap._googleMap);
                _this._eventManager.setTarget(_this._marker);
            });
            this._watchForOptionsChanges();
            this._watchForTitleChanges();
            this._watchForPositionChanges();
            this._watchForLabelChanges();
            this._watchForClickableChanges();
        }
    };
    MapMarker.prototype.ngOnDestroy = function () {
        this._destroy.next();
        this._destroy.complete();
        this._eventManager.destroy();
        if (this._marker) {
            this._marker.setMap(null);
        }
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
     */
    MapMarker.prototype.getAnimation = function () {
        return (this._marker && this._marker.getAnimation()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
     */
    MapMarker.prototype.getClickable = function () {
        return this._marker ? this._marker.getClickable() : false;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
     */
    MapMarker.prototype.getCursor = function () {
        return (this._marker && this._marker.getCursor()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
     */
    MapMarker.prototype.getDraggable = function () {
        return this._marker ? !!this._marker.getDraggable() : false;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
     */
    MapMarker.prototype.getIcon = function () {
        return (this._marker && this._marker.getIcon()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
     */
    MapMarker.prototype.getLabel = function () {
        return (this._marker && this._marker.getLabel()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
     */
    MapMarker.prototype.getOpacity = function () {
        return (this._marker && this._marker.getOpacity()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
     */
    MapMarker.prototype.getPosition = function () {
        return (this._marker && this._marker.getPosition()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
     */
    MapMarker.prototype.getShape = function () {
        return (this._marker && this._marker.getShape()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
     */
    MapMarker.prototype.getTitle = function () {
        return (this._marker && this._marker.getTitle()) || null;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
     */
    MapMarker.prototype.getVisible = function () {
        return this._marker ? this._marker.getVisible() : false;
    };
    /**
     * See
     * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
     */
    MapMarker.prototype.getZIndex = function () {
        return (this._marker && this._marker.getZIndex()) || null;
    };
    MapMarker.prototype._combineOptions = function () {
        var _this = this;
        return combineLatest([this._options, this._title, this._position, this._label, this._clickable])
            .pipe(map(function (_a) {
            var _b = __read(_a, 5), options = _b[0], title = _b[1], position = _b[2], label = _b[3], clickable = _b[4];
            var combinedOptions = __assign(__assign({}, options), { title: title || options.title, position: position || options.position, label: label || options.label, clickable: clickable !== undefined ? clickable : options.clickable, map: _this._googleMap._googleMap || null });
            return combinedOptions;
        }));
    };
    MapMarker.prototype._watchForOptionsChanges = function () {
        var _this = this;
        this._options.pipe(takeUntil(this._destroy)).subscribe(function (options) {
            if (_this._marker) {
                _this._marker.setOptions(options);
            }
        });
    };
    MapMarker.prototype._watchForTitleChanges = function () {
        var _this = this;
        this._title.pipe(takeUntil(this._destroy)).subscribe(function (title) {
            if (_this._marker && title !== undefined) {
                _this._marker.setTitle(title);
            }
        });
    };
    MapMarker.prototype._watchForPositionChanges = function () {
        var _this = this;
        this._position.pipe(takeUntil(this._destroy)).subscribe(function (position) {
            if (_this._marker && position) {
                _this._marker.setPosition(position);
            }
        });
    };
    MapMarker.prototype._watchForLabelChanges = function () {
        var _this = this;
        this._label.pipe(takeUntil(this._destroy)).subscribe(function (label) {
            if (_this._marker && label !== undefined) {
                _this._marker.setLabel(label);
            }
        });
    };
    MapMarker.prototype._watchForClickableChanges = function () {
        var _this = this;
        this._clickable.pipe(takeUntil(this._destroy)).subscribe(function (clickable) {
            if (_this._marker && clickable !== undefined) {
                _this._marker.setClickable(clickable);
            }
        });
    };
    MapMarker.decorators = [
        { type: Component, args: [{
                    selector: 'map-marker',
                    template: '<ng-content></ng-content>',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                }] }
    ];
    /** @nocollapse */
    MapMarker.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: NgZone }
    ]; };
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
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Polygon via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
 */
var MapPolygon = /** @class */ (function () {
    function MapPolygon(_map, _ngZone) {
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
    Object.defineProperty(MapPolygon.prototype, "options", {
        set: function (options) {
            this._options.next(options || {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolygon.prototype, "paths", {
        set: function (paths) {
            this._paths.next(paths);
        },
        enumerable: true,
        configurable: true
    });
    MapPolygon.prototype.ngOnInit = function () {
        var _this = this;
        if (this._map._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(function (options) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                _this._ngZone.runOutsideAngular(function () {
                    _this._polygon = new google.maps.Polygon(options);
                });
                _this._polygon.setMap(_this._map._googleMap);
                _this._eventManager.setTarget(_this._polygon);
            });
            this._watchForOptionsChanges();
            this._watchForPathChanges();
        }
    };
    MapPolygon.prototype.ngOnDestroy = function () {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        if (this._polygon) {
            this._polygon.setMap(null);
        }
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
     */
    MapPolygon.prototype.getDraggable = function () {
        return this._polygon.getDraggable();
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
     */
    MapPolygon.prototype.getEditable = function () {
        return this._polygon.getEditable();
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
     */
    MapPolygon.prototype.getPath = function () {
        return this._polygon.getPath();
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
     */
    MapPolygon.prototype.getPaths = function () {
        return this._polygon.getPaths();
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
     */
    MapPolygon.prototype.getVisible = function () {
        return this._polygon.getVisible();
    };
    MapPolygon.prototype._combineOptions = function () {
        return combineLatest([this._options, this._paths]).pipe(map(function (_a) {
            var _b = __read(_a, 2), options = _b[0], paths = _b[1];
            var combinedOptions = __assign(__assign({}, options), { paths: paths || options.paths });
            return combinedOptions;
        }));
    };
    MapPolygon.prototype._watchForOptionsChanges = function () {
        var _this = this;
        this._options.pipe(takeUntil(this._destroyed)).subscribe(function (options) {
            _this._polygon.setOptions(options);
        });
    };
    MapPolygon.prototype._watchForPathChanges = function () {
        var _this = this;
        this._paths.pipe(takeUntil(this._destroyed)).subscribe(function (paths) {
            if (paths) {
                _this._polygon.setPaths(paths);
            }
        });
    };
    MapPolygon.decorators = [
        { type: Directive, args: [{
                    selector: 'map-polygon',
                },] }
    ];
    /** @nocollapse */
    MapPolygon.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: NgZone }
    ]; };
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
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Polyline via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
 */
var MapPolyline = /** @class */ (function () {
    function MapPolyline(_map, _ngZone) {
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
    Object.defineProperty(MapPolyline.prototype, "options", {
        set: function (options) {
            this._options.next(options || {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapPolyline.prototype, "path", {
        set: function (path) {
            this._path.next(path);
        },
        enumerable: true,
        configurable: true
    });
    MapPolyline.prototype.ngOnInit = function () {
        var _this = this;
        if (this._map._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(function (options) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                _this._ngZone.runOutsideAngular(function () { return _this._polyline = new google.maps.Polyline(options); });
                _this._polyline.setMap(_this._map._googleMap);
                _this._eventManager.setTarget(_this._polyline);
            });
            this._watchForOptionsChanges();
            this._watchForPathChanges();
        }
    };
    MapPolyline.prototype.ngOnDestroy = function () {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        if (this._polyline) {
            this._polyline.setMap(null);
        }
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
     */
    MapPolyline.prototype.getDraggable = function () {
        return this._polyline ? this._polyline.getDraggable() : false;
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
     */
    MapPolyline.prototype.getEditable = function () {
        return this._polyline ? this._polyline.getEditable() : false;
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
     */
    MapPolyline.prototype.getPath = function () {
        // @breaking-change 11.0.0 Make the return value nullable.
        return this._polyline ? this._polyline.getPath() : null;
    };
    /**
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
     */
    MapPolyline.prototype.getVisible = function () {
        return this._polyline ? this._polyline.getVisible() : false;
    };
    MapPolyline.prototype._combineOptions = function () {
        return combineLatest([this._options, this._path]).pipe(map(function (_a) {
            var _b = __read(_a, 2), options = _b[0], path = _b[1];
            var combinedOptions = __assign(__assign({}, options), { path: path || options.path });
            return combinedOptions;
        }));
    };
    MapPolyline.prototype._watchForOptionsChanges = function () {
        var _this = this;
        this._options.pipe(takeUntil(this._destroyed)).subscribe(function (options) {
            if (_this._polyline) {
                _this._polyline.setOptions(options);
            }
        });
    };
    MapPolyline.prototype._watchForPathChanges = function () {
        var _this = this;
        this._path.pipe(takeUntil(this._destroyed)).subscribe(function (path) {
            if (path && _this._polyline) {
                _this._polyline.setPath(path);
            }
        });
    };
    MapPolyline.decorators = [
        { type: Directive, args: [{
                    selector: 'map-polyline',
                },] }
    ];
    /** @nocollapse */
    MapPolyline.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: NgZone }
    ]; };
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
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Angular component that renders a Google Maps Rectangle via the Google Maps JavaScript API.
 * @see developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
 */
var MapRectangle = /** @class */ (function () {
    function MapRectangle(_map, _ngZone) {
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
    Object.defineProperty(MapRectangle.prototype, "options", {
        set: function (options) {
            this._options.next(options || {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapRectangle.prototype, "bounds", {
        set: function (bounds) {
            this._bounds.next(bounds);
        },
        enumerable: true,
        configurable: true
    });
    MapRectangle.prototype.ngOnInit = function () {
        var _this = this;
        if (this._map._isBrowser) {
            this._combineOptions().pipe(take(1)).subscribe(function (options) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                _this._ngZone.runOutsideAngular(function () {
                    _this._rectangle = new google.maps.Rectangle(options);
                });
                _this._rectangle.setMap(_this._map._googleMap);
                _this._eventManager.setTarget(_this._rectangle);
            });
            this._watchForOptionsChanges();
            this._watchForBoundsChanges();
        }
    };
    MapRectangle.prototype.ngOnDestroy = function () {
        this._eventManager.destroy();
        this._destroyed.next();
        this._destroyed.complete();
        if (this._rectangle) {
            this._rectangle.setMap(null);
        }
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
     */
    MapRectangle.prototype.getBounds = function () {
        return this._rectangle.getBounds();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
     */
    MapRectangle.prototype.getDraggable = function () {
        return this._rectangle.getDraggable();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
     */
    MapRectangle.prototype.getEditable = function () {
        return this._rectangle.getEditable();
    };
    /**
     * @see
     * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
     */
    MapRectangle.prototype.getVisible = function () {
        return this._rectangle.getVisible();
    };
    MapRectangle.prototype._combineOptions = function () {
        return combineLatest([this._options, this._bounds]).pipe(map(function (_a) {
            var _b = __read(_a, 2), options = _b[0], bounds = _b[1];
            var combinedOptions = __assign(__assign({}, options), { bounds: bounds || options.bounds });
            return combinedOptions;
        }));
    };
    MapRectangle.prototype._watchForOptionsChanges = function () {
        var _this = this;
        this._options.pipe(takeUntil(this._destroyed)).subscribe(function (options) {
            _this._rectangle.setOptions(options);
        });
    };
    MapRectangle.prototype._watchForBoundsChanges = function () {
        var _this = this;
        this._bounds.pipe(takeUntil(this._destroyed)).subscribe(function (bounds) {
            if (bounds) {
                _this._rectangle.setBounds(bounds);
            }
        });
    };
    MapRectangle.decorators = [
        { type: Directive, args: [{
                    selector: 'map-rectangle',
                },] }
    ];
    /** @nocollapse */
    MapRectangle.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: NgZone }
    ]; };
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
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var COMPONENTS = [
    GoogleMap,
    MapInfoWindow,
    MapMarker,
    MapPolyline,
    MapPolygon,
    MapRectangle,
];
var GoogleMapsModule = /** @class */ (function () {
    function GoogleMapsModule() {
    }
    GoogleMapsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: COMPONENTS,
                    exports: COMPONENTS,
                },] }
    ];
    return GoogleMapsModule;
}());

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

export { GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker, MapPolygon, MapPolyline, MapRectangle };
//# sourceMappingURL=google-maps.js.map
