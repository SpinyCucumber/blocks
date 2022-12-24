export interface Mapping<K, V> {
    get(key: K): V;
}