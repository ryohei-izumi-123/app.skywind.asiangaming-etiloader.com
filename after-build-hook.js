'use strict';
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
/**
 *
 *
 * @private
 * @description event handler when build(pack) is done
 * @param {{ outDir: string; appOutDir: string; packager: { config: any; appInfo: { productFilename: string; }; platform: { name: string }; }; electronPlatformName: string; arch: number; targets: ({name: string; isAsyncSupported: boolean; outDir: string; options: any; checkOptions: () => any; build: () => any; finishBuild: () => any;})[]; }} context
 */
exports.default = async context => {
  const config = context.packager.config;
  const env = _.get(config, 'extraMetadata.builder_env');
  const message = `[AFTER BUILD HOOK] ENV=${env} PROCESS_ENV=${process.env.NODE_ENV} APP_NAME=${context.packager.appInfo.productFilename} APP_OUT_DIR=${context.appOutDir} PLATFORM=${context.packager.platform.name} ELECTRON_PLATFORM_NAME=${context.electronPlatformName}`;
  console.info(message, context);

  return Promise.resolve(message);
};
