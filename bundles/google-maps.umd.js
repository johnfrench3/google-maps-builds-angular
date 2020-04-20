(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@angular/google-maps', ['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.googleMaps = {}), global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, common, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

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
            var observable = new rxjs.Observable(function (observer) {
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
        zoom: 17
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
            this._options = new rxjs.BehaviorSubject(DEFAULT_OPTIONS);
            this._center = new rxjs.BehaviorSubject(undefined);
            this._zoom = new rxjs.BehaviorSubject(undefined);
            this._destroy = new rxjs.Subject();
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
                platformId ? common.isPlatformBrowser(platformId) : typeof window === 'object' && !!window;
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
            if (this.googleMap && this.mapTypeId) {
                this.googleMap.setMapTypeId(this.mapTypeId);
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
                    _this.googleMap = googleMap;
                    _this._eventManager.setTarget(_this.googleMap);
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
            this.googleMap.fitBounds(bounds, padding);
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panBy
         */
        GoogleMap.prototype.panBy = function (x, y) {
            this._assertInitialized();
            this.googleMap.panBy(x, y);
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panTo
         */
        GoogleMap.prototype.panTo = function (latLng) {
            this._assertInitialized();
            this.googleMap.panTo(latLng);
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.panToBounds
         */
        GoogleMap.prototype.panToBounds = function (latLngBounds, padding) {
            this._assertInitialized();
            this.googleMap.panToBounds(latLngBounds, padding);
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getBounds
         */
        GoogleMap.prototype.getBounds = function () {
            this._assertInitialized();
            return this.googleMap.getBounds() || null;
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getCenter
         */
        GoogleMap.prototype.getCenter = function () {
            this._assertInitialized();
            return this.googleMap.getCenter();
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getClickableIcons
         */
        GoogleMap.prototype.getClickableIcons = function () {
            this._assertInitialized();
            return this.googleMap.getClickableIcons();
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getHeading
         */
        GoogleMap.prototype.getHeading = function () {
            this._assertInitialized();
            return this.googleMap.getHeading();
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getMapTypeId
         */
        GoogleMap.prototype.getMapTypeId = function () {
            this._assertInitialized();
            return this.googleMap.getMapTypeId();
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getProjection
         */
        GoogleMap.prototype.getProjection = function () {
            this._assertInitialized();
            return this.googleMap.getProjection();
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getStreetView
         */
        GoogleMap.prototype.getStreetView = function () {
            this._assertInitialized();
            return this.googleMap.getStreetView();
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getTilt
         */
        GoogleMap.prototype.getTilt = function () {
            this._assertInitialized();
            return this.googleMap.getTilt();
        };
        /**
         * See
         * https://developers.google.com/maps/documentation/javascript/reference/map#Map.getZoom
         */
        GoogleMap.prototype.getZoom = function () {
            this._assertInitialized();
            return this.googleMap.getZoom();
        };
        Object.defineProperty(GoogleMap.prototype, "controls", {
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/reference/map#Map.controls
             */
            get: function () {
                this._assertInitialized();
                return this.googleMap.controls;
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
                return this.googleMap.data;
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
                return this.googleMap.mapTypes;
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
                return this.googleMap.overlayMapTypes;
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
            return rxjs.combineLatest([this._options, this._center, this._zoom])
                .pipe(operators.map(function (_a) {
                var _b = __read(_a, 3), options = _b[0], center = _b[1], zoom = _b[2];
                var combinedOptions = __assign(__assign({}, options), { center: center || options.center, zoom: zoom !== undefined ? zoom : options.zoom, mapTypeId: _this.mapTypeId });
                return combinedOptions;
            }));
        };
        GoogleMap.prototype._initializeMap = function (optionsChanges) {
            var _this = this;
            return optionsChanges.pipe(operators.take(1), operators.map(function (options) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                return _this._ngZone.runOutsideAngular(function () { return new google.maps.Map(_this._mapEl, options); });
            }), operators.shareReplay(1));
        };
        GoogleMap.prototype._watchForOptionsChanges = function () {
            rxjs.combineLatest([this._googleMapChanges, this._options])
                .pipe(operators.takeUntil(this._destroy))
                .subscribe(function (_a) {
                var _b = __read(_a, 2), googleMap = _b[0], options = _b[1];
                googleMap.setOptions(options);
            });
        };
        GoogleMap.prototype._watchForCenterChanges = function () {
            rxjs.combineLatest([this._googleMapChanges, this._center])
                .pipe(operators.takeUntil(this._destroy))
                .subscribe(function (_a) {
                var _b = __read(_a, 2), googleMap = _b[0], center = _b[1];
                if (center) {
                    googleMap.setCenter(center);
                }
            });
        };
        GoogleMap.prototype._watchForZoomChanges = function () {
            rxjs.combineLatest([this._googleMapChanges, this._zoom])
                .pipe(operators.takeUntil(this._destroy))
                .subscribe(function (_a) {
                var _b = __read(_a, 2), googleMap = _b[0], zoom = _b[1];
                if (zoom !== undefined) {
                    googleMap.setZoom(zoom);
                }
            });
        };
        /** Asserts that the map has been initialized. */
        GoogleMap.prototype._assertInitialized = function () {
            if (!this.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
        };
        GoogleMap.decorators = [
            { type: core.Component, args: [{
                        selector: 'google-map',
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        template: '<div class="map-container"></div><ng-content></ng-content>',
                        encapsulation: core.ViewEncapsulation.None
                    }] }
        ];
        /** @nocollapse */
        GoogleMap.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.NgZone },
            { type: Object, decorators: [{ type: core.Optional }, { type: core.Inject, args: [core.PLATFORM_ID,] }] }
        ]; };
        GoogleMap.propDecorators = {
            height: [{ type: core.Input }],
            width: [{ type: core.Input }],
            mapTypeId: [{ type: core.Input }],
            center: [{ type: core.Input }],
            zoom: [{ type: core.Input }],
            options: [{ type: core.Input }],
            boundsChanged: [{ type: core.Output }],
            centerChanged: [{ type: core.Output }],
            mapClick: [{ type: core.Output }],
            mapDblclick: [{ type: core.Output }],
            mapDrag: [{ type: core.Output }],
            mapDragend: [{ type: core.Output }],
            mapDragstart: [{ type: core.Output }],
            headingChanged: [{ type: core.Output }],
            idle: [{ type: core.Output }],
            maptypeidChanged: [{ type: core.Output }],
            mapMousemove: [{ type: core.Output }],
            mapMouseout: [{ type: core.Output }],
            mapMouseover: [{ type: core.Output }],
            projectionChanged: [{ type: core.Output }],
            mapRightclick: [{ type: core.Output }],
            tilesloaded: [{ type: core.Output }],
            tiltChanged: [{ type: core.Output }],
            zoomChanged: [{ type: core.Output }]
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
     * Angular component that renders a Google Maps Circle via the Google Maps JavaScript API.
     * @see developers.google.com/maps/documentation/javascript/reference/polygon#Circle
     */
    var MapCircle = /** @class */ (function () {
        function MapCircle(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new rxjs.BehaviorSubject({});
            this._center = new rxjs.BehaviorSubject(undefined);
            this._radius = new rxjs.BehaviorSubject(undefined);
            this._destroyed = new rxjs.Subject();
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
        Object.defineProperty(MapCircle.prototype, "options", {
            set: function (options) {
                this._options.next(options || {});
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCircle.prototype, "center", {
            set: function (center) {
                this._center.next(center);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapCircle.prototype, "radius", {
            set: function (radius) {
                this._radius.next(radius);
            },
            enumerable: true,
            configurable: true
        });
        MapCircle.prototype.ngOnInit = function () {
            var _this = this;
            if (this._map._isBrowser) {
                this._combineOptions().pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () {
                        _this.circle = new google.maps.Circle(options);
                    });
                    _this._assertInitialized();
                    _this.circle.setMap(_this._map.googleMap);
                    _this._eventManager.setTarget(_this.circle);
                });
                this._watchForOptionsChanges();
                this._watchForCenterChanges();
                this._watchForRadiusChanges();
            }
        };
        MapCircle.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.circle) {
                this.circle.setMap(null);
            }
        };
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getBounds
         */
        MapCircle.prototype.getBounds = function () {
            this._assertInitialized();
            return this.circle.getBounds();
        };
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         */
        MapCircle.prototype.getCenter = function () {
            this._assertInitialized();
            return this.circle.getCenter();
        };
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getDraggable
         */
        MapCircle.prototype.getDraggable = function () {
            this._assertInitialized();
            return this.circle.getDraggable();
        };
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getEditable
         */
        MapCircle.prototype.getEditable = function () {
            this._assertInitialized();
            return this.circle.getEditable();
        };
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getCenter
         */
        MapCircle.prototype.getRadius = function () {
            this._assertInitialized();
            return this.circle.getRadius();
        };
        /**
         * @see
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getVisible
         */
        MapCircle.prototype.getVisible = function () {
            this._assertInitialized();
            return this.circle.getVisible();
        };
        MapCircle.prototype._combineOptions = function () {
            return rxjs.combineLatest([this._options, this._center, this._radius])
                .pipe(operators.map(function (_a) {
                var _b = __read(_a, 3), options = _b[0], center = _b[1], radius = _b[2];
                var combinedOptions = __assign(__assign({}, options), { center: center || options.center, radius: radius !== undefined ? radius : options.radius });
                return combinedOptions;
            }));
        };
        MapCircle.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroyed)).subscribe(function (options) {
                _this._assertInitialized();
                _this.circle.setOptions(options);
            });
        };
        MapCircle.prototype._watchForCenterChanges = function () {
            var _this = this;
            this._center.pipe(operators.takeUntil(this._destroyed)).subscribe(function (center) {
                if (center) {
                    _this._assertInitialized();
                    _this.circle.setCenter(center);
                }
            });
        };
        MapCircle.prototype._watchForRadiusChanges = function () {
            var _this = this;
            this._radius.pipe(operators.takeUntil(this._destroyed)).subscribe(function (radius) {
                if (radius !== undefined) {
                    _this._assertInitialized();
                    _this.circle.setRadius(radius);
                }
            });
        };
        MapCircle.prototype._assertInitialized = function () {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.circle) {
                throw Error('Cannot interact with a Google Map Circle before it has been ' +
                    'initialized. Please wait for the Circle to load before trying to interact with it.');
            }
        };
        MapCircle.decorators = [
            { type: core.Directive, args: [{
                        selector: 'map-circle',
                    },] }
        ];
        /** @nocollapse */
        MapCircle.ctorParameters = function () { return [
            { type: GoogleMap },
            { type: core.NgZone }
        ]; };
        MapCircle.propDecorators = {
            options: [{ type: core.Input }],
            center: [{ type: core.Input }],
            radius: [{ type: core.Input }],
            centerChanged: [{ type: core.Output }],
            circleClick: [{ type: core.Output }],
            circleDblclick: [{ type: core.Output }],
            circleDrag: [{ type: core.Output }],
            circleDragend: [{ type: core.Output }],
            circleDragstart: [{ type: core.Output }],
            circleMousedown: [{ type: core.Output }],
            circleMousemove: [{ type: core.Output }],
            circleMouseout: [{ type: core.Output }],
            circleMouseover: [{ type: core.Output }],
            circleMouseup: [{ type: core.Output }],
            radiusChanged: [{ type: core.Output }],
            circleRightclick: [{ type: core.Output }]
        };
        return MapCircle;
    }());

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
    var MapInfoWindow = /** @class */ (function () {
        function MapInfoWindow(_googleMap, _elementRef, _ngZone) {
            this._googleMap = _googleMap;
            this._elementRef = _elementRef;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new rxjs.BehaviorSubject({});
            this._position = new rxjs.BehaviorSubject(undefined);
            this._destroy = new rxjs.Subject();
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
                var combinedOptionsChanges = this._combineOptions();
                combinedOptionsChanges.pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () {
                        _this.infoWindow = new google.maps.InfoWindow(options);
                    });
                    _this._eventManager.setTarget(_this.infoWindow);
                });
                this._watchForOptionsChanges();
                this._watchForPositionChanges();
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
            this._assertInitialized();
            this.infoWindow.close();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getContent
         */
        MapInfoWindow.prototype.getContent = function () {
            this._assertInitialized();
            return this.infoWindow.getContent();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window
         * #InfoWindow.getPosition
         */
        MapInfoWindow.prototype.getPosition = function () {
            this._assertInitialized();
            return this.infoWindow.getPosition();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.getZIndex
         */
        MapInfoWindow.prototype.getZIndex = function () {
            this._assertInitialized();
            return this.infoWindow.getZIndex();
        };
        /**
         * Opens the MapInfoWindow using the provided MapMarker as the anchor. If the anchor is not set,
         * then the position property of the options input is used instead.
         */
        MapInfoWindow.prototype.open = function (anchor) {
            this._assertInitialized();
            var marker = anchor ? anchor.marker : undefined;
            this._elementRef.nativeElement.style.display = '';
            this.infoWindow.open(this._googleMap.googleMap, marker);
        };
        MapInfoWindow.prototype._combineOptions = function () {
            var _this = this;
            return rxjs.combineLatest([this._options, this._position]).pipe(operators.map(function (_a) {
                var _b = __read(_a, 2), options = _b[0], position = _b[1];
                var combinedOptions = __assign(__assign({}, options), { position: position || options.position, content: _this._elementRef.nativeElement });
                return combinedOptions;
            }));
        };
        MapInfoWindow.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroy)).subscribe(function (options) {
                _this._assertInitialized();
                _this.infoWindow.setOptions(options);
            });
        };
        MapInfoWindow.prototype._watchForPositionChanges = function () {
            var _this = this;
            this._position.pipe(operators.takeUntil(this._destroy)).subscribe(function (position) {
                if (position) {
                    _this._assertInitialized();
                    _this.infoWindow.setPosition(position);
                }
            });
        };
        MapInfoWindow.prototype._assertInitialized = function () {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.infoWindow) {
                throw Error('Cannot interact with a Google Map Info Window before it has been ' +
                    'initialized. Please wait for the Info Window to load before trying to interact with ' +
                    'it.');
            }
        };
        MapInfoWindow.decorators = [
            { type: core.Directive, args: [{
                        selector: 'map-info-window',
                        host: { 'style': 'display: none' },
                    },] }
        ];
        /** @nocollapse */
        MapInfoWindow.ctorParameters = function () { return [
            { type: GoogleMap },
            { type: core.ElementRef },
            { type: core.NgZone }
        ]; };
        MapInfoWindow.propDecorators = {
            options: [{ type: core.Input }],
            position: [{ type: core.Input }],
            closeclick: [{ type: core.Output }],
            contentChanged: [{ type: core.Output }],
            domready: [{ type: core.Output }],
            positionChanged: [{ type: core.Output }],
            zindexChanged: [{ type: core.Output }]
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
     *
     * See developers.google.com/maps/documentation/javascript/reference/marker
     */
    var MapMarker = /** @class */ (function () {
        function MapMarker(_googleMap, _ngZone) {
            this._googleMap = _googleMap;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new rxjs.BehaviorSubject(DEFAULT_MARKER_OPTIONS);
            this._title = new rxjs.BehaviorSubject(undefined);
            this._position = new rxjs.BehaviorSubject(undefined);
            this._label = new rxjs.BehaviorSubject(undefined);
            this._clickable = new rxjs.BehaviorSubject(undefined);
            this._destroy = new rxjs.Subject();
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
                this._combineOptions().pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () { return _this.marker = new google.maps.Marker(options); });
                    _this._assertInitialized();
                    _this.marker.setMap(_this._googleMap.googleMap);
                    _this._eventManager.setTarget(_this.marker);
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
            if (this.marker) {
                this.marker.setMap(null);
            }
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getAnimation
         */
        MapMarker.prototype.getAnimation = function () {
            this._assertInitialized();
            return this.marker.getAnimation() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getClickable
         */
        MapMarker.prototype.getClickable = function () {
            this._assertInitialized();
            return this.marker.getClickable();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getCursor
         */
        MapMarker.prototype.getCursor = function () {
            this._assertInitialized();
            return this.marker.getCursor() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getDraggable
         */
        MapMarker.prototype.getDraggable = function () {
            this._assertInitialized();
            return !!this.marker.getDraggable();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getIcon
         */
        MapMarker.prototype.getIcon = function () {
            this._assertInitialized();
            return this.marker.getIcon() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getLabel
         */
        MapMarker.prototype.getLabel = function () {
            this._assertInitialized();
            return this.marker.getLabel() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getOpacity
         */
        MapMarker.prototype.getOpacity = function () {
            this._assertInitialized();
            return this.marker.getOpacity() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getPosition
         */
        MapMarker.prototype.getPosition = function () {
            this._assertInitialized();
            return this.marker.getPosition() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getShape
         */
        MapMarker.prototype.getShape = function () {
            this._assertInitialized();
            return this.marker.getShape() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getTitle
         */
        MapMarker.prototype.getTitle = function () {
            this._assertInitialized();
            return this.marker.getTitle() || null;
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getVisible
         */
        MapMarker.prototype.getVisible = function () {
            this._assertInitialized();
            return this.marker.getVisible();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/marker#Marker.getZIndex
         */
        MapMarker.prototype.getZIndex = function () {
            this._assertInitialized();
            return this.marker.getZIndex() || null;
        };
        MapMarker.prototype._combineOptions = function () {
            var _this = this;
            return rxjs.combineLatest([this._options, this._title, this._position, this._label, this._clickable])
                .pipe(operators.map(function (_a) {
                var _b = __read(_a, 5), options = _b[0], title = _b[1], position = _b[2], label = _b[3], clickable = _b[4];
                var combinedOptions = __assign(__assign({}, options), { title: title || options.title, position: position || options.position, label: label || options.label, clickable: clickable !== undefined ? clickable : options.clickable, map: _this._googleMap.googleMap });
                return combinedOptions;
            }));
        };
        MapMarker.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroy)).subscribe(function (options) {
                if (_this.marker) {
                    _this._assertInitialized();
                    _this.marker.setOptions(options);
                }
            });
        };
        MapMarker.prototype._watchForTitleChanges = function () {
            var _this = this;
            this._title.pipe(operators.takeUntil(this._destroy)).subscribe(function (title) {
                if (_this.marker && title !== undefined) {
                    _this._assertInitialized();
                    _this.marker.setTitle(title);
                }
            });
        };
        MapMarker.prototype._watchForPositionChanges = function () {
            var _this = this;
            this._position.pipe(operators.takeUntil(this._destroy)).subscribe(function (position) {
                if (_this.marker && position) {
                    _this._assertInitialized();
                    _this.marker.setPosition(position);
                }
            });
        };
        MapMarker.prototype._watchForLabelChanges = function () {
            var _this = this;
            this._label.pipe(operators.takeUntil(this._destroy)).subscribe(function (label) {
                if (_this.marker && label !== undefined) {
                    _this._assertInitialized();
                    _this.marker.setLabel(label);
                }
            });
        };
        MapMarker.prototype._watchForClickableChanges = function () {
            var _this = this;
            this._clickable.pipe(operators.takeUntil(this._destroy)).subscribe(function (clickable) {
                if (_this.marker && clickable !== undefined) {
                    _this._assertInitialized();
                    _this.marker.setClickable(clickable);
                }
            });
        };
        MapMarker.prototype._assertInitialized = function () {
            if (!this._googleMap.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.marker) {
                throw Error('Cannot interact with a Google Map Marker before it has been ' +
                    'initialized. Please wait for the Marker to load before trying to interact with it.');
            }
        };
        MapMarker.decorators = [
            { type: core.Component, args: [{
                        selector: 'map-marker',
                        template: '<ng-content></ng-content>',
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        encapsulation: core.ViewEncapsulation.None
                    }] }
        ];
        /** @nocollapse */
        MapMarker.ctorParameters = function () { return [
            { type: GoogleMap },
            { type: core.NgZone }
        ]; };
        MapMarker.propDecorators = {
            options: [{ type: core.Input }],
            title: [{ type: core.Input }],
            position: [{ type: core.Input }],
            label: [{ type: core.Input }],
            clickable: [{ type: core.Input }],
            animationChanged: [{ type: core.Output }],
            mapClick: [{ type: core.Output }],
            clickableChanged: [{ type: core.Output }],
            cursorChanged: [{ type: core.Output }],
            mapDblclick: [{ type: core.Output }],
            mapDrag: [{ type: core.Output }],
            mapDragend: [{ type: core.Output }],
            draggableChanged: [{ type: core.Output }],
            mapDragstart: [{ type: core.Output }],
            flatChanged: [{ type: core.Output }],
            iconChanged: [{ type: core.Output }],
            mapMousedown: [{ type: core.Output }],
            mapMouseout: [{ type: core.Output }],
            mapMouseover: [{ type: core.Output }],
            mapMouseup: [{ type: core.Output }],
            positionChanged: [{ type: core.Output }],
            mapRightclick: [{ type: core.Output }],
            shapeChanged: [{ type: core.Output }],
            titleChanged: [{ type: core.Output }],
            visibleChanged: [{ type: core.Output }],
            zindexChanged: [{ type: core.Output }]
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
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon
     */
    var MapPolygon = /** @class */ (function () {
        function MapPolygon(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new rxjs.BehaviorSubject({});
            this._paths = new rxjs.BehaviorSubject(undefined);
            this._destroyed = new rxjs.Subject();
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
                this._combineOptions().pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () {
                        _this.polygon = new google.maps.Polygon(options);
                    });
                    _this._assertInitialized();
                    _this.polygon.setMap(_this._map.googleMap);
                    _this._eventManager.setTarget(_this.polygon);
                });
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        };
        MapPolygon.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.polygon) {
                this.polygon.setMap(null);
            }
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getDraggable
         */
        MapPolygon.prototype.getDraggable = function () {
            this._assertInitialized();
            return this.polygon.getDraggable();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getEditable
         */
        MapPolygon.prototype.getEditable = function () {
            this._assertInitialized();
            return this.polygon.getEditable();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPath
         */
        MapPolygon.prototype.getPath = function () {
            this._assertInitialized();
            return this.polygon.getPath();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getPaths
         */
        MapPolygon.prototype.getPaths = function () {
            this._assertInitialized();
            return this.polygon.getPaths();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polygon.getVisible
         */
        MapPolygon.prototype.getVisible = function () {
            this._assertInitialized();
            return this.polygon.getVisible();
        };
        MapPolygon.prototype._combineOptions = function () {
            return rxjs.combineLatest([this._options, this._paths]).pipe(operators.map(function (_a) {
                var _b = __read(_a, 2), options = _b[0], paths = _b[1];
                var combinedOptions = __assign(__assign({}, options), { paths: paths || options.paths });
                return combinedOptions;
            }));
        };
        MapPolygon.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroyed)).subscribe(function (options) {
                _this._assertInitialized();
                _this.polygon.setOptions(options);
            });
        };
        MapPolygon.prototype._watchForPathChanges = function () {
            var _this = this;
            this._paths.pipe(operators.takeUntil(this._destroyed)).subscribe(function (paths) {
                if (paths) {
                    _this._assertInitialized();
                    _this.polygon.setPaths(paths);
                }
            });
        };
        MapPolygon.prototype._assertInitialized = function () {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.polygon) {
                throw Error('Cannot interact with a Google Map Polygon before it has been ' +
                    'initialized. Please wait for the Polygon to load before trying to interact with it.');
            }
        };
        MapPolygon.decorators = [
            { type: core.Directive, args: [{
                        selector: 'map-polygon',
                    },] }
        ];
        /** @nocollapse */
        MapPolygon.ctorParameters = function () { return [
            { type: GoogleMap },
            { type: core.NgZone }
        ]; };
        MapPolygon.propDecorators = {
            options: [{ type: core.Input }],
            paths: [{ type: core.Input }],
            polygonClick: [{ type: core.Output }],
            polygonDblclick: [{ type: core.Output }],
            polygonDrag: [{ type: core.Output }],
            polygonDragend: [{ type: core.Output }],
            polygonDragstart: [{ type: core.Output }],
            polygonMousedown: [{ type: core.Output }],
            polygonMousemove: [{ type: core.Output }],
            polygonMouseout: [{ type: core.Output }],
            polygonMouseover: [{ type: core.Output }],
            polygonMouseup: [{ type: core.Output }],
            polygonRightclick: [{ type: core.Output }]
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
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
     */
    var MapPolyline = /** @class */ (function () {
        function MapPolyline(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new rxjs.BehaviorSubject({});
            this._path = new rxjs.BehaviorSubject(undefined);
            this._destroyed = new rxjs.Subject();
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
                this._combineOptions().pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () { return _this.polyline = new google.maps.Polyline(options); });
                    _this._assertInitialized();
                    _this.polyline.setMap(_this._map.googleMap);
                    _this._eventManager.setTarget(_this.polyline);
                });
                this._watchForOptionsChanges();
                this._watchForPathChanges();
            }
        };
        MapPolyline.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.polyline) {
                this.polyline.setMap(null);
            }
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getDraggable
         */
        MapPolyline.prototype.getDraggable = function () {
            this._assertInitialized();
            return this.polyline.getDraggable();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getEditable
         */
        MapPolyline.prototype.getEditable = function () {
            this._assertInitialized();
            return this.polyline.getEditable();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getPath
         */
        MapPolyline.prototype.getPath = function () {
            this._assertInitialized();
            // @breaking-change 11.0.0 Make the return value nullable.
            return this.polyline.getPath();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/polygon#Polyline.getVisible
         */
        MapPolyline.prototype.getVisible = function () {
            this._assertInitialized();
            return this.polyline.getVisible();
        };
        MapPolyline.prototype._combineOptions = function () {
            return rxjs.combineLatest([this._options, this._path]).pipe(operators.map(function (_a) {
                var _b = __read(_a, 2), options = _b[0], path = _b[1];
                var combinedOptions = __assign(__assign({}, options), { path: path || options.path });
                return combinedOptions;
            }));
        };
        MapPolyline.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroyed)).subscribe(function (options) {
                if (_this.polyline) {
                    _this._assertInitialized();
                    _this.polyline.setOptions(options);
                }
            });
        };
        MapPolyline.prototype._watchForPathChanges = function () {
            var _this = this;
            this._path.pipe(operators.takeUntil(this._destroyed)).subscribe(function (path) {
                if (path && _this.polyline) {
                    _this._assertInitialized();
                    _this.polyline.setPath(path);
                }
            });
        };
        MapPolyline.prototype._assertInitialized = function () {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.polyline) {
                throw Error('Cannot interact with a Google Map Polyline before it has been ' +
                    'initialized. Please wait for the Polyline to load before trying to interact with it.');
            }
        };
        MapPolyline.decorators = [
            { type: core.Directive, args: [{
                        selector: 'map-polyline',
                    },] }
        ];
        /** @nocollapse */
        MapPolyline.ctorParameters = function () { return [
            { type: GoogleMap },
            { type: core.NgZone }
        ]; };
        MapPolyline.propDecorators = {
            options: [{ type: core.Input }],
            path: [{ type: core.Input }],
            polylineClick: [{ type: core.Output }],
            polylineDblclick: [{ type: core.Output }],
            polylineDrag: [{ type: core.Output }],
            polylineDragend: [{ type: core.Output }],
            polylineDragstart: [{ type: core.Output }],
            polylineMousedown: [{ type: core.Output }],
            polylineMousemove: [{ type: core.Output }],
            polylineMouseout: [{ type: core.Output }],
            polylineMouseover: [{ type: core.Output }],
            polylineMouseup: [{ type: core.Output }],
            polylineRightclick: [{ type: core.Output }]
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
     *
     * See developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle
     */
    var MapRectangle = /** @class */ (function () {
        function MapRectangle(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new rxjs.BehaviorSubject({});
            this._bounds = new rxjs.BehaviorSubject(undefined);
            this._destroyed = new rxjs.Subject();
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
                this._combineOptions().pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () {
                        _this.rectangle = new google.maps.Rectangle(options);
                    });
                    _this._assertInitialized();
                    _this.rectangle.setMap(_this._map.googleMap);
                    _this._eventManager.setTarget(_this.rectangle);
                });
                this._watchForOptionsChanges();
                this._watchForBoundsChanges();
            }
        };
        MapRectangle.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.rectangle) {
                this.rectangle.setMap(null);
            }
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getBounds
         */
        MapRectangle.prototype.getBounds = function () {
            this._assertInitialized();
            return this.rectangle.getBounds();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getDraggable
         */
        MapRectangle.prototype.getDraggable = function () {
            this._assertInitialized();
            return this.rectangle.getDraggable();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getEditable
         */
        MapRectangle.prototype.getEditable = function () {
            this._assertInitialized();
            return this.rectangle.getEditable();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle.getVisible
         */
        MapRectangle.prototype.getVisible = function () {
            this._assertInitialized();
            return this.rectangle.getVisible();
        };
        MapRectangle.prototype._combineOptions = function () {
            return rxjs.combineLatest([this._options, this._bounds]).pipe(operators.map(function (_a) {
                var _b = __read(_a, 2), options = _b[0], bounds = _b[1];
                var combinedOptions = __assign(__assign({}, options), { bounds: bounds || options.bounds });
                return combinedOptions;
            }));
        };
        MapRectangle.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroyed)).subscribe(function (options) {
                _this._assertInitialized();
                _this.rectangle.setOptions(options);
            });
        };
        MapRectangle.prototype._watchForBoundsChanges = function () {
            var _this = this;
            this._bounds.pipe(operators.takeUntil(this._destroyed)).subscribe(function (bounds) {
                if (bounds) {
                    _this._assertInitialized();
                    _this.rectangle.setBounds(bounds);
                }
            });
        };
        MapRectangle.prototype._assertInitialized = function () {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.rectangle) {
                throw Error('Cannot interact with a Google Map Rectangle before it has been ' +
                    'initialized. Please wait for the Rectangle to load before trying to interact with it.');
            }
        };
        MapRectangle.decorators = [
            { type: core.Directive, args: [{
                        selector: 'map-rectangle',
                    },] }
        ];
        /** @nocollapse */
        MapRectangle.ctorParameters = function () { return [
            { type: GoogleMap },
            { type: core.NgZone }
        ]; };
        MapRectangle.propDecorators = {
            options: [{ type: core.Input }],
            bounds: [{ type: core.Input }],
            boundsChanged: [{ type: core.Output }],
            rectangleClick: [{ type: core.Output }],
            rectangleDblclick: [{ type: core.Output }],
            rectangleDrag: [{ type: core.Output }],
            rectangleDragend: [{ type: core.Output }],
            rectangleDragstart: [{ type: core.Output }],
            rectangleMousedown: [{ type: core.Output }],
            rectangleMousemove: [{ type: core.Output }],
            rectangleMouseout: [{ type: core.Output }],
            rectangleMouseover: [{ type: core.Output }],
            rectangleMouseup: [{ type: core.Output }],
            rectangleRightclick: [{ type: core.Output }]
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
        MapCircle,
        MapInfoWindow,
        MapMarker,
        MapPolygon,
        MapPolyline,
        MapRectangle,
    ];
    var GoogleMapsModule = /** @class */ (function () {
        function GoogleMapsModule() {
        }
        GoogleMapsModule.decorators = [
            { type: core.NgModule, args: [{
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

    exports.GoogleMap = GoogleMap;
    exports.GoogleMapsModule = GoogleMapsModule;
    exports.MapCircle = MapCircle;
    exports.MapInfoWindow = MapInfoWindow;
    exports.MapMarker = MapMarker;
    exports.MapPolygon = MapPolygon;
    exports.MapPolyline = MapPolyline;
    exports.MapRectangle = MapRectangle;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=google-maps.umd.js.map
