import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container not-found">
      <span class="code">404</span>
      <h1>We couldn't find that page</h1>
      <p>The link may be broken or the page may have moved.</p>
      <a class="btn btn--primary" routerLink="/">Browse homes</a>
    </div>
  `,
  styles: `
    .not-found { display: grid; justify-items: center; gap: 8px; padding: 96px 16px; text-align: center; }
    .code { color: var(--primary); font-size: 3.5rem; font-weight: 800; letter-spacing: -0.04em; }
    h1 { margin: 0; font-size: 1.6rem; }
    p { margin: 0 0 16px; color: var(--text-muted); }
  `,
})
export class NotFoundPage {}
