import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere } from 'typeorm';

export type FindParams<T> = {
  where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  select?: FindOptionsSelect<T>;
  relations?: string[];
  order?: FindOptionsOrder<T>;
  limit?: number;
  page?: number;
};

export type FindOneParams<T> = Omit<FindParams<T>, 'limit' | 'page' | 'order'>;
