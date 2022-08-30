import fetch from "node-fetch";
import { GUI_LINK, UNMINIFY_SOUCE, VERSION } from "./constants";
import { transform } from "sucrase";
import { js_beautify as beautify } from "js-beautify";

/** 
 * The actual DeltaMath script patcher.
 */
export default class Nil {

	/** es6 convertion template (powered by sucrase) */
	public static readonly es6 = (...args: Parameters<typeof String["raw"]>) => transform(String.raw(...args), { transforms: ["typescript"] }).code;

	/** Latest unmodified main.js */
	private static latestVanillaFile : string | null = null;

	/** Latest patched main.js */
	private static latestPatchedFile : string | null = null;

	/** Latest main.js URL */
	private static latestMainJsUrl : string | null = null;

	/** Clear the main.js and patched main.js cache every 30 minutes, and the mainJsUrl cache every 10 minutes */
	static {
		setInterval(() => {
			Nil.latestVanillaFile = null;
			Nil.latestPatchedFile = null;
		}, 30*60*1000);

		setInterval(() => {
			Nil.latestMainJsUrl = null;
		}, 10*60*1000);
	};

	/** Gets the latest URL to the main.js */
	public static async getMainJsUrl () : Promise<string> {
		try {
			if (Nil.latestMainJsUrl === null) {
				console.log("getMainJsUrl - fetching new main.js");
				const FindMainJs = await (await fetch(`https://www.deltamath.com/app/`)).text();

				const mainJsUrl : string = new String("https://www.deltamath.com/app/" + FindMainJs.match(/main\..{0,40}\.js/g)).valueOf();
				Nil.latestMainJsUrl = mainJsUrl;
				return mainJsUrl;
			} else {
				console.log("getMainJsUrl - returned latestMainJsUrl");
				return Nil.latestMainJsUrl;
			}
		} catch (error : unknown) {
			console.error("getMainJsUrl - encountered error");
			throw new Error(`Could not fetch main.js url.\nReason: ${error}`);
		}
	}

	/** Gets the latest unmodified main.js file. If it isn't cached, download it. */
	public static async getFile () : Promise<string> {
		try {
			if (Nil.latestVanillaFile === null) {
				console.log("getFile - fetching new main.js");
				const mainjs = await (await fetch(await Nil.getMainJsUrl())).text();
				Nil.latestVanillaFile = mainjs;
				return mainjs;
			} else {
				console.log("getFile - returned latestVanilaFile");
				return Nil.latestVanillaFile;
			}
		} catch (error : unknown) {
			console.error("getFile - encountered error");
			throw new Error(`Could not fetch main.js file.\nReason: ${error}`);
		}
	};

	/** Applies patches to (unmodifiedFile). */
	public static patchFile (unmodifiedFile : string) : string {

			console.log("patchFile - patching main.js");


			/** patched deltamath code */
			let patched : string = unmodifiedFile;

			// Never randomize timed
			patched = patched.replaceAll(`doNotRandomize=!1`, `doNotRandomize=delta.doNotRandomize`);

			// Alert on timer start
			patched = patched.replaceAll(`function y(t){return function(e){if("__ngUnwrap__"===e)return t;!1===t(e)&&(e.preventDefault(),e.returnValue=!1)}}`, `
			function y(t) {
                return function(e) {

                    if (e.path[0].tagName === "BUTTON" && e.path[0].className === "btn btn-default timed-start-button") {
                        console.log("Timer toggle (prevent OFF)");
                    }


                    if ("__ngUnwrap__" === e) return t;
                    !1 === t(e) && (e.preventDefault(), e.returnValue = !1)
                }
            }
			`.replaceAll("\n", ""));

			// Allow escaping timed activities
			patched = patched.replaceAll(`{if($(".timed-start-button").length&&"Stop"==$(".timed-start-button").text())return alertDialog("You must stop the timer before pressing back. ");this.router.url.startsWith("/explore")?this.router.navigate(["/explore"]):this.router.url.startsWith("/student")?this.router.navigate(["/student"]):this.location.back()}`, `
			{
				/* Only happens while timer is running */

				/** Allow exiting timed problems without clicking "Stop" */
				const escape = window.delta.allowEscapingTimed;

				/** If the button says "Stop" */
				const stop = $(".timed-start-button").length && "Stop" == $(".timed-start-button").text();

				/* If escape is false and stop is true, then do this: */
				if (!escape && stop) return alertDialog("You must stop the timer before pressing back. ");

				/* Otherwise do this: */
				this.router.url.startsWith("/explore") ? this.router.navigate(["/explore"]) : this.router.url.startsWith("/student") ? this.router.navigate(["/student"]) : this.location.back()
			}
			`.replaceAll("\n", ""));




			let variables : string = "window.delta = {};";
			variables += `delta.doNotRandomize = !1;`;
			variables += `delta.allowEscapingTimed = false;`;


			const output : string = `/* main.js */
			

			${/* console.image, and ignore anti devtools */ Nil.es6`
			const _getBox=(o,t)=>({string:"+",style:"font-size: 1px; padding: 0 "+Math.floor(o/2)+"px; line-height: "+t+"px;"});
			console.image=((o,t=1)=>{const e=new Image;e.onload=(()=>{const n=_getBox(e.width*t,e.height*t);
			console.log("%c"+n.string,n.style+"background: url("+o+"); background-size: "+e.width*t+"px "
			+e.height*t+"px; color: transparent;")}),e.src=o});
			const oldLog = console.log.bind(console);
			console.log = (...d) => {
				if (d && d.length && typeof d[0] === "string" && d[0].includes("This is a browser feature for developers only")) return "lol no";
				return oldLog(...d);
			};
			`}

			${/** Add accesors */ variables}

			
	

			${/* Add the main patched file */ patched}
		
			${Nil.es6`
			console.log("%cNil", "font-size:69px;color:#540052;font-weight:900;font-family:sans-serif;");
			console.log("%cVersion ${VERSION}", "font-size:20px;color:#000025;font-weight:700;font-family:sans-serif;");
			
			/* Load the Delta Math Cheat GUI */
			(async () => {
				await new Promise(r => setTimeout(r, 5000));
				await eval(await (await fetch("${GUI_LINK}")).text());
			})();

			console.trace = () => {};
			`}

		`;

		return output.replaceAll("\n", "");
	
	};

	/** Gets the latest patched main.js file. If it isn't cached, patch it now. */
	public static async getPatchedFile () : Promise<string> {
		if (Nil.latestPatchedFile !== null) {
			console.log("getPatchedFile - returned lastPatchedFile");
			return Nil.latestPatchedFile;
		} else {
			console.log("getPatchedFile - patching main.js now...");
			const patchedfile = await (await Nil.patchFile(Nil.latestVanillaFile || (await (Nil.getFile())).valueOf())).valueOf();
			Nil.latestPatchedFile = patchedfile;
			return (UNMINIFY_SOUCE) ? beautify(patchedfile) : patchedfile;
		}
	}
	
}
