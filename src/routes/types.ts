import React from 'react';
import type { Role } from '../lib/types';

export type RouteScope = 'shared' | 'customer' | 'partner' | 'admin';

export interface RouteManifestItem {
  path: string;
  scope: RouteScope;
  component?: React.LazyExoticComponent<React.ComponentType<any>>;
  roles?: Role[];
  title: string;
  redirectTo?: string;
}
