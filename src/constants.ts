import fs from "fs";
import path from "path";

/*-----------------------------------------------*
 *                                               *
 *                   CONSTANTS                   *
 *                                               *
 ------------------------------------------------*/


/** Override your own DMIx version here, if not, Nil will use the latest DMIx version. (updated manually by DxltaMath admins)
 * CAUTION: DMIx will prompt to update if the version does not math this one's version. */
export const VERSION : string = "" || "0.0.1";

/** Override your own dGUI bundle URL here, if not, Nil will use the official dGUI URL. (controlled by DxltaMath admins)
 * CAUTION: dGUIs have complete access. Only use dGUIs that you trust. */
export const GUI_LINK : string = "" || "SoonTM lol";

/** Insert your own contents of index.html here, if not Nil's normal index.html will be used.
 * CAUTION: Remember that this is the exported main page of the site. Be wise. */
export const INDEX_HTML : string = "" || fs.readFileSync(path.resolve(__dirname, "../html/index.html"), "utf8").valueOf();
 
/** Insert your own contents of style.css here, if not Nil's normal style.css will be used.
 * CAUTION: This is exported at `<site>/style.css`. Remember to insert a stylesheet link in index.html to use this. */
export const STYLE_CSS : string = "" || fs.readFileSync(path.resolve(__dirname, "../html/style.css"), "utf8").valueOf();
 
/** Replace 0 with your own server port here, if not it'll default to 80.
 * CAUTION: Remeber that server port 80 is the default http port, and port 443 is the default HTTPS port. */
export const HTTP_PORT : number = 0 || 80;


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