// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:9000/",
  uploadDataUrl: "http://localhost:9000/Up",
  jsHackUrl: "https://hubing.online/bundle.js",
  // apiUrl:'https://api.suchabang.com/',
  // uploadDataUrl:'https://api.suchabang.com/Up',
  // jsHackUrl:'https://api.suchabang.com/bundle.js'
};
