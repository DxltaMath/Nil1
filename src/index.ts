import type { Server } from "http"; // Server typings
import express from "express"; // Express server
import cors from "cors"; // CORS
import { getPatchedFile, getFile } from "./util"; // Gamefile patchers
import { DOWNLOAD_LINK, VERSION, LICENSE_LINK, HTTP_PORT, UNMINIFY_SOUCE } from "./constants"; // Constants
import beautify from "js-beautify"; // JavaScript beautifier
import { hash } from "./hash"; // Hash function
import fetch from "node-fetch"; // fetch





(async () => {


	const app = express();
	app.set("trust proxy", true);


	app.use(cors());
	// @ts-expect-error
	app.use((req, res, next) => {
		res.set("Cache-Control", "no-cache");
		next();
	});










    // ./app/main.761406757919c0973f71.js
    // @ts-expect-error
	app.get(/app\/main.*.js/g, async (req, res) => {
		try {
            let output : string = "";
            output += "// modified main.js \n\n";
            output += (UNMINIFY_SOUCE) ? beautify(getPatchedFile()) : getPatchedFile();
			res.type("js").send(output);
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
	app.get("/download", (_req, res) => res.redirect(DOWNLOAD_LINK));


	// ./license
    app.get("/license", (_req, res) => res.redirect(LICENSE_LINK));

	

    // ./gui
    app.get("/gui", (_req, res) => {
		res.type("text/js").send(latestCheatGui);
	});




	app.get("/", (_req, res) => {
		res
			.status(200)
			.type("text/html")
			.send(`<!DOCTYPE html>
			<html>
				<head>
					<title>Delta Math Patcher</title>
					<meta charset="utf-8" />
					<link rel="icon" type="image/png" href="https://raw.githubusercontent.com/DxltaMath/assets/master/profile/DxltaMath.jpg"/>
				</head>	
				<body>
					<h1>Delta Math Patcher</h1>
					<p>This is a tool for patching the main.js file of the Delta Math client.</p>
				</body>	
			</html>`);
	});

	const addr: ReturnType<Server["address"]> = app.listen(HTTP_PORT, () =>
		console.log(`[Nil] Nil has started on :${typeof addr === "string" ? addr : addr?.port ?? ""}!`)
	).address();

})();