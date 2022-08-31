import fs from "fs";
import path from "path";

/*-----------------------------------------------*
 *                                               *
 *                   CONSTANTS                   *
 *                                               *
 ------------------------------------------------*/


/** Override your own DMIx version here, if not, Nil will use the latest DMIx version. (updated manually by DxltaMath admins)
 * CAUTION: DMIx will prompt to update if the version does not math this one's version. */
export const VERSION : string = "" || "0.0.2";

/** Replace 0 with your own server port here, if not it'll default to 80.
 * CAUTION: Remeber that server port 80 is the default http port, and port 443 is the default HTTPS port. */
 export const HTTP_PORT : number = 0 || 80;

/** Override your own dGUI bundle URL here, if not, Nil will use the official dGUI URL. (controlled by DxltaMath admins)
 * CAUTION: dGUIs have complete access. Only use dGUIs that you trust. */
export const GUI_LINK : string = "" || "https://raw.githubusercontent.com/DxltaMath/dGUI/master/dist/bundle.js";

/** Set this to true if you would like to unminify main.js
 * CAUTION: this will HEAVILY increase the filesize of main.js- use for debugging ONLY. */
export const UNMINIFY_SOUCE : boolean = false;

/** Set this to true if you are overriding the contents of main.js to modify it manually
 * CAUTION: This removes the main functionality of Nil, use this for development only. */
export const OVERRIDE : string | null = null; // fs.readFileSync(path.resolve(__dirname, "../html/main.js"), "utf8").valueOf();

/** Insert your own contents of index.html here, if not Nil's normal index.html will be used.
 * CAUTION: Remember that this is the exported main page of the site. Be wise. */
export const INDEX_HTML : string = "" || fs.readFileSync(path.resolve(__dirname, "../html/index.html"), "utf8").valueOf();
 
/** Insert your own contents of style.css here, if not Nil's normal style.css will be used.
 * CAUTION: This is exported at `<site>/style.css`. Remember to insert a stylesheet link in index.html to use this. */
export const STYLE_CSS : string = "" || fs.readFileSync(path.resolve(__dirname, "../html/style.css"), "utf8").valueOf();
 
/** Override your own License links here, otherwise DxltaMath's licenece repo will be used
 * CAUTION: If you license is incompatible with ours, then you are violating our license and may not use DxltaMath software. */
export const LICENSE_LINK : string = "" || "https://github.com/DxltaMath/license";

/** Override your own DMIx link here, otherwise DxltaMath's DMIx extension.zip will be used
 * CAUTION: Only use extensions you competley trust - they have full access  */
export const DOWNLOAD_LINK : string = "" || "https://github.com/DxltaMath/DMIx/raw/master/build/extension.zip";



/*-----------------------------------------------*
 *                                               *
 *                     HTTPS                     *
 *                                               *
 ------------------------------------------------*/

/** Set this to true if you are not using a proxy, and need to use HTTPS included in Nil.
 * CAUTION: Remember to set HTTPS_KEY_PATH and HTTPS_CHAIN_PATH to your SSL certificate. */
export const HTTPS : boolean = false;

/** Insert your own path to the privatekey.pem SSL certificate here. If not, Nil's default one will be used.
 * CAUTION: Remember to use the full path, and change this to YOUR DOMAIN's SSL Certificate. DO NOT LEAK THIS FILE. */
export const HTTPS_KEY_PATH : string = "" || "comingSoonLmao";

/** Insert your own path to the fullchain.pem SSL certificate here. If not, Nil's default one will be used.
 * CAUTION: Remember to use the full path, and change this to YOUR DOMAIN's SSL Certificate. */
export const HTTPS_CHAIN_PATH : string = "" || "comingSoonLmao"; 

/** Replace 0 with your own server port here, if not it'll default to 443.
 * CAUTION: Remeber that server port 80 is the default http port, and port 443 is the default HTTPS port. */
export const HTTPS_PORT : number = 0 || 443;
