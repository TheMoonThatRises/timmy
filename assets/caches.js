import Persistence from './persistence.js';

export const eventMessageCache = new Persistence('./caches/eventMessageCache');
export const voteScrimTypeCache = new Persistence('./caches/voteScrimTypeCache');
export const mapPickBanSideSelectCache = new Persistence('./caches/mapPickBanSideSelectCache');
export const imageCache = new Persistence('./caches/imageCache');
export const scrimInfoCache = new Persistence('./caches/scrimInfoCache');
