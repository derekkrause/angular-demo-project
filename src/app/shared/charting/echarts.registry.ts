import { InjectionToken } from '@angular/core';
// Import the echarts core module, which provides the necessary interfaces for using echarts
// https://echarts.apache.org/handbook/en/basics/import/
import * as echarts from 'echarts/core';

// Import charts used in this application, all suffixed with 'Chart'.
import { BarChart } from 'echarts/charts';

// Import the title, tooltip, rectangular coordinate system, dataset and transform components.
import {
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';

// Features
import { LabelLayout, UniversalTransition } from 'echarts/features';

// Import the CanvasRenderer (or SVGRenderer). Required step.
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  // Charts
  BarChart,

  // Components
  DatasetComponent,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,

  // Features
  LabelLayout,
  UniversalTransition,

  // Renderer
  CanvasRenderer,
]);

export { echarts };

export const ECHARTS_INIT = new InjectionToken<typeof echarts.init>('ECHARTS_INIT', {
  providedIn: 'root',
  factory: () => echarts.init,
});
