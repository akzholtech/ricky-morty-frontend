import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {
  AiChatRequest,
  AiChatResponse,
  AiCharacterDescriptionResponse,
} from '../models/ai.model';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:8000/api/ai';

  chat(request: AiChatRequest): Observable<AiChatResponse> {
    return this.http.post<AiChatResponse>(`${this.apiUrl}/chat`, request).pipe(
      catchError((error) =>
        of({
          message: '',
          error: error?.error?.message || 'Failed to get AI response',
        })
      )
    );
  }

  getCharacterDescription(characterId: number): Observable<AiCharacterDescriptionResponse> {
    return this.http
      .get<AiCharacterDescriptionResponse>(`${this.apiUrl}/character-description/${characterId}`)
      .pipe(
        catchError((error) =>
          of({
            characterId,
            characterName: '',
            description: '',
            generatedAt: '',
            error: error?.error?.message || 'Failed to get character description',
          })
        )
      );
  }

  askAboutCharacter(characterName: string, question: string): Observable<AiChatResponse> {
    return this.chat({
      message: question,
      context: `The user is asking about the Rick and Morty character: ${characterName}`,
    });
  }
}
