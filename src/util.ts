import fetch from "node-fetch";
import { GUI_LINK, VERSION } from "./constants";
import displayImages from "./displayImages";
import { transform } from "sucrase";


/** Convert to/from ES6 */
const es6 = (...args: Parameters<typeof String["raw"]>) => transform(String.raw(...args), { transforms: ["typescript"] }).code;

/** Latest unmodified main.js */
let latestVanillaFile : string | null = null;

/** Latest patched main.js */
let latestPatchedFile : string | null = null;


setInterval(() => {
	latestVanillaFile = null;
	latestPatchedFile = null;
}, 30*60*1000); // Every 30 minutes


export async function getFile () : Promise<string> {
	try {
		if (latestVanillaFile === null) {
			const mainjs = await (await fetch(`https://www.deltamath.com/app/main.761406757919c0973f71.js`)).text();
			latestVanillaFile = mainjs;
			return mainjs;
		} else {
			return latestVanillaFile;
		}
	} catch (error : unknown) {
		throw new Error(`Could not fetch main.js file.\nReason: ${error}`);
	}
}


export function patchFile (unmodifiedFile : string) : string {

	return `

	${es6`${unmodifiedFile}`}

	${es6`

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
}

export async function getPatchedFile () : Promise<string> {
	if (latestPatchedFile !== null) {
		return latestPatchedFile;
	} else {
		return await (await patchFile(latestVanillaFile || (await (getFile())).valueOf())).valueOf();
	}
};

