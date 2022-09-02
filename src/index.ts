import type { Server } from "http"; // HTTP Server typings
import express from "express"; // Express server
import cors from "cors"; // CORS
import Nil from "./util"; // Gamefile patchers
import { DOWNLOAD_LINK, VERSION, LICENSE_LINK, HTTP_PORT, INDEX_HTML, STYLE_CSS, OVERRIDE } from "./constants"; // Constants
import dGUI from "./gui";





(async () => {

    const app = express();
	app.set("trust proxy", true);


	app.use(cors());
	app.use((req, res, next) => {
		console.log(req.ip);
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
            output += await (await Nil.getPatchedFile()).valueOf();
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
	

    // ./download
	app.get("/download", (_req, res) => { res.redirect(DOWNLOAD_LINK) });


	// ./license
    app.get("/license", (_req, res) => { res.redirect(LICENSE_LINK) });

	
    // ./gui
    app.get("/gui", async (_req, res) => { res.type("text/js").send(await (await dGUI.getLatestGui())); });

	// style.css
	app.get("/style.css", (_req, res) => { res.status(200).type("text/css").send(STYLE_CSS); });

	// index.html
	app.get("/", (_req, res) => { res.status(200).type("text/html").send(INDEX_HTML); });


	const addr: ReturnType<Server["address"]> = app.listen(HTTP_PORT, () =>
		console.log(`[Nil] Nil has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)
	).address();

})();