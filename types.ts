
export interface Delegate {
  id: string;
  isla: string;
  nCentro: string;
  comite: number;
  ccoo: number;
  ugt: number;
  sb: number;
  otros: number;
}

export type UnionKey = 'ccoo' | 'ugt' | 'sb' | 'otros';
