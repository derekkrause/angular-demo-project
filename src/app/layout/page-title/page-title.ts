import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ImageComponent } from '@shared/ui/image/image';

@Component({
  selector: 'app-page-title',
  imports: [ImageComponent, RouterLink],
  templateUrl: './page-title.html',
  styleUrl: './page-title.scss',
})
export class PageTitle {
  protected readonly titleImageSrc = '/recall_logo.svg';
}
