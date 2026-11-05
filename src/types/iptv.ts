export interface Channel {
  id: string;
  number: number;
  title: string;
  group: string;
  logo: string;
  url: string;
  tvgId?: string;
  tvgName?: string;
  resolution?: string;
  isCustom?: boolean;
}

export type ViewMode = 'grid' | 'list';
export type AspectRatioMode = 'contain' | 'cover' | 'fill';

export interface PlaylistPreset {
  id: string;
  name: string;
  description: string;
  url: string;
  badge?: string;
  isBdix?: boolean;
}
