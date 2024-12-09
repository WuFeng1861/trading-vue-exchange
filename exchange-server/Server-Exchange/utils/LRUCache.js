export class LRUCache {
    #cache;
    #len;
    constructor(len) {
        this.#len = len;
        this.#cache = new Map();
    }
    has(key) {
        return this.#cache.has(key);
    }
    get(key) {
        // 没有返回null
        if(!this.#cache.has(key)) {
            return null;
        }
        // 有的话，先取出来，然后删除再放进去
        const value = this.#cache.get(key);
        this.#cache.delete(key);
        this.#cache.set(key, value);
        return value;
    }

    set(key, value) {
        // 如果存在 就先删除再设置，保证在最后面
        if(this.#cache.has(key)) {
            this.#cache.delete(key);
        }
        this.#cache.set(key, value);
        // 不存在则先判定是否超出长度， 超出长度则先删除第一项
        if(this.#cache.size > this.#len) {
            this.#cache.delete(this.#cache.keys().next().value);
        }
    }
}
