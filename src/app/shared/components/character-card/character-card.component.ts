import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Character } from '../../../core/models/character.model';

@Component({
  selector: 'app-character-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgOptimizedImage],
  template: `
    <a
      [routerLink]="['/character', character().id]"
      class="card"
      [attr.aria-labelledby]="'character-' + character().id"
    >
      <div class="card-image-container">
        <div class="status-indicator" [class]="statusClass()">
          <span class="status-dot"></span>
          <span>{{ character().status }}</span>
        </div>
        <img
          [ngSrc]="character().image"
          [alt]="character().name + ' character portrait'"
          width="300"
          height="300"
          class="card-image"
          priority
        />
        <div class="card-overlay">
          <div class="portal-effect"></div>
        </div>
      </div>
      <div class="card-content">
        <h3 [id]="'character-' + character().id" class="card-title">{{ character().name }}</h3>
        <div class="card-info">
          <div class="info-row">
            <span class="info-label">Species:</span>
            <span class="info-value">{{ character().species }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Gender:</span>
            <span class="info-value">{{ character().gender }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Origin:</span>
            <span class="info-value truncate">{{ character().origin.name }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Location:</span>
            <span class="info-value truncate">{{ character().location.name }}</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="episode-count">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="17,2 12,7 7,2"/>
            </svg>
            {{ character().episode.length }} episode{{ character().episode.length !== 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </a>
  `,
  styles: `
    .card {
      display: block;
      text-decoration: none;
      position: relative;
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all var(--transition-base);
      cursor: pointer;
    }

    .card:hover {
      transform: translateY(-8px);
      border-color: var(--rm-portal-green);
      box-shadow: var(--shadow-portal);
    }

    .card-image-container {
      position: relative;
      aspect-ratio: 1;
      overflow: hidden;
    }

    .status-indicator {
      position: absolute;
      top: var(--space-3);
      left: var(--space-3);
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3);
      background: var(--bg-card);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
      z-index: 2;
      text-transform: capitalize;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .status-indicator.alive .status-dot {
      background: var(--rm-portal-green);
      box-shadow: 0 0 8px var(--rm-portal-green);
    }

    .status-indicator.dead .status-dot {
      background: #ef4444;
      box-shadow: 0 0 8px #ef4444;
    }

    .status-indicator.unknown .status-dot {
      background: var(--gray-400);
      box-shadow: 0 0 8px var(--gray-400);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .card:hover .card-image {
      transform: scale(1.1);
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to top,
        rgba(10, 10, 10, 0.9) 0%,
        transparent 50%
      );
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .card:hover .card-overlay {
      opacity: 1;
    }

    .portal-effect {
      position: absolute;
      bottom: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 150%;
      height: 100%;
      background: radial-gradient(
        ellipse at center,
        rgba(151, 206, 76, 0.3) 0%,
        transparent 60%
      );
      opacity: 0;
      transition: opacity var(--transition-slow);
    }

    .card:hover .portal-effect {
      opacity: 1;
      animation: portalGlow 2s ease-in-out infinite;
    }

    @keyframes portalGlow {
      0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; }
      50% { transform: translateX(-50%) scale(1.1); opacity: 0.7; }
    }

    .card-content {
      padding: var(--space-4);
    }

    .card-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-3);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .info-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: 0.875rem;
    }

    .info-label {
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .info-value {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-footer {
      margin-top: var(--space-4);
      padding-top: var(--space-3);
      border-top: 1px solid var(--border-color);
    }

    .episode-count {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--rm-portal-cyan);
      font-size: 0.8rem;
      font-weight: 500;
    }

    .episode-count svg {
      width: 16px;
      height: 16px;
    }
  `,
})
export class CharacterCardComponent {
  readonly character = input.required<Character>();

  protected readonly statusClass = computed(() => {
    const status = this.character().status.toLowerCase();
    return status === 'alive' ? 'alive' : status === 'dead' ? 'dead' : 'unknown';
  });
}
