import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageComponent } from './image';

describe('Image outcomes', () => {
  let fixture: ComponentFixture<ImageComponent>;
  const element = (): HTMLElement => fixture.nativeElement as HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ImageComponent] }).compileComponents();
    fixture = TestBed.createComponent(ImageComponent);
    fixture.componentRef.setInput('src', 'recall_logo.svg');
    fixture.componentRef.setInput('alt', 'RecallOps logo');
    fixture.componentRef.setInput('width', 40);
    fixture.componentRef.setInput('height', 48);
    fixture.detectChanges();
  });
  it('shows a loading placeholder and preserves the image description', () => {
    expect(element().querySelector('[role="status"]')?.textContent).toContain('Loading image');
    expect(element().querySelector('img')?.alt).toBe('RecallOps logo');
  });
  it('removes the placeholder after the image loads', () => {
    element().querySelector('img')!.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(element().querySelector('[role="status"]')).toBeNull();
    expect(element().querySelector('img')).not.toBeNull();
  });
  it('replaces a broken image with an accessible error message', () => {
    element().querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(element().querySelector('img')).toBeNull();
    expect(element().querySelector('[role="status"]')?.textContent).toContain('Image unavailable');
  });
});
