export interface ResponsePage<T> {
  code: number;
  data: {
    records: T[];
    total: number;
    size: number;
    current: number;
    orders: [];
    optimizeCountSql: boolean;
    searchCount: boolean;
    maxLimit: number;
    countId: number;
    pages: number;
  },
  message:string
}
export interface Response<T> {
  code: number;
  data: T,
  message:string
}
