import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ApiResponse, Character, CharacterFilter } from '../models/character.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/characters`;

  getCharacters(filter?: CharacterFilter): Observable<ApiResponse<Character>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.name) params = params.set('name', filter.name);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.species) params = params.set('species', filter.species);
      if (filter.gender) params = params.set('gender', filter.gender);
      if (filter.page) params = params.set('page', filter.page.toString());
    }

    return this.http.get<ApiResponse<Character>>(this.apiUrl, { params }).pipe(
      catchError(() =>
        of({
          info: { count: 0, pages: 0, next: null, prev: null },
          results: [],
        })
      )
    );
  }

  getCharacterById(id: number): Observable<Character | null> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  searchCharacters(query: string, page = 1): Observable<ApiResponse<Character>> {
    return this.getCharacters({ name: query, page });
  }
}
