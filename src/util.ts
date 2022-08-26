import fetch from "node-fetch";
import { GUI_LINK, VERSION } from "./constants";
import displayImages from "./displayImages";
import { transform } from "sucrase";


/** Convert to/from ES6 */
const es6 = (...args: Parameters<typeof String["raw"]>) => transform(String.raw(...args), { transforms: ["typescript"] }).code;


setInterval(() => {
	patchedPublicGameFile = null;
}, 30*60*1000); // 30 minutes

const gameFileCache: Record<string, string> = {};

export const getGameFile = async (version: string): Promise<string> => {
	if (version in gameFileCache) return gameFileCache[version];
	if (!version.match(/^[0-9-.]+$/)) throw new Error("Invalid version specified.");
	try {
		return (gameFileCache[version] = await (
			await fetch(`https://code.prodigygame.com/code/${version}/game.min.js?v=${version}`)
		).text());
	} catch (e: unknown) {
		throw new Error(`Could not fetch game file with version ${version}.\nReason: ${e}`);
	}
};



export const patchFile = (str: string): string => {
	const variables = [str.match(/window,function\((.)/)![1], str.match(/var (.)={}/)![1]] as string[];
	const patches: [string | RegExp, string][] = Object.entries({
		[`s),this._game=${variables![1]}`]: `s),this._game=${variables![1]};
			jQuery.temp = window._;
			let lodashChecker = setInterval(() => {
				if (jQuery.temp !== window._) {
					window._ = jQuery.temp;
					delete jQuery.temp;
					clearInterval(lodashChecker);
				}
			});
			Object.defineProperty(window._, "instance", { 
				get: () => ${variables![0]}.instance,
		enumerable: true,
	configurable: true
			});`,
		[`${variables![0]}.constants=Object`]: `window._.constants=${variables![0]},${variables![0]}.constants=Object`,
		[`window,function(${variables![0]}){var ${variables![1]}={};`]: `window,function(${variables![0]}){var ${variables![1]}={};window._.modules=${variables![1]};`,
		[`${variables![0]}.prototype.hasMembership=`]: `${variables![1]}.prototype.hasMembership=_=>true,${variables![1]}.prototype.originalHasMembership=`,
		"answerQuestion=function(){": `answerQuestion=function(){
			if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
				const wasCorrect = Math.random() < _.constants.get('GameConstants.Debug.AUTO_ANSWER_CORRECT_PERCENT');
                this.onQuestionAnswered.dispatch(wasCorrect, 0, null);
                if (wasCorrect) {
                    this.onQuestionAnsweredCorrectly.dispatch(0, null);
                } else {
                    this.onQuestionAnsweredIncorrectly.dispatch(0, null);
                }
                return;
			}
		`
	});
	patches.push([/type\.sendEvent=function\((.), (.), (.)\) \{/, `type.sendEvent=function($1, $2, $3) {
			if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
				return
			}
		`])
	patches.push([/(var .=this.findParameter("externalFactory"))/, `
	if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
		const wasCorrect: boolean = Math.random() < _.constants.get('GameConstants.Debug.AUTO_ANSWER_CORRECT_PERCENT');
		this.finish({ answerCorrect: wasCorrect, responseTime: 0 });
		return;
	}
	$1`]);
	patches.push([/openQuestionInterfaceThenEmitNotifications=function\((.), (.), (.), (.), (.)\) \{/, `openQuestionInterfaceThenEmitNotifications=function($1, $2, $3, $4, $5) {
	if (!_.constants.get('GameConstants.Debug.EDUCATION_ENABLED')) {
		const wasCorrect = true;
		const skill = {}
		const questionAnswerResponse = { eventType, skill, wasCorrect };
		this.fireEvent(MathTowerNotificationType.TOWER_TOWN_QUESTION_ANSWERED, questionAnswerResponse);
		if (callback) {
			callback(wasCorrect, 10, 1, false, false, skill);
		}
		return;
	}
	`]);
	patches.push([/.\.setContentVisible\(!1\)\}\)/, "})"]);
	return `
${es6`
	/** DO NOT TOUCH **/
	const _getBox=(o,t)=>({string:"+",style:"font-size: 1px; padding: 0 "+Math.floor(o/2)+"px; line-height: "+t+"px;"});
	console.image=((o,t=1)=>{const e=new Image;e.onload=(()=>{const n=_getBox(e.width*t,e.height*t);
	console.log("%c"+n.string,n.style+"background: url("+o+"); background-size: "+e.width*t+"px "
	+e.height*t+"px; color: transparent;")}),e.src=o});
	/** ok touch now */
	const oldLog = console.log.bind(console);
	console.log = (...d) => {
		if (d && d.length && typeof d[0] === "string" && d[0].includes("This is a browser feature for developers only")) return "lol no";
		if (new Error().stack?.split("\n").reverse()[0]?.includes("load-identity")) return "fuck you";
		return oldLog(...d);
	};
	_.variables = Object.create(null);
`}

${patches.reduce((l, c) => l.replace(...c), str)}

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

const patchedFileCache: Record<string, string> = {};

export const getPatchedGameFile = async (version: string): Promise<string> => {
	if (version in patchedFileCache) return patchedFileCache[version];
	return (patchedFileCache[version] = patchFile(await getGameFile(version)));
};

