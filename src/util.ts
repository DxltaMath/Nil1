import fetch from "node-fetch";
import { GUI_LINK, VERSION } from "./constants";
import displayImages from "./displayImages";
import { transform } from "sucrase";


export default class Nil {
	/** es6 convertion template (powered by sucrase) */
	public static readonly es6 = (...args: Parameters<typeof String["raw"]>) => transform(String.raw(...args), { transforms: ["typescript"] }).code;

	/** Latest unmodified main.js */
	private static latestVanillaFile : string | null = null;

	/** Latest patched main.js */
	private static latestPatchedFile : string | null = null;

	/** Clear the main.js and patched main.js cache every 30 minutes */
	static {
		setInterval(() => {
			Nil.latestVanillaFile = null;
			Nil.latestPatchedFile = null;
		}, 30*60*1000);
	};

	/** Gets the latest unmodified main.js file. If it isn't cached, download it. */
	public static async getFile () : Promise<string> {
		try {
			if (Nil.latestVanillaFile === null) {
				const mainjs = await (await fetch(`https://www.deltamath.com/app/main.761406757919c0973f71.js`)).text();
				Nil.latestVanillaFile = mainjs;
				return mainjs;
			} else {
				return Nil.latestVanillaFile;
			}
		} catch (error : unknown) {
			throw new Error(`Could not fetch main.js file.\nReason: ${error}`);
		}
	};

	/** Applies patches to (unmodifiedFile). */
	public static patchFile (unmodifiedFile : string) : string {

		return `
	
		${Nil.es6`${unmodifiedFile}`}
	
		${Nil.es6`
	
		console.log("%cNil", "font-size:69px;color:#540052;font-weight:900;font-family:sans-serif;");
		console.log("%cVersion ${VERSION}", "font-size:20px;color:#000025;font-weight:700;font-family:sans-serif;");
		
		console.image((e => e[Math.floor(Math.random() * e.length)])(${JSON.stringify(displayImages)}));
		setTimeout(() =>
			(async () =>
				eval(
					await (
						await fetch(
							"${GUI_LINK}"
						)
					).text()
				)
			)(), 15000);
		console.trace = () => {};
	`}
	`;
	};

	/** Gets the latest patched main.js file. If it isn't cached, patch it now. */
	public static async getPatchedFile () : Promise<string> {
		if (Nil.latestPatchedFile !== null) {
			return Nil.latestPatchedFile;
		} else {
			const patchedfile = await (await Nil.patchFile(Nil.latestVanillaFile || (await (Nil.getFile())).valueOf())).valueOf();
			Nil.latestPatchedFile = patchedfile;
			return patchedfile;
		}
	}
	
}
