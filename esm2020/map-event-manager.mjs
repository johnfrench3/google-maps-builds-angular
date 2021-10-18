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
    constructor(_ngZone) {
        this._ngZone = _ngZone;
        /** Pending listeners that were added before the target was set. */
        this._pending = [];
        this._listeners = [];
        this._targetStream = new BehaviorSubject(undefined);
    }
    /** Clears all currently-registered event listeners. */
    _clearListeners() {
        for (const listener of this._listeners) {
            listener.remove();
        }
        this._listeners = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWV2ZW50LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBV3pDLGlHQUFpRztBQUNqRyxNQUFNLE9BQU8sZUFBZTtJQWUxQixZQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWRuQyxtRUFBbUU7UUFDM0QsYUFBUSxHQUErRCxFQUFFLENBQUM7UUFDMUUsZUFBVSxHQUFvQyxFQUFFLENBQUM7UUFDakQsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBd0IsU0FBUyxDQUFDLENBQUM7SUFXeEMsQ0FBQztJQVR2Qyx1REFBdUQ7SUFDL0MsZUFBZTtRQUNyQixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUlELGtHQUFrRztJQUNsRyxjQUFjLENBQUksSUFBWTtRQUM1QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUM1QixTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDakIsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUksUUFBUSxDQUFDLEVBQUU7Z0JBQzlDLDBGQUEwRjtnQkFDMUYsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLFNBQVMsQ0FBQztpQkFDbEI7Z0JBRUQsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFRLEVBQUUsRUFBRTtvQkFDckQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUMvQyxDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLFVBQVUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUVELHNFQUFzRTtJQUN0RSxTQUFTLENBQUMsTUFBNkI7UUFDckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFFL0MsSUFBSSxNQUFNLEtBQUssYUFBYSxFQUFFO1lBQzVCLE9BQU87U0FDUjtRQUVELG9EQUFvRDtRQUNwRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7U0FDcEI7UUFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoQyxvRUFBb0U7UUFDcEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQsMkRBQTJEO0lBQzNELE9BQU87UUFDTCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUsIFN1YnNjcmliZXJ9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtzd2l0Y2hNYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxudHlwZSBNYXBFdmVudE1hbmFnZXJUYXJnZXQgPVxuICB8IHtcbiAgICAgIGFkZExpc3RlbmVyOiAoXG4gICAgICAgIG5hbWU6IHN0cmluZyxcbiAgICAgICAgY2FsbGJhY2s6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZCxcbiAgICAgICkgPT4gZ29vZ2xlLm1hcHMuTWFwc0V2ZW50TGlzdGVuZXI7XG4gICAgfVxuICB8IHVuZGVmaW5lZDtcblxuLyoqIE1hbmFnZXMgZXZlbnQgb24gYSBHb29nbGUgTWFwcyBvYmplY3QsIGVuc3VyaW5nIHRoYXQgZXZlbnRzIGFyZSBhZGRlZCBvbmx5IHdoZW4gbmVjZXNzYXJ5LiAqL1xuZXhwb3J0IGNsYXNzIE1hcEV2ZW50TWFuYWdlciB7XG4gIC8qKiBQZW5kaW5nIGxpc3RlbmVycyB0aGF0IHdlcmUgYWRkZWQgYmVmb3JlIHRoZSB0YXJnZXQgd2FzIHNldC4gKi9cbiAgcHJpdmF0ZSBfcGVuZGluZzoge29ic2VydmFibGU6IE9ic2VydmFibGU8YW55Pjsgb2JzZXJ2ZXI6IFN1YnNjcmliZXI8YW55Pn1bXSA9IFtdO1xuICBwcml2YXRlIF9saXN0ZW5lcnM6IGdvb2dsZS5tYXBzLk1hcHNFdmVudExpc3RlbmVyW10gPSBbXTtcbiAgcHJpdmF0ZSBfdGFyZ2V0U3RyZWFtID0gbmV3IEJlaGF2aW9yU3ViamVjdDxNYXBFdmVudE1hbmFnZXJUYXJnZXQ+KHVuZGVmaW5lZCk7XG5cbiAgLyoqIENsZWFycyBhbGwgY3VycmVudGx5LXJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzLiAqL1xuICBwcml2YXRlIF9jbGVhckxpc3RlbmVycygpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgYWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWFwIHdoZW4gYSBjb25zdW1lciBzdWJzY3JpYmVzIHRvIGl0LiAqL1xuICBnZXRMYXp5RW1pdHRlcjxUPihuYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fdGFyZ2V0U3RyZWFtLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAodGFyZ2V0ID0+IHtcbiAgICAgICAgY29uc3Qgb2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPFQ+KG9ic2VydmVyID0+IHtcbiAgICAgICAgICAvLyBJZiB0aGUgdGFyZ2V0IGhhc24ndCBiZWVuIGluaXRpYWxpemVkIHlldCwgY2FjaGUgdGhlIG9ic2VydmVyIHNvIGl0IGNhbiBiZSBhZGRlZCBsYXRlci5cbiAgICAgICAgICBpZiAoIXRhcmdldCkge1xuICAgICAgICAgICAgdGhpcy5fcGVuZGluZy5wdXNoKHtvYnNlcnZhYmxlLCBvYnNlcnZlcn0pO1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBsaXN0ZW5lciA9IHRhcmdldC5hZGRMaXN0ZW5lcihuYW1lLCAoZXZlbnQ6IFQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dChldmVudCkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuX2xpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICAgICAgICByZXR1cm4gKCkgPT4gbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBjdXJyZW50IHRhcmdldCB0aGF0IHRoZSBtYW5hZ2VyIHNob3VsZCBiaW5kIGV2ZW50cyB0by4gKi9cbiAgc2V0VGFyZ2V0KHRhcmdldDogTWFwRXZlbnRNYW5hZ2VyVGFyZ2V0KSB7XG4gICAgY29uc3QgY3VycmVudFRhcmdldCA9IHRoaXMuX3RhcmdldFN0cmVhbS52YWx1ZTtcblxuICAgIGlmICh0YXJnZXQgPT09IGN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDbGVhciB0aGUgbGlzdGVuZXJzIGZyb20gdGhlIHByZS1leGlzdGluZyB0YXJnZXQuXG4gICAgaWYgKGN1cnJlbnRUYXJnZXQpIHtcbiAgICAgIHRoaXMuX2NsZWFyTGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLl9wZW5kaW5nID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fdGFyZ2V0U3RyZWFtLm5leHQodGFyZ2V0KTtcblxuICAgIC8vIEFkZCB0aGUgbGlzdGVuZXJzIHRoYXQgd2VyZSBib3VuZCBiZWZvcmUgdGhlIG1hcCB3YXMgaW5pdGlhbGl6ZWQuXG4gICAgdGhpcy5fcGVuZGluZy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5vYnNlcnZhYmxlLnN1YnNjcmliZShzdWJzY3JpYmVyLm9ic2VydmVyKSk7XG4gICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICB9XG5cbiAgLyoqIERlc3Ryb3lzIHRoZSBtYW5hZ2VyIGFuZCBjbGVhcnMgdGhlIGV2ZW50IGxpc3RlbmVycy4gKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLl9jbGVhckxpc3RlbmVycygpO1xuICAgIHRoaXMuX3BlbmRpbmcgPSBbXTtcbiAgICB0aGlzLl90YXJnZXRTdHJlYW0uY29tcGxldGUoKTtcbiAgfVxufVxuIl19