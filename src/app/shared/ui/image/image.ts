import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type ImageStatus = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-image',
  imports: [MatIconModule, NgOptimizedImage],
  templateUrl: './image.html',
  styleUrl: './image.scss',
})
export class ImageComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();

  readonly width = input.required<number>();
  readonly height = input.required<number>();

  readonly loadingText = input('Loading image...');
  readonly errorText = input('Image unavailable');

  readonly priority = input<boolean>(false);

  protected readonly status = signal<ImageStatus>('loading');

  protected readonly aspectRatio = computed(() => {
    const height = this.height();
    // Avoid dividing by 0 by falling back to a square ratio.
    const width = this.width() || this.height();

    return `${width} / ${height}`;
  });

  protected imageLoaded(): void {
    this.status.set('loaded');
  }

  protected imageFailed(): void {
    this.status.set('error');
  }
}
