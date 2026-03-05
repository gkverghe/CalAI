'use client';

import useSWR from 'swr';
import { DailySummary } from '@/types';
import { getTodayString } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useDailySummary(date?: string) {
  const d = date ?? getTodayString();
  const { data, error, mutate, isLoading } = useSWR<DailySummary>(
    `/api/daily-summary?date=${d}`,
    fetcher
  );

  return {
    summary: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
