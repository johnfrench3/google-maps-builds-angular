/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
/** Manages event on a Google Maps object, ensuring that events are added only when necessary. */
export class MapEventManager {
    /** Clears all currently-registered event listeners. */
    _clearListeners() {
        for (const listener of this._listeners) {
            listener.remove();
        }
        this._listeners = [];
    }
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /** Pending listeners that were added before the target was set. */
        this._pending = [];
        this._listeners = [];
        this._targetStream = new BehaviorSubject(undefined);
    }
    /** Gets an observable that adds an event listener to the map when a consumer subscribes to it. */
    getLazyEmitter(name) {
        return this._targetStream.pipe(switchMap(target => {
            const observable = new Observable(observer => {
                // If the target hasn't been initialized yet, cache the observer so it can be added later.
                if (!target) {
                    this._pending.push({ observable, observer });
                    return undefined;
                }
                const listener = target.addListener(name, (event) => {
                    this._ngZone.run(() => observer.next(event));
                });
                // If there's an error when initializing the Maps API (e.g. a wrong API key), it will
                // return a dummy object that returns `undefined` from `addListener` (see #26514).
                if (!listener) {
                    observer.complete();
                    return undefined;
                }
                this._listeners.push(listener);
                return () => listener.remove();
            });
            return observable;
        }));
    }
    /** Sets the current target that the manager should bind events to. */
    setTarget(target) {
        const currentTarget = this._targetStream.value;
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
        this._pending.forEach(subscriber => subscriber.observable.subscribe(subscriber.observer));
        this._pending = [];
    }
    /** Destroys the manager and clears the event listeners. */
    destroy() {
        this._clearListeners();
        this._pending = [];
        this._targetStream.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWV2ZW50LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBV3pDLGlHQUFpRztBQUNqRyxNQUFNLE9BQU8sZUFBZTtJQU0xQix1REFBdUQ7SUFDL0MsZUFBZTtRQUNyQixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELFlBQW9CLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBZG5DLG1FQUFtRTtRQUMzRCxhQUFRLEdBQStELEVBQUUsQ0FBQztRQUMxRSxlQUFVLEdBQW9DLEVBQUUsQ0FBQztRQUNqRCxrQkFBYSxHQUFHLElBQUksZUFBZSxDQUF3QixTQUFTLENBQUMsQ0FBQztJQVd4QyxDQUFDO0lBRXZDLGtHQUFrRztJQUNsRyxjQUFjLENBQUksSUFBWTtRQUM1QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUM1QixTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUksUUFBUSxDQUFDLEVBQUU7Z0JBQzlDLDBGQUEwRjtnQkFDMUYsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLFNBQVMsQ0FBQztpQkFDbEI7Z0JBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFRLEVBQUUsRUFBRTtvQkFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDLENBQUMsQ0FBQztnQkFFSCxxRkFBcUY7Z0JBQ3JGLGtGQUFrRjtnQkFDbEYsSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDYixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3BCLE9BQU8sU0FBUyxDQUFDO2lCQUNsQjtnQkFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLFVBQVUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELHNFQUFzRTtJQUN0RSxTQUFTLENBQUMsTUFBNkI7UUFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFFL0MsSUFBSSxNQUFNLEtBQUssYUFBYSxFQUFFO1lBQzVCLE9BQU87U0FDUjtRQUVELG9EQUFvRDtRQUNwRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7U0FDcEI7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoQyxvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsMkRBQTJEO0lBQzNELE9BQU87UUFDTCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmliZXJ9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzd2l0Y2hNYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxudHlwZSBNYXBFdmVudE1hbmFnZXJUYXJnZXQgPVxuICB8IHtcbiAgICAgIGFkZExpc3RlbmVyOiAoXG4gICAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgICAgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCxcbiAgICAgICkgPT4gZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXIgfCB1bmRlZmluZWQ7XG4gICAgfVxuICB8IHVuZGVmaW5lZDtcblxuLyoqIE1hbmFnZXMgZXZlbnQgb24gYSBHb29nbGUgTWFwcyBvYmplY3QsIGVuc3VyaW5nIHRoYXQgZXZlbnRzIGFyZSBhZGRlZCBvbmx5IHdoZW4gbmVjZXNzYXJ5LiAqL1xuZXhwb3J0IGNsYXNzIE1hcEV2ZW50TWFuYWdlciB7XG4gIC8qKiBQZW5kaW5nIGxpc3RlbmVycyB0aGF0IHdlcmUgYWRkZWQgYmVmb3JlIHRoZSB0YXJnZXQgd2FzIHNldC4gKi9cbiAgcHJpdmF0ZSBfcGVuZGluZzoge29ic2VydmFibGU6IE9ic2VydmFibGU8YW55Pjsgb2JzZXJ2ZXI6IFN1YnNjcmliZXI8YW55Pn1bXSA9IFtdO1xuICBwcml2YXRlIF9saXN0ZW5lcnM6IGdvb2dsZS5tYXBzLk1hcHNFdmVudExpc3RlbmVyW10gPSBbXTtcbiAgcHJpdmF0ZSBfdGFyZ2V0U3RyZWFtID0gbmV3IEJlaGF2aW9yU3ViamVjdDxNYXBFdmVudE1hbmFnZXJUYXJnZXQ+KHVuZGVmaW5lZCk7XG5cbiAgLyoqIENsZWFycyBhbGwgY3VycmVudGx5LXJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzLiAqL1xuICBwcml2YXRlIF9jbGVhckxpc3RlbmVycygpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgYWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWFwIHdoZW4gYSBjb25zdW1lciBzdWJzY3JpYmVzIHRvIGl0LiAqL1xuICBnZXRMYXp5RW1pdHRlcjxUPihuYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fdGFyZ2V0U3RyZWFtLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAodGFyZ2V0ID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPFQ+KG9ic2VydmVyID0+IHtcbiAgICAgICAgICAvLyBJZiB0aGUgdGFyZ2V0IGhhc24ndCBiZWVuIGluaXRpYWxpemVkIHlldCwgY2FjaGUgdGhlIG9ic2VydmVyIHNvIGl0IGNhbiBiZSBhZGRlZCBsYXRlci5cbiAgICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy5fcGVuZGluZy5wdXNoKHtvYnNlcnZhYmxlLCBvYnNlcnZlcn0pO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRhcmdldC5hZGRMaXN0ZW5lcihuYW1lLCAoZXZlbnQ6IFQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dChldmVudCkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBhbiBlcnJvciB3aGVuIGluaXRpYWxpemluZyB0aGUgTWFwcyBBUEkgKGUuZy4gYSB3cm9uZyBBUEkga2V5KSwgaXQgd2lsbFxuICAgICAgICAgIC8vIHJldHVybiBhIGR1bW15IG9iamVjdCB0aGF0IHJldHVybnMgYHVuZGVmaW5lZGAgZnJvbSBgYWRkTGlzdGVuZXJgIChzZWUgIzI2NTE0KS5cbiAgICAgICAgICBpZiAoIWxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgICAgICAgcmV0dXJuICgpID0+IGxpc3RlbmVyLnJlbW92ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gb2JzZXJ2YWJsZTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgY3VycmVudCB0YXJnZXQgdGhhdCB0aGUgbWFuYWdlciBzaG91bGQgYmluZCBldmVudHMgdG8uICovXG4gIHNldFRhcmdldCh0YXJnZXQ6IE1hcEV2ZW50TWFuYWdlclRhcmdldCkge1xuICAgIGNvbnN0IGN1cnJlbnRUYXJnZXQgPSB0aGlzLl90YXJnZXRTdHJlYW0udmFsdWU7XG5cbiAgICBpZiAodGFyZ2V0ID09PSBjdXJyZW50VGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2xlYXIgdGhlIGxpc3RlbmVycyBmcm9tIHRoZSBwcmUtZXhpc3RpbmcgdGFyZ2V0LlxuICAgIGlmIChjdXJyZW50VGFyZ2V0KSB7XG4gICAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX3RhcmdldFN0cmVhbS5uZXh0KHRhcmdldCk7XG5cbiAgICAvLyBBZGQgdGhlIGxpc3RlbmVycyB0aGF0IHdlcmUgYm91bmQgYmVmb3JlIHRoZSBtYXAgd2FzIGluaXRpYWxpemVkLlxuICAgIHRoaXMuX3BlbmRpbmcuZm9yRWFjaChzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIub2JzZXJ2YWJsZS5zdWJzY3JpYmUoc3Vic2NyaWJlci5vYnNlcnZlcikpO1xuICAgIHRoaXMuX3BlbmRpbmcgPSBbXTtcbiAgfVxuXG4gIC8qKiBEZXN0cm95cyB0aGUgbWFuYWdlciBhbmQgY2xlYXJzIHRoZSBldmVudCBsaXN0ZW5lcnMuICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5fY2xlYXJMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLl9wZW5kaW5nID0gW107XG4gICAgdGhpcy5fdGFyZ2V0U3RyZWFtLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==