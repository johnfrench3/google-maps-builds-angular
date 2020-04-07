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
    zoom: 17
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLW1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9nb29nbGUtbWFwL2dvb2dsZS1tYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFJTCxNQUFNLEVBQ04saUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixNQUFNLEVBQ04sV0FBVyxFQUNYLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRSxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFlckQsNENBQTRDO0FBQzVDLE1BQU0sQ0FBQyxJQUFNLGVBQWUsR0FBMkI7SUFDckQsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxVQUFVLEVBQUM7SUFDMUMsSUFBSSxFQUFFLEVBQUU7Q0FDVCxDQUFDO0FBRUYsbURBQW1EO0FBQ25ELE1BQU0sQ0FBQyxJQUFNLGNBQWMsR0FBRyxPQUFPLENBQUM7QUFDdEMsa0RBQWtEO0FBQ2xELE1BQU0sQ0FBQyxJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7QUFFckM7Ozs7R0FJRztBQUNIO0lBNEtFLG1CQUNtQixXQUF1QixFQUNoQyxPQUFlO0lBQ3ZCOzs7T0FHRztJQUM4QixVQUFtQjtRQU5uQyxnQkFB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QUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBSSxLQUFLLE9BQUksQ0FBQztBQUM1RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPcHRpb25hbCxcbiAgSW5qZWN0LFxuICBQTEFURk9STV9JRCxcbiAgTmdab25lLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc2hhcmVSZXBsYXksIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtNYXBFdmVudE1hbmFnZXJ9IGZyb20gJy4uL21hcC1ldmVudC1tYW5hZ2VyJztcblxuaW50ZXJmYWNlIEdvb2dsZU1hcHNXaW5kb3cgZXh0ZW5kcyBXaW5kb3cge1xuICBnb29nbGU/OiB0eXBlb2YgZ29vZ2xlO1xufVxuXG4vLyBUT0RPKG1iZWhybGljaCk6IFVwZGF0ZSB0aGlzIHRvIHVzZSBvcmlnaW5hbCBtYXAgYWZ0ZXIgdXBkYXRpbmcgRGVmaW5pdGVseVR5cGVkXG4vKipcbiAqIEV4dGVuZHMgdGhlIEdvb2dsZSBNYXAgaW50ZXJmYWNlIGR1ZSB0byB0aGUgRGVmaW5pdGVseSBUeXBlZCBpbXBsZW1lbnRhdGlvblxuICogbWlzc2luZyBcImdldENsaWNrYWJsZUljb25zXCIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlZEdvb2dsZU1hcCBleHRlbmRzIGdvb2dsZS5tYXBzLk1hcCB7XG4gIGdldENsaWNrYWJsZUljb25zOiAoKSA9PiBib29sZWFuO1xufVxuXG4vKiogZGVmYXVsdCBvcHRpb25zIHNldCB0byB0aGUgR29vZ2xlcGxleCAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfT1BUSU9OUzogZ29vZ2xlLm1hcHMuTWFwT3B0aW9ucyA9IHtcbiAgY2VudGVyOiB7bGF0OiAzNy40MjE5OTUsIGxuZzogLTEyMi4wODQwOTJ9LFxuICB6b29tOiAxN1xufTtcblxuLyoqIEFyYml0cmFyeSBkZWZhdWx0IGhlaWdodCBmb3IgdGhlIG1hcCBlbGVtZW50ICovXG5leHBvcnQgY29uc3QgREVGQVVMVF9IRUlHSFQgPSAnNTAwcHgnO1xuLyoqIEFyYml0cmFyeSBkZWZhdWx0IHdpZHRoIGZvciB0aGUgbWFwIGVsZW1lbnQgKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX1dJRFRIID0gJzUwMHB4JztcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdFxuICogQVBJLlxuICogQHNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2dvb2dsZS1tYXAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibWFwLWNvbnRhaW5lclwiPjwvZGl2PjxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBHb29nbGVNYXAgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyOiBNYXBFdmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgX2dvb2dsZU1hcENoYW5nZXM6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwPjtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID0gbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NYXBPcHRpb25zPihERUZBVUxUX09QVElPTlMpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jZW50ZXIgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3pvb20gPSBuZXcgQmVoYXZpb3JTdWJqZWN0PG51bWJlcnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9tYXBFbDogSFRNTEVsZW1lbnQ7XG4gIF9nb29nbGVNYXA6IFVwZGF0ZWRHb29nbGVNYXA7XG5cbiAgLyoqIFdoZXRoZXIgd2UncmUgY3VycmVudGx5IHJlbmRlcmluZyBpbnNpZGUgYSBicm93c2VyLiAqL1xuICBfaXNCcm93c2VyOiBib29sZWFuO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIG1hcC4gKi9cbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmcgfCBudW1iZXIgPSBERUZBVUxUX0hFSUdIVDtcblxuICAvKiogV2lkdGggb2YgdGhlIG1hcC4gKi9cbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZyB8IG51bWJlciA9IERFRkFVTFRfV0lEVEg7XG5cbiAgLyoqXG4gICAqIFR5cGUgb2YgbWFwIHRoYXQgc2hvdWxkIGJlIHJlbmRlcmVkLiBFLmcuIGh5YnJpZCBtYXAsIHRlcnJhaW4gbWFwIGV0Yy5cbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcFR5cGVJZFxuICAgKi9cbiAgQElucHV0KCkgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQgfCB1bmRlZmluZWQ7XG5cbiAgQElucHV0KClcbiAgc2V0IGNlbnRlcihjZW50ZXI6IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8Z29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fY2VudGVyLm5leHQoY2VudGVyKTtcbiAgfVxuICBASW5wdXQoKVxuICBzZXQgem9vbSh6b29tOiBudW1iZXIpIHtcbiAgICB0aGlzLl96b29tLm5leHQoem9vbSk7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuTWFwT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IERFRkFVTFRfT1BUSU9OUyk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmJvdW5kc19jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgYm91bmRzQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignYm91bmRzX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmNlbnRlcl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2VudGVyQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2VudGVyX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudHxnb29nbGUubWFwcy5JY29uTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnR8Z29vZ2xlLm1hcHMuSWNvbk1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5kcmFnXG4gICAqL1xuICBAT3V0cHV0KCkgbWFwRHJhZzogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpIG1hcERyYWdlbmQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpIG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5oZWFkaW5nX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBoZWFkaW5nQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignaGVhZGluZ19jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5pZGxlXG4gICAqL1xuICBAT3V0cHV0KCkgaWRsZTogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignaWRsZScpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubWFwdHlwZWlkX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXB0eXBlaWRDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdtYXB0eXBlaWRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAubW91c2Vtb3ZlXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2Vtb3ZlOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2Vtb3ZlJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2VvdXQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlb3ZlcjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnByb2plY3Rpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHByb2plY3Rpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncHJvamVjdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ3JpZ2h0Y2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLnRpbGVzbG9hZGVkXG4gICAqL1xuICBAT3V0cHV0KCkgdGlsZXNsb2FkZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpbGVzbG9hZGVkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC50aWx0X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSB0aWx0Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndGlsdF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC56b29tX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSB6b29tQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignem9vbV9jaGFuZ2VkJyk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAvKipcbiAgICAgKiBAZGVwcmVjYXRlZCBgcGxhdGZvcm1JZGAgcGFyYW1ldGVyIHRvIGJlY29tZSByZXF1aXJlZC5cbiAgICAgKiBAYnJlYWtpbmctY2hhbmdlIDEwLjAuMFxuICAgICAqL1xuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ/OiBPYmplY3QpIHtcblxuICAgIC8vIEBicmVha2luZy1jaGFuZ2UgMTAuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgcGxhdGZvcm1JZGAuXG4gICAgdGhpcy5faXNCcm93c2VyID1cbiAgICAgICAgcGxhdGZvcm1JZCA/IGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpIDogdHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcgJiYgISF3aW5kb3c7XG5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBnb29nbGVNYXBzV2luZG93OiBHb29nbGVNYXBzV2luZG93ID0gd2luZG93O1xuICAgICAgaWYgKCFnb29nbGVNYXBzV2luZG93Lmdvb2dsZSkge1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgICdOYW1lc3BhY2UgZ29vZ2xlIG5vdCBmb3VuZCwgY2Fubm90IGNvbnN0cnVjdCBlbWJlZGRlZCBnb29nbGUgJyArXG4gICAgICAgICAgICAnbWFwLiBQbGVhc2UgaW5zdGFsbCB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEk6ICcgK1xuICAgICAgICAgICAgJ2h0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0LycgK1xuICAgICAgICAgICAgJ3R1dG9yaWFsI0xvYWRpbmdfdGhlX01hcHNfQVBJJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fc2V0U2l6ZSgpO1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAgJiYgdGhpcy5tYXBUeXBlSWQpIHtcbiAgICAgIHRoaXMuX2dvb2dsZU1hcC5zZXRNYXBUeXBlSWQodGhpcy5tYXBUeXBlSWQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIEl0IHNob3VsZCBiZSBhIG5vb3AgZHVyaW5nIHNlcnZlci1zaWRlIHJlbmRlcmluZy5cbiAgICBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9tYXBFbCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubWFwLWNvbnRhaW5lcicpITtcbiAgICAgIHRoaXMuX3NldFNpemUoKTtcbiAgICAgIHRoaXMuX2dvb2dsZU1hcENoYW5nZXMgPSB0aGlzLl9pbml0aWFsaXplTWFwKHRoaXMuX2NvbWJpbmVPcHRpb25zKCkpO1xuICAgICAgdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcy5zdWJzY3JpYmUoKGdvb2dsZU1hcDogZ29vZ2xlLm1hcHMuTWFwKSA9PiB7XG4gICAgICAgIHRoaXMuX2dvb2dsZU1hcCA9IGdvb2dsZU1hcCBhcyBVcGRhdGVkR29vZ2xlTWFwO1xuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMuX2dvb2dsZU1hcCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JDZW50ZXJDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclpvb21DaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmZpdEJvdW5kc1xuICAgKi9cbiAgZml0Qm91bmRzKFxuICAgICAgYm91bmRzOiBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN8Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzTGl0ZXJhbCxcbiAgICAgIHBhZGRpbmc/OiBudW1iZXJ8Z29vZ2xlLm1hcHMuUGFkZGluZykge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgdGhpcy5fZ29vZ2xlTWFwLmZpdEJvdW5kcyhib3VuZHMsIHBhZGRpbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5CeVxuICAgKi9cbiAgcGFuQnkoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuX2dvb2dsZU1hcC5wYW5CeSh4LCB5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAucGFuVG9cbiAgICovXG4gIHBhblRvKGxhdExuZzogZ29vZ2xlLm1hcHMuTGF0TG5nfGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHRoaXMuX2dvb2dsZU1hcC5wYW5UbyhsYXRMbmcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5wYW5Ub0JvdW5kc1xuICAgKi9cbiAgcGFuVG9Cb3VuZHMoXG4gICAgICBsYXRMbmdCb3VuZHM6IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc3xnb29nbGUubWFwcy5MYXRMbmdCb3VuZHNMaXRlcmFsLFxuICAgICAgcGFkZGluZz86IG51bWJlcnxnb29nbGUubWFwcy5QYWRkaW5nKSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICB0aGlzLl9nb29nbGVNYXAucGFuVG9Cb3VuZHMobGF0TG5nQm91bmRzLCBwYWRkaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Qm91bmRzXG4gICAqL1xuICBnZXRCb3VuZHMoKTogZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRCb3VuZHMoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRDZW50ZXJcbiAgICovXG4gIGdldENlbnRlcigpOiBnb29nbGUubWFwcy5MYXRMbmcge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRDZW50ZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0Q2xpY2thYmxlSWNvbnNcbiAgICovXG4gIGdldENsaWNrYWJsZUljb25zKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRDbGlja2FibGVJY29ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRIZWFkaW5nXG4gICAqL1xuICBnZXRIZWFkaW5nKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLmdldEhlYWRpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0TWFwVHlwZUlkXG4gICAqL1xuICBnZXRNYXBUeXBlSWQoKTogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkfHN0cmluZyB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLmdldE1hcFR5cGVJZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRQcm9qZWN0aW9uXG4gICAqL1xuICBnZXRQcm9qZWN0aW9uKCk6IGdvb2dsZS5tYXBzLlByb2plY3Rpb258bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLmdldFByb2plY3Rpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZ2V0U3RyZWV0Vmlld1xuICAgKi9cbiAgZ2V0U3RyZWV0VmlldygpOiBnb29nbGUubWFwcy5TdHJlZXRWaWV3UGFub3JhbWEge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5nZXRTdHJlZXRWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLmdldFRpbHRcbiAgICovXG4gIGdldFRpbHQoKTogbnVtYmVyIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLl9nb29nbGVNYXAuZ2V0VGlsdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFwI01hcC5nZXRab29tXG4gICAqL1xuICBnZXRab29tKCk6IG51bWJlciB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLmdldFpvb20oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuY29udHJvbHNcbiAgICovXG4gIGdldCBjb250cm9scygpOiBBcnJheTxnb29nbGUubWFwcy5NVkNBcnJheTxOb2RlPj4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMuX2dvb2dsZU1hcC5jb250cm9scztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcCNNYXAuZGF0YVxuICAgKi9cbiAgZ2V0IGRhdGEoKTogZ29vZ2xlLm1hcHMuRGF0YSB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm1hcFR5cGVzXG4gICAqL1xuICBnZXQgbWFwVHlwZXMoKTogZ29vZ2xlLm1hcHMuTWFwVHlwZVJlZ2lzdHJ5IHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLl9nb29nbGVNYXAubWFwVHlwZXM7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXAjTWFwLm92ZXJsYXlNYXBUeXBlc1xuICAgKi9cbiAgZ2V0IG92ZXJsYXlNYXBUeXBlcygpOiBnb29nbGUubWFwcy5NVkNBcnJheTxnb29nbGUubWFwcy5NYXBUeXBlPiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5fZ29vZ2xlTWFwLm92ZXJsYXlNYXBUeXBlcztcbiAgfVxuXG4gIHByaXZhdGUgX3NldFNpemUoKSB7XG4gICAgaWYgKHRoaXMuX21hcEVsKSB7XG4gICAgICBjb25zdCBzdHlsZXMgPSB0aGlzLl9tYXBFbC5zdHlsZTtcbiAgICAgIHN0eWxlcy5oZWlnaHQgPSBjb2VyY2VDc3NQaXhlbFZhbHVlKHRoaXMuaGVpZ2h0KSB8fCBERUZBVUxUX0hFSUdIVDtcbiAgICAgIHN0eWxlcy53aWR0aCA9IGNvZXJjZUNzc1BpeGVsVmFsdWUodGhpcy53aWR0aCkgfHwgREVGQVVMVF9XSURUSDtcbiAgICB9XG4gIH1cblxuICAvKiogQ29tYmluZXMgdGhlIGNlbnRlciBhbmQgem9vbSBhbmQgdGhlIG90aGVyIG1hcCBvcHRpb25zIGludG8gYSBzaW5nbGUgb2JqZWN0ICovXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl9jZW50ZXIsIHRoaXMuX3pvb21dKVxuICAgICAgICAucGlwZShtYXAoKFtvcHRpb25zLCBjZW50ZXIsIHpvb21dKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5NYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIGNlbnRlcjogY2VudGVyIHx8IG9wdGlvbnMuY2VudGVyLFxuICAgICAgICAgICAgem9vbTogem9vbSAhPT0gdW5kZWZpbmVkID8gem9vbSA6IG9wdGlvbnMuem9vbSxcbiAgICAgICAgICAgIG1hcFR5cGVJZDogdGhpcy5tYXBUeXBlSWRcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRpYWxpemVNYXAob3B0aW9uc0NoYW5nZXM6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFwT3B0aW9ucz4pOlxuICAgICAgT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXA+IHtcbiAgICByZXR1cm4gb3B0aW9uc0NoYW5nZXMucGlwZShcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgbWFwKG9wdGlvbnMgPT4ge1xuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgICAvLyB1c2VyIGhhcyBzdWJzY3JpYmVkIHRvLlxuICAgICAgICAgIHJldHVybiB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gbmV3IGdvb2dsZS5tYXBzLk1hcCh0aGlzLl9tYXBFbCwgb3B0aW9ucykpO1xuICAgICAgICB9KSxcbiAgICAgICAgc2hhcmVSZXBsYXkoMSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9vcHRpb25zXSlcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKVxuICAgICAgICAuc3Vic2NyaWJlKChbZ29vZ2xlTWFwLCBvcHRpb25zXSkgPT4ge1xuICAgICAgICAgIGdvb2dsZU1hcC5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2VudGVyQ2hhbmdlcygpIHtcbiAgICBjb21iaW5lTGF0ZXN0KFt0aGlzLl9nb29nbGVNYXBDaGFuZ2VzLCB0aGlzLl9jZW50ZXJdKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKFtnb29nbGVNYXAsIGNlbnRlcl0pID0+IHtcbiAgICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Q2VudGVyKGNlbnRlcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yWm9vbUNoYW5nZXMoKSB7XG4gICAgY29tYmluZUxhdGVzdChbdGhpcy5fZ29vZ2xlTWFwQ2hhbmdlcywgdGhpcy5fem9vbV0pXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgICAgLnN1YnNjcmliZSgoW2dvb2dsZU1hcCwgem9vbV0pID0+IHtcbiAgICAgICAgICBpZiAoem9vbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBnb29nbGVNYXAuc2V0Wm9vbSh6b29tKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgbWFwIGhhcyBiZWVuIGluaXRpYWxpemVkLiAqL1xuICBwcml2YXRlIF9hc3NlcnRJbml0aWFsaXplZCgpIHtcbiAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgICAgICAgICAnUGxlYXNlIHdhaXQgZm9yIHRoZSBBUEkgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG5cbmNvbnN0IGNzc1VuaXRzUGF0dGVybiA9IC8oW0EtWmEteiVdKykkLztcblxuLyoqIENvZXJjZXMgYSB2YWx1ZSB0byBhIENTUyBwaXhlbCB2YWx1ZS4gKi9cbmZ1bmN0aW9uIGNvZXJjZUNzc1BpeGVsVmFsdWUodmFsdWU6IGFueSk6IHN0cmluZyB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG5cbiAgcmV0dXJuIGNzc1VuaXRzUGF0dGVybi50ZXN0KHZhbHVlKSA/IHZhbHVlIDogYCR7dmFsdWV9cHhgO1xufVxuIl19