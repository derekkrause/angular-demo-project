import { Meta } from '@api/models/meta.interface';

export interface IResult<T> {
  meta: Meta;
  results: T[];
}
