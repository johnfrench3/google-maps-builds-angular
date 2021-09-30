/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="google.maps" />
import { Input, NgZone, Directive, } from '@angular/core';
import { GoogleMap } from '../google-map/google-map';
/**
 * Angular directive that renders a Google Maps heatmap via the Google Maps JavaScript API.
 *
 * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
 */
export class MapHeatmapLayer {
    constructor(_googleMap, _ngZone) {
        this._googleMap = _googleMap;
        this._ngZone = _ngZone;
    }
    /**
     * Data shown on the heatmap.
     * See: https://developers.google.com/maps/documentation/javascript/reference/visualization
     */
    set data(data) {
        this._data = data;
    }
    /**
     * Options used to configure the heatmap. See:
     * developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayerOptions
     */
    set options(options) {
        this._options = options;
    }
    ngOnInit() {
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
            this._ngZone.runOutsideAngular(() => {
                this.heatmap = new google.maps.visualization.HeatmapLayer(this._combineOptions());
            });
            this._assertInitialized();
            this.heatmap.setMap(this._googleMap.googleMap);
        }
    }
    ngOnChanges(changes) {
        const { _data, heatmap } = this;
        if (heatmap) {
            if (changes['options']) {
                heatmap.setOptions(this._combineOptions());
            }
            if (changes['data'] && _data !== undefined) {
                heatmap.setData(this._normalizeData(_data));
            }
        }
    }
    ngOnDestroy() {
        if (this.heatmap) {
            this.heatmap.setMap(null);
        }
    }
    /**
     * Gets the data that is currently shown on the heatmap.
     * See: developers.google.com/maps/documentation/javascript/reference/visualization#HeatmapLayer
     */
    getData() {
        this._assertInitialized();
        return this.heatmap.getData();
    }
    /** Creates a combined options object using the passed-in options and the individual inputs. */
    _combineOptions() {
        const options = this._options || {};
        return Object.assign(Object.assign({}, options), { data: this._normalizeData(this._data || options.data || []), map: this._googleMap.googleMap });
    }
    /**
     * Most Google Maps APIs support both `LatLng` objects and `LatLngLiteral`. The latter is more
     * convenient to write out, because the Google Maps API doesn't have to have been loaded in order
     * to construct them. The `HeatmapLayer` appears to be an exception that only allows a `LatLng`
     * object, or it throws a runtime error. Since it's more convenient and we expect that Angular
     * users will load the API asynchronously, we allow them to pass in a `LatLngLiteral` and we
     * convert it to a `LatLng` object before passing it off to Google Maps.
     */
    _normalizeData(data) {
        const result = [];
        data.forEach(item => {
            result.push(isLatLngLiteral(item) ? new google.maps.LatLng(item.lat, item.lng) : item);
        });
        return result;
    }
    /** Asserts that the heatmap object has been initialized. */
    _assertInitialized() {
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
    }
}
MapHeatmapLayer.decorators = [
    { type: Directive, args: [{
                selector: 'map-heatmap-layer',
                exportAs: 'mapHeatmapLayer',
            },] }
];
MapHeatmapLayer.ctorParameters = () => [
    { type: GoogleMap },
    { type: NgZone }
];
MapHeatmapLayer.propDecorators = {
    data: [{ type: Input }],
    options: [{ type: Input }]
};
/** Asserts that an object is a `LatLngLiteral`. */
function isLatLngLiteral(value) {
    return value && typeof value.lat === 'number' && typeof value.lng === 'number';
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWhlYXRtYXAtbGF5ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWhlYXRtYXAtbGF5ZXIvbWFwLWhlYXRtYXAtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgseUVBQXlFO0FBQ3pFLHFDQUFxQztBQUVyQyxPQUFPLEVBQ0wsS0FBSyxFQUdMLE1BQU0sRUFDTixTQUFTLEdBR1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBU25EOzs7O0dBSUc7QUFLSCxNQUFNLE9BQU8sZUFBZTtJQTRCMUIsWUFDbUIsVUFBcUIsRUFDOUIsT0FBZTtRQUROLGVBQVUsR0FBVixVQUFVLENBQVc7UUFDOUIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUE3QjdCOzs7T0FHRztJQUNILElBQ0ksSUFBSSxDQUFDLElBQWlCO1FBQ3hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLENBQUM7SUFHRDs7O09BR0c7SUFDSCxJQUNJLE9BQU8sQ0FBQyxPQUErRDtRQUN6RSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBY0QsUUFBUTs7UUFDTixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFO1lBQzlCLElBQUksQ0FBQyxDQUFBLE1BQUEsTUFBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRSxJQUFJLDBDQUFFLGFBQWEsQ0FBQSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO2dCQUMxRixNQUFNLEtBQUssQ0FDUCw2RUFBNkU7b0JBQzdFLGtGQUFrRjtvQkFDbEYsMkVBQTJFLENBQUMsQ0FBQzthQUNsRjtZQUVELG1GQUFtRjtZQUNuRixtRkFBbUY7WUFDbkYsMEJBQTBCO1lBQzFC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Szs7QUErR1IsbURBQW1EO0FBQ25ELFNBQVMsZUFBZSxDQUFDLEtBQVU7SUFDakMsT0FBTyxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLEtBQUssUUFBUSxDQUFDO0FBQ2pGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLy8gV29ya2Fyb3VuZCBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9iYXplbGJ1aWxkL3J1bGVzX25vZGVqcy9pc3N1ZXMvMTI2NVxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUubWFwc1wiIC8+XG5cbmltcG9ydCB7XG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgTmdab25lLFxuICBEaXJlY3RpdmUsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7R29vZ2xlTWFwfSBmcm9tICcuLi9nb29nbGUtbWFwL2dvb2dsZS1tYXAnO1xuXG4vKiogUG9zc2libGUgZGF0YSB0aGF0IGNhbiBiZSBzaG93biBvbiBhIGhlYXRtYXAgbGF5ZXIuICovXG5leHBvcnQgdHlwZSBIZWF0bWFwRGF0YSA9XG4gIGdvb2dsZS5tYXBzLk1WQ0FycmF5PFxuICAgIGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWw+IHxcbiAgKGdvb2dsZS5tYXBzLkxhdExuZyB8IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbiB8IGdvb2dsZS5tYXBzLkxhdExuZ0xpdGVyYWwpW107XG5cblxuLyoqXG4gKiBBbmd1bGFyIGRpcmVjdGl2ZSB0aGF0IHJlbmRlcnMgYSBHb29nbGUgTWFwcyBoZWF0bWFwIHZpYSB0aGUgR29vZ2xlIE1hcHMgSmF2YVNjcmlwdCBBUEkuXG4gKlxuICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvblxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXAtaGVhdG1hcC1sYXllcicsXG4gIGV4cG9ydEFzOiAnbWFwSGVhdG1hcExheWVyJyxcbn0pXG5leHBvcnQgY2xhc3MgTWFwSGVhdG1hcExheWVyIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBEYXRhIHNob3duIG9uIHRoZSBoZWF0bWFwLlxuICAgKiBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL21hcHMvZG9jdW1lbnRhdGlvbi9qYXZhc2NyaXB0L3JlZmVyZW5jZS92aXN1YWxpemF0aW9uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgZGF0YShkYXRhOiBIZWF0bWFwRGF0YSkge1xuICAgIHRoaXMuX2RhdGEgPSBkYXRhO1xuICB9XG4gIHByaXZhdGUgX2RhdGE6IEhlYXRtYXBEYXRhO1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIHVzZWQgdG8gY29uZmlndXJlIHRoZSBoZWF0bWFwLiBTZWU6XG4gICAqIGRldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvbiNIZWF0bWFwTGF5ZXJPcHRpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgb3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyT3B0aW9ucz4pIHtcbiAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcbiAgfVxuICBwcml2YXRlIF9vcHRpb25zOiBQYXJ0aWFsPGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyT3B0aW9ucz47XG5cbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyIG9iamVjdC5cbiAgICpcbiAgICogU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC9yZWZlcmVuY2UvdmlzdWFsaXphdGlvblxuICAgKi9cbiAgaGVhdG1hcD86IGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uSGVhdG1hcExheWVyO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2dvb2dsZU1hcDogR29vZ2xlTWFwLFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLl9nb29nbGVNYXAuX2lzQnJvd3Nlcikge1xuICAgICAgaWYgKCF3aW5kb3cuZ29vZ2xlPy5tYXBzPy52aXN1YWxpemF0aW9uICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgJ05hbWVzcGFjZSBgZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbmAgbm90IGZvdW5kLCBjYW5ub3QgY29uc3RydWN0IGhlYXRtYXAuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSBpbnN0YWxsIHRoZSBHb29nbGUgTWFwcyBKYXZhU2NyaXB0IEFQSSB3aXRoIHRoZSBcInZpc3VhbGl6YXRpb25cIiBsaWJyYXJ5OiAnICtcbiAgICAgICAgICAgICdodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9tYXBzL2RvY3VtZW50YXRpb24vamF2YXNjcmlwdC92aXN1YWxpemF0aW9uJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSB0aGUgb2JqZWN0IG91dHNpZGUgdGhlIHpvbmUgc28gaXRzIGV2ZW50cyBkb24ndCB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAvLyBXZSdsbCBicmluZyBpdCBiYWNrIGluIGluc2lkZSB0aGUgYE1hcEV2ZW50TWFuYWdlcmAgb25seSBmb3IgdGhlIGV2ZW50cyB0aGF0IHRoZVxuICAgICAgLy8gdXNlciBoYXMgc3Vic2NyaWJlZCB0by5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuaGVhdG1hcCA9IG5ldyBnb29nbGUubWFwcy52aXN1YWxpemF0aW9uLkhlYXRtYXBMYXllcih0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fYXNzZXJ0SW5pdGlhbGl6ZWQoKTtcbiAgICAgIHRoaXMuaGVhdG1hcC5zZXRNYXAodGhpcy5fZ29vZ2xlTWFwLmdvb2dsZU1hcCEpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCB7X2RhdGEsIGhlYXRtYXB9ID0gdGhpcztcblxuICAgIGlmIChoZWF0bWFwKSB7XG4gICAgICBpZiAoY2hhbmdlc1snb3B0aW9ucyddKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0T3B0aW9ucyh0aGlzLl9jb21iaW5lT3B0aW9ucygpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoYW5nZXNbJ2RhdGEnXSAmJiBfZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGhlYXRtYXAuc2V0RGF0YSh0aGlzLl9ub3JtYWxpemVEYXRhKF9kYXRhKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuaGVhdG1hcCkge1xuICAgICAgdGhpcy5oZWF0bWFwLnNldE1hcChudWxsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZGF0YSB0aGF0IGlzIGN1cnJlbnRseSBzaG93biBvbiB0aGUgaGVhdG1hcC5cbiAgICogU2VlOiBkZXZlbG9wZXJzLmdvb2dsZS5jb20vbWFwcy9kb2N1bWVudGF0aW9uL2phdmFzY3JpcHQvcmVmZXJlbmNlL3Zpc3VhbGl6YXRpb24jSGVhdG1hcExheWVyXG4gICAqL1xuICBnZXREYXRhKCk6IEhlYXRtYXBEYXRhIHtcbiAgICB0aGlzLl9hc3NlcnRJbml0aWFsaXplZCgpO1xuICAgIHJldHVybiB0aGlzLmhlYXRtYXAuZ2V0RGF0YSgpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBjb21iaW5lZCBvcHRpb25zIG9iamVjdCB1c2luZyB0aGUgcGFzc2VkLWluIG9wdGlvbnMgYW5kIHRoZSBpbmRpdmlkdWFsIGlucHV0cy4gKi9cbiAgcHJpdmF0ZSBfY29tYmluZU9wdGlvbnMoKTogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJPcHRpb25zIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fb3B0aW9ucyB8fCB7fTtcbiAgICByZXR1cm4ge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIGRhdGE6IHRoaXMuX25vcm1hbGl6ZURhdGEodGhpcy5fZGF0YSB8fCBvcHRpb25zLmRhdGEgfHwgW10pLFxuICAgICAgbWFwOiB0aGlzLl9nb29nbGVNYXAuZ29vZ2xlTWFwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTW9zdCBHb29nbGUgTWFwcyBBUElzIHN1cHBvcnQgYm90aCBgTGF0TG5nYCBvYmplY3RzIGFuZCBgTGF0TG5nTGl0ZXJhbGAuIFRoZSBsYXR0ZXIgaXMgbW9yZVxuICAgKiBjb252ZW5pZW50IHRvIHdyaXRlIG91dCwgYmVjYXVzZSB0aGUgR29vZ2xlIE1hcHMgQVBJIGRvZXNuJ3QgaGF2ZSB0byBoYXZlIGJlZW4gbG9hZGVkIGluIG9yZGVyXG4gICAqIHRvIGNvbnN0cnVjdCB0aGVtLiBUaGUgYEhlYXRtYXBMYXllcmAgYXBwZWFycyB0byBiZSBhbiBleGNlcHRpb24gdGhhdCBvbmx5IGFsbG93cyBhIGBMYXRMbmdgXG4gICAqIG9iamVjdCwgb3IgaXQgdGhyb3dzIGEgcnVudGltZSBlcnJvci4gU2luY2UgaXQncyBtb3JlIGNvbnZlbmllbnQgYW5kIHdlIGV4cGVjdCB0aGF0IEFuZ3VsYXJcbiAgICogdXNlcnMgd2lsbCBsb2FkIHRoZSBBUEkgYXN5bmNocm9ub3VzbHksIHdlIGFsbG93IHRoZW0gdG8gcGFzcyBpbiBhIGBMYXRMbmdMaXRlcmFsYCBhbmQgd2VcbiAgICogY29udmVydCBpdCB0byBhIGBMYXRMbmdgIG9iamVjdCBiZWZvcmUgcGFzc2luZyBpdCBvZmYgdG8gR29vZ2xlIE1hcHMuXG4gICAqL1xuICBwcml2YXRlIF9ub3JtYWxpemVEYXRhKGRhdGE6IEhlYXRtYXBEYXRhKSB7XG4gICAgY29uc3QgcmVzdWx0OiAoZ29vZ2xlLm1hcHMuTGF0TG5nfGdvb2dsZS5tYXBzLnZpc3VhbGl6YXRpb24uV2VpZ2h0ZWRMb2NhdGlvbilbXSA9IFtdO1xuXG4gICAgZGF0YS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgcmVzdWx0LnB1c2goaXNMYXRMbmdMaXRlcmFsKGl0ZW0pID8gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhpdGVtLmxhdCwgaXRlbS5sbmcpIDogaXRlbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqIEFzc2VydHMgdGhhdCB0aGUgaGVhdG1hcCBvYmplY3QgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuICovXG4gIHByaXZhdGUgX2Fzc2VydEluaXRpYWxpemVkKCk6IGFzc2VydHMgdGhpcyBpcyB7aGVhdG1hcDogZ29vZ2xlLm1hcHMudmlzdWFsaXphdGlvbi5IZWF0bWFwTGF5ZXJ9IHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoIXRoaXMuX2dvb2dsZU1hcC5nb29nbGVNYXApIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICAnQ2Fubm90IGFjY2VzcyBHb29nbGUgTWFwIGluZm9ybWF0aW9uIGJlZm9yZSB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkLiAnICtcbiAgICAgICAgICAgICdQbGVhc2Ugd2FpdCBmb3IgdGhlIEFQSSB0byBsb2FkIGJlZm9yZSB0cnlpbmcgdG8gaW50ZXJhY3Qgd2l0aCBpdC4nKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5oZWF0bWFwKSB7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgICAgJ0Nhbm5vdCBpbnRlcmFjdCB3aXRoIGEgR29vZ2xlIE1hcCBIZWF0bWFwTGF5ZXIgYmVmb3JlIGl0IGhhcyBiZWVuICcgK1xuICAgICAgICAgICAgJ2luaXRpYWxpemVkLiBQbGVhc2Ugd2FpdCBmb3IgdGhlIGhlYXRtYXAgdG8gbG9hZCBiZWZvcmUgdHJ5aW5nIHRvIGludGVyYWN0IHdpdGggaXQuJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKiBBc3NlcnRzIHRoYXQgYW4gb2JqZWN0IGlzIGEgYExhdExuZ0xpdGVyYWxgLiAqL1xuZnVuY3Rpb24gaXNMYXRMbmdMaXRlcmFsKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBnb29nbGUubWFwcy5MYXRMbmdMaXRlcmFsIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5sYXQgPT09ICdudW1iZXInICYmIHR5cGVvZiB2YWx1ZS5sbmcgPT09ICdudW1iZXInO1xufVxuIl19