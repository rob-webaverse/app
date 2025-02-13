import {createObjectSprite} from './object-spriter.js';
import {OffscreenEngine} from './offscreen-engine.js';

class SpritesheetManager {
  constructor() {
    this.spritesheetCache = new Map();
    this.offscreenEngine = new OffscreenEngine();
    this.getSpriteSheetForAppUrlInternal = this.offscreenEngine.createFunction([
      `\
      import {createObjectSpriteAsync} from './object-spriter.js';
      import metaversefile from './metaversefile-api.js';
      `,
      async function(appUrl, opts) {
        const app = await metaversefile.createAppAsync({
          start_url: appUrl,
        });
        const spritesheet = await createObjectSpriteAsync(app, opts);
        return spritesheet;
      }
    ]);
  }
  getSpriteSheetForApp(app) {
    let spritesheet = this.spritesheetCache.get(app.contentId);
    if (!spritesheet) {
      spritesheet = createObjectSprite(app);
      this.spritesheetCache.set(app.contentId, spritesheet);
    }
    return spritesheet;
  }
  async getSpriteSheetForAppUrlAsync(appUrl, opts) {
    let spritesheet = this.spritesheetCache.get(appUrl);
    if (!spritesheet) {
      spritesheet = await this.getSpriteSheetForAppUrlInternal(appUrl, opts);
      this.spritesheetCache.set(appUrl, spritesheet);
    }
    return spritesheet;
  }
}
const spritesheetManager = new SpritesheetManager();

export default spritesheetManager;