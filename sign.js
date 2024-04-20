const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const TEMP_DIR = path.join(__dirname, 'dist', 'win32', 'temp');

fs.mkdirSync(TEMP_DIR, { recursive: true });

function sign(configuration) {
  const USER_NAME = process.env.WINDOWS_SIGN_USER_NAME;
  const USER_PASSWORD = process.env.WINDOWS_SIGN_USER_PASSWORD;
  const CREDENTIAL_ID = process.env.WINDOWS_SIGN_CREDENTIAL_ID;
  const USER_TOTP = process.env.WINDOWS_SIGN_USER_TOTP;
  if (USER_NAME && USER_PASSWORD && USER_TOTP && CREDENTIAL_ID) {
    console.log(`Signing ${configuration.path}`);
    const { base, dir } = path.parse(configuration.path);
    const tempFile = path.join(TEMP_DIR, base);
    const setDir = `cd "..\\"`;
    const signFile = `CodeSignTool.bat sign -input_file_path="${configuration.path}" -output_dir_path="${TEMP_DIR}" -credential_id="${CREDENTIAL_ID}" -username="${USER_NAME}" -password="${USER_PASSWORD}" -totp_secret="${USER_TOTP}"`;
    const moveFile = `mv "${tempFile}" "${dir}"`;
    childProcess.execSync(`${setDir} && ${signFile} && ${moveFile}`, {
      stdio: 'inherit',
    });
  } else {
    console.warn(`sign.js - Can't sign file ${
      configuration.path
    }, missing value for:
${USER_NAME ? '' : 'WINDOWS_SIGN_USER_NAME'}
${USER_PASSWORD ? '' : 'WINDOWS_SIGN_USER_PASSWORD'}
${CREDENTIAL_ID ? '' : 'WINDOWS_SIGN_CREDENTIAL_ID'}
${USER_TOTP ? '' : 'WINDOWS_SIGN_USER_TOTP'}
`);
    process.exit(1);
  }
}

exports.default = sign;
