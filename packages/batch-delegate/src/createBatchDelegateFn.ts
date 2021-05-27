import DataLoader from 'dataloader';

import { CreateBatchDelegateFnOptions, BatchDelegateOptionsFn, BatchDelegateFn } from './types';

import { getLoader } from './getLoader';

export function createBatchDelegateFn<K = any, V = any, C = K>(
  optionsOrArgsFromKeys: CreateBatchDelegateFnOptions | ((keys: ReadonlyArray<K>) => Record<string, any>),
  lazyOptionsFn?: BatchDelegateOptionsFn,
  dataLoaderOptions?: DataLoader.Options<K, V, C>,
): BatchDelegateFn<K> {
  return typeof optionsOrArgsFromKeys === 'function'
    ? createBatchDelegateFnImpl({
        argsFromKeys: optionsOrArgsFromKeys,
        lazyOptionsFn,
        dataLoaderOptions,
      })
    : createBatchDelegateFnImpl(optionsOrArgsFromKeys);
}

function createBatchDelegateFnImpl<K = any>(options: CreateBatchDelegateFnOptions): BatchDelegateFn<K> {
  return batchDelegateOptions => {
    const loader = getLoader({
      ...options,
      ...batchDelegateOptions,
    });
    return loader.load(batchDelegateOptions.key);
  };
}
