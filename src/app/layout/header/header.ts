import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="hdr">
      <a routerLink="/" class="brand">
        <span class="mark" aria-hidden="true">iS</span>
        <span class="name">infopoint <strong>Sardegna</strong></span>
      </a>

      <nav class="nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          Dashboard
        </a>
        <a routerLink="/meteo" routerLinkActive="active">Meteo</a>
        <a routerLink="/incendi" routerLinkActive="active">Incendi</a>
        <a routerLink="/traffico" routerLinkActive="active">Traffico</a>
        <a routerLink="/voli" routerLinkActive="active">Voli</a>
        <a routerLink="/navi" routerLinkActive="active">Navi</a>
        <a routerLink="/news" routerLinkActive="active">News</a>
        <a routerLink="/eventi" routerLinkActive="active">Eventi</a>
        @if (session.isAuthenticated()) {
          <a routerLink="/gestione" routerLinkActive="active">Gestione</a>
        }
      </nav>

      <div class="actions">
        @if (session.isAuthenticated()) {
          <span class="muted who">{{ session.user()?.nome }}</span>
          <button class="btn btn-ghost" type="button" (click)="logout()">Esci</button>
        } @else {
          <a routerLink="/login" class="btn btn-primary">Accedi</a>
        }
      </div>
    </header>
  `,
  styles: [
    `
      .hdr {
        display: flex;
        align-items: center;
        gap: 1.25rem;
        padding: 0.6rem 1.1rem;
        background: oklch(1 0 0 / 0.85);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--line);
        position: sticky;
        top: 0;
        z-index: var(--z-sticky);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 0.55rem;
        color: var(--ink);
        font-size: var(--text-md);
        font-weight: 700;
        letter-spacing: -0.01em;
      }
      .brand:hover {
        text-decoration: none;
      }
      .mark {
        display: grid;
        place-items: center;
        width: 1.7rem;
        height: 1.7rem;
        border-radius: 8px;
        background: var(--sea);
        color: #fff;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: -0.02em;
      }
      .name {
        font-weight: 500;
        color: var(--ink-soft);
      }
      .name strong {
        color: var(--ink);
        font-weight: 700;
      }
      .nav {
        display: flex;
        gap: 0.15rem;
        margin-left: 0.5rem;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .nav::-webkit-scrollbar {
        display: none;
      }
      .nav a {
        white-space: nowrap;
      }
      .nav a {
        color: var(--ink-soft);
        font-weight: 600;
        font-size: var(--text-sm);
        padding: 0.4rem 0.7rem;
        border-radius: var(--radius-sm);
      }
      .nav a:hover {
        color: var(--ink);
        background: var(--surface-2);
        text-decoration: none;
      }
      .nav a.active {
        color: var(--sea-strong);
        background: var(--sea-tint);
      }
      .actions {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .who {
        font-weight: 600;
        font-size: var(--text-sm);
      }
      @media (max-width: 640px) {
        .who {
          display: none;
        }
      }
    `,
  ],
})
export class Header {
  protected readonly session = inject(SessionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout().subscribe({ complete: () => this.router.navigate(['/']) });
  }
}
