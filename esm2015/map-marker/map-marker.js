/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
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
export const DEFAULT_MARKER_OPTIONS = {
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
export { MapMarker };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILHlFQUF5RTtBQUN6RSxvQ0FBb0M7QUFFcEMsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUdMLE1BQU0sRUFDTixpQkFBaUIsRUFDakIsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDekUsT0FBTyxFQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ25ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUdyRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRztJQUNwQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBQztDQUM3QyxDQUFDO0FBRUY7Ozs7R0FJRztBQU9IO0lBQUEsSUFBYSxTQUFTLEdBQXRCLE1BQWEsU0FBUztRQXVNcEIsWUFDbUIsVUFBcUIsRUFDOUIsT0FBZTtZQUROLGVBQVUsR0FBVixVQUFVLENBQVc7WUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQXhNakIsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDekMsYUFBUSxHQUNyQixJQUFJLGVBQWUsQ0FBNEIsc0JBQXNCLENBQUMsQ0FBQztZQUMxRCxXQUFNLEdBQUcsSUFBSSxlQUFlLENBQW1CLFNB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c0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge01hcEFuY2hvclBvaW50fSBmcm9tICcuLi9tYXAtYW5jaG9yLXBvaW50JztcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBHb29nbGUgTWFwcyBtYXJrZXIgY29tcG9uZW50LiBEaXNwbGF5cyBhIG1hcmtlclxuICogYXQgdGhlIEdvb2dsZXBsZXguXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX01BUktFUl9PUFRJT05TID0ge1xuICBwb3NpdGlvbjoge2xhdDogMzcuNDIxOTk1LCBsbmc6IC0xMjIuMDg0MDkyfSxcbn07XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgbWFya2VyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hcC1tYXJrZXInLFxuICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWFwTWFya2VyIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIE1hcEFuY2hvclBvaW50IHtcbiAgcHJpdmF0ZSBfZXZlbnRNYW5hZ2VyID0gbmV3IE1hcEV2ZW50TWFuYWdlcih0aGlzLl9uZ1pvbmUpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9vcHRpb25zID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucz4oREVGQVVMVF9NQVJLRVJfT1BUSU9OUyk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3RpdGxlID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9wb3NpdGlvbiA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8Z29vZ2xlLm1hcHMuTGF0TG5nfHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfbGFiZWwgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmd8Z29vZ2xlLm1hcHMuTWFya2VyTGFiZWx8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9jbGlja2FibGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW58dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9kZXN0cm95ID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zKSB7XG4gICAgdGhpcy5fb3B0aW9ucy5uZXh0KG9wdGlvbnMgfHwgREVGQVVMVF9NQVJLRVJfT1BUSU9OUyk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgdGl0bGUodGl0bGU6IHN0cmluZykge1xuICAgIHRoaXMuX3RpdGxlLm5leHQodGl0bGUpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IHBvc2l0aW9uKHBvc2l0aW9uOiBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsfGdvb2dsZS5tYXBzLkxhdExuZykge1xuICAgIHRoaXMuX3Bvc2l0aW9uLm5leHQocG9zaXRpb24pO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGxhYmVsKGxhYmVsOiBzdHJpbmd8Z29vZ2xlLm1hcHMuTWFya2VyTGFiZWwpIHtcbiAgICB0aGlzLl9sYWJlbC5uZXh0KGxhYmVsKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBjbGlja2FibGUoY2xpY2thYmxlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fY2xpY2thYmxlLm5leHQoY2xpY2thYmxlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmFuaW1hdGlvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgYW5pbWF0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignYW5pbWF0aW9uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5jbGlja1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcENsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignY2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5jbGlja2FibGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGNsaWNrYWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2NsaWNrYWJsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuY3Vyc29yX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBjdXJzb3JDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdjdXJzb3JfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRibGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwRGJsY2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkYmxjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEcmFnOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdlbmRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEcmFnZW5kOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignZHJhZ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdnYWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJhZ2dhYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZHJhZ2dhYmxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5kcmFnc3RhcnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEcmFnc3RhcnQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnc3RhcnQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5mbGF0X2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSBmbGF0Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignZmxhdF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuaWNvbl9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgaWNvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2ljb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNlZG93blxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlZG93bjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlZG93bicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNlb3V0XG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2VvdXQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZW91dCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNlb3ZlclxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNlb3ZlcjogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3ZlcicpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLm1vdXNldXBcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZXVwOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2V1cCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnBvc2l0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBwb3NpdGlvbkNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Bvc2l0aW9uX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5yaWdodGNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwUmlnaHRjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ3JpZ2h0Y2xpY2snKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5zaGFwZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KCkgc2hhcGVDaGFuZ2VkOlxuICBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdzaGFwZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIudGl0bGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHRpdGxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigndGl0bGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnZpc2libGVfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHZpc2libGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd2aXNpYmxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci56aW5kZXhfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHppbmRleENoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3ppbmRleF9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLk1hcmtlciBvYmplY3QuXG4gICAqXG4gICAqIFNlZSBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXJcbiAgICovXG4gIG1hcmtlcj86IGdvb2dsZS5tYXBzLk1hcmtlcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9nb29nbGVNYXA6IEdvb2dsZU1hcCxcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fZ29vZ2xlTWFwLl9pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMuX2NvbWJpbmVPcHRpb25zKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgIC8vIFdlJ2xsIGJyaW5nIGl0IGJhY2sgaW4gaW5zaWRlIHRoZSBgTWFwRXZlbnRNYW5hZ2VyYCBvbmx5IGZvciB0aGUgZXZlbnRzIHRoYXQgdGhlXG4gICAgICAgIC8vIHVzZXIgaGFzIHN1YnNjcmliZWQgdG8uXG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLm1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIob3B0aW9ucykpO1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRNYXAodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEpO1xuICAgICAgICB0aGlzLl9ldmVudE1hbmFnZXIuc2V0VGFyZ2V0KHRoaXMubWFya2VyKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclRpdGxlQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JQb3NpdGlvbkNoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yTGFiZWxDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvckNsaWNrYWJsZUNoYW5nZXMoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9kZXN0cm95Lm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICBpZiAodGhpcy5tYXJrZXIpIHtcbiAgICAgIHRoaXMubWFya2VyLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRBbmltYXRpb25cbiAgICovXG4gIGdldEFuaW1hdGlvbigpOiBnb29nbGUubWFwcy5BbmltYXRpb258bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0QW5pbWF0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldENsaWNrYWJsZVxuICAgKi9cbiAgZ2V0Q2xpY2thYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldENsaWNrYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0Q3Vyc29yXG4gICAqL1xuICBnZXRDdXJzb3IoKTogc3RyaW5nfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldEN1cnNvcigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXREcmFnZ2FibGVcbiAgICovXG4gIGdldERyYWdnYWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiAhIXRoaXMubWFya2VyLmdldERyYWdnYWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0SWNvblxuICAgKi9cbiAgZ2V0SWNvbigpOiBzdHJpbmd8Z29vZ2xlLm1hcHMuSWNvbnxnb29nbGUubWFwcy5TeW1ib2x8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0SWNvbigpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRMYWJlbFxuICAgKi9cbiAgZ2V0TGFiZWwoKTogZ29vZ2xlLm1hcHMuTWFya2VyTGFiZWx8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0TGFiZWwoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0T3BhY2l0eVxuICAgKi9cbiAgZ2V0T3BhY2l0eSgpOiBudW1iZXJ8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0T3BhY2l0eSgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRQb3NpdGlvblxuICAgKi9cbiAgZ2V0UG9zaXRpb24oKTogZ29vZ2xlLm1hcHMuTGF0TG5nfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFBvc2l0aW9uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFNoYXBlXG4gICAqL1xuICBnZXRTaGFwZSgpOiBnb29nbGUubWFwcy5NYXJrZXJTaGFwZXxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRTaGFwZSgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRUaXRsZVxuICAgKi9cbiAgZ2V0VGl0bGUoKTogc3RyaW5nfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFRpdGxlKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFZpc2libGVcbiAgICovXG4gIGdldFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0VmlzaWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0WkluZGV4XG4gICAqL1xuICBnZXRaSW5kZXgoKTogbnVtYmVyfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFpJbmRleCgpIHx8IG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYW5jaG9yIHBvaW50IHRoYXQgY2FuIGJlIHVzZWQgdG8gYXR0YWNoIG90aGVyIEdvb2dsZSBNYXBzIG9iamVjdHMuICovXG4gIGdldEFuY2hvcigpOiBnb29nbGUubWFwcy5NVkNPYmplY3Qge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zPiB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoW3RoaXMuX29wdGlvbnMsIHRoaXMuX3RpdGxlLCB0aGlzLl9wb3NpdGlvbiwgdGhpcy5fbGFiZWwsIHRoaXMuX2NsaWNrYWJsZV0pXG4gICAgICAgIC5waXBlKG1hcCgoW29wdGlvbnMsIHRpdGxlLCBwb3NpdGlvbiwgbGFiZWwsIGNsaWNrYWJsZV0pID0+IHtcbiAgICAgICAgICBjb25zdCBjb21iaW5lZE9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnMgPSB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgdGl0bGU6IHRpdGxlIHx8IG9wdGlvbnMudGl0bGUsXG4gICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24gfHwgb3B0aW9ucy5wb3NpdGlvbixcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCB8fCBvcHRpb25zLmxhYmVsLFxuICAgICAgICAgICAgY2xpY2thYmxlOiBjbGlja2FibGUgIT09IHVuZGVmaW5lZCA/IGNsaWNrYWJsZSA6IG9wdGlvbnMuY2xpY2thYmxlLFxuICAgICAgICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLFxuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0dXJuIGNvbWJpbmVkT3B0aW9ucztcbiAgICAgICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JPcHRpb25zQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9vcHRpb25zLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUob3B0aW9ucyA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXIpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCkge1xuICAgIHRoaXMuX3RpdGxlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUodGl0bGUgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyICYmIHRpdGxlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuc2V0VGl0bGUodGl0bGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JQb3NpdGlvbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5fcG9zaXRpb24ucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShwb3NpdGlvbiA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXIgJiYgcG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgICAgdGhpcy5tYXJrZXIuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JMYWJlbENoYW5nZXMoKSB7XG4gICAgdGhpcy5fbGFiZWwucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShsYWJlbCA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXIgJiYgbGFiZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRMYWJlbChsYWJlbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckNsaWNrYWJsZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fY2xpY2thYmxlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3kpKS5zdWJzY3JpYmUoY2xpY2thYmxlID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlciAmJiBjbGlja2FibGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRDbGlja2FibGUoY2xpY2thYmxlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7bWFya2VyOiBnb29nbGUubWFwcy5NYXJrZXJ9IHtcbiAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICdDYW5ub3QgYWNjZXNzIEdvb2dsZSBNYXAgaW5mb3JtYXRpb24gYmVmb3JlIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICcgK1xuICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm1hcmtlcikge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBNYXJrZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICdpbml0aWFsaXplZC4gUGxlYXNlIHdhaXQgZm9yIHRoZSBNYXJrZXIgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgfVxuICB9XG59XG4iXX0=