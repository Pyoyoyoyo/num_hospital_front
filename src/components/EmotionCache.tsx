// num_hospital/src/components/EmotionCache.tsx
'use client';
import * as React from 'react';
import type { EmotionCache, Options as EmotionCacheOptions } from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';

// This implementation is taken directly from Material UI's documentation
// https://mui.com/material-ui/guides/nextjs-app-router/
export interface NextAppDirEmotionCacheProviderProps {
  options: Omit<EmotionCacheOptions, 'insertionPoint'>;
  CacheProvider?: React.Provider<EmotionCache>;
  children: React.ReactNode;
}

// Mock context if needed, otherwise import from @emotion/react
// import { CacheProvider as EmotionCacheContext } from '@emotion/react';
const EmotionCacheContext = React.createContext<EmotionCache | null>(null);


export default function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps) {
  const { options, CacheProvider = EmotionCacheContext.Provider, children } = props;

  const [registry] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = registry.flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += registry.cache.inserted[name];
    }
    return (
      <style
        key={registry.cache.key}
        data-emotion={`${registry.cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}