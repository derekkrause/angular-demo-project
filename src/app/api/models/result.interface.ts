import { Meta } from '@api/models/meta.interface';

export interface Result<T> {
  meta: Meta;
  results: T[];
}
