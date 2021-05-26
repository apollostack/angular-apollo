import {Injectable} from '@angular/core';
import {DocumentNode} from 'graphql';
import {ApolloQueryResult} from '@apollo/client/core';
import {TypedDocumentNode} from '@graphql-typed-document-node/core';
import {Observable} from 'rxjs';

import {Apollo} from './apollo';
import {QueryRef} from './query-ref';
import {WatchQueryOptionsAlone, QueryOptionsAlone, EmptyObject} from './types';

@Injectable()
export class Query<T = {}, V = EmptyObject> {
  public readonly document: DocumentNode | TypedDocumentNode<T, V>;
  public client = 'default';

  constructor(protected apollo: Apollo) {}

  public watch(
    variables?: V,
    options?: WatchQueryOptionsAlone<V, T>,
  ): QueryRef<T, V> {
    return this.apollo.use(this.client).watchQuery<T, V>({
      ...options,
      variables,
      query: this.document,
    });
  }

  public fetch(
    variables?: V,
    options?: QueryOptionsAlone<V, T>,
  ): Observable<ApolloQueryResult<T>> {
    return this.apollo.use(this.client).query<T, V>({
      ...options,
      variables,
      query: this.document,
    });
  }
}
