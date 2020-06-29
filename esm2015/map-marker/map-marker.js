/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
    class MapMarker {
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
    }
    MapMarker.decorators = [
        { type: Component, args: [{
                    selector: 'map-marker',
                    exportAs: 'mapMarker',
                    template: '<ng-content></ng-content>',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None
                },] }
    ];
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
export { MapMarker };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLW1hcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9nb29nbGUtbWFwcy9tYXAtbWFya2VyL21hcC1tYXJrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLG9DQUFvQztBQUVwQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxLQUFLLEVBR0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixNQUFNLEVBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGVBQWUsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6RSxPQUFPLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3JEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHO0lBQ3BDLFFBQVEsRUFBRSxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFDO0NBQzdDLENBQUM7QUFFRjs7OztHQUlHO0FBQ0g7SUFBQSxNQU9hLFNBQVM7UUF1TXBCLFlBQ21CLFVBQXFCLEVBQzlCLE9BQWU7WUFETixlQUFVLEdBQVYsVUFBVSxDQUFXO1lBQzlCLFlBQU8sR0FBUCxPQUFPLENBQVE7WUF4TWpCLGtCQUFhLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3pDLGFBQVEsR0FDckIsSUFBSSxlQUFlLENBQTRCLHNCQUFzQixDQUFDLENBQUM7WUFDMUQsV0FBTSxHQUFHLElBQUksZUFBZSxDQUFtQixTQUFTLENBQUMsQ0FBQztZQUMx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QkFRTixNQUFNO21DQVFOLE1BQU07K0JBT04sTUFBTTs4QkFRTixNQUFNOzhCQU1OLE1BQU07K0JBTU4sTUFBTTs4QkFRTixNQUFNOytCQVFOLE1BQU07NkJBUU4sTUFBTTtrQ0FRTixNQUFNO2dDQU9OLE1BQU07K0JBUU4sTUFBTTsrQkFPTixNQUFNO2lDQU9OLE1BQU07Z0NBT04sTUFBTTs7SUFxT1QsZ0JBQUM7S0FBQTtTQWxhWSxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIFdvcmthcm91bmQgZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYmF6ZWxidWlsZC9ydWxlc19ub2RlanMvaXNzdWVzLzEyNjVcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiZ29vZ2xlbWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXAsIHRha2UsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge0dvb2dsZU1hcH0gZnJvbSAnLi4vZ29vZ2xlLW1hcC9nb29nbGUtbWFwJztcbmltcG9ydCB7TWFwRXZlbnRNYW5hZ2VyfSBmcm9tICcuLi9tYXAtZXZlbnQtbWFuYWdlcic7XG5pbXBvcnQge01hcEFuY2hvclBvaW50fSBmcm9tICcuLi9tYXAtYW5jaG9yLXBvaW50JztcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMgZm9yIHRoZSBHb29nbGUgTWFwcyBtYXJrZXIgY29tcG9uZW50LiBEaXNwbGF5cyBhIG1hcmtlclxuICogYXQgdGhlIEdvb2dsZXBsZXguXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX01BUktFUl9PUFRJT05TID0ge1xuICBwb3NpdGlvbjoge2xhdDogMzcuNDIxOTk1LCBsbmc6IC0xMjIuMDg0MDkyfSxcbn07XG5cbi8qKlxuICogQW5ndWxhciBjb21wb25lbnQgdGhhdCByZW5kZXJzIGEgR29vZ2xlIE1hcHMgbWFya2VyIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hcC1tYXJrZXInLFxuICBleHBvcnRBczogJ21hcE1hcmtlcicsXG4gIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBNYXJrZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgTWFwQW5jaG9yUG9pbnQge1xuICBwcml2YXRlIF9ldmVudE1hbmFnZXIgPSBuZXcgTWFwRXZlbnRNYW5hZ2VyKHRoaXMuX25nWm9uZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX29wdGlvbnMgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxnb29nbGUubWFwcy5NYXJrZXJPcHRpb25zPihERUZBVUxUX01BUktFUl9PUFRJT05TKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfdGl0bGUgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZ3x1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3Bvc2l0aW9uID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8Z29vZ2xlLm1hcHMuTGF0TG5nTGl0ZXJhbHxnb29nbGUubWFwcy5MYXRMbmd8dW5kZWZpbmVkPih1bmRlZmluZWQpO1xuICBwcml2YXRlIHJlYWRvbmx5IF9sYWJlbCA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZ3xnb29nbGUubWFwcy5NYXJrZXJMYWJlbHx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NsaWNrYWJsZSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbnx1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2Rlc3Ryb3kgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBvcHRpb25zKG9wdGlvbnM6IGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnMpIHtcbiAgICB0aGlzLl9vcHRpb25zLm5leHQob3B0aW9ucyB8fCBERUZBVUxUX01BUktFUl9PUFRJT05TKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCB0aXRsZSh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdGl0bGUubmV4dCh0aXRsZSk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgcG9zaXRpb24ocG9zaXRpb246IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWx8Z29vZ2xlLm1hcHMuTGF0TG5nKSB7XG4gICAgdGhpcy5fcG9zaXRpb24ubmV4dChwb3NpdGlvbik7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbGFiZWwobGFiZWw6IHN0cmluZ3xnb29nbGUubWFwcy5NYXJrZXJMYWJlbCkge1xuICAgIHRoaXMuX2xhYmVsLm5leHQobGFiZWwpO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNsaWNrYWJsZShjbGlja2FibGU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9jbGlja2FibGUubmV4dChjbGlja2FibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuYW5pbWF0aW9uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBhbmltYXRpb25DaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdhbmltYXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmNsaWNrXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwQ2xpY2s6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmNsaWNrYWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgY2xpY2thYmxlQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignY2xpY2thYmxlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5jdXJzb3JfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGN1cnNvckNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ2N1cnNvcl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZGJsY2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBEYmxjbGljazogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RibGNsaWNrJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ1xuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERyYWc6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ2VuZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERyYWdlbmQ6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdkcmFnZW5kJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZHJhZ2dhYmxlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkcmFnZ2FibGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdkcmFnZ2FibGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmRyYWdzdGFydFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcERyYWdzdGFydDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ2RyYWdzdGFydCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmZsYXRfY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpIGZsYXRDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCdmbGF0X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5pY29uX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSBpY29uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignaWNvbl9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2Vkb3duXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2Vkb3duOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2Vkb3duJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2VvdXRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBNb3VzZW91dDogT2JzZXJ2YWJsZTxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PiA9XG4gICAgICB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4oJ21vdXNlb3V0Jyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2VvdmVyXG4gICAqL1xuICBAT3V0cHV0KClcbiAgbWFwTW91c2VvdmVyOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PignbW91c2VvdmVyJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIubW91c2V1cFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIG1hcE1vdXNldXA6IE9ic2VydmFibGU8Z29vZ2xlLm1hcHMuTW91c2VFdmVudD4gPVxuICAgICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+KCdtb3VzZXVwJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIucG9zaXRpb25fY2hhbmdlZFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHBvc2l0aW9uQ2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPigncG9zaXRpb25fY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnJpZ2h0Y2xpY2tcbiAgICovXG4gIEBPdXRwdXQoKVxuICBtYXBSaWdodGNsaWNrOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1vdXNlRXZlbnQ+ID1cbiAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjxnb29nbGUubWFwcy5Nb3VzZUV2ZW50PigncmlnaHRjbGljaycpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnNoYXBlX2NoYW5nZWRcbiAgICovXG4gIEBPdXRwdXQoKSBzaGFwZUNoYW5nZWQ6XG4gIE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3NoYXBlX2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci50aXRsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgdGl0bGVDaGFuZ2VkOiBPYnNlcnZhYmxlPHZvaWQ+ID0gdGhpcy5fZXZlbnRNYW5hZ2VyLmdldExhenlFbWl0dGVyPHZvaWQ+KCd0aXRsZV9jaGFuZ2VkJyk7XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIudmlzaWJsZV9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgdmlzaWJsZUNoYW5nZWQ6IE9ic2VydmFibGU8dm9pZD4gPSB0aGlzLl9ldmVudE1hbmFnZXIuZ2V0TGF6eUVtaXR0ZXI8dm9pZD4oJ3Zpc2libGVfY2hhbmdlZCcpO1xuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLnppbmRleF9jaGFuZ2VkXG4gICAqL1xuICBAT3V0cHV0KClcbiAgemluZGV4Q2hhbmdlZDogT2JzZXJ2YWJsZTx2b2lkPiA9IHRoaXMuX2V2ZW50TWFuYWdlci5nZXRMYXp5RW1pdHRlcjx2b2lkPignemluZGV4X2NoYW5nZWQnKTtcblxuICAvKipcbiAgICogVGhlIHVuZGVybHlpbmcgZ29vZ2xlLm1hcHMuTWFya2VyIG9iamVjdC5cbiAgICpcbiAgICogU2VlIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlclxuICAgKi9cbiAgbWFya2VyPzogZ29vZ2xlLm1hcHMuTWFya2VyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgdGhpcy5fY29tYmluZU9wdGlvbnMoKS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBvYmplY3Qgb3V0c2lkZSB0aGUgem9uZSBzbyBpdHMgZXZlbnRzIGRvbid0IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbi5cbiAgICAgICAgLy8gV2UnbGwgYnJpbmcgaXQgYmFjayBpbiBpbnNpZGUgdGhlIGBNYXBFdmVudE1hbmFnZXJgIG9ubHkgZm9yIHRoZSBldmVudHMgdGhhdCB0aGVcbiAgICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMubWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcihvcHRpb25zKSk7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyLnNldE1hcCh0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwISk7XG4gICAgICAgIHRoaXMuX2V2ZW50TWFuYWdlci5zZXRUYXJnZXQodGhpcy5tYXJrZXIpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX3dhdGNoRm9yT3B0aW9uc0NoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yVGl0bGVDaGFuZ2VzKCk7XG4gICAgICB0aGlzLl93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2F0Y2hGb3JMYWJlbENoYW5nZXMoKTtcbiAgICAgIHRoaXMuX3dhdGNoRm9yQ2xpY2thYmxlQ2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2Rlc3Ryb3kubmV4dCgpO1xuICAgIHRoaXMuX2Rlc3Ryb3kuY29tcGxldGUoKTtcbiAgICB0aGlzLl9ldmVudE1hbmFnZXIuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLm1hcmtlcikge1xuICAgICAgdGhpcy5tYXJrZXIuc2V0TWFwKG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldEFuaW1hdGlvblxuICAgKi9cbiAgZ2V0QW5pbWF0aW9uKCk6IGdvb2dsZS5tYXBzLkFuaW1hdGlvbnxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRBbmltYXRpb24oKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0Q2xpY2thYmxlXG4gICAqL1xuICBnZXRDbGlja2FibGUoKTogYm9vbGVhbiB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0Q2xpY2thYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRDdXJzb3JcbiAgICovXG4gIGdldEN1cnNvcigpOiBzdHJpbmd8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0Q3Vyc29yKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldERyYWdnYWJsZVxuICAgKi9cbiAgZ2V0RHJhZ2dhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuICEhdGhpcy5tYXJrZXIuZ2V0RHJhZ2dhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRJY29uXG4gICAqL1xuICBnZXRJY29uKCk6IHN0cmluZ3xnb29nbGUubWFwcy5JY29ufGdvb2dsZS5tYXBzLlN5bWJvbHxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRJY29uKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldExhYmVsXG4gICAqL1xuICBnZXRMYWJlbCgpOiBnb29nbGUubWFwcy5NYXJrZXJMYWJlbHxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRMYWJlbCgpIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRPcGFjaXR5XG4gICAqL1xuICBnZXRPcGFjaXR5KCk6IG51bWJlcnxudWxsIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRPcGFjaXR5KCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFBvc2l0aW9uXG4gICAqL1xuICBnZXRQb3NpdGlvbigpOiBnb29nbGUubWFwcy5MYXRMbmd8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0UG9zaXRpb24oKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0U2hhcGVcbiAgICovXG4gIGdldFNoYXBlKCk6IGdvb2dsZS5tYXBzLk1hcmtlclNoYXBlfG51bGwge1xuICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyLmdldFNoYXBlKCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWVcbiAgICogZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS9tYXJrZXIjTWFya2VyLmdldFRpdGxlXG4gICAqL1xuICBnZXRUaXRsZSgpOiBzdHJpbmd8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0VGl0bGUoKSB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZVxuICAgKiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL21hcmtlciNNYXJrZXIuZ2V0VmlzaWJsZVxuICAgKi9cbiAgZ2V0VmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLm1hcmtlci5nZXRWaXNpYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VlXG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvbWFya2VyI01hcmtlci5nZXRaSW5kZXhcbiAgICovXG4gIGdldFpJbmRleCgpOiBudW1iZXJ8bnVsbCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXIuZ2V0WkluZGV4KCkgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhbmNob3IgcG9pbnQgdGhhdCBjYW4gYmUgdXNlZCB0byBhdHRhY2ggb3RoZXIgR29vZ2xlIE1hcHMgb2JqZWN0cy4gKi9cbiAgZ2V0QW5jaG9yKCk6IGdvb2dsZS5tYXBzLk1WQ09iamVjdCB7XG4gICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXI7XG4gIH1cblxuICBwcml2YXRlIF9jb21iaW5lT3B0aW9ucygpOiBPYnNlcnZhYmxlPGdvb2dsZS5tYXBzLk1hcmtlck9wdGlvbnM+IHtcbiAgICByZXR1cm4gY29tYmluZUxhdGVzdChbdGhpcy5fb3B0aW9ucywgdGhpcy5fdGl0bGUsIHRoaXMuX3Bvc2l0aW9uLCB0aGlzLl9sYWJlbCwgdGhpcy5fY2xpY2thYmxlXSlcbiAgICAgICAgLnBpcGUobWFwKChbb3B0aW9ucywgdGl0bGUsIHBvc2l0aW9uLCBsYWJlbCwgY2xpY2thYmxlXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGNvbWJpbmVkT3B0aW9uczogZ29vZ2xlLm1hcHMuTWFya2VyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICB0aXRsZTogdGl0bGUgfHwgb3B0aW9ucy50aXRsZSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbiB8fCBvcHRpb25zLnBvc2l0aW9uLFxuICAgICAgICAgICAgbGFiZWw6IGxhYmVsIHx8IG9wdGlvbnMubGFiZWwsXG4gICAgICAgICAgICBjbGlja2FibGU6IGNsaWNrYWJsZSAhPT0gdW5kZWZpbmVkID8gY2xpY2thYmxlIDogb3B0aW9ucy5jbGlja2FibGUsXG4gICAgICAgICAgICBtYXA6IHRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXAsXG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXR1cm4gY29tYmluZWRPcHRpb25zO1xuICAgICAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvck9wdGlvbnNDaGFuZ2VzKCkge1xuICAgIHRoaXMuX29wdGlvbnMucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShvcHRpb25zID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlcikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfd2F0Y2hGb3JUaXRsZUNoYW5nZXMoKSB7XG4gICAgdGhpcy5fdGl0bGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZSh0aXRsZSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXJrZXIgJiYgdGl0bGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRUaXRsZSh0aXRsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvclBvc2l0aW9uQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9wb3NpdGlvbi5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKHBvc2l0aW9uID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlciAmJiBwb3NpdGlvbikge1xuICAgICAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgICAgICB0aGlzLm1hcmtlci5zZXRQb3NpdGlvbihwb3NpdGlvbik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93YXRjaEZvckxhYmVsQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9sYWJlbC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSkuc3Vic2NyaWJlKGxhYmVsID0+IHtcbiAgICAgIGlmICh0aGlzLm1hcmtlciAmJiBsYWJlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyLnNldExhYmVsKGxhYmVsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dhdGNoRm9yQ2xpY2thYmxlQ2hhbmdlcygpIHtcbiAgICB0aGlzLl9jbGlja2FibGUucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveSkpLnN1YnNjcmliZShjbGlja2FibGUgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2VyICYmIGNsaWNrYWJsZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2Fzc2VydEluaXRpYWxpemVkKCk7XG4gICAgICAgIHRoaXMubWFya2VyLnNldENsaWNrYWJsZShjbGlja2FibGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXNzZXJ0SW5pdGlhbGl6ZWQoKTogYXNzZXJ0cyB0aGlzIGlzIHttYXJrZXI6IGdvb2dsZS5tYXBzLk1hcmtlcn0ge1xuICAgIGlmICghdGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgJ0Nhbm5vdCBhY2Nlc3MgR29vZ2xlIE1hcCBpbmZvcm1hdGlvbiBiZWZvcmUgdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSB3YWl0IGZvciB0aGUgQVBJIHRvIGxvYWQgYmVmb3JlIHRyeWluZyB0byBpbnRlcmFjdCB3aXRoIGl0LicpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWFya2VyKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAnQ2Fubm90IGludGVyYWN0IHdpdGggYSBHb29nbGUgTWFwIE1hcmtlciBiZWZvcmUgaXQgaGFzIGJlZW4gJyArXG4gICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIE1hcmtlciB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==