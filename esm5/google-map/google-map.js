/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __assign, __read } from "tslib";
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="googlemaps" />
import { ChangeDetectionStrategy, Component, ElementRef, Input, Output, ViewEncapsulation, Optional, Inject, PLATFORM_ID, NgZone, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { MapEventManager } from '../map-event-manager';
/** default options set to the Googleplex */
export var DEFAULT_OPTIONS = {
    center: { lat: 37.421995, lng: -122.084092 },
    zoom: 17,
    mapTypeId: undefined
};
/** Arbitrary default height for the map element */
export var DEFAULT_HEIGHT = '500px';
/** Arbitrary default width for the map element */
export var DEFAULT_WIDTH = '500px';
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
        if (this._googleMap && this.mapTypeId) {
            this._googleMap.setMapTypeId(this.mapTypeId);
        }
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
        var _this = this;
        return combineLatest([this._options, this._center, this._zoom])
            .pipe(map(function (_a) {
            var _b = __read(_a, 3), options = _b[0], center = _b[1], zoom = _b[2];
            var combinedOptions = __assign(__assign({}, options), { center: center || options.center, zoom: zoom !== undefined ? zoom : options.zoom, mapTypeId: _this.mapTypeId });
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
}());
export { GoogleMap };
var cssUnitsPattern = /([A-Za-z%]+)$/;
/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
    if (value == null) {
        return '';
    }
    return cssUnitsPattern.test(value) ? value : value + "px";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFJTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixNQUFNLEVBQ04sV0FBVyxFQUNYLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFlckQsNENBQTRDO0FBQzVDLE1BQU0sQ0FBQyxJQUFNLGVBQWUsR0FBMkI7SUFDckQsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7SUFDMUMsSUFBSSxFQUFFLEVBQUU7SUFDUixTQUFTLEVBQUUsU0FBUztDQUNyQixDQUFDO0FBRUYsbURBQW1EO0FBQ25ELE1BQU0sQ0FBQyxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFDdEMsa0RBQWtEO0FBQ2xELE1BQU0sQ0FBQyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7QUFFckM7Ozs7R0FJRztBQUNIO0lBNEtFLG1CQUNtQixXQUF1QixFQUNoQyxPQUFlO0lBQ3ZCOzs7T0FHRztJ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QW1CLENBQUMsS0FBVTtJQUNyQyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBSSxLQUFLLE9BQUksQ0FBQztBQUM1RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0LFxuICBQTEFURk9STV9JRCxcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc2hhcmVSZXBsYXksIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuaW50ZXJmYWNlIEdvb2dsZU1hcHNXaW5kb3cgZXh0ZW5kcyBXaW5kb3cge1xuICBnb29nbGU/OiB0eXBlb2YgZ29vZ2xlO1xufVxuXG4vLyBUT0RPKG1iZWhybGljaCk6IFVwZGF0ZSB0aGlzIHRvIHVzZSBvcmlnaW5hbCBtYXAgYWZ0ZXIgdXBkYXRpbmcgRGVmaW5pdGVseVR5cGVkXG4vKipcbiAqIEV4dGVuZHMgdGhlIEdvb2dsZSBNYXAgaW50ZXJmYWNlIGR1ZSB0byB0aGUgRGVmaW5pdGVseSBUeXBlZCBpbXBsZW1lbnRhdGlvblxuICogbWlzc2luZyBcImdldENsaWNrYWJsZUljb25zXCIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlZEdvb2dsZU1hcCBleHRlbmRzIGdvb2dsZS5tYXBzLk1hcCB7XG4gIGdldENsaWNrYWJsZUljb25zOiAoKSA9PiBib29sZWFuO1xufVxuXG4vKiogZGVmYXVsdCBvcHRpb25zIHNldCB0byB0aGUgR29vZ2xlcGxleCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUzogZ29vZ2xlLm1hcHMuTWFwT3B0aW9ucyA9IHtcbiAgY2VudGVyOiB7bGF0OiAzNy40MjE5OTUsIGxuZzogLTEyMi4wODQwOTJ9LFxuICB6b29tOiAxNyxcbiAgbWFwVHlwZUlkOiB1bmRlZmluZWRcbn07XG5cbi8qKiBBcmJpdHJhcnkgZGVmYXVsdCBoZWlnaHQgZm9yIHRoZSBtYXAgZWxlbWVudCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfSEVJR0hUID0gJzUwMHB4Jztcbi8qKiBBcmJpdHJhcnkgZGVmYXVsdCB3aWR0aCBmb3IgdGhlIG1hcCBlbGVtZW50ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9XSURUSCA9ICc1MDBweCc7XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcCB2aWEgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHRcbiAqIEFQSS5cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL1xuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdnb29nbGUtbWFwJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm1hcC1jb250YWluZXJcIj48L2Rpdj48bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgR29vZ2xlTWFwIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlcjogTWFwRXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIF9nb29nbGVNYXBDaGFuZ2VzOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcD47XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4oREVGQVVMVF9PUFRJT05TKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2VudGVyID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF96b29tID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXJ8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfbWFwRWw6IEhUTUxFbGVtZW50O1xuICBfZ29vZ2xlTWFwOiBVcGRhdGVkR29vZ2xlTWFwO1xuXG4gIC8qKiBXaGV0aGVyIHdlJ3JlIGN1cnJlbnRseSByZW5kZXJpbmcgaW5zaWRlIGEgYnJvd3Nlci4gKi9cbiAgX2lzQnJvd3NlcjogYm9vbGVhbjtcblxuICAvKiogSGVpZ2h0IG9mIHRoZSBtYXAuICovXG4gIEBJbnB1dCgpIGhlaWdodDogc3RyaW5nIHwgbnVtYmVyID0gREVGQVVMVF9IRUlHSFQ7XG5cbiAgLyoqIFdpZHRoIG9mIHRoZSBtYXAuICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgfCBudW1iZXIgPSBERUZBVUxUX1dJRFRIO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIG1hcCB0aGF0IHNob3VsZCBiZSByZW5kZXJlZC4gRS5nLiBoeWJyaWQgbWFwLCB0ZXJyYWluIG1hcCBldGMuXG4gICAqIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXBUeXBlSWRcbiAgICovXG4gIEBJbnB1dCgpIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkIHwgdW5kZWZpbmVkO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBjZW50ZXIoY2VudGVyOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX2NlbnRlci5uZXh0KGNlbnRlcik7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IHpvb20oem9vbTogbnVtYmVyKSB7XG4gICAgdGhpcy5fem9vbS5uZXh0KHpvb20pO1xuICB9XG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcE9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCBERUZBVUxUX09QVElPTlMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5ib3VuZHNfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGJvdW5kc0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2JvdW5kc19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jZW50ZXJfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNlbnRlckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NlbnRlcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnR8Z29vZ2xlLm1hcHMuSWNvbk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50fGdvb2dsZS5tYXBzLkljb25Nb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpIG1hcERyYWc6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKSBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaGVhZGluZ19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgaGVhZGluZ0NoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2hlYWRpbmdfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuaWRsZVxuICAgKi9cbiAgQE91dHB1dCgpIGlkbGU6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2lkbGUnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcHR5cGVpZF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwdHlwZWlkQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignbWFwdHlwZWlkX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1vdXNlbW92ZVxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlbW92ZTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlbW92ZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wcm9qZWN0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwcm9qZWN0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Byb2plY3Rpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC50aWxlc2xvYWRlZFxuICAgKi9cbiAgQE91dHB1dCgpIHRpbGVzbG9hZGVkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aWxlc2xvYWRlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAudGlsdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgdGlsdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpbHRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuem9vbV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgem9vbUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3pvb21fY2hhbmdlZCcpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYHBsYXRmb3JtSWRgIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkPzogT2JqZWN0KSB7XG5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMCBSZW1vdmUgbnVsbCBjaGVjayBmb3IgYHBsYXRmb3JtSWRgLlxuICAgIHRoaXMuX2lzQnJvd3NlciA9XG4gICAgICAgIHBsYXRmb3JtSWQgPyBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSA6IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmICEhd2luZG93O1xuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgY29uc3QgZ29vZ2xlTWFwc1dpbmRvdzogR29vZ2xlTWFwc1dpbmRvdyA9IHdpbmRvdztcbiAgICAgIGlmICghZ29vZ2xlTWFwc1dpbmRvdy5nb29nbGUpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnTmFtZXNwYWNlIGdvb2dsZSBub3QgZm91bmQsIGNhbm5vdCBjb25zdHJ1Y3QgZW1iZWRkZWQgZ29vZ2xlICcgK1xuICAgICAgICAgICAgJ21hcC4gUGxlYXNlIGluc3RhbGwgdGhlIEdvb2dsZSBNYXBzIEphdmFTY3JpcHQgQVBJOiAnICtcbiAgICAgICAgICAgICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC8nICtcbiAgICAgICAgICAgICd0dXRvcmlhbCNMb2FkaW5nX3RoZV9NYXBzX0FQSScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuX3NldFNpemUoKTtcbiAgICBpZiAodGhpcy5fZ29vZ2xlTWFwICYmIHRoaXMubWFwVHlwZUlkKSB7XG4gICAgICB0aGlzLl9nb29nbGVNYXAuc2V0TWFwVHlwZUlkKHRoaXMubWFwVHlwZUlkKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBJdCBzaG91bGQgYmUgYSBub29wIGR1cmluZyBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuXG4gICAgaWYgKHRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fbWFwRWwgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1hcC1jb250YWluZXInKSE7XG4gICAgICB0aGlzLl9zZXRTaXplKCk7XG4gICAgICB0aGlzLl9nb29nbGVNYXBDaGFuZ2VzID0gdGhpcy5faW5pdGlhbGl6ZU1hcCh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIHRoaXMuX2dvb2dsZU1hcENoYW5nZXMuc3Vic2NyaWJlKChnb29nbGVNYXA6IGdvb2dsZS5tYXBzLk1hcCkgPT4ge1xuICAgICAgICB0aGlzLl9nb29nbGVNYXAgPSBnb29nbGVNYXAgYXMgVXBkYXRlZEdvb2dsZU1hcDtcbiAgICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLnNldFRhcmdldCh0aGlzLl9nb29nbGVNYXApO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3Jab29tQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2V2ZW50TWFuYWdlci5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveS5uZXh0KCk7XG4gICAgdGhpcy5fZGVzdHJveS5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5maXRCb3VuZHNcbiAgICovXG4gIGZpdEJvdW5kcyhcbiAgICAgIGJvdW5kczogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc0xpdGVyYWwsXG4gICAgICBwYWRkaW5nPzogbnVtYmVyfGdvb2dsZS5tYXBzLlBhZGRpbmcpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuX2dvb2dsZU1hcC5maXRCb3VuZHMoYm91bmRzLCBwYWRkaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuQnlcbiAgICovXG4gIHBhbkJ5KHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLl9nb29nbGVNYXAucGFuQnkoeCwgeSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnBhblRvXG4gICAqL1xuICBwYW5UbyhsYXRMbmc6IGdvb2dsZS5tYXBzLkxhdExuZ3xnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLl9nb29nbGVNYXAucGFuVG8obGF0TG5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuVG9Cb3VuZHNcbiAgICovXG4gIHBhblRvQm91bmRzKFxuICAgICAgbGF0TG5nQm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN8Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCxcbiAgICAgIHBhZGRpbmc/OiBudW1iZXJ8Z29vZ2xlLm1hcHMuUGFkZGluZykge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5fZ29vZ2xlTWFwLnBhblRvQm91bmRzKGxhdExuZ0JvdW5kcywgcGFkZGluZyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldEJvdW5kc1xuICAgKi9cbiAgZ2V0Qm91bmRzKCk6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLl9nb29nbGVNYXAuZ2V0Qm91bmRzKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Q2VudGVyXG4gICAqL1xuICBnZXRDZW50ZXIoKTogZ29vZ2xlLm1hcHMuTGF0TG5nIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLl9nb29nbGVNYXAuZ2V0Q2VudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldENsaWNrYWJsZUljb25zXG4gICAqL1xuICBnZXRDbGlja2FibGVJY29ucygpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLl9nb29nbGVNYXAuZ2V0Q2xpY2thYmxlSWNvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0SGVhZGluZ1xuICAgKi9cbiAgZ2V0SGVhZGluZygpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRIZWFkaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldE1hcFR5cGVJZFxuICAgKi9cbiAgZ2V0TWFwVHlwZUlkKCk6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZHxzdHJpbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRNYXBUeXBlSWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0UHJvamVjdGlvblxuICAgKi9cbiAgZ2V0UHJvamVjdGlvbigpOiBnb29nbGUubWFwcy5Qcm9qZWN0aW9ufG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRQcm9qZWN0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFN0cmVldFZpZXdcbiAgICovXG4gIGdldFN0cmVldFZpZXcoKTogZ29vZ2xlLm1hcHMuU3RyZWV0Vmlld1Bhbm9yYW1hIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLl9nb29nbGVNYXAuZ2V0U3RyZWV0VmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRUaWx0XG4gICAqL1xuICBnZXRUaWx0KCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLmdldFRpbHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Wm9vbVxuICAgKi9cbiAgZ2V0Wm9vbSgpOiBudW1iZXIge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRab29tKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmNvbnRyb2xzXG4gICAqL1xuICBnZXQgY29udHJvbHMoKTogQXJyYXk8Z29vZ2xlLm1hcHMuTVZDQXJyYXk8Tm9kZT4+IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLl9nb29nbGVNYXAuY29udHJvbHM7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRhdGFcbiAgICovXG4gIGdldCBkYXRhKCk6IGdvb2dsZS5tYXBzLkRhdGEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tYXBUeXBlc1xuICAgKi9cbiAgZ2V0IG1hcFR5cGVzKCk6IGdvb2dsZS5tYXBzLk1hcFR5cGVSZWdpc3RyeSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLm1hcFR5cGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5vdmVybGF5TWFwVHlwZXNcbiAgICovXG4gIGdldCBvdmVybGF5TWFwVHlwZXMoKTogZ29vZ2xlLm1hcHMuTVZDQXJyYXk8Z29vZ2xlLm1hcHMuTWFwVHlwZT4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5vdmVybGF5TWFwVHlwZXM7XG4gIH1cblxuICBwcml2YXRlIF9zZXRTaXplKCkge1xuICAgIGlmICh0aGlzLl9tYXBFbCkge1xuICAgICAgY29uc3Qgc3R5bGVzID0gdGhpcy5fbWFwRWwuc3R5bGU7XG4gICAgICBzdHlsZXMuaGVpZ2h0ID0gY29lcmNlQ3NzUGl4ZWxWYWx1ZSh0aGlzLmhlaWdodCkgfHwgREVGQVVMVF9IRUlHSFQ7XG4gICAgICBzdHlsZXMud2lkdGggPSBjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMud2lkdGgpIHx8IERFRkFVTFRfV0lEVEg7XG4gICAgfVxuICB9XG5cbiAgLyoqIENvbWJpbmVzIHRoZSBjZW50ZXIgYW5kIHpvb20gYW5kIHRoZSBvdGhlciBtYXAgb3B0aW9ucyBpbnRvIGEgc2luZ2xlIG9iamVjdCAqL1xuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE9wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fY2VudGVyLCB0aGlzLl96b29tXSlcbiAgICAgICAgLnBpcGUobWFwKChbb3B0aW9ucywgY2VudGVyLCB6b29tXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuTWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBjZW50ZXI6IGNlbnRlciB8fCBvcHRpb25zLmNlbnRlcixcbiAgICAgICAgICAgIHpvb206IHpvb20gIT09IHVuZGVmaW5lZCA/IHpvb20gOiBvcHRpb25zLnpvb20sXG4gICAgICAgICAgICBtYXBUeXBlSWQ6IHRoaXMubWFwVHlwZUlkXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF9pbml0aWFsaXplTWFwKG9wdGlvbnNDaGFuZ2VzOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcE9wdGlvbnM+KTpcbiAgICAgIE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwPiB7XG4gICAgcmV0dXJuIG9wdGlvbnNDaGFuZ2VzLnBpcGUoXG4gICAgICAgIHRha2UoMSksXG4gICAgICAgIG1hcChvcHRpb25zID0+IHtcbiAgICAgICAgICAvLyBDcmVhdGUgdGhlIG9iamVjdCBvdXRzaWRlIHRoZSB6b25lIHNvIGl0cyBldmVudHMgZG9uJ3QgdHJpZ2dlciBjaGFuZ2UgZGV0ZWN0aW9uLlxuICAgICAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgICByZXR1cm4gdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IG5ldyBnb29nbGUubWFwcy5NYXAodGhpcy5fbWFwRWwsIG9wdGlvbnMpKTtcbiAgICAgICAgfSksXG4gICAgICAgIHNoYXJlUmVwbGF5KDEpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKSB7XG4gICAgY29tYmluZUxhdGVzdChbdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcywgdGhpcy5fb3B0aW9uc10pXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgLnN1YnNjcmliZSgoW2dvb2dsZU1hcCwgb3B0aW9uc10pID0+IHtcbiAgICAgICAgICBnb29nbGVNYXAuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckNlbnRlckNoYW5nZXMoKSB7XG4gICAgY29tYmluZUxhdGVzdChbdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcywgdGhpcy5fY2VudGVyXSlcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAuc3Vic2NyaWJlKChbZ29vZ2xlTWFwLCBjZW50ZXJdKSA9PiB7XG4gICAgICAgICAgaWYgKGNlbnRlcikge1xuICAgICAgICAgICAgZ29vZ2xlTWFwLnNldENlbnRlcihjZW50ZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclpvb21DaGFuZ2VzKCkge1xuICAgIGNvbWJpbmVMYXRlc3QoW3RoaXMuX2dvb2dsZU1hcENoYW5nZXMsIHRoaXMuX3pvb21dKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKFtnb29nbGVNYXAsIHpvb21dKSA9PiB7XG4gICAgICAgICAgaWYgKHpvb20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZ29vZ2xlTWFwLnNldFpvb20oem9vbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBBc3NlcnRzIHRoYXQgdGhlIG1hcCBoYXMgYmVlbiBpbml0aWFsaXplZC4gKi9cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKSB7XG4gICAgaWYgKCF0aGlzLl9nb29nbGVNYXApIHtcbiAgICAgIHRocm93IEVycm9yKCdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjc3NVbml0c1BhdHRlcm4gPSAvKFtBLVphLXolXSspJC87XG5cbi8qKiBDb2VyY2VzIGEgdmFsdWUgdG8gYSBDU1MgcGl4ZWwgdmFsdWUuICovXG5mdW5jdGlvbiBjb2VyY2VDc3NQaXhlbFZhbHVlKHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIHJldHVybiBjc3NVbml0c1BhdHRlcm4udGVzdCh2YWx1ZSkgPyB2YWx1ZSA6IGAke3ZhbHVlfXB4YDtcbn1cbiJdfQ==