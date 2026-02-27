import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScreenFile, ScreenConfig } from './screen-types';

/**
 * Retrieve a single screen configuration by name using HttpClient.
 * Returns an observable that emits the matching ScreenConfig or undefined.
 */
export function fetchScreenConfig(http: HttpClient, screenName: string): Observable<ScreenConfig | undefined> {
  return http.get<ScreenFile>('assets/project-json/Screens.json').pipe(
    map(cfg => cfg.Screens.find(s => s.ScreenName === screenName)),
  );
}
