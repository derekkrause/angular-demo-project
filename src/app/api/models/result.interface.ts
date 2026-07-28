import { Meta } from '@api/models/meta.interface';
import { TermCount } from '@api/models/term-count.interface';

export interface IResult {
  meta: Meta;
  results: TermCount[];
}
