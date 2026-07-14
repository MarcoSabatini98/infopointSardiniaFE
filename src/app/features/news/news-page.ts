import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FeedsService } from '../../core/services/feeds.service';
import { NewsItem } from '../../core/models/feeds.models';

@Component({
  selector: 'app-news-page',
  imports: [DatePipe],
  templateUrl: './news-page.html',
  styleUrl: './news-page.css',
})
export class NewsPage {
  private readonly feeds = inject(FeedsService);

  protected readonly items = signal<NewsItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly today = new Date();

  protected readonly lead = computed(() => this.items()[0] ?? null);
  protected readonly secondary = computed(() => this.items().slice(1, 4));
  protected readonly rest = computed(() => this.items().slice(4));

  constructor() {
    this.feeds.news(60).subscribe({
      next: (d) => this.items.set(d.items),
      complete: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }
}
