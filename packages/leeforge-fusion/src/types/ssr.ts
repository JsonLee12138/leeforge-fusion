export interface SSRResult {
  html: string;
  dehydratedState: any;
  routerState: any;
  status: number;
  headers: Record<string, string>;
}
