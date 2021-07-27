(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@angular/google-maps', ['exports', '@angular/core', '@angular/common', 'rxjs', 'rxjs/operators'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ng = global.ng || {}, global.ng.googleMaps = {}), global.ng.core, global.ng.common, global.rxjs, global.rxjs.operators));
}(this, (function (exports, i0, common, rxjs, operators) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
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
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || from);
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    /** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
    var MapEventManager = /** @class */ (function () {
        function MapEventManager(_ngZone) {
            this._ngZone = _ngZone;
            /** Pending listeners that were added before the target was set. */
            this._pending = [];
            this._listeners = [];
            this._targetStream = new rxjs.BehaviorSubject(undefined);
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
            return this._targetStream.pipe(operators.switchMap(function (target) {
                var observable = new rxjs.Observable(function (observer) {
                    // If the target hasn't been initialized yet, cache the observer so it can be added later.
                    if (!target) {
                        _this._pending.push({ observable: observable, observer: observer });
                        return undefined;
                    }
                    var listener = target.addListener(name, function (event) {
                        _this._ngZone.run(function () { return observer.next(event); });
                    });
                    _this._listeners.push(listener);
                    return function () { return listener.remove(); };
                });
                return observable;
            }));
        };
        /** Sets the current target that the manager should bind events to. */
        MapEventManager.prototype.setTarget = function (target) {
            var currentTarget = this._targetStream.value;
            if (target === currentTarget) {
                return;
            }
            // Clear the listeners from the pre-existing target.
            if (currentTarget) {
                this._clearListeners();
                this._pending = [];
            }
            this._targetStream.next(target);
            // Add the listeners that were bound before the map was initialized.
            this._pending.forEach(function (subscriber) { return subscriber.observable.subscribe(subscriber.observer); });
            this._pending = [];
        };
        /** Destroys the manager and clears the event listeners. */
        MapEventManager.prototype.destroy = function () {
            this._clearListeners();
            this._pending = [];
            this._targetStream.complete();
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
        // Note: the type conversion here isn't necessary for our CI, but it resolves a g3 failure.
        mapTypeId: 'roadmap'
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
        function GoogleMap(_elementRef, _ngZone, platformId) {
            var _this = this;
            this._elementRef = _elementRef;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            /** Height of the map. Set this to `null` if you'd like to control the height through CSS. */
            this.height = DEFAULT_HEIGHT;
            /** Width of the map. Set this to `null` if you'd like to control the width through CSS. */
            this.width = DEFAULT_WIDTH;
            this._options = DEFAULT_OPTIONS;
            /**
             * See
             * https://developers.google.com/maps/documentation/javascript/events#auth-errors
             */
            this.authFailure = new i0.EventEmitter();
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
            this.mapClick = this._eventManager
                .getLazyEmitter('click');
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
            this._isBrowser = common.isPlatformBrowser(platformId);
            if (this._isBrowser) {
                var googleMapsWindow = window;
                if (!googleMapsWindow.google && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                    throw Error('Namespace google not found, cannot construct embedded google ' +
                        'map. Please install the Google Maps JavaScript API: ' +
                        'https://developers.google.com/maps/documentation/javascript/' +
                        'tutorial#Loading_the_Maps_API');
                }
                this._existingAuthFailureCallback = googleMapsWindow.gm_authFailure;
                googleMapsWindow.gm_authFailure = function () {
                    if (_this._existingAuthFailureCallback) {
                        _this._existingAuthFailureCallback();
                    }
                    _this.authFailure.emit();
                };
            }
        }
        Object.defineProperty(GoogleMap.prototype, "center", {
            set: function (center) {
                this._center = center;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoogleMap.prototype, "zoom", {
            set: function (zoom) {
                this._zoom = zoom;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoogleMap.prototype, "options", {
            set: function (options) {
                this._options = options || DEFAULT_OPTIONS;
            },
            enumerable: false,
            configurable: true
        });
        GoogleMap.prototype.ngOnChanges = function (changes) {
            if (changes['height'] || changes['width']) {
                this._setSize();
            }
            var googleMap = this.googleMap;
            if (googleMap) {
                if (changes['options']) {
                    googleMap.setOptions(this._combineOptions());
                }
                if (changes['center'] && this._center) {
                    googleMap.setCenter(this._center);
                }
                // Note that the zoom can be zero.
                if (changes['zoom'] && this._zoom != null) {
                    googleMap.setZoom(this._zoom);
                }
                if (changes['mapTypeId'] && this.mapTypeId) {
                    googleMap.setMapTypeId(this.mapTypeId);
                }
            }
        };
        GoogleMap.prototype.ngOnInit = function () {
            var _this = this;
            // It should be a noop during server-side rendering.
            if (this._isBrowser) {
                this._mapEl = this._elementRef.nativeElement.querySelector('.map-container');
                this._setSize();
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(function () {
                    _this.googleMap = new google.maps.Map(_this._mapEl, _this._combineOptions());
                });
                this._eventManager.setTarget(this.googleMap);
            }
        };
        GoogleMap.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            if (this._isBrowser) {
                var googleMapsWindow = window;
                googleMapsWindow.gm_authFailure = this._existingAuthFailureCallback;
            }
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
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
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
            enumerable: false,
            configurable: true
        });
        GoogleMap.prototype._setSize = function () {
            if (this._mapEl) {
                var styles = this._mapEl.style;
                styles.height =
                    this.height === null ? '' : (coerceCssPixelValue(this.height) || DEFAULT_HEIGHT);
                styles.width = this.width === null ? '' : (coerceCssPixelValue(this.width) || DEFAULT_WIDTH);
            }
        };
        /** Combines the center and zoom and the other map options into a single object */
        GoogleMap.prototype._combineOptions = function () {
            var _a, _b;
            var options = this._options || {};
            return Object.assign(Object.assign({}, options), {
                // It's important that we set **some** kind of `center` and `zoom`, otherwise
                // Google Maps will render a blank rectangle which looks broken.
                center: this._center || options.center || DEFAULT_OPTIONS.center, zoom: (_b = (_a = this._zoom) !== null && _a !== void 0 ? _a : options.zoom) !== null && _b !== void 0 ? _b : DEFAULT_OPTIONS.zoom,
                // Passing in an undefined `mapTypeId` seems to break tile loading
                // so make sure that we have some kind of default (see #22082).
                mapTypeId: this.mapTypeId || options.mapTypeId || DEFAULT_OPTIONS.mapTypeId
            });
        };
        /** Asserts that the map has been initialized. */
        GoogleMap.prototype._assertInitialized = function () {
            if (!this.googleMap && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
        };
        return GoogleMap;
    }());
    GoogleMap.decorators = [
        { type: i0.Component, args: [{
                    selector: 'google-map',
                    exportAs: 'googleMap',
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    template: '<div class="map-container"></div><ng-content></ng-content>',
                    encapsulation: i0.ViewEncapsulation.None
                },] }
    ];
    GoogleMap.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.NgZone },
        { type: Object, decorators: [{ type: i0.Inject, args: [i0.PLATFORM_ID,] }] }
    ]; };
    GoogleMap.propDecorators = {
        height: [{ type: i0.Input }],
        width: [{ type: i0.Input }],
        mapTypeId: [{ type: i0.Input }],
        center: [{ type: i0.Input }],
        zoom: [{ type: i0.Input }],
        options: [{ type: i0.Input }],
        authFailure: [{ type: i0.Output }],
        boundsChanged: [{ type: i0.Output }],
        centerChanged: [{ type: i0.Output }],
        mapClick: [{ type: i0.Output }],
        mapDblclick: [{ type: i0.Output }],
        mapDrag: [{ type: i0.Output }],
        mapDragend: [{ type: i0.Output }],
        mapDragstart: [{ type: i0.Output }],
        headingChanged: [{ type: i0.Output }],
        idle: [{ type: i0.Output }],
        maptypeidChanged: [{ type: i0.Output }],
        mapMousemove: [{ type: i0.Output }],
        mapMouseout: [{ type: i0.Output }],
        mapMouseover: [{ type: i0.Output }],
        projectionChanged: [{ type: i0.Output }],
        mapRightclick: [{ type: i0.Output }],
        tilesloaded: [{ type: i0.Output }],
        tiltChanged: [{ type: i0.Output }],
        zoomChanged: [{ type: i0.Output }]
    };
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
    var MapBaseLayer = /** @class */ (function () {
        function MapBaseLayer(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
        }
        MapBaseLayer.prototype.ngOnInit = function () {
            var _this = this;
            if (this._map._isBrowser) {
                this._ngZone.runOutsideAngular(function () {
                    _this._initializeObject();
                });
                this._assertInitialized();
                this._setMap();
            }
        };
        MapBaseLayer.prototype.ngOnDestroy = function () {
            this._unsetMap();
        };
        MapBaseLayer.prototype._assertInitialized = function () {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
        };
        MapBaseLayer.prototype._initializeObject = function () { };
        MapBaseLayer.prototype._setMap = function () { };
        MapBaseLayer.prototype._unsetMap = function () { };
        return MapBaseLayer;
    }());
    MapBaseLayer.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-base-layer',
                    exportAs: 'mapBaseLayer',
                },] }
    ];
    MapBaseLayer.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };

    /**
     * Angular component that renders a Google Maps Bicycling Layer via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#BicyclingLayer
     */
    var MapBicyclingLayer = /** @class */ (function (_super) {
        __extends(MapBicyclingLayer, _super);
        function MapBicyclingLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapBicyclingLayer.prototype._initializeObject = function () {
            this.bicyclingLayer = new google.maps.BicyclingLayer();
        };
        MapBicyclingLayer.prototype._setMap = function () {
            this._assertLayerInitialized();
            this.bicyclingLayer.setMap(this._map.googleMap);
        };
        MapBicyclingLayer.prototype._unsetMap = function () {
            if (this.bicyclingLayer) {
                this.bicyclingLayer.setMap(null);
            }
        };
        MapBicyclingLayer.prototype._assertLayerInitialized = function () {
            if (!this.bicyclingLayer) {
                throw Error('Cannot interact with a Google Map Bicycling Layer before it has been initialized. ' +
                    'Please wait for the Transit Layer to load before trying to interact with it.');
            }
        };
        return MapBicyclingLayer;
    }(MapBaseLayer));
    MapBicyclingLayer.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-bicycling-layer',
                    exportAs: 'mapBicyclingLayer',
                },] }
    ];

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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapCircle.prototype, "center", {
            set: function (center) {
                this._center.next(center);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapCircle.prototype, "radius", {
            set: function (radius) {
                this._radius.next(radius);
            },
            enumerable: false,
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
         * developers.google.com/maps/documentation/javascript/reference/polygon#Circle.getRadius
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
                var combinedOptions = Object.assign(Object.assign({}, options), { center: center || options.center, radius: radius !== undefined ? radius : options.radius });
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
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
        return MapCircle;
    }());
    MapCircle.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-circle',
                    exportAs: 'mapCircle',
                },] }
    ];
    MapCircle.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapCircle.propDecorators = {
        options: [{ type: i0.Input }],
        center: [{ type: i0.Input }],
        radius: [{ type: i0.Input }],
        centerChanged: [{ type: i0.Output }],
        circleClick: [{ type: i0.Output }],
        circleDblclick: [{ type: i0.Output }],
        circleDrag: [{ type: i0.Output }],
        circleDragend: [{ type: i0.Output }],
        circleDragstart: [{ type: i0.Output }],
        circleMousedown: [{ type: i0.Output }],
        circleMousemove: [{ type: i0.Output }],
        circleMouseout: [{ type: i0.Output }],
        circleMouseover: [{ type: i0.Output }],
        circleMouseup: [{ type: i0.Output }],
        radiusChanged: [{ type: i0.Output }],
        circleRightclick: [{ type: i0.Output }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Angular component that renders a Google Maps Directions Renderer via the Google Maps
     * JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRenderer
     */
    var MapDirectionsRenderer = /** @class */ (function () {
        function MapDirectionsRenderer(_googleMap, _ngZone) {
            this._googleMap = _googleMap;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            /**
             * See developers.google.com/maps/documentation/javascript/reference/directions
             * #DirectionsRenderer.directions_changed
             */
            this.directionsChanged = this._eventManager.getLazyEmitter('directions_changed');
        }
        Object.defineProperty(MapDirectionsRenderer.prototype, "directions", {
            /**
             * See developers.google.com/maps/documentation/javascript/reference/directions
             * #DirectionsRendererOptions.directions
             */
            set: function (directions) {
                this._directions = directions;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapDirectionsRenderer.prototype, "options", {
            /**
             * See developers.google.com/maps/documentation/javascript/reference/directions
             * #DirectionsRendererOptions
             */
            set: function (options) {
                this._options = options;
            },
            enumerable: false,
            configurable: true
        });
        MapDirectionsRenderer.prototype.ngOnInit = function () {
            var _this = this;
            if (this._googleMap._isBrowser) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(function () {
                    _this.directionsRenderer = new google.maps.DirectionsRenderer(_this._combineOptions());
                });
                this._assertInitialized();
                this.directionsRenderer.setMap(this._googleMap.googleMap);
                this._eventManager.setTarget(this.directionsRenderer);
            }
        };
        MapDirectionsRenderer.prototype.ngOnChanges = function (changes) {
            if (this.directionsRenderer) {
                if (changes['options']) {
                    this.directionsRenderer.setOptions(this._combineOptions());
                }
                if (changes['directions'] && this._directions !== undefined) {
                    this.directionsRenderer.setDirections(this._directions);
                }
            }
        };
        MapDirectionsRenderer.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            if (this.directionsRenderer) {
                this.directionsRenderer.setMap(null);
            }
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/directions
         * #DirectionsRenderer.getDirections
         */
        MapDirectionsRenderer.prototype.getDirections = function () {
            this._assertInitialized();
            return this.directionsRenderer.getDirections();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/directions
         * #DirectionsRenderer.getPanel
         */
        MapDirectionsRenderer.prototype.getPanel = function () {
            this._assertInitialized();
            return this.directionsRenderer.getPanel();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/directions
         * #DirectionsRenderer.getRouteIndex
         */
        MapDirectionsRenderer.prototype.getRouteIndex = function () {
            this._assertInitialized();
            return this.directionsRenderer.getRouteIndex();
        };
        MapDirectionsRenderer.prototype._combineOptions = function () {
            var options = this._options || {};
            return Object.assign(Object.assign({}, options), { directions: this._directions || options.directions, map: this._googleMap.googleMap });
        };
        MapDirectionsRenderer.prototype._assertInitialized = function () {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                if (!this._googleMap.googleMap) {
                    throw Error('Cannot access Google Map information before the API has been initialized. ' +
                        'Please wait for the API to load before trying to interact with it.');
                }
                if (!this.directionsRenderer) {
                    throw Error('Cannot interact with a Google Map Directions Renderer before it has been ' +
                        'initialized. Please wait for the Directions Renderer to load before trying ' +
                        'to interact with it.');
                }
            }
        };
        return MapDirectionsRenderer;
    }());
    MapDirectionsRenderer.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-directions-renderer',
                    exportAs: 'mapDirectionsRenderer',
                },] }
    ];
    MapDirectionsRenderer.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapDirectionsRenderer.propDecorators = {
        directions: [{ type: i0.Input }],
        options: [{ type: i0.Input }],
        directionsChanged: [{ type: i0.Output }]
    };

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
    var MapGroundOverlay = /** @class */ (function () {
        function MapGroundOverlay(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._opacity = new rxjs.BehaviorSubject(1);
            this._url = new rxjs.BehaviorSubject('');
            this._bounds = new rxjs.BehaviorSubject(undefined);
            this._destroyed = new rxjs.Subject();
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
        Object.defineProperty(MapGroundOverlay.prototype, "url", {
            /** URL of the image that will be shown in the overlay. */
            set: function (url) {
                this._url.next(url);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGroundOverlay.prototype, "bounds", {
            /** Bounds for the overlay. */
            get: function () {
                return this._bounds.value;
            },
            set: function (bounds) {
                this._bounds.next(bounds);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGroundOverlay.prototype, "opacity", {
            /** Opacity of the overlay. */
            set: function (opacity) {
                this._opacity.next(opacity);
            },
            enumerable: false,
            configurable: true
        });
        MapGroundOverlay.prototype.ngOnInit = function () {
            var _this = this;
            if (this._map._isBrowser) {
                // The ground overlay setup is slightly different from the other Google Maps objects in that
                // we have to recreate the `GroundOverlay` object whenever the bounds change, because
                // Google Maps doesn't provide an API to update the bounds of an existing overlay.
                this._bounds.pipe(operators.takeUntil(this._destroyed)).subscribe(function (bounds) {
                    if (_this.groundOverlay) {
                        _this.groundOverlay.setMap(null);
                        _this.groundOverlay = undefined;
                    }
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    if (bounds) {
                        _this._ngZone.runOutsideAngular(function () {
                            _this.groundOverlay = new google.maps.GroundOverlay(_this._url.getValue(), bounds, {
                                clickable: _this.clickable,
                                opacity: _this._opacity.value,
                            });
                        });
                        _this._assertInitialized();
                        _this.groundOverlay.setMap(_this._map.googleMap);
                        _this._eventManager.setTarget(_this.groundOverlay);
                    }
                });
                this._watchForOpacityChanges();
                this._watchForUrlChanges();
            }
        };
        MapGroundOverlay.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.groundOverlay) {
                this.groundOverlay.setMap(null);
            }
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getBounds
         */
        MapGroundOverlay.prototype.getBounds = function () {
            this._assertInitialized();
            return this.groundOverlay.getBounds();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getOpacity
         */
        MapGroundOverlay.prototype.getOpacity = function () {
            this._assertInitialized();
            return this.groundOverlay.getOpacity();
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/image-overlay
         * #GroundOverlay.getUrl
         */
        MapGroundOverlay.prototype.getUrl = function () {
            this._assertInitialized();
            return this.groundOverlay.getUrl();
        };
        MapGroundOverlay.prototype._watchForOpacityChanges = function () {
            var _this = this;
            this._opacity.pipe(operators.takeUntil(this._destroyed)).subscribe(function (opacity) {
                if (opacity != null) {
                    _this._assertInitialized();
                    _this.groundOverlay.setOpacity(opacity);
                }
            });
        };
        MapGroundOverlay.prototype._watchForUrlChanges = function () {
            var _this = this;
            this._url.pipe(operators.takeUntil(this._destroyed)).subscribe(function (url) {
                _this._assertInitialized();
                var overlay = _this.groundOverlay;
                overlay.set('url', url);
                // Google Maps only redraws the overlay if we re-set the map.
                overlay.setMap(null);
                overlay.setMap(_this._map.googleMap);
            });
        };
        MapGroundOverlay.prototype._assertInitialized = function () {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
        return MapGroundOverlay;
    }());
    MapGroundOverlay.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-ground-overlay',
                    exportAs: 'mapGroundOverlay',
                },] }
    ];
    MapGroundOverlay.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapGroundOverlay.propDecorators = {
        url: [{ type: i0.Input }],
        bounds: [{ type: i0.Input }],
        clickable: [{ type: i0.Input }],
        opacity: [{ type: i0.Input }],
        mapClick: [{ type: i0.Output }],
        mapDblclick: [{ type: i0.Output }]
    };

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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapInfoWindow.prototype, "position", {
            set: function (position) {
                this._position.next(position);
            },
            enumerable: false,
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
            // If no info window has been created on the server, we do not try closing it.
            // On the server, an info window cannot be created and this would cause errors.
            if (this.infoWindow) {
                this.close();
            }
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
         * Opens the MapInfoWindow using the provided anchor. If the anchor is not set,
         * then the position property of the options input is used instead.
         */
        MapInfoWindow.prototype.open = function (anchor) {
            this._assertInitialized();
            var anchorObject = anchor ? anchor.getAnchor() : undefined;
            // Prevent the info window from initializing when trying to reopen on the same anchor.
            // Note that when the window is opened for the first time, the anchor will always be
            // undefined. If that's the case, we have to allow it to open in order to handle the
            // case where the window doesn't have an anchor, but is placed at a particular position.
            if (this.infoWindow.get('anchor') !== anchorObject || !anchorObject) {
                this._elementRef.nativeElement.style.display = '';
                this.infoWindow.open(this._googleMap.googleMap, anchorObject);
            }
        };
        MapInfoWindow.prototype._combineOptions = function () {
            var _this = this;
            return rxjs.combineLatest([this._options, this._position]).pipe(operators.map(function (_a) {
                var _b = __read(_a, 2), options = _b[0], position = _b[1];
                var combinedOptions = Object.assign(Object.assign({}, options), { position: position || options.position, content: _this._elementRef.nativeElement });
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
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
        return MapInfoWindow;
    }());
    MapInfoWindow.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-info-window',
                    exportAs: 'mapInfoWindow',
                    host: { 'style': 'display: none' },
                },] }
    ];
    MapInfoWindow.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.ElementRef },
        { type: i0.NgZone }
    ]; };
    MapInfoWindow.propDecorators = {
        options: [{ type: i0.Input }],
        position: [{ type: i0.Input }],
        closeclick: [{ type: i0.Output }],
        contentChanged: [{ type: i0.Output }],
        domready: [{ type: i0.Output }],
        positionChanged: [{ type: i0.Output }],
        zindexChanged: [{ type: i0.Output }]
    };

    /**
     * Angular component that renders a Google Maps KML Layer via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer
     */
    var MapKmlLayer = /** @class */ (function () {
        function MapKmlLayer(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._eventManager = new MapEventManager(this._ngZone);
            this._options = new rxjs.BehaviorSubject({});
            this._url = new rxjs.BehaviorSubject('');
            this._destroyed = new rxjs.Subject();
            /**
             * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.click
             */
            this.kmlClick = this._eventManager.getLazyEmitter('click');
            /**
             * See
             * developers.google.com/maps/documentation/javascript/reference/kml
             * #KmlLayer.defaultviewport_changed
             */
            this.defaultviewportChanged = this._eventManager.getLazyEmitter('defaultviewport_changed');
            /**
             * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.status_changed
             */
            this.statusChanged = this._eventManager.getLazyEmitter('status_changed');
        }
        Object.defineProperty(MapKmlLayer.prototype, "options", {
            set: function (options) {
                this._options.next(options || {});
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapKmlLayer.prototype, "url", {
            set: function (url) {
                this._url.next(url);
            },
            enumerable: false,
            configurable: true
        });
        MapKmlLayer.prototype.ngOnInit = function () {
            var _this = this;
            if (this._map._isBrowser) {
                this._combineOptions().pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    // We'll bring it back in inside the `MapEventManager` only for the events that the
                    // user has subscribed to.
                    _this._ngZone.runOutsideAngular(function () { return _this.kmlLayer = new google.maps.KmlLayer(options); });
                    _this._assertInitialized();
                    _this.kmlLayer.setMap(_this._map.googleMap);
                    _this._eventManager.setTarget(_this.kmlLayer);
                });
                this._watchForOptionsChanges();
                this._watchForUrlChanges();
            }
        };
        MapKmlLayer.prototype.ngOnDestroy = function () {
            this._eventManager.destroy();
            this._destroyed.next();
            this._destroyed.complete();
            if (this.kmlLayer) {
                this.kmlLayer.setMap(null);
            }
        };
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getDefaultViewport
         */
        MapKmlLayer.prototype.getDefaultViewport = function () {
            this._assertInitialized();
            return this.kmlLayer.getDefaultViewport();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getMetadata
         */
        MapKmlLayer.prototype.getMetadata = function () {
            this._assertInitialized();
            return this.kmlLayer.getMetadata();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getStatus
         */
        MapKmlLayer.prototype.getStatus = function () {
            this._assertInitialized();
            return this.kmlLayer.getStatus();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getUrl
         */
        MapKmlLayer.prototype.getUrl = function () {
            this._assertInitialized();
            return this.kmlLayer.getUrl();
        };
        /**
         * See developers.google.com/maps/documentation/javascript/reference/kml#KmlLayer.getZIndex
         */
        MapKmlLayer.prototype.getZIndex = function () {
            this._assertInitialized();
            return this.kmlLayer.getZIndex();
        };
        MapKmlLayer.prototype._combineOptions = function () {
            return rxjs.combineLatest([this._options, this._url]).pipe(operators.map(function (_a) {
                var _b = __read(_a, 2), options = _b[0], url = _b[1];
                var combinedOptions = Object.assign(Object.assign({}, options), { url: url || options.url });
                return combinedOptions;
            }));
        };
        MapKmlLayer.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroyed)).subscribe(function (options) {
                if (_this.kmlLayer) {
                    _this._assertInitialized();
                    _this.kmlLayer.setOptions(options);
                }
            });
        };
        MapKmlLayer.prototype._watchForUrlChanges = function () {
            var _this = this;
            this._url.pipe(operators.takeUntil(this._destroyed)).subscribe(function (url) {
                if (url && _this.kmlLayer) {
                    _this._assertInitialized();
                    _this.kmlLayer.setUrl(url);
                }
            });
        };
        MapKmlLayer.prototype._assertInitialized = function () {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                if (!this._map.googleMap) {
                    throw Error('Cannot access Google Map information before the API has been initialized. ' +
                        'Please wait for the API to load before trying to interact with it.');
                }
                if (!this.kmlLayer) {
                    throw Error('Cannot interact with a Google Map KmlLayer before it has been ' +
                        'initialized. Please wait for the KmlLayer to load before trying to interact with it.');
                }
            }
        };
        return MapKmlLayer;
    }());
    MapKmlLayer.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-kml-layer',
                    exportAs: 'mapKmlLayer',
                },] }
    ];
    MapKmlLayer.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapKmlLayer.propDecorators = {
        options: [{ type: i0.Input }],
        url: [{ type: i0.Input }],
        kmlClick: [{ type: i0.Output }],
        defaultviewportChanged: [{ type: i0.Output }],
        statusChanged: [{ type: i0.Output }]
    };

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
        Object.defineProperty(MapMarker.prototype, "title", {
            /**
             * Title of the marker.
             * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.title
             */
            set: function (title) {
                this._title = title;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarker.prototype, "position", {
            /**
             * Position of the marker. See:
             * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.position
             */
            set: function (position) {
                this._position = position;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarker.prototype, "label", {
            /**
             * Label for the marker.
             * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.label
             */
            set: function (label) {
                this._label = label;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarker.prototype, "clickable", {
            /**
             * Whether the marker is clickable. See:
             * developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.clickable
             */
            set: function (clickable) {
                this._clickable = clickable;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarker.prototype, "options", {
            /**
             * Options used to configure the marker.
             * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions
             */
            set: function (options) {
                this._options = options;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarker.prototype, "icon", {
            /**
             * Icon to be used for the marker.
             * See: https://developers.google.com/maps/documentation/javascript/reference/marker#Icon
             */
            set: function (icon) {
                this._icon = icon;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarker.prototype, "visible", {
            /**
             * Whether the marker is visible.
             * See: developers.google.com/maps/documentation/javascript/reference/marker#MarkerOptions.visible
             */
            set: function (value) {
                this._visible = value;
            },
            enumerable: false,
            configurable: true
        });
        MapMarker.prototype.ngOnInit = function () {
            var _this = this;
            if (this._googleMap._isBrowser) {
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(function () {
                    _this.marker = new google.maps.Marker(_this._combineOptions());
                });
                this._assertInitialized();
                this.marker.setMap(this._googleMap.googleMap);
                this._eventManager.setTarget(this.marker);
            }
        };
        MapMarker.prototype.ngOnChanges = function (changes) {
            var _c = this, marker = _c.marker, _title = _c._title, _position = _c._position, _label = _c._label, _clickable = _c._clickable, _icon = _c._icon, _visible = _c._visible;
            if (marker) {
                if (changes['options']) {
                    marker.setOptions(this._combineOptions());
                }
                if (changes['title'] && _title !== undefined) {
                    marker.setTitle(_title);
                }
                if (changes['position'] && _position) {
                    marker.setPosition(_position);
                }
                if (changes['label'] && _label !== undefined) {
                    marker.setLabel(_label);
                }
                if (changes['clickable'] && _clickable !== undefined) {
                    marker.setClickable(_clickable);
                }
                if (changes['icon'] && _icon) {
                    marker.setIcon(_icon);
                }
                if (changes['visible'] && _visible !== undefined) {
                    marker.setVisible(_visible);
                }
            }
        };
        MapMarker.prototype.ngOnDestroy = function () {
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
        /** Gets the anchor point that can be used to attach other Google Maps objects. */
        MapMarker.prototype.getAnchor = function () {
            this._assertInitialized();
            return this.marker;
        };
        /** Creates a combined options object using the passed-in options and the individual inputs. */
        MapMarker.prototype._combineOptions = function () {
            var _a, _b;
            var options = this._options || DEFAULT_MARKER_OPTIONS;
            return Object.assign(Object.assign({}, options), { title: this._title || options.title, position: this._position || options.position, label: this._label || options.label, clickable: (_a = this._clickable) !== null && _a !== void 0 ? _a : options.clickable, map: this._googleMap.googleMap, icon: this._icon || options.icon, visible: (_b = this._visible) !== null && _b !== void 0 ? _b : options.visible });
        };
        MapMarker.prototype._assertInitialized = function () {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
        return MapMarker;
    }());
    MapMarker.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-marker',
                    exportAs: 'mapMarker',
                },] }
    ];
    MapMarker.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapMarker.propDecorators = {
        title: [{ type: i0.Input }],
        position: [{ type: i0.Input }],
        label: [{ type: i0.Input }],
        clickable: [{ type: i0.Input }],
        options: [{ type: i0.Input }],
        icon: [{ type: i0.Input }],
        visible: [{ type: i0.Input }],
        animationChanged: [{ type: i0.Output }],
        mapClick: [{ type: i0.Output }],
        clickableChanged: [{ type: i0.Output }],
        cursorChanged: [{ type: i0.Output }],
        mapDblclick: [{ type: i0.Output }],
        mapDrag: [{ type: i0.Output }],
        mapDragend: [{ type: i0.Output }],
        draggableChanged: [{ type: i0.Output }],
        mapDragstart: [{ type: i0.Output }],
        flatChanged: [{ type: i0.Output }],
        iconChanged: [{ type: i0.Output }],
        mapMousedown: [{ type: i0.Output }],
        mapMouseout: [{ type: i0.Output }],
        mapMouseover: [{ type: i0.Output }],
        mapMouseup: [{ type: i0.Output }],
        positionChanged: [{ type: i0.Output }],
        mapRightclick: [{ type: i0.Output }],
        shapeChanged: [{ type: i0.Output }],
        titleChanged: [{ type: i0.Output }],
        visibleChanged: [{ type: i0.Output }],
        zindexChanged: [{ type: i0.Output }]
    };

    /** Default options for a clusterer. */
    var DEFAULT_CLUSTERER_OPTIONS = {};
    /**
     * Angular component for implementing a Google Maps Marker Clusterer.
     *
     * See https://developers.google.com/maps/documentation/javascript/marker-clustering
     */
    var MapMarkerClusterer = /** @class */ (function () {
        function MapMarkerClusterer(_googleMap, _ngZone) {
            this._googleMap = _googleMap;
            this._ngZone = _ngZone;
            this._currentMarkers = new Set();
            this._eventManager = new MapEventManager(this._ngZone);
            this._destroy = new rxjs.Subject();
            this.ariaLabelFn = function () { return ''; };
            /**
             * See
             * googlemaps.github.io/v3-utility-library/modules/
             * _google_markerclustererplus.html#clusteringbegin
             */
            this.clusteringbegin = this._eventManager.getLazyEmitter('clusteringbegin');
            /**
             * See
             * googlemaps.github.io/v3-utility-library/modules/_google_markerclustererplus.html#clusteringend
             */
            this.clusteringend = this._eventManager.getLazyEmitter('clusteringend');
            /** Emits when a cluster has been clicked. */
            this.clusterClick = this._eventManager.getLazyEmitter('click');
            this._canInitialize = this._googleMap._isBrowser;
        }
        Object.defineProperty(MapMarkerClusterer.prototype, "averageCenter", {
            set: function (averageCenter) {
                this._averageCenter = averageCenter;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "batchSizeIE", {
            set: function (batchSizeIE) {
                this._batchSizeIE = batchSizeIE;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "calculator", {
            set: function (calculator) {
                this._calculator = calculator;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "clusterClass", {
            set: function (clusterClass) {
                this._clusterClass = clusterClass;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "enableRetinaIcons", {
            set: function (enableRetinaIcons) {
                this._enableRetinaIcons = enableRetinaIcons;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "gridSize", {
            set: function (gridSize) {
                this._gridSize = gridSize;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "ignoreHidden", {
            set: function (ignoreHidden) {
                this._ignoreHidden = ignoreHidden;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "imageExtension", {
            set: function (imageExtension) {
                this._imageExtension = imageExtension;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "imagePath", {
            set: function (imagePath) {
                this._imagePath = imagePath;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "imageSizes", {
            set: function (imageSizes) {
                this._imageSizes = imageSizes;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "maxZoom", {
            set: function (maxZoom) {
                this._maxZoom = maxZoom;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "minimumClusterSize", {
            set: function (minimumClusterSize) {
                this._minimumClusterSize = minimumClusterSize;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "styles", {
            set: function (styles) {
                this._styles = styles;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "title", {
            set: function (title) {
                this._title = title;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "zIndex", {
            set: function (zIndex) {
                this._zIndex = zIndex;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "zoomOnClick", {
            set: function (zoomOnClick) {
                this._zoomOnClick = zoomOnClick;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapMarkerClusterer.prototype, "options", {
            set: function (options) {
                this._options = options;
            },
            enumerable: false,
            configurable: true
        });
        MapMarkerClusterer.prototype.ngOnInit = function () {
            var _this = this;
            if (this._canInitialize) {
                var clustererWindow = window;
                if (!clustererWindow.MarkerClusterer && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                    throw Error('MarkerClusterer class not found, cannot construct a marker cluster. ' +
                        'Please install the MarkerClustererPlus library: ' +
                        'https://github.com/googlemaps/js-markerclustererplus');
                }
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(function () {
                    _this.markerClusterer = new MarkerClusterer(_this._googleMap.googleMap, [], _this._combineOptions());
                });
                this._assertInitialized();
                this._eventManager.setTarget(this.markerClusterer);
            }
        };
        MapMarkerClusterer.prototype.ngAfterContentInit = function () {
            if (this._canInitialize) {
                this._watchForMarkerChanges();
            }
        };
        MapMarkerClusterer.prototype.ngOnChanges = function (changes) {
            var _u = this, clusterer = _u.markerClusterer, ariaLabelFn = _u.ariaLabelFn, _averageCenter = _u._averageCenter, _batchSizeIE = _u._batchSizeIE, _calculator = _u._calculator, _styles = _u._styles, _clusterClass = _u._clusterClass, _enableRetinaIcons = _u._enableRetinaIcons, _gridSize = _u._gridSize, _ignoreHidden = _u._ignoreHidden, _imageExtension = _u._imageExtension, _imagePath = _u._imagePath, _imageSizes = _u._imageSizes, _maxZoom = _u._maxZoom, _minimumClusterSize = _u._minimumClusterSize, _title = _u._title, _zIndex = _u._zIndex, _zoomOnClick = _u._zoomOnClick;
            if (clusterer) {
                if (changes['options']) {
                    clusterer.setOptions(this._combineOptions());
                }
                if (changes['ariaLabelFn']) {
                    clusterer.ariaLabelFn = ariaLabelFn;
                }
                if (changes['averageCenter'] && _averageCenter !== undefined) {
                    clusterer.setAverageCenter(_averageCenter);
                }
                if (changes['batchSizeIE'] && _batchSizeIE !== undefined) {
                    clusterer.setBatchSizeIE(_batchSizeIE);
                }
                if (changes['calculator'] && !!_calculator) {
                    clusterer.setCalculator(_calculator);
                }
                if (changes['clusterClass'] && _clusterClass !== undefined) {
                    clusterer.setClusterClass(_clusterClass);
                }
                if (changes['enableRetinaIcons'] && _enableRetinaIcons !== undefined) {
                    clusterer.setEnableRetinaIcons(_enableRetinaIcons);
                }
                if (changes['gridSize'] && _gridSize !== undefined) {
                    clusterer.setGridSize(_gridSize);
                }
                if (changes['ignoreHidden'] && _ignoreHidden !== undefined) {
                    clusterer.setIgnoreHidden(_ignoreHidden);
                }
                if (changes['imageExtension'] && _imageExtension !== undefined) {
                    clusterer.setImageExtension(_imageExtension);
                }
                if (changes['imagePath'] && _imagePath !== undefined) {
                    clusterer.setImagePath(_imagePath);
                }
                if (changes['imageSizes'] && _imageSizes) {
                    clusterer.setImageSizes(_imageSizes);
                }
                if (changes['maxZoom'] && _maxZoom !== undefined) {
                    clusterer.setMaxZoom(_maxZoom);
                }
                if (changes['minimumClusterSize'] && _minimumClusterSize !== undefined) {
                    clusterer.setMinimumClusterSize(_minimumClusterSize);
                }
                if (changes['styles'] && _styles) {
                    clusterer.setStyles(_styles);
                }
                if (changes['title'] && _title !== undefined) {
                    clusterer.setTitle(_title);
                }
                if (changes['zIndex'] && _zIndex !== undefined) {
                    clusterer.setZIndex(_zIndex);
                }
                if (changes['zoomOnClick'] && _zoomOnClick !== undefined) {
                    clusterer.setZoomOnClick(_zoomOnClick);
                }
            }
        };
        MapMarkerClusterer.prototype.ngOnDestroy = function () {
            this._destroy.next();
            this._destroy.complete();
            this._eventManager.destroy();
            if (this.markerClusterer) {
                this.markerClusterer.setMap(null);
            }
        };
        MapMarkerClusterer.prototype.fitMapToMarkers = function (padding) {
            this._assertInitialized();
            this.markerClusterer.fitMapToMarkers(padding);
        };
        MapMarkerClusterer.prototype.getAverageCenter = function () {
            this._assertInitialized();
            return this.markerClusterer.getAverageCenter();
        };
        MapMarkerClusterer.prototype.getBatchSizeIE = function () {
            this._assertInitialized();
            return this.markerClusterer.getBatchSizeIE();
        };
        MapMarkerClusterer.prototype.getCalculator = function () {
            this._assertInitialized();
            return this.markerClusterer.getCalculator();
        };
        MapMarkerClusterer.prototype.getClusterClass = function () {
            this._assertInitialized();
            return this.markerClusterer.getClusterClass();
        };
        MapMarkerClusterer.prototype.getClusters = function () {
            this._assertInitialized();
            return this.markerClusterer.getClusters();
        };
        MapMarkerClusterer.prototype.getEnableRetinaIcons = function () {
            this._assertInitialized();
            return this.markerClusterer.getEnableRetinaIcons();
        };
        MapMarkerClusterer.prototype.getGridSize = function () {
            this._assertInitialized();
            return this.markerClusterer.getGridSize();
        };
        MapMarkerClusterer.prototype.getIgnoreHidden = function () {
            this._assertInitialized();
            return this.markerClusterer.getIgnoreHidden();
        };
        MapMarkerClusterer.prototype.getImageExtension = function () {
            this._assertInitialized();
            return this.markerClusterer.getImageExtension();
        };
        MapMarkerClusterer.prototype.getImagePath = function () {
            this._assertInitialized();
            return this.markerClusterer.getImagePath();
        };
        MapMarkerClusterer.prototype.getImageSizes = function () {
            this._assertInitialized();
            return this.markerClusterer.getImageSizes();
        };
        MapMarkerClusterer.prototype.getMaxZoom = function () {
            this._assertInitialized();
            return this.markerClusterer.getMaxZoom();
        };
        MapMarkerClusterer.prototype.getMinimumClusterSize = function () {
            this._assertInitialized();
            return this.markerClusterer.getMinimumClusterSize();
        };
        MapMarkerClusterer.prototype.getStyles = function () {
            this._assertInitialized();
            return this.markerClusterer.getStyles();
        };
        MapMarkerClusterer.prototype.getTitle = function () {
            this._assertInitialized();
            return this.markerClusterer.getTitle();
        };
        MapMarkerClusterer.prototype.getTotalClusters = function () {
            this._assertInitialized();
            return this.markerClusterer.getTotalClusters();
        };
        MapMarkerClusterer.prototype.getTotalMarkers = function () {
            this._assertInitialized();
            return this.markerClusterer.getTotalMarkers();
        };
        MapMarkerClusterer.prototype.getZIndex = function () {
            this._assertInitialized();
            return this.markerClusterer.getZIndex();
        };
        MapMarkerClusterer.prototype.getZoomOnClick = function () {
            this._assertInitialized();
            return this.markerClusterer.getZoomOnClick();
        };
        MapMarkerClusterer.prototype._combineOptions = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
            var options = this._options || DEFAULT_CLUSTERER_OPTIONS;
            return Object.assign(Object.assign({}, options), { ariaLabelFn: (_a = this.ariaLabelFn) !== null && _a !== void 0 ? _a : options.ariaLabelFn, averageCenter: (_b = this._averageCenter) !== null && _b !== void 0 ? _b : options.averageCenter, batchSize: (_c = this.batchSize) !== null && _c !== void 0 ? _c : options.batchSize, batchSizeIE: (_d = this._batchSizeIE) !== null && _d !== void 0 ? _d : options.batchSizeIE, calculator: (_e = this._calculator) !== null && _e !== void 0 ? _e : options.calculator, clusterClass: (_f = this._clusterClass) !== null && _f !== void 0 ? _f : options.clusterClass, enableRetinaIcons: (_g = this._enableRetinaIcons) !== null && _g !== void 0 ? _g : options.enableRetinaIcons, gridSize: (_h = this._gridSize) !== null && _h !== void 0 ? _h : options.gridSize, ignoreHidden: (_j = this._ignoreHidden) !== null && _j !== void 0 ? _j : options.ignoreHidden, imageExtension: (_k = this._imageExtension) !== null && _k !== void 0 ? _k : options.imageExtension, imagePath: (_l = this._imagePath) !== null && _l !== void 0 ? _l : options.imagePath, imageSizes: (_m = this._imageSizes) !== null && _m !== void 0 ? _m : options.imageSizes, maxZoom: (_o = this._maxZoom) !== null && _o !== void 0 ? _o : options.maxZoom, minimumClusterSize: (_p = this._minimumClusterSize) !== null && _p !== void 0 ? _p : options.minimumClusterSize, styles: (_q = this._styles) !== null && _q !== void 0 ? _q : options.styles, title: (_r = this._title) !== null && _r !== void 0 ? _r : options.title, zIndex: (_s = this._zIndex) !== null && _s !== void 0 ? _s : options.zIndex, zoomOnClick: (_t = this._zoomOnClick) !== null && _t !== void 0 ? _t : options.zoomOnClick });
        };
        MapMarkerClusterer.prototype._watchForMarkerChanges = function () {
            var e_1, _u;
            var _this = this;
            this._assertInitialized();
            var initialMarkers = [];
            try {
                for (var _v = __values(this._getInternalMarkers(this._markers.toArray())), _w = _v.next(); !_w.done; _w = _v.next()) {
                    var marker = _w.value;
                    this._currentMarkers.add(marker);
                    initialMarkers.push(marker);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_w && !_w.done && (_u = _v.return)) _u.call(_v);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.markerClusterer.addMarkers(initialMarkers);
            this._markers.changes.pipe(operators.takeUntil(this._destroy)).subscribe(function (markerComponents) {
                var e_2, _u, e_3, _v, e_4, _w;
                _this._assertInitialized();
                var newMarkers = new Set(_this._getInternalMarkers(markerComponents));
                var markersToAdd = [];
                var markersToRemove = [];
                try {
                    for (var _x = __values(Array.from(newMarkers)), _y = _x.next(); !_y.done; _y = _x.next()) {
                        var marker = _y.value;
                        if (!_this._currentMarkers.has(marker)) {
                            _this._currentMarkers.add(marker);
                            markersToAdd.push(marker);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_y && !_y.done && (_u = _x.return)) _u.call(_x);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                try {
                    for (var _z = __values(Array.from(_this._currentMarkers)), _0 = _z.next(); !_0.done; _0 = _z.next()) {
                        var marker = _0.value;
                        if (!newMarkers.has(marker)) {
                            markersToRemove.push(marker);
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_0 && !_0.done && (_v = _z.return)) _v.call(_z);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                _this.markerClusterer.addMarkers(markersToAdd, true);
                _this.markerClusterer.removeMarkers(markersToRemove, true);
                _this.markerClusterer.repaint();
                try {
                    for (var markersToRemove_1 = __values(markersToRemove), markersToRemove_1_1 = markersToRemove_1.next(); !markersToRemove_1_1.done; markersToRemove_1_1 = markersToRemove_1.next()) {
                        var marker = markersToRemove_1_1.value;
                        _this._currentMarkers.delete(marker);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (markersToRemove_1_1 && !markersToRemove_1_1.done && (_w = markersToRemove_1.return)) _w.call(markersToRemove_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
            });
        };
        MapMarkerClusterer.prototype._getInternalMarkers = function (markers) {
            return markers.filter(function (markerComponent) { return !!markerComponent.marker; })
                .map(function (markerComponent) { return markerComponent.marker; });
        };
        MapMarkerClusterer.prototype._assertInitialized = function () {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                if (!this._googleMap.googleMap) {
                    throw Error('Cannot access Google Map information before the API has been initialized. ' +
                        'Please wait for the API to load before trying to interact with it.');
                }
                if (!this.markerClusterer) {
                    throw Error('Cannot interact with a MarkerClusterer before it has been initialized. ' +
                        'Please wait for the MarkerClusterer to load before trying to interact with it.');
                }
            }
        };
        return MapMarkerClusterer;
    }());
    MapMarkerClusterer.decorators = [
        { type: i0.Component, args: [{
                    selector: 'map-marker-clusterer',
                    exportAs: 'mapMarkerClusterer',
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    template: '<ng-content></ng-content>',
                    encapsulation: i0.ViewEncapsulation.None
                },] }
    ];
    MapMarkerClusterer.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapMarkerClusterer.propDecorators = {
        ariaLabelFn: [{ type: i0.Input }],
        averageCenter: [{ type: i0.Input }],
        batchSize: [{ type: i0.Input }],
        batchSizeIE: [{ type: i0.Input }],
        calculator: [{ type: i0.Input }],
        clusterClass: [{ type: i0.Input }],
        enableRetinaIcons: [{ type: i0.Input }],
        gridSize: [{ type: i0.Input }],
        ignoreHidden: [{ type: i0.Input }],
        imageExtension: [{ type: i0.Input }],
        imagePath: [{ type: i0.Input }],
        imageSizes: [{ type: i0.Input }],
        maxZoom: [{ type: i0.Input }],
        minimumClusterSize: [{ type: i0.Input }],
        styles: [{ type: i0.Input }],
        title: [{ type: i0.Input }],
        zIndex: [{ type: i0.Input }],
        zoomOnClick: [{ type: i0.Input }],
        options: [{ type: i0.Input }],
        clusteringbegin: [{ type: i0.Output }],
        clusteringend: [{ type: i0.Output }],
        clusterClick: [{ type: i0.Output }],
        _markers: [{ type: i0.ContentChildren, args: [MapMarker, { descendants: true },] }]
    };

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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolygon.prototype, "paths", {
            set: function (paths) {
                this._paths.next(paths);
            },
            enumerable: false,
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
                var combinedOptions = Object.assign(Object.assign({}, options), { paths: paths || options.paths });
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
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
        return MapPolygon;
    }());
    MapPolygon.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-polygon',
                    exportAs: 'mapPolygon',
                },] }
    ];
    MapPolygon.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapPolygon.propDecorators = {
        options: [{ type: i0.Input }],
        paths: [{ type: i0.Input }],
        polygonClick: [{ type: i0.Output }],
        polygonDblclick: [{ type: i0.Output }],
        polygonDrag: [{ type: i0.Output }],
        polygonDragend: [{ type: i0.Output }],
        polygonDragstart: [{ type: i0.Output }],
        polygonMousedown: [{ type: i0.Output }],
        polygonMousemove: [{ type: i0.Output }],
        polygonMouseout: [{ type: i0.Output }],
        polygonMouseover: [{ type: i0.Output }],
        polygonMouseup: [{ type: i0.Output }],
        polygonRightclick: [{ type: i0.Output }]
    };

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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolyline.prototype, "path", {
            set: function (path) {
                this._path.next(path);
            },
            enumerable: false,
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
                var combinedOptions = Object.assign(Object.assign({}, options), { path: path || options.path });
                return combinedOptions;
            }));
        };
        MapPolyline.prototype._watchForOptionsChanges = function () {
            var _this = this;
            this._options.pipe(operators.takeUntil(this._destroyed)).subscribe(function (options) {
                _this._assertInitialized();
                _this.polyline.setOptions(options);
            });
        };
        MapPolyline.prototype._watchForPathChanges = function () {
            var _this = this;
            this._path.pipe(operators.takeUntil(this._destroyed)).subscribe(function (path) {
                if (path) {
                    _this._assertInitialized();
                    _this.polyline.setPath(path);
                }
            });
        };
        MapPolyline.prototype._assertInitialized = function () {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
        return MapPolyline;
    }());
    MapPolyline.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-polyline',
                    exportAs: 'mapPolyline',
                },] }
    ];
    MapPolyline.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapPolyline.propDecorators = {
        options: [{ type: i0.Input }],
        path: [{ type: i0.Input }],
        polylineClick: [{ type: i0.Output }],
        polylineDblclick: [{ type: i0.Output }],
        polylineDrag: [{ type: i0.Output }],
        polylineDragend: [{ type: i0.Output }],
        polylineDragstart: [{ type: i0.Output }],
        polylineMousedown: [{ type: i0.Output }],
        polylineMousemove: [{ type: i0.Output }],
        polylineMouseout: [{ type: i0.Output }],
        polylineMouseover: [{ type: i0.Output }],
        polylineMouseup: [{ type: i0.Output }],
        polylineRightclick: [{ type: i0.Output }]
    };

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
             */ this.boundsChanged = this._eventManager.getLazyEmitter('bounds_changed');
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
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapRectangle.prototype, "bounds", {
            set: function (bounds) {
                this._bounds.next(bounds);
            },
            enumerable: false,
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
                var combinedOptions = Object.assign(Object.assign({}, options), { bounds: bounds || options.bounds });
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
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                if (!this._map.googleMap) {
                    throw Error('Cannot access Google Map information before the API has been initialized. ' +
                        'Please wait for the API to load before trying to interact with it.');
                }
                if (!this.rectangle) {
                    throw Error('Cannot interact with a Google Map Rectangle before it has been initialized. ' +
                        'Please wait for the Rectangle to load before trying to interact with it.');
                }
            }
        };
        return MapRectangle;
    }());
    MapRectangle.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-rectangle',
                    exportAs: 'mapRectangle',
                },] }
    ];
    MapRectangle.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapRectangle.propDecorators = {
        options: [{ type: i0.Input }],
        bounds: [{ type: i0.Input }],
        boundsChanged: [{ type: i0.Output }],
        rectangleClick: [{ type: i0.Output }],
        rectangleDblclick: [{ type: i0.Output }],
        rectangleDrag: [{ type: i0.Output }],
        rectangleDragend: [{ type: i0.Output }],
        rectangleDragstart: [{ type: i0.Output }],
        rectangleMousedown: [{ type: i0.Output }],
        rectangleMousemove: [{ type: i0.Output }],
        rectangleMouseout: [{ type: i0.Output }],
        rectangleMouseover: [{ type: i0.Output }],
        rectangleMouseup: [{ type: i0.Output }],
        rectangleRightclick: [{ type: i0.Output }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Angular component that renders a Google Maps Traffic Layer via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#TrafficLayer
     */
    var MapTrafficLayer = /** @class */ (function () {
        function MapTrafficLayer(_map, _ngZone) {
            this._map = _map;
            this._ngZone = _ngZone;
            this._autoRefresh = new rxjs.BehaviorSubject(true);
            this._destroyed = new rxjs.Subject();
        }
        Object.defineProperty(MapTrafficLayer.prototype, "autoRefresh", {
            /**
             * Whether the traffic layer refreshes with updated information automatically.
             */
            set: function (autoRefresh) {
                this._autoRefresh.next(autoRefresh);
            },
            enumerable: false,
            configurable: true
        });
        MapTrafficLayer.prototype.ngOnInit = function () {
            var _this = this;
            if (this._map._isBrowser) {
                this._combineOptions().pipe(operators.take(1)).subscribe(function (options) {
                    // Create the object outside the zone so its events don't trigger change detection.
                    _this._ngZone.runOutsideAngular(function () {
                        _this.trafficLayer = new google.maps.TrafficLayer(options);
                    });
                    _this._assertInitialized();
                    _this.trafficLayer.setMap(_this._map.googleMap);
                });
                this._watchForAutoRefreshChanges();
            }
        };
        MapTrafficLayer.prototype.ngOnDestroy = function () {
            this._destroyed.next();
            this._destroyed.complete();
            if (this.trafficLayer) {
                this.trafficLayer.setMap(null);
            }
        };
        MapTrafficLayer.prototype._combineOptions = function () {
            return this._autoRefresh.pipe(operators.map(function (autoRefresh) {
                var combinedOptions = { autoRefresh: autoRefresh };
                return combinedOptions;
            }));
        };
        MapTrafficLayer.prototype._watchForAutoRefreshChanges = function () {
            var _this = this;
            this._combineOptions().pipe(operators.takeUntil(this._destroyed)).subscribe(function (options) {
                _this._assertInitialized();
                _this.trafficLayer.setOptions(options);
            });
        };
        MapTrafficLayer.prototype._assertInitialized = function () {
            if (!this._map.googleMap) {
                throw Error('Cannot access Google Map information before the API has been initialized. ' +
                    'Please wait for the API to load before trying to interact with it.');
            }
            if (!this.trafficLayer) {
                throw Error('Cannot interact with a Google Map Traffic Layer before it has been initialized. ' +
                    'Please wait for the Traffic Layer to load before trying to interact with it.');
            }
        };
        return MapTrafficLayer;
    }());
    MapTrafficLayer.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-traffic-layer',
                    exportAs: 'mapTrafficLayer',
                },] }
    ];
    MapTrafficLayer.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapTrafficLayer.propDecorators = {
        autoRefresh: [{ type: i0.Input }]
    };

    /**
     * Angular component that renders a Google Maps Transit Layer via the Google Maps JavaScript API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/map#TransitLayer
     */
    var MapTransitLayer = /** @class */ (function (_super) {
        __extends(MapTransitLayer, _super);
        function MapTransitLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapTransitLayer.prototype._initializeObject = function () {
            this.transitLayer = new google.maps.TransitLayer();
        };
        MapTransitLayer.prototype._setMap = function () {
            this._assertLayerInitialized();
            this.transitLayer.setMap(this._map.googleMap);
        };
        MapTransitLayer.prototype._unsetMap = function () {
            if (this.transitLayer) {
                this.transitLayer.setMap(null);
            }
        };
        MapTransitLayer.prototype._assertLayerInitialized = function () {
            if (!this.transitLayer) {
                throw Error('Cannot interact with a Google Map Transit Layer before it has been initialized. ' +
                    'Please wait for the Transit Layer to load before trying to interact with it.');
            }
        };
        return MapTransitLayer;
    }(MapBaseLayer));
    MapTransitLayer.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-transit-layer',
                    exportAs: 'mapTransitLayer',
                },] }
    ];

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Angular directive that renders a Google Maps heatmap via the Google Maps JavaScript API.
     *
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    var MapHeatmapLayer = /** @class */ (function () {
        function MapHeatmapLayer(_googleMap, _ngZone) {
            this._googleMap = _googleMap;
            this._ngZone = _ngZone;
        }
        Object.defineProperty(MapHeatmapLayer.prototype, "data", {
            /**
             * Data shown on the heatmap.
             * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
             */
            set: function (data) {
                this._data = data;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapHeatmapLayer.prototype, "options", {
            /**
             * Options used to configure the heatmap. See:
             * developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions
             */
            set: function (options) {
                this._options = options;
            },
            enumerable: false,
            configurable: true
        });
        MapHeatmapLayer.prototype.ngOnInit = function () {
            var _this = this;
            var _a, _b;
            if (this._googleMap._isBrowser) {
                if (!((_b = (_a = window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.visualization) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
                    throw Error('Namespace `google.maps.visualization` not found, cannot construct heatmap. ' +
                        'Please install the Google Maps JavaScript API with the "visualization" library: ' +
                        'https://developers.google.com/maps/documentation/javascript/visualization');
                }
                // Create the object outside the zone so its events don't trigger change detection.
                // We'll bring it back in inside the `MapEventManager` only for the events that the
                // user has subscribed to.
                this._ngZone.runOutsideAngular(function () {
                    _this.heatmap = new google.maps.visualization.HeatmapLayer(_this._combineOptions());
                });
                this._assertInitialized();
                this.heatmap.setMap(this._googleMap.googleMap);
            }
        };
        MapHeatmapLayer.prototype.ngOnChanges = function (changes) {
            var _c = this, _data = _c._data, heatmap = _c.heatmap;
            if (heatmap) {
                if (changes['options']) {
                    heatmap.setOptions(this._combineOptions());
                }
                if (changes['data'] && _data !== undefined) {
                    heatmap.setData(this._normalizeData(_data));
                }
            }
        };
        MapHeatmapLayer.prototype.ngOnDestroy = function () {
            if (this.heatmap) {
                this.heatmap.setMap(null);
            }
        };
        /**
         * Gets the data that is currently shown on the heatmap.
         * See: developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayer
         */
        MapHeatmapLayer.prototype.getData = function () {
            this._assertInitialized();
            return this.heatmap.getData();
        };
        /** Creates a combined options object using the passed-in options and the individual inputs. */
        MapHeatmapLayer.prototype._combineOptions = function () {
            var options = this._options || {};
            return Object.assign(Object.assign({}, options), { data: this._normalizeData(this._data || options.data || []), map: this._googleMap.googleMap });
        };
        /**
         * Most Google Maps APIs support both `LatLng` objects and `LatLngLiteral`. The latter is more
         * convenient to write out, because the Google Maps API doesn't have to have been loaded in order
         * to construct them. The `HeatmapLayer` appears to be an exception that only allows a `LatLng`
         * object, or it throws a runtime error. Since it's more convenient and we expect that Angular
         * users will load the API asynchronously, we allow them to pass in a `LatLngLiteral` and we
         * convert it to a `LatLng` object before passing it off to Google Maps.
         */
        MapHeatmapLayer.prototype._normalizeData = function (data) {
            var result = [];
            data.forEach(function (item) {
                result.push(isLatLngLiteral(item) ? new google.maps.LatLng(item.lat, item.lng) : item);
            });
            return result;
        };
        /** Asserts that the heatmap object has been initialized. */
        MapHeatmapLayer.prototype._assertInitialized = function () {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                if (!this._googleMap.googleMap) {
                    throw Error('Cannot access Google Map information before the API has been initialized. ' +
                        'Please wait for the API to load before trying to interact with it.');
                }
                if (!this.heatmap) {
                    throw Error('Cannot interact with a Google Map HeatmapLayer before it has been ' +
                        'initialized. Please wait for the heatmap to load before trying to interact with it.');
                }
            }
        };
        return MapHeatmapLayer;
    }());
    MapHeatmapLayer.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'map-heatmap-layer',
                    exportAs: 'mapHeatmapLayer',
                },] }
    ];
    MapHeatmapLayer.ctorParameters = function () { return [
        { type: GoogleMap },
        { type: i0.NgZone }
    ]; };
    MapHeatmapLayer.propDecorators = {
        data: [{ type: i0.Input }],
        options: [{ type: i0.Input }]
    };
    /** Asserts that an object is a `LatLngLiteral`. */
    function isLatLngLiteral(value) {
        return value && typeof value.lat === 'number' && typeof value.lng === 'number';
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var COMPONENTS = [
        GoogleMap,
        MapBaseLayer,
        MapBicyclingLayer,
        MapCircle,
        MapDirectionsRenderer,
        MapGroundOverlay,
        MapInfoWindow,
        MapKmlLayer,
        MapMarker,
        MapMarkerClusterer,
        MapPolygon,
        MapPolyline,
        MapRectangle,
        MapTrafficLayer,
        MapTransitLayer,
        MapHeatmapLayer,
    ];
    var GoogleMapsModule = /** @class */ (function () {
        function GoogleMapsModule() {
        }
        return GoogleMapsModule;
    }());
    GoogleMapsModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: COMPONENTS,
                    exports: COMPONENTS,
                },] }
    ];

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Angular service that wraps the Google Maps DirectionsService from the Google Maps JavaScript
     * API.
     *
     * See developers.google.com/maps/documentation/javascript/reference/directions#DirectionsService
     */
    var MapDirectionsService = /** @class */ (function () {
        function MapDirectionsService(_ngZone) {
            this._ngZone = _ngZone;
        }
        /**
         * See
         * developers.google.com/maps/documentation/javascript/reference/directions
         * #DirectionsService.route
         */
        MapDirectionsService.prototype.route = function (request) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                // Initialize the `DirectionsService` lazily since the Google Maps API may
                // not have been loaded when the provider is instantiated.
                if (!_this._directionsService) {
                    _this._directionsService = new google.maps.DirectionsService();
                }
                var callback = function (result, status) {
                    _this._ngZone.run(function () {
                        observer.next({ result: result, status: status });
                        observer.complete();
                    });
                };
                _this._directionsService.route(request, callback);
            });
        };
        return MapDirectionsService;
    }());
    MapDirectionsService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function MapDirectionsService_Factory() { return new MapDirectionsService(i0__namespace.ɵɵinject(i0__namespace.NgZone)); }, token: MapDirectionsService, providedIn: "root" });
    MapDirectionsService.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    MapDirectionsService.ctorParameters = function () { return [
        { type: i0.NgZone }
    ]; };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Angular service that wraps the Google Maps Geocoder from the Google Maps JavaScript API.
     * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder
     */
    var MapGeocoder = /** @class */ (function () {
        function MapGeocoder(_ngZone) {
            this._ngZone = _ngZone;
        }
        /**
         * See developers.google.com/maps/documentation/javascript/reference/geocoder#Geocoder.geocode
         */
        MapGeocoder.prototype.geocode = function (request) {
            var _this = this;
            return new rxjs.Observable(function (observer) {
                // Initialize the `Geocoder` lazily since the Google Maps API may
                // not have been loaded when the provider is instantiated.
                if (!_this._geocoder) {
                    _this._geocoder = new google.maps.Geocoder();
                }
                _this._geocoder.geocode(request, function (results, status) {
                    _this._ngZone.run(function () {
                        observer.next({ results: results, status: status });
                        observer.complete();
                    });
                });
            });
        };
        return MapGeocoder;
    }());
    MapGeocoder.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function MapGeocoder_Factory() { return new MapGeocoder(i0__namespace.ɵɵinject(i0__namespace.NgZone)); }, token: MapGeocoder, providedIn: "root" });
    MapGeocoder.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];
    MapGeocoder.ctorParameters = function () { return [
        { type: i0.NgZone }
    ]; };

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
    exports.MapBaseLayer = MapBaseLayer;
    exports.MapBicyclingLayer = MapBicyclingLayer;
    exports.MapCircle = MapCircle;
    exports.MapDirectionsRenderer = MapDirectionsRenderer;
    exports.MapDirectionsService = MapDirectionsService;
    exports.MapGeocoder = MapGeocoder;
    exports.MapGroundOverlay = MapGroundOverlay;
    exports.MapHeatmapLayer = MapHeatmapLayer;
    exports.MapInfoWindow = MapInfoWindow;
    exports.MapKmlLayer = MapKmlLayer;
    exports.MapMarker = MapMarker;
    exports.MapMarkerClusterer = MapMarkerClusterer;
    exports.MapPolygon = MapPolygon;
    exports.MapPolyline = MapPolyline;
    exports.MapRectangle = MapRectangle;
    exports.MapTrafficLayer = MapTrafficLayer;
    exports.MapTransitLayer = MapTransitLayer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=google-maps.umd.js.map
