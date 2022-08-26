import type { Server } from "http"; // Server typings
import express from "express"; // Express server
import cors from "cors"; // CORS
import Nil from "./util"; // Gamefile patchers
import { /* DOWNLOAD_LINK, */ VERSION, /* LICENSE_LINK, */ HTTP_PORT, UNMINIFY_SOUCE, INDEX_HTML, STYLE_CSS, OVERRIDE } from "./constants"; // Constants
import beautify from "js-beautify"; // JavaScript beautifier





(async () => {

    const app = express();
	app.set("trust proxy", true);


	app.use(cors());
	app.use((_req, res, next) => {
		res.set("Cache-Control", "no-cache");
		next();
	});






	app.get("/main*js", (_req, res) => { res.redirect("/app/main.js") })



    // ./app/main.761406757919c0973f71.js
    // @ts-expect-error
	app.get("/app/main*js", async (req, res) => {
		try {

			if (OVERRIDE !== null) {
				return res.type("text/js").send(OVERRIDE);
			}


            let output : string = "";
            output += "// modified main.js \n\n";
            output += (UNMINIFY_SOUCE) ? beautify(await (await Nil.getPatchedFile()).valueOf()) : await (await Nil.getPatchedFile()).valueOf();
			return res.type("text/js").send(output);
		} catch (error : unknown) {
			console.error(error);
			return res.status(500).type("text/plain").send((error as any).message);
		}
	});

    // ./version
	app.get("/version", (_req, res) => {
		res.type("text/plain").send(VERSION);
	});


// BIG IMPORTANT TODO: FIX THESE 3


    // ./download
	app.get("/download", (_req, res) => { res.redirect("DOWNLOAD_LINK") });


	// ./license
    app.get("/license", (_req, res) => { res.redirect("LICENSE_LINK") });

	
    // ./gui
    app.get("/gui", (_req, res) => { res.type("text/js").send("latestCheatGui"); });

	// style.css
	app.get("/style.css", (_req, res) => { res.status(200).type("text/css").send(STYLE_CSS); });

	// index.html
	app.get("/", (_req, res) => { res.status(200).type("text/html").send(INDEX_HTML); });


	const addr: ReturnType<Server["address"]> = app.listen(HTTP_PORT, () =>
		console.log(`[Nil] Nil has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)
	).address();

})();