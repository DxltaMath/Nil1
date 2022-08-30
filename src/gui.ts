// sorry if the name of the file decieves you, this isn't a GUI for Nil
// this is the dGUI cache on the Nil server.

import { GUI_LINK } from "./constants";

/** a thing that caches the latest dGUI */
export default class dGUI {

    /** latest dGUI cache */
    private static latestdGui : string | null = null;

    /** Clear the dGUI bundle.js cache every 20 minutes */
	static {
		setInterval(() => {
			dGUI.latestdGui = null;
		}, 20*60*1000);
	};


    public static async getLatestGui () {
        try {
			if (dGUI.latestdGui === null) {
				console.log("getLatestGui - fetching new bundle");
				const bundle = await (await fetch(GUI_LINK)).text();
				dGUI.latestdGui = bundle;
				return bundle;
			} else {
				console.log("getLatestGui - returned latestdGui");
				return dGUI.latestdGui;
			}
		} catch (error : unknown) {
			console.error("getLatestGui - encountered error");
			throw new Error(`Could not get latest dGUI.\nReason: ${error}`);
		}
    }

}