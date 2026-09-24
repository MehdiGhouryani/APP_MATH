import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { ContentManifest, ContentPackageDescriptor, EntitlementCheck } from '@math/contracts';
import { supabaseRestSelect, supabaseRpc } from './supabase-http';

function resolveFixtureFile(subpath: string): string {
  const candidates = [
    path.resolve(process.cwd(), '..', '..', 'content', subpath),
    path.resolve(process.cwd(), 'content', subpath),
    path.resolve(process.cwd(), 'apps', 'web', '..', '..', 'content', subpath),
  ];
  for (const candidate of candidates) {
    if (fsSync.existsSync(/*turbopackIgnore: true*/ candidate)) {
      return candidate;
    }
  }
  return candidates[0]!;
}

const fixtures = [
  {
    id: 'dev-g1-st01-v2', gradeId: 'G1', stationId: 'G1-ST01', packageCode: 'G1-ST01', version: '1.1.0-staging',
    file: resolveFixtureFile('dev-packs/g1-st01-v2/package.json'), cacheClass: 'CURRENT' as const,
    sequence: 1, prefetchRank: 1,
  },
  {
    id: 'dev-g1-st02-v1', gradeId: 'G1', stationId: 'G1-ST02', packageCode: 'G1-ST02', version: '0.1.0-dev',
    file: resolveFixtureFile('dev-packs/g1-st01-v1/next-stub.json'), cacheClass: 'NEXT' as const,
    sequence: 2, prefetchRank: 1,
  },
];

type DbPackage = {
  id: string;
  grade_id: string;
  station_id: string | null;
  package_code: string;
  version: string;
  checksum: string;
  bytes: number;
  min_app_version: string | null;
  release_channel: 'STABLE' | 'BETA' | 'DEV';
  status: 'DRAFT' | 'ACTIVE' | 'RETIRED';
};

type DbPackageItem = { content_version_id: string; required: boolean; ordinal: number };
type DbManifestItem = { package_id: string; cache_class: 'CURRENT' | 'NEXT' | 'RECENT' | 'FUTURE'; sequence: number; prefetch_rank: number | null };

async function descriptor(item: (typeof fixtures)[number]): Promise<ContentPackageDescriptor> {
  const bytes = await fs.readFile(item.file);
  const checksum = crypto.createHash('sha256').update(bytes).digest('hex');
  const pkg = JSON.parse(bytes.toString('utf8')) as { items?: Array<{ contentVersionId: string; required?: boolean; ordinal?: number }> };
  return {
    id: item.id, gradeId: item.gradeId, stationId: item.stationId, packageCode: item.packageCode, version: item.version,
    checksum, bytes: bytes.length, cacheClass: item.cacheClass, sequence: item.sequence, prefetchRank: item.prefetchRank,
    downloadUrl: `/api/v1/content/packages/${item.id}`,
    items: (pkg.items ?? []).map((x, ordinal) => ({ contentVersionId: x.contentVersionId, required: x.required ?? true, ordinal: x.ordinal ?? ordinal })),
    minAppVersion: '0.1.0', releaseChannel: 'DEV', status: 'ACTIVE',
  };
}

async function dbManifest(gradeId: string, accessToken: string): Promise<ContentManifest> {
  const manifests = await supabaseRestSelect<{ id: string; version: string; generated_at: string }>(accessToken, 'content_manifests', {
    grade_id: `eq.${gradeId}`,
    status: 'eq.ACTIVE',
    order: 'generated_at.desc',
    limit: '1',
  });
  const manifest = manifests[0];
  if (!manifest) throw new Error('CONTENT_MANIFEST_NOT_FOUND');
  const items = await supabaseRestSelect<DbManifestItem>(accessToken, 'content_manifest_items', {
    manifest_id: `eq.${manifest.id}`,
    select: 'package_id,cache_class,sequence,prefetch_rank',
    order: 'sequence.asc',
  });
  const ids = items.map((x) => x.package_id);
  if (ids.length === 0) {
    return { manifestVersion: manifest.version, gradeId, generatedAt: manifest.generated_at, current: [], next: [], recent: [], future: [] };
  }
  const packages = await supabaseRestSelect<DbPackage>(accessToken, 'content_packages', {
    id: `in.(${ids.join(',')})`,
    status: 'eq.ACTIVE',
    select: 'id,grade_id,station_id,package_code,version,checksum,bytes,min_app_version,release_channel,status',
  });
  const byId = new Map(packages.map((x) => [x.id, x]));
  const refs = items.map((item) => {
    const pkg = byId.get(item.package_id);
    if (!pkg) throw new Error(`CONTENT_PACKAGE_MISSING:${item.package_id}`);
    return {
      id: pkg.id,
      gradeId: pkg.grade_id,
      stationId: pkg.station_id,
      packageCode: pkg.package_code,
      version: pkg.version,
      checksum: pkg.checksum,
      bytes: Number(pkg.bytes),
      cacheClass: item.cache_class,
      sequence: Number(item.sequence),
      prefetchRank: item.prefetch_rank === null ? null : Number(item.prefetch_rank),
      downloadUrl: `/api/v1/content/packages/${pkg.id}`,
    } satisfies ContentManifest['current'][number];
  });
  return {
    manifestVersion: manifest.version,
    gradeId,
    generatedAt: manifest.generated_at,
    current: refs.filter((x) => x.cacheClass === 'CURRENT'),
    next: refs.filter((x) => x.cacheClass === 'NEXT'),
    recent: refs.filter((x) => x.cacheClass === 'RECENT'),
    future: refs.filter((x) => x.cacheClass === 'FUTURE'),
  };
}

async function dbPackage(packageId: string, accessToken: string): Promise<{ descriptor: ContentPackageDescriptor; bytes: Buffer } | null> {
  const packages = await supabaseRestSelect<DbPackage>(accessToken, 'content_packages', {
    id: `eq.${packageId}`,
    status: 'eq.ACTIVE',
    select: 'id,grade_id,station_id,package_code,version,checksum,bytes,min_app_version,release_channel,status',
    limit: '1',
  });
  const pkg = packages[0];
  if (!pkg) return null;
  const items = await supabaseRestSelect<DbPackageItem>(accessToken, 'content_package_items', {
    package_id: `eq.${packageId}`,
    select: 'content_version_id,required,ordinal',
    order: 'ordinal.asc',
  });
  const mappedItems = items.map((x) => ({ contentVersionId: x.content_version_id, required: x.required, ordinal: x.ordinal }));
  const payload = {
    schema: 'math-content-package/v1',
    environment: 'STAGING_ONLY',
    gradeId: pkg.grade_id,
    stationId: pkg.station_id,
    packageVersion: pkg.version,
    items: mappedItems,
  };
  const bytes = Buffer.from(`${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  const checksum = crypto.createHash('sha256').update(bytes).digest('hex');
  if (checksum !== pkg.checksum || bytes.length !== Number(pkg.bytes)) throw new Error('CONTENT_PACKAGE_CHECKSUM_MISMATCH');
  const cacheClass: ContentManifest['current'][number]['cacheClass'] = 'CURRENT';
  return {
    descriptor: {
      id: pkg.id,
      gradeId: pkg.grade_id,
      stationId: pkg.station_id,
      packageCode: pkg.package_code,
      version: pkg.version,
      checksum,
      bytes: bytes.length,
      cacheClass,
      sequence: 1,
      prefetchRank: 1,
      downloadUrl: `/api/v1/content/packages/${pkg.id}`,
      items: mappedItems,
      minAppVersion: pkg.min_app_version,
      releaseChannel: pkg.release_channel,
      status: pkg.status,
    },
    bytes,
  };
}

export async function getManifest(gradeId: string, accessToken?: string): Promise<ContentManifest> {
  if (process.env.NODE_ENV === 'production') {
    if (!accessToken) throw new Error('AUTH_BEARER_REQUIRED');
    return dbManifest(gradeId, accessToken);
  }
  const packages = await Promise.all(fixtures.filter(x => x.gradeId === gradeId).map(descriptor));
  return {
    manifestVersion: 'dev-2', gradeId, generatedAt: new Date().toISOString(),
    current: packages.filter(p => p.cacheClass === 'CURRENT'), next: packages.filter(p => p.cacheClass === 'NEXT'),
    recent: packages.filter(p => p.cacheClass === 'RECENT'), future: packages.filter(p => p.cacheClass === 'FUTURE'),
  };
}

export async function getPackage(packageId: string, accessToken?: string): Promise<{ descriptor: ContentPackageDescriptor; bytes: Buffer } | null> {
  if (process.env.NODE_ENV === 'production') {
    if (!accessToken) throw new Error('AUTH_BEARER_REQUIRED');
    return dbPackage(packageId, accessToken);
  }
  const fixture = fixtures.find(x => x.id === packageId);
  if (!fixture) return null;
  const bytes = await fs.readFile(fixture.file);
  return { descriptor: await descriptor(fixture), bytes };
}

export async function checkEntitlement(packageId: string, learningIdentityId: string | null, accessToken?: string): Promise<EntitlementCheck> {
  if (process.env.NODE_ENV === 'production') {
    if (!accessToken) throw new Error('AUTH_BEARER_REQUIRED');
    if (!learningIdentityId) return { packageId, entitled: false, source: null, expiresAt: null, reason: 'NOT_ENTITLED' };
    const entitled = await supabaseRpc<boolean>(accessToken, 'can_access_content_package', {
      p_package_id: packageId,
      p_learning_identity_id: learningIdentityId,
    });
    return { packageId, entitled: Boolean(entitled), source: entitled ? 'OTHER' : null, expiresAt: null, reason: entitled ? 'ACTIVE' : 'NOT_ENTITLED' };
  }
  if (!learningIdentityId) return { packageId, entitled: false, source: null, expiresAt: null, reason: 'NOT_ENTITLED' };
  return { packageId, entitled: true, source: 'DEV_GRANT', expiresAt: null, reason: 'ACTIVE' };
}
