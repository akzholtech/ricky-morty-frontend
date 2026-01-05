import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { CharacterService } from '../../core/services/character.service';
import { AiService } from '../../core/services/ai.service';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';
import { Character } from '../../core/models/character.model';

@Component({
  selector: 'app-character-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage, ThemeToggleComponent],
  template: `
    <div class="detail-page">
      <header class="header">
        <nav class="nav">
          <a routerLink="/" class="back-button" aria-label="Вернуться к поиску">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            <span>Назад к поиску</span>
          </a>
          <app-theme-toggle />
        </nav>
      </header>

      <main class="main-content">
        @if (isLoading()) {
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Загрузка данных персонажа...</p>
          </div>
        } @else if (character()) {
          <article class="character-detail" aria-labelledby="character-name">
            <div class="character-image-section">
              <div class="image-container">
                <div class="status-badge" [class]="statusClass()">
                  <span class="status-dot"></span>
                  <span>{{ character()!.status }}</span>
                </div>
                <img
                  [ngSrc]="character()!.image"
                  [alt]="character()!.name + ' portrait'"
                  width="400"
                  height="400"
                  class="character-image"
                  priority
                />
                <div class="image-glow"></div>
              </div>
            </div>

            <div class="character-info-section">
              <h1 id="character-name" class="character-name">{{ character()!.name }}</h1>

              <div class="info-grid">
                <div class="info-card">
                  <h2 class="info-card-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Основная информация
                  </h2>
                  <dl class="info-list">
                    <div class="info-item">
                      <dt>Вид</dt>
                      <dd>{{ character()!.species }}</dd>
                    </div>
                    <div class="info-item">
                      <dt>Пол</dt>
                      <dd>{{ character()!.gender }}</dd>
                    </div>
                    @if (character()!.type) {
                      <div class="info-item">
                        <dt>Тип</dt>
                        <dd>{{ character()!.type }}</dd>
                      </div>
                    }
                  </dl>
                </div>

                <div class="info-card">
                  <h2 class="info-card-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                      <path d="M2 12h20"/>
                    </svg>
                    Местоположение
                  </h2>
                  <dl class="info-list">
                    <div class="info-item">
                      <dt>Происхождение</dt>
                      <dd>{{ character()!.origin.name }}</dd>
                    </div>
                    <div class="info-item">
                      <dt>Последняя локация</dt>
                      <dd>{{ character()!.location.name }}</dd>
                    </div>
                  </dl>
                </div>

                <div class="info-card episodes-card">
                  <h2 class="info-card-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                      <polyline points="17,2 12,7 7,2"/>
                    </svg>
                    Эпизоды
                  </h2>
                  <p class="episodes-count">
                    Появляется в <strong>{{ character()!.episode.length }}</strong>
                    {{ character()!.episode.length === 1 ? 'эпизоде' : 'эпизодах' }}
                  </p>
                  <div class="episodes-list">
                    @for (ep of episodeNumbers(); track ep; let i = $index) {
                      @if (i < 20) {
                        <span class="episode-badge">EP {{ ep }}</span>
                      }
                    }
                    @if (episodeNumbers().length > 20) {
                      <span class="episode-badge more">+{{ episodeNumbers().length - 20 }} ещё</span>
                    }
                  </div>
                </div>

                <div class="info-card ai-card">
                  <h2 class="info-card-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                      <circle cx="7.5" cy="14.5" r="1.5"/>
                      <circle cx="16.5" cy="14.5" r="1.5"/>
                    </svg>
                    ИИ-анализ персонажа
                  </h2>
                  @if (isLoadingAi()) {
                    <div class="ai-loading">
                      <div class="ai-loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <p>Генерация ИИ-анализа...</p>
                    </div>
                  } @else if (aiDescription()) {
                    <div class="ai-description">
                      <p>{{ aiDescription() }}</p>
                      @if (aiGeneratedAt()) {
                        <span class="ai-meta">Сгенерировано {{ aiGeneratedAt() }}</span>
                      }
                    </div>
                  } @else if (aiError()) {
                    <div class="ai-error">
                      <p>{{ aiError() }}</p>
                      <button type="button" class="retry-button" (click)="loadAiDescription()">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
                          <path d="M21 3v5h-5"/>
                        </svg>
                        Повторить
                      </button>
                    </div>
                  } @else {
                    <button type="button" class="generate-button" (click)="loadAiDescription()">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      Сгенерировать ИИ-описание
                    </button>
                  }
                </div>
              </div>

              <div class="meta-info">
                <p>ID персонажа: {{ character()!.id }}</p>
                <p>Создан: {{ formattedDate() }}</p>
              </div>
            </div>
          </article>
        } @else {
          <div class="error-state">
            <div class="error-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="m15 9-6 6M9 9l6 6"/>
              </svg>
            </div>
            <h2>Персонаж не найден</h2>
            <p>Возможно, этот персонаж ускользнул в другое измерение.</p>
            <a routerLink="/" class="home-link">Вернуться к поиску</a>
          </div>
        }
      </main>
    </div>
  `,
  styles: `
    .detail-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border-color);
      backdrop-filter: blur(12px);
    }

    .nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-4);
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all var(--transition-base);
    }

    .back-button:hover {
      border-color: var(--rm-portal-green);
      color: var(--rm-portal-green);
    }

    .back-button svg {
      width: 18px;
      height: 18px;
    }

    .main-content {
      flex: 1;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-8) var(--space-4);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      gap: var(--space-4);
      color: var(--text-secondary);
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid var(--border-color);
      border-top-color: var(--rm-portal-green);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .character-detail {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: var(--space-10);
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .character-image-section {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .image-container {
      position: relative;
      border-radius: var(--radius-2xl);
      overflow: hidden;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
    }

    .status-badge {
      position: absolute;
      top: var(--space-4);
      left: var(--space-4);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 600;
      z-index: 2;
      text-transform: capitalize;
      color: white;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .status-badge.alive .status-dot {
      background: var(--rm-portal-green);
      box-shadow: 0 0 10px var(--rm-portal-green);
    }

    .status-badge.dead .status-dot {
      background: #ef4444;
      box-shadow: 0 0 10px #ef4444;
    }

    .status-badge.unknown .status-dot {
      background: #a1a1aa;
      box-shadow: 0 0 10px #a1a1aa;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .character-image {
      width: 100%;
      height: auto;
      display: block;
    }

    .image-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(
        circle at center,
        transparent 40%,
        var(--bg-primary) 100%
      );
      pointer-events: none;
      opacity: 0.3;
    }

    .character-info-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .character-name {
      font-family: 'Creepster', cursive;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 400;
      color: var(--rm-portal-green);
      text-shadow: 0 0 20px rgba(151, 206, 76, 0.3);
      line-height: 1.2;
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .info-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      transition: all var(--transition-base);
    }

    .info-card:hover {
      border-color: var(--rm-portal-green);
      box-shadow: 0 0 20px rgba(151, 206, 76, 0.1);
    }

    .info-card-title {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 1rem;
      font-weight: 600;
      color: var(--rm-portal-cyan);
      margin-bottom: var(--space-4);
    }

    .info-card-title svg {
      width: 20px;
      height: 20px;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--border-color);
    }

    .info-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .info-item dt {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .info-item dd {
      color: var(--text-primary);
      font-weight: 500;
    }

    .episodes-count {
      color: var(--text-secondary);
      margin-bottom: var(--space-3);
    }

    .episodes-count strong {
      color: var(--rm-portal-green);
      font-size: 1.25rem;
    }

    .episodes-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .episode-badge {
      padding: var(--space-1) var(--space-3);
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .episode-badge.more {
      background: var(--rm-portal-green);
      border-color: var(--rm-portal-green);
      color: #0a0a0a;
    }

    .meta-info {
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: var(--space-6);
      color: var(--text-muted);
      font-size: 0.8rem;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
      gap: var(--space-4);
    }

    .error-icon {
      width: 80px;
      height: 80px;
      color: var(--text-muted);
      animation: float 3s ease-in-out infinite;
    }

    .error-icon svg {
      width: 100%;
      height: 100%;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .error-state h2 {
      font-size: 1.5rem;
      color: var(--text-primary);
    }

    .error-state p {
      color: var(--text-secondary);
    }

    .home-link {
      display: inline-flex;
      padding: var(--space-3) var(--space-6);
      background: var(--portal-gradient);
      border-radius: var(--radius-lg);
      color: #0a0a0a;
      text-decoration: none;
      font-weight: 600;
      transition: all var(--transition-base);
    }

    .home-link:hover {
      transform: scale(1.05);
      box-shadow: var(--shadow-portal);
    }

    @media (max-width: 900px) {
      .character-detail {
        grid-template-columns: 1fr;
        gap: var(--space-6);
      }

      .character-image-section {
        position: static;
        max-width: 400px;
        margin: 0 auto;
      }

      .character-name {
        text-align: center;
      }

      .meta-info {
        flex-direction: column;
        gap: var(--space-2);
        text-align: center;
      }
    }

    .ai-card {
      background: linear-gradient(135deg, var(--bg-card) 0%, rgba(151, 206, 76, 0.05) 100%);
      border-color: rgba(151, 206, 76, 0.3);
    }

    .ai-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4);
    }

    .ai-loading-dots {
      display: flex;
      gap: var(--space-2);
    }

    .ai-loading-dots span {
      width: 10px;
      height: 10px;
      background: var(--rm-portal-green);
      border-radius: 50%;
      animation: aiDotPulse 1.4s ease-in-out infinite;
    }

    .ai-loading-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }

    .ai-loading-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }

    @keyframes aiDotPulse {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    .ai-loading p {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .ai-description {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .ai-description p {
      color: var(--text-secondary);
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .ai-meta {
      color: var(--text-muted);
      font-size: 0.75rem;
      font-style: italic;
    }

    .ai-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3);
      text-align: center;
    }

    .ai-error p {
      color: #ef4444;
      font-size: 0.875rem;
    }

    .retry-button,
    .generate-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-5);
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .retry-button:hover,
    .generate-button:hover {
      border-color: var(--rm-portal-green);
      color: var(--rm-portal-green);
      box-shadow: 0 0 15px rgba(151, 206, 76, 0.2);
    }

    .retry-button svg,
    .generate-button svg {
      width: 18px;
      height: 18px;
    }

    .generate-button {
      width: 100%;
      background: linear-gradient(135deg, rgba(151, 206, 76, 0.1) 0%, rgba(151, 206, 76, 0.05) 100%);
      border-color: rgba(151, 206, 76, 0.3);
    }

    .generate-button:hover {
      background: linear-gradient(135deg, rgba(151, 206, 76, 0.2) 0%, rgba(151, 206, 76, 0.1) 100%);
    }

    @media (max-width: 640px) {
      .back-button span {
        display: none;
      }

      .back-button {
        padding: var(--space-2);
      }
    }
  `,
})
export class CharacterDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly characterService = inject(CharacterService);
  private readonly aiService = inject(AiService);

  protected readonly isLoading = signal(true);
  protected readonly character = signal<Character | null>(null);
  protected readonly isLoadingAi = signal(false);
  protected readonly aiDescription = signal<string>('');
  protected readonly aiGeneratedAt = signal<string>('');
  protected readonly aiError = signal<string>('');

  protected readonly statusClass = computed(() => {
    const char = this.character();
    if (!char) return '';
    const status = char.status.toLowerCase();
    return status === 'alive' ? 'alive' : status === 'dead' ? 'dead' : 'unknown';
  });

  protected readonly episodeNumbers = computed(() => {
    const char = this.character();
    if (!char) return [];
    return char.episode.map((ep) => {
      const match = ep.match(/\/episode\/(\d+)/);
      return match ? match[1] : '';
    }).filter(Boolean);
  });

  protected readonly formattedDate = computed(() => {
    const char = this.character();
    if (!char) return '';
    return new Date(char.created).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCharacter(+id);
    } else {
      this.isLoading.set(false);
    }
  }

  private loadCharacter(id: number): void {
    this.characterService.getCharacterById(id).subscribe((char) => {
      this.character.set(char);
      this.isLoading.set(false);
    });
  }

  protected loadAiDescription(): void {
    const char = this.character();
    if (!char) return;

    this.isLoadingAi.set(true);
    this.aiError.set('');

    this.aiService.getCharacterDescription(char.id).subscribe((response) => {
      this.isLoadingAi.set(false);

      if (response.error) {
        this.aiError.set(response.error);
      } else {
        this.aiDescription.set(response.description);
        if (response.generatedAt) {
          const date = new Date(response.generatedAt);
          this.aiGeneratedAt.set(
            date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          );
        }
      }
    });
  }
}
