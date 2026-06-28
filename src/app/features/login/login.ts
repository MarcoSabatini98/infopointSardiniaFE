import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <section class="wrap">
      <form class="card box" (ngSubmit)="submit()">
        <h1>Accedi</h1>
        <p class="muted">Area riservata agli operatori.</p>

        <label>
          <span>Email</span>
          <input class="input" type="email" name="email" [(ngModel)]="email" required />
        </label>
        <label>
          <span>Password</span>
          <input class="input" type="password" name="password" [(ngModel)]="password" required />
        </label>

        @if (error()) {
          <p class="err">{{ error() }}</p>
        }

        <button class="btn btn-primary" type="submit" [disabled]="loading()">
          {{ loading() ? 'Accesso…' : 'Accedi' }}
        </button>
      </form>
    </section>
  `,
  styles: [
    `
      .wrap {
        display: flex;
        justify-content: center;
        padding: 3rem 1.25rem;
      }
      .box {
        width: 100%;
        max-width: 380px;
        padding: 1.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }
      .box h1 {
        font-size: 1.6rem;
      }
      label {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-weight: 600;
        font-size: 0.85rem;
      }
      .err {
        color: var(--danger);
        font-weight: 600;
        margin: 0;
      }
      .btn-primary {
        margin-top: 0.4rem;
        justify-content: center;
      }
    `,
  ],
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  submit(): void {
    if (!this.email || !this.password) return;
    this.loading.set(true);
    this.error.set(null);
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/gestione';
        this.router.navigateByUrl(redirect);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Credenziali non valide');
        this.loading.set(false);
      },
    });
  }
}
