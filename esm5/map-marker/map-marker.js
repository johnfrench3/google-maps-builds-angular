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
import { ChangeDetectionStrategy, Component, Input, Output, ViewEncapsulation, NgZone } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
import { GoogleMap } from '../google-map/google-map';
import { MapEventManager } from '../map-event-manager';
/**
 * Default options for the Google Maps marker component. Displays a marker
 * at the Googleplex.
 */
export var DEFAULT_MARKER_OPTIONS = {
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
            var combinedOptionsChanges = this._combineOptions();
            combinedOptionsChanges.pipe(take(1)).subscribe(function (options) {
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
export { MapMarker };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUdMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUVyRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsSUFBTSxzQkFBc0IsR0FBRztJQUNwQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBQztDQUM3QyxDQUFDO0FBRUY7OztHQUdHO0FBQ0g7SUF3TUUsbUJBQ21CLFVBQXFCLEVBQzlCLE9BQWU7UUFETixlQUFVLEdBQVYsVUFBVSxDQUFXO1FBQzlCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFuTWpCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLGFBQVEsR0FDckIsSUFBSSxlQUFlLENBQTRCLHNCQUFzQixDQUFDLENBQUM7UUFDMUQsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFtQixTQUFTLENBQUMsQ0FBQztRQUMxRCxjQUFT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aWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBXb3JrYXJvdW5kIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2JhemVsYnVpbGQvcnVsZXNfbm9kZWpzL2lzc3Vlcy8xMjY1XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImdvb2dsZW1hcHNcIiAvPlxuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7QmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCB0YWtlLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtHb29nbGVNYXB9IGZyb20gJy4uL2dvb2dsZS1tYXAvZ29vZ2xlLW1hcCc7XG5pbXBvcnQge01hcEV2ZW50TWFuYWdlcn0gZnJvbSAnLi4vbWFwLWV2ZW50LW1hbmFnZXInO1xuXG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucyBmb3IgdGhlIEdvb2dsZSBNYXBzIG1hcmtlciBjb21wb25lbnQuIERpc3BsYXlzIGEgbWFya2VyXG4gKiBhdCB0aGUgR29vZ2xlcGxleC5cbiAqL1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfTUFSS0VSX09QVElPTlMgPSB7XG4gIHBvc2l0aW9uOiB7bGF0OiAzNy40MjE5OTUsIGxuZzogLTEyMi4wODQwOTJ9LFxufTtcblxuLyoqXG4gKiBBbmd1bGFyIGNvbXBvbmVudCB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBtYXJrZXIgdmlhIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSS5cbiAqIEBzZWUgZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXJcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWFwLW1hcmtlcicsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2V2ZW50TWFuYWdlciA9IG5ldyBNYXBFdmVudE1hbmFnZXIodGhpcy5fbmdab25lKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfb3B0aW9ucyA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnM+KERFRkFVTFRfTUFSS0VSX09QVElPTlMpO1xuICBwcml2YXRlIHJlYWRvbmx5IF90aXRsZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcG9zaXRpb24gPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2xhYmVsID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nfGdvb2dsZS5tYXBzLk1hcmtlckxhYmVsfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2xpY2thYmxlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFufHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfZGVzdHJveSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG9wdGlvbnMob3B0aW9uczogZ29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucykge1xuICAgIHRoaXMuX29wdGlvbnMubmV4dChvcHRpb25zIHx8IERFRkFVTFRfTUFSS0VSX09QVElPTlMpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHRpdGxlKHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl90aXRsZS5uZXh0KHRpdGxlKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBwb3NpdGlvbihwb3NpdGlvbjogZ29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmcpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5uZXh0KHBvc2l0aW9uKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBsYWJlbChsYWJlbDogc3RyaW5nfGdvb2dsZS5tYXBzLk1hcmtlckxhYmVsKSB7XG4gICAgdGhpcy5fbGFiZWwubmV4dChsYWJlbCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgY2xpY2thYmxlKGNsaWNrYWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2NsaWNrYWJsZS5uZXh0KGNsaWNrYWJsZSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5hbmltYXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGFuaW1hdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2FuaW1hdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBDbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2NsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY2xpY2thYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjbGlja2FibGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjbGlja2FibGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmN1cnNvcl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY3Vyc29yQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY3Vyc29yX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kYmxjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERibGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZGJsY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRHJhZzogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWcnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnZW5kXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRHJhZ2VuZDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdlbmQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnZ2FibGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyYWdnYWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2RyYWdnYWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ3N0YXJ0XG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRHJhZ3N0YXJ0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ3N0YXJ0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZmxhdF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgZmxhdENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2ZsYXRfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmljb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIGljb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdpY29uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZWRvd25cbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZWRvd246IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZWRvd24nKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZW91dFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlb3V0OiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2VvdXQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZW92ZXJcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW92ZXI6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW92ZXInKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5tb3VzZXVwXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2V1cDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNldXAnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5wb3NpdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcG9zaXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdwb3NpdGlvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIucmlnaHRjbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcFJpZ2h0Y2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdyaWdodGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuc2hhcGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIHNoYXBlQ2hhbmdlZDpcbiAgT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignc2hhcGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnRpdGxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB0aXRsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3RpdGxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci52aXNpYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB2aXNpYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndmlzaWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuemluZGV4X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICB6aW5kZXhDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd6aW5kZXhfY2hhbmdlZCcpO1xuXG4gIF9tYXJrZXI/OiBnb29nbGUubWFwcy5NYXJrZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ29vZ2xlTWFwOiBHb29nbGVNYXAsXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuX2dvb2dsZU1hcC5faXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnNDaGFuZ2VzID0gdGhpcy5fY29tYmluZU9wdGlvbnMoKTtcblxuICAgICAgY29tYmluZWRPcHRpb25zQ2hhbmdlcy5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMuX21hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIob3B0aW9ucykpO1xuICAgICAgICB0aGlzLl9tYXJrZXIhLnNldE1hcCh0aGlzLl9nb29nbGVNYXAuX2dvb2dsZU1hcCk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5fbWFya2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclRpdGxlQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JQb3NpdGlvbkNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yTGFiZWxDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNsaWNrYWJsZUNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5fbWFya2VyKSB7XG4gICAgICB0aGlzLl9tYXJrZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEFuaW1hdGlvblxuICAgKi9cbiAgZ2V0QW5pbWF0aW9uKCk6IGdvb2dsZS5tYXBzLkFuaW1hdGlvbnxudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX21hcmtlciAmJiB0aGlzLl9tYXJrZXIuZ2V0QW5pbWF0aW9uKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRDbGlja2FibGVcbiAgICovXG4gIGdldENsaWNrYWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2VyID8gdGhpcy5fbWFya2VyLmdldENsaWNrYWJsZSgpIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRDdXJzb3JcbiAgICovXG4gIGdldEN1cnNvcigpOiBzdHJpbmd8bnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9tYXJrZXIgJiYgdGhpcy5fbWFya2VyLmdldEN1cnNvcigpKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0RHJhZ2dhYmxlXG4gICAqL1xuICBnZXREcmFnZ2FibGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX21hcmtlciA/ICEhdGhpcy5fbWFya2VyLmdldERyYWdnYWJsZSgpIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRJY29uXG4gICAqL1xuICBnZXRJY29uKCk6IHN0cmluZ3xnb29nbGUubWFwcy5JY29ufGdvb2dsZS5tYXBzLlN5bWJvbHxudWxsIHtcbiAgICByZXR1cm4gKHRoaXMuX21hcmtlciAmJiB0aGlzLl9tYXJrZXIuZ2V0SWNvbigpKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0TGFiZWxcbiAgICovXG4gIGdldExhYmVsKCk6IGdvb2dsZS5tYXBzLk1hcmtlckxhYmVsfG51bGwge1xuICAgIHJldHVybiAodGhpcy5fbWFya2VyICYmIHRoaXMuX21hcmtlci5nZXRMYWJlbCgpKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0T3BhY2l0eVxuICAgKi9cbiAgZ2V0T3BhY2l0eSgpOiBudW1iZXJ8bnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9tYXJrZXIgJiYgdGhpcy5fbWFya2VyLmdldE9wYWNpdHkoKSkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFBvc2l0aW9uXG4gICAqL1xuICBnZXRQb3NpdGlvbigpOiBnb29nbGUubWFwcy5MYXRMbmd8bnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9tYXJrZXIgJiYgdGhpcy5fbWFya2VyLmdldFBvc2l0aW9uKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRTaGFwZVxuICAgKi9cbiAgZ2V0U2hhcGUoKTogZ29vZ2xlLm1hcHMuTWFya2VyU2hhcGV8bnVsbCB7XG4gICAgcmV0dXJuICh0aGlzLl9tYXJrZXIgJiYgdGhpcy5fbWFya2VyLmdldFNoYXBlKCkpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRUaXRsZVxuICAgKi9cbiAgZ2V0VGl0bGUoKTogc3RyaW5nfG51bGwge1xuICAgIHJldHVybiAodGhpcy5fbWFya2VyICYmIHRoaXMuX21hcmtlci5nZXRUaXRsZSgpKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fbWFya2VyID8gdGhpcy5fbWFya2VyLmdldFZpc2libGUoKSA6IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0WkluZGV4XG4gICAqL1xuICBnZXRaSW5kZXgoKTogbnVtYmVyfG51bGwge1xuICAgIHJldHVybiAodGhpcy5fbWFya2VyICYmIHRoaXMuX21hcmtlci5nZXRaSW5kZXgoKSkgfHwgbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbWJpbmVPcHRpb25zKCk6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucz4ge1xuICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFt0aGlzLl9vcHRpb25zLCB0aGlzLl90aXRsZSwgdGhpcy5fcG9zaXRpb24sIHRoaXMuX2xhYmVsLCB0aGlzLl9jbGlja2FibGVdKVxuICAgICAgICAucGlwZShtYXAoKFtvcHRpb25zLCB0aXRsZSwgcG9zaXRpb24sIGxhYmVsLCBjbGlja2FibGVdKSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tYmluZWRPcHRpb25zOiBnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSB8fCBvcHRpb25zLnRpdGxlLFxuICAgICAgICAgICAgcG9zaXRpb246IHBvc2l0aW9uIHx8IG9wdGlvbnMucG9zaXRpb24sXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwgfHwgb3B0aW9ucy5sYWJlbCxcbiAgICAgICAgICAgIGNsaWNrYWJsZTogY2xpY2thYmxlICE9PSB1bmRlZmluZWQgPyBjbGlja2FibGUgOiBvcHRpb25zLmNsaWNrYWJsZSxcbiAgICAgICAgICAgIG1hcDogdGhpcy5fZ29vZ2xlTWFwLl9nb29nbGVNYXAgfHwgbnVsbCxcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldHVybiBjb21iaW5lZE9wdGlvbnM7XG4gICAgICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKG9wdGlvbnMgPT4ge1xuICAgICAgaWYgKHRoaXMuX21hcmtlcikge1xuICAgICAgICB0aGlzLl9tYXJrZXIuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3RpdGxlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUodGl0bGUgPT4ge1xuICAgICAgaWYgKHRoaXMuX21hcmtlciAmJiB0aXRsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX21hcmtlci5zZXRUaXRsZSh0aXRsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHBvc2l0aW9uID0+IHtcbiAgICAgIGlmICh0aGlzLl9tYXJrZXIgJiYgcG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5fbWFya2VyLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yTGFiZWxDaGFuZ2VzKCkge1xuICAgIHRoaXMuX2xhYmVsLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUobGFiZWwgPT4ge1xuICAgICAgaWYgKHRoaXMuX21hcmtlciAmJiBsYWJlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX21hcmtlci5zZXRMYWJlbChsYWJlbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckNsaWNrYWJsZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2xpY2thYmxlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoY2xpY2thYmxlID0+IHtcbiAgICAgIGlmICh0aGlzLl9tYXJrZXIgJiYgY2xpY2thYmxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fbWFya2VyLnNldENsaWNrYWJsZShjbGlja2FibGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=