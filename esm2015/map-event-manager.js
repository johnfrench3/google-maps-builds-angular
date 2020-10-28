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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50LW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvZ29vZ2xlLW1hcHMvbWFwLWV2ZW50LW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBR0gsT0FBTyxFQUFDLGVBQWUsRUFBRSxVQUFVLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDN0QsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTXpDLGlHQUFpRztBQUNqRyxNQUFNLE9BQU8sZUFBZTtJQWUxQixZQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQWRuQyxtRUFBbUU7UUFDM0QsYUFBUSxHQUErRCxFQUFFLENBQUM7UUFDMUUsZUFBVSxHQUFvQyxFQUFFLENBQUM7UUFDakQsa0JBQWEsR0FBRyxJQUFJLGVBQWUsQ0FBd0IsU0FBUyxDQUFDLENBQUM7SUFXeEMsQ0FBQztJQVR2Qyx1REFBdUQ7SUFDL0MsZUFBZTtRQUNyQixLQUFLLE1BQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDdEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ25CO1FBRUQsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUlELGtHQUFrRztJQUNsRyxjQUFjLENBQUksSUFBWTtRQUM1QixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNoRCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBSSxRQUFRLENBQUMsRUFBRTtnQkFDOUMsMEZBQTBGO2dCQUMxRixJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7b0JBQzNDLE9BQU8sU0FBUyxDQUFDO2lCQUNsQjtnQkFFRCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQVEsRUFBRSxFQUFFO29CQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUMvQixPQUFPLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNqQyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sVUFBVSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsc0VBQXNFO0lBQ3RFLFNBQVMsQ0FBQyxNQUE2QjtRQUNyQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUUvQyxJQUFJLE1BQU0sS0FBSyxhQUFhLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBRUQsb0RBQW9EO1FBQ3BELElBQUksYUFBYSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztTQUNwQjtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWhDLG9FQUFvRTtRQUNwRSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCwyREFBMkQ7SUFDM0QsT0FBTztRQUNMLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nWm9uZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0JlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgU3Vic2NyaWJlcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3N3aXRjaE1hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG50eXBlIE1hcEV2ZW50TWFuYWdlclRhcmdldCA9IHtcbiAgYWRkTGlzdGVuZXI6IChuYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQpID0+IGdvb2dsZS5tYXBzLk1hcHNFdmVudExpc3RlbmVyO1xufSB8IHVuZGVmaW5lZDtcblxuLyoqIE1hbmFnZXMgZXZlbnQgb24gYSBHb29nbGUgTWFwcyBvYmplY3QsIGVuc3VyaW5nIHRoYXQgZXZlbnRzIGFyZSBhZGRlZCBvbmx5IHdoZW4gbmVjZXNzYXJ5LiAqL1xuZXhwb3J0IGNsYXNzIE1hcEV2ZW50TWFuYWdlciB7XG4gIC8qKiBQZW5kaW5nIGxpc3RlbmVycyB0aGF0IHdlcmUgYWRkZWQgYmVmb3JlIHRoZSB0YXJnZXQgd2FzIHNldC4gKi9cbiAgcHJpdmF0ZSBfcGVuZGluZzoge29ic2VydmFibGU6IE9ic2VydmFibGU8YW55Piwgb2JzZXJ2ZXI6IFN1YnNjcmliZXI8YW55Pn1bXSA9IFtdO1xuICBwcml2YXRlIF9saXN0ZW5lcnM6IGdvb2dsZS5tYXBzLk1hcHNFdmVudExpc3RlbmVyW10gPSBbXTtcbiAgcHJpdmF0ZSBfdGFyZ2V0U3RyZWFtID0gbmV3IEJlaGF2aW9yU3ViamVjdDxNYXBFdmVudE1hbmFnZXJUYXJnZXQ+KHVuZGVmaW5lZCk7XG5cbiAgLyoqIENsZWFycyBhbGwgY3VycmVudGx5LXJlZ2lzdGVyZWQgZXZlbnQgbGlzdGVuZXJzLiAqL1xuICBwcml2YXRlIF9jbGVhckxpc3RlbmVycygpIHtcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVycykge1xuICAgICAgbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gW107XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSkge31cblxuICAvKiogR2V0cyBhbiBvYnNlcnZhYmxlIHRoYXQgYWRkcyBhbiBldmVudCBsaXN0ZW5lciB0byB0aGUgbWFwIHdoZW4gYSBjb25zdW1lciBzdWJzY3JpYmVzIHRvIGl0LiAqL1xuICBnZXRMYXp5RW1pdHRlcjxUPihuYW1lOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5fdGFyZ2V0U3RyZWFtLnBpcGUoc3dpdGNoTWFwKHRhcmdldCA9PiB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8VD4ob2JzZXJ2ZXIgPT4ge1xuICAgICAgICAvLyBJZiB0aGUgdGFyZ2V0IGhhc24ndCBiZWVuIGluaXRpYWxpemVkIHlldCwgY2FjaGUgdGhlIG9ic2VydmVyIHNvIGl0IGNhbiBiZSBhZGRlZCBsYXRlci5cbiAgICAgICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgICAgICB0aGlzLl9wZW5kaW5nLnB1c2goe29ic2VydmFibGUsIG9ic2VydmVyfSk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGFyZ2V0LmFkZExpc3RlbmVyKG5hbWUsIChldmVudDogVCkgPT4ge1xuICAgICAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dChldmVudCkpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICByZXR1cm4gKCkgPT4gbGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIG9ic2VydmFibGU7XG4gICAgfSkpO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGN1cnJlbnQgdGFyZ2V0IHRoYXQgdGhlIG1hbmFnZXIgc2hvdWxkIGJpbmQgZXZlbnRzIHRvLiAqL1xuICBzZXRUYXJnZXQodGFyZ2V0OiBNYXBFdmVudE1hbmFnZXJUYXJnZXQpIHtcbiAgICBjb25zdCBjdXJyZW50VGFyZ2V0ID0gdGhpcy5fdGFyZ2V0U3RyZWFtLnZhbHVlO1xuXG4gICAgaWYgKHRhcmdldCA9PT0gY3VycmVudFRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENsZWFyIHRoZSBsaXN0ZW5lcnMgZnJvbSB0aGUgcHJlLWV4aXN0aW5nIHRhcmdldC5cbiAgICBpZiAoY3VycmVudFRhcmdldCkge1xuICAgICAgdGhpcy5fY2xlYXJMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMuX3BlbmRpbmcgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLl90YXJnZXRTdHJlYW0ubmV4dCh0YXJnZXQpO1xuXG4gICAgLy8gQWRkIHRoZSBsaXN0ZW5lcnMgdGhhdCB3ZXJlIGJvdW5kIGJlZm9yZSB0aGUgbWFwIHdhcyBpbml0aWFsaXplZC5cbiAgICB0aGlzLl9wZW5kaW5nLmZvckVhY2goc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyLm9ic2VydmFibGUuc3Vic2NyaWJlKHN1YnNjcmliZXIub2JzZXJ2ZXIpKTtcbiAgICB0aGlzLl9wZW5kaW5nID0gW107XG4gIH1cblxuICAvKiogRGVzdHJveXMgdGhlIG1hbmFnZXIgYW5kIGNsZWFycyB0aGUgZXZlbnQgbGlzdGVuZXJzLiAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuX2NsZWFyTGlzdGVuZXJzKCk7XG4gICAgdGhpcy5fcGVuZGluZyA9IFtdO1xuICAgIHRoaXMuX3RhcmdldFN0cmVhbS5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=