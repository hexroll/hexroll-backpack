require('dotenv').config();
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.hexroll.backpack',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    teamId: process.env.APPLETEAMID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
};
