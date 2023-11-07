/** @param {NS} ns */
export async function main(ns) {
	ns.write("wiki.js", `import { marked } from "marked/marked.js";
import { hljs } from "highlight.min.js";
import { myCSS } from "wikiCSS.js";

/** @param {NS} ns */
export async function main(ns) {
	const doc = eval("document");
	const win = eval("window");
	ns.disableLog("ALL");
	ns.clearLog();
	ns.tail();
	const style = doc.createElement("style");
	style.innerHTML = myCSS;
	marked.setOptions({
		highlight: function (code, lang) {
			return hljs.highlight(code, { language: hljs.getLanguage(lang) ? lang : "plaintext" }).value;
		},
		langPrefix: 'hljs language-'
	})
	const log = doc.querySelector(\`h6[title="\${ns.getScriptName()} \${ns.args.join(" ")}"]\`).parentNode.nextSibling;
	let frame = doc.createElement("div");
	frame.id = "wikiframe";
	async function loadPage(path) {
		let p = fetch("https://raw.githubusercontent.com/bitburner-official/bitburner-src/dev/markdown/" + path + ".md").then(x => x.text());
		let md = await p;
		let code = marked.parse(md);
		while (frame.firstChild) {
			frame.removeChild(frame.firstChild);
		}
		frame.innerHTML = code.replaceAll(/<\\/thead>\\s*<tbody>/g, "")
			.replaceAll("<thead>", "").replaceAll("</tbody>", "")
			.replaceAll(/<a href="\\.\\/(.*?)\\.md">(.*?)<\\/a>/g,
						"<a href=\\"#a\\" goesto=\\"$1\\">$2</a>")
			.replaceAll(/<a href="(https:\\/\\/.*?)">(.*?)<\\/a>/g,
						"<a href=\\"#a\\" ext=\\"$1\\">$2</a>");
		frame.appendChild(style);
		log.appendChild(frame);
		doc.querySelectorAll("#wikiframe a").forEach(link => {
			link.addEventListener("click", e => {
				if (e.target.getAttribute("goesTo"))
					loadPage(e.target.getAttribute("goesto"));
				else
					win.open(e.target.getAttribute("ext"), "_blank");
			});
		});
	}
	await loadPage("bitburner.ns");
	ns.atExit(() => {
		while (log.firstChild) {
			log.removeChild(log.firstChild);
		}
	});
	while (true) {
		await ns.sleep(1000);
	}
}`, "w");
	ns.write("wikiCSS.js", `/** @param {NS} ns */
export async function main(ns) {
}

const myCSS = \`
#wikiframe {
	color-scheme: dark;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	color: #c9d1d9;
	background-color: #0d1117;
	font-family: -apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
	font-size: 16px;
	line-height: 1.5;
	word-wrap: break-word;
	padding: 0 0 20px 20px;
	width: 100%;
	height: 100%;
	overflow: scroll;
}

#wikiframe * {
	padding-top: 0px;
	margin-top: 0px;
	padding-bottom: 0px;
	margin-bottom: 0px;
}

#wikiframe a {
	color: #0ff;
	background-color: transparent;
	text-decoration: none;
}

#wikiframe a:hover, #wikiframe a:active {
	color: #0f0;
}

#wikiframe .octicon {
	display: inline-block;
	fill: currentColor;
	vertical-align: text-bottom;
}

#wikiframe h1:hover .anchor .octicon-link:before,
#wikiframe h2:hover .anchor .octicon-link:before,
#wikiframe h3:hover .anchor .octicon-link:before,
#wikiframe h4:hover .anchor .octicon-link:before,
#wikiframe h5:hover .anchor .octicon-link:before,
#wikiframe h6:hover .anchor .octicon-link:before {
	width: 16px;
	height: 16px;
	content: ' ';
	display: inline-block;
	background-color: currentColor;
	-webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
	mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
}

#wikiframe details,
#wikiframe figcaption,
#wikiframe figure {
	display: block;
}

#wikiframe summary {
	display: list-item;
}

#wikiframe [hidden] {
	display: none !important;
}

#wikiframe abbr[title] {
	border-bottom: none;
	text-decoration: underline dotted;
}

#wikiframe b,
#wikiframe strong {
	font-weight: 600;
}

#wikiframe dfn {
	font-style: italic;
}

#wikiframe h1 {
	margin: .67em 0;
	font-weight: 600;
	padding-bottom: .3em;
	font-size: 2em;
	border-bottom: 1px solid #21262d;
}

#wikiframe mark {
	background-color: rgba(187,128,9,0.15);
	color: #c9d1d9;
}

#wikiframe small {
	font-size: 90%;
}

#wikiframe sub,
#wikiframe sup {
	font-size: 75%;
	line-height: 0;
	position: relative;
	vertical-align: baseline;
}

#wikiframe sub {
	bottom: -0.25em;
}

#wikiframe sup {
	top: -0.5em;
}

#wikiframe img {
	border-style: none;
	max-width: 100%;
	box-sizing: content-box;
	background-color: #0d1117;
}

#wikiframe code,
#wikiframe kbd,
#wikiframe pre,
#wikiframe samp {
	font-family: monospace;
	font-size: 1em;
}

#wikiframe figure {
	margin: 1em 40px;
}

#wikiframe hr {
	box-sizing: content-box;
	overflow: hidden;
	background: transparent;
	border-bottom: 1px solid #21262d;
	height: 0;
	padding: 0px;
	margin: 0px;
	background-color: #30363d;
	border: 0;
}

#wikiframe input {
	font: inherit;
	margin: 0;
	overflow: visible;
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
}

#wikiframe [type=button],
#wikiframe [type=reset],
#wikiframe [type=submit] {
	-webkit-appearance: button;
}

#wikiframe [type=checkbox],
#wikiframe [type=radio] {
	box-sizing: border-box;
	padding: 0;
}

#wikiframe [type=number]::-webkit-inner-spin-button,
#wikiframe [type=number]::-webkit-outer-spin-button {
	height: auto;
}

#wikiframe [type=search]::-webkit-search-cancel-button,
#wikiframe [type=search]::-webkit-search-decoration {
	-webkit-appearance: none;
}

#wikiframe ::-webkit-input-placeholder {
	color: inherit;
	opacity: .54;
}

#wikiframe ::-webkit-file-upload-button {
	-webkit-appearance: button;
	font: inherit;
}

#wikiframe a:hover {
	text-decoration: underline;
}

#wikiframe ::placeholder {
	color: #6e7681;
	opacity: 1;
}

#wikiframe table {
	border-spacing: 0;
	border-collapse: collapse;
	display: block;
	width: max-content;
	max-width: 100%;
	overflow: auto;
	line-height: 1.5;
}

#wikiframe td,
#wikiframe th {
	padding: 0;
}

#wikiframe details summary {
	cursor: pointer;
}

#wikiframe details:not([open])>*:not(summary) {
	display: none !important;
}

#wikiframe a:focus,
#wikiframe [role=button]:focus,
#wikiframe input[type=radio]:focus,
#wikiframe input[type=checkbox]:focus {
	outline: 2px solid #58a6ff;
	outline-offset: -2px;
	box-shadow: none;
}

#wikiframe a:focus:not(:focus-visible),
#wikiframe [role=button]:focus:not(:focus-visible),
#wikiframe input[type=radio]:focus:not(:focus-visible),
#wikiframe input[type=checkbox]:focus:not(:focus-visible) {
	outline: solid 1px transparent;
}

#wikiframe a:focus-visible,
#wikiframe [role=button]:focus-visible,
#wikiframe input[type=radio]:focus-visible,
#wikiframe input[type=checkbox]:focus-visible {
	outline: 2px solid #58a6ff;
	outline-offset: -2px;
	box-shadow: none;
}

#wikiframe a:not([class]):focus,
#wikiframe a:not([class]):focus-visible,
#wikiframe input[type=radio]:focus,
#wikiframe input[type=radio]:focus-visible,
#wikiframe input[type=checkbox]:focus,
#wikiframe input[type=checkbox]:focus-visible {
	outline-offset: 0;
}

#wikiframe kbd {
	display: inline-block;
	padding: 3px 5px;
	font: 11px ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
	line-height: 10px;
	color: #c9d1d9;
	vertical-align: middle;
	background-color: #161b22;
	border: solid 1px rgba(110,118,129,0.4);
	border-bottom-color: rgba(110,118,129,0.4);
	border-radius: 6px;
	box-shadow: inset 0 -1px 0 rgba(110,118,129,0.4);
}

#wikiframe h1,
#wikiframe h2,
#wikiframe h3,
#wikiframe h4,
#wikiframe h5,
#wikiframe h6 {
	margin-top: 0px;
	margin-bottom: 16px;
	font-weight: 600;
	line-height: 1.25;
}

#wikiframe h2 {
	font-weight: 600;
	padding-bottom: .3em;
	font-size: 1.5em;
	border-bottom: 1px solid #21262d;
}

#wikiframe h3 {
	font-weight: 600;
	font-size: 1.25em;
}

#wikiframe h4 {
	font-weight: 600;
	font-size: 1em;
}

#wikiframe h5 {
	font-weight: 600;
	font-size: .875em;
}

#wikiframe h6 {
	font-weight: 600;
	font-size: .85em;
	color: #8b949e;
}

#wikiframe p {
	margin-top: 0;
	margin-bottom: 10px;
}

#wikiframe blockquote {
	margin: 0;
	padding: 0 1em;
	color: #8b949e;
	border-left: .25em solid #30363d;
}

#wikiframe ul,
#wikiframe ol {
	margin-top: 0;
	margin-bottom: 0;
	padding-left: 2em;
}

#wikiframe ol ol,
#wikiframe ul ol {
	list-style-type: lower-roman;
}

#wikiframe ul ul ol,
#wikiframe ul ol ol,
#wikiframe ol ul ol,
#wikiframe ol ol ol {
	list-style-type: lower-alpha;
}

#wikiframe dd {
	margin-left: 0;
}

#wikiframe tt,
#wikiframe code,
#wikiframe samp {
	font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
	font-size: 12px;
}

#wikiframe pre {
	margin-top: 0;
	margin-bottom: 0;
	font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
	font-size: 12px;
	word-wrap: normal;
}

#wikiframe .octicon {
	display: inline-block;
	overflow: visible !important;
	vertical-align: text-bottom;
	fill: currentColor;
}

#wikiframe input::-webkit-outer-spin-button,
#wikiframe input::-webkit-inner-spin-button {
	margin: 0;
	-webkit-appearance: none;
	appearance: none;
}

#wikiframe::before {
	display: table;
	content: "";
}

#wikiframe::after {
	display: table;
	clear: both;
	content: "";
}

#wikiframe>*:first-child {
	margin-top: 0 !important;
}

#wikiframe>*:last-child {
	margin-bottom: 0 !important;
}

#wikiframe a:not([href]) {
	color: inherit;
	text-decoration: none;
}

#wikiframe .absent {
	color: #f85149;
}

#wikiframe .anchor {
	float: left;
	padding-right: 4px;
	margin-left: -20px;
	line-height: 1;
}

#wikiframe .anchor:focus {
	outline: none;
}

#wikiframe p,
#wikiframe blockquote,
#wikiframe ul,
#wikiframe ol,
#wikiframe dl,
#wikiframe table,
#wikiframe pre,
#wikiframe details {
	margin-top: 0;
	margin-bottom: 16px;
}

#wikiframe blockquote>:first-child {
	margin-top: 0;
}

#wikiframe blockquote>:last-child {
	margin-bottom: 0;
}

#wikiframe h1 .octicon-link,
#wikiframe h2 .octicon-link,
#wikiframe h3 .octicon-link,
#wikiframe h4 .octicon-link,
#wikiframe h5 .octicon-link,
#wikiframe h6 .octicon-link {
	color: #c9d1d9;
	vertical-align: middle;
	visibility: hidden;
}

#wikiframe h1:hover .anchor,
#wikiframe h2:hover .anchor,
#wikiframe h3:hover .anchor,
#wikiframe h4:hover .anchor,
#wikiframe h5:hover .anchor,
#wikiframe h6:hover .anchor {
	text-decoration: none;
}

#wikiframe h1:hover .anchor .octicon-link,
#wikiframe h2:hover .anchor .octicon-link,
#wikiframe h3:hover .anchor .octicon-link,
#wikiframe h4:hover .anchor .octicon-link,
#wikiframe h5:hover .anchor .octicon-link,
#wikiframe h6:hover .anchor .octicon-link {
	visibility: visible;
}

#wikiframe h1 tt,
#wikiframe h1 code,
#wikiframe h2 tt,
#wikiframe h2 code,
#wikiframe h3 tt,
#wikiframe h3 code,
#wikiframe h4 tt,
#wikiframe h4 code,
#wikiframe h5 tt,
#wikiframe h5 code,
#wikiframe h6 tt,
#wikiframe h6 code {
	padding: 0 .2em;
	font-size: inherit;
}

#wikiframe summary h1,
#wikiframe summary h2,
#wikiframe summary h3,
#wikiframe summary h4,
#wikiframe summary h5,
#wikiframe summary h6 {
	display: inline-block;
}

#wikiframe summary h1 .anchor,
#wikiframe summary h2 .anchor,
#wikiframe summary h3 .anchor,
#wikiframe summary h4 .anchor,
#wikiframe summary h5 .anchor,
#wikiframe summary h6 .anchor {
	margin-left: -40px;
}

#wikiframe summary h1,
#wikiframe summary h2 {
	padding-bottom: 0;
	border-bottom: 0;
}

#wikiframe ul.no-list,
#wikiframe ol.no-list {
	padding: 0;
	list-style-type: none;
}

#wikiframe ol[type=a] {
	list-style-type: lower-alpha;
}

#wikiframe ol[type=A] {
	list-style-type: upper-alpha;
}

#wikiframe ol[type=i] {
	list-style-type: lower-roman;
}

#wikiframe ol[type=I] {
	list-style-type: upper-roman;
}

#wikiframe ol[type="1"] {
	list-style-type: decimal;
}

#wikiframe div>ol:not([type]) {
	list-style-type: decimal;
}

#wikiframe ul ul,
#wikiframe ul ol,
#wikiframe ol ol,
#wikiframe ol ul {
	margin-top: 0;
	margin-bottom: 0;
}

#wikiframe li>p {
	margin-top: 16px;
}

#wikiframe li+li {
	margin-top: .25em;
}

#wikiframe dl {
	padding: 0;
}

#wikiframe dl dt {
	padding: 0;
	margin-top: 16px;
	font-size: 1em;
	font-style: italic;
	font-weight: 600;
}

#wikiframe dl dd {
	padding: 0 16px;
	margin-bottom: 16px;
}

#wikiframe table th {
	font-weight: 600;
}

#wikiframe table th,
#wikiframe table td {
	padding: 6px 13px;
	border: 1px solid #30363d;
}

#wikiframe table tr {
	background-color: #0d1117;
	border-top: 1px solid #21262d;
}

#wikiframe table tr:nth-child(2n) {
	background-color: #161b22;
}

#wikiframe table img {
	background-color: transparent;
}

#wikiframe img[align=right] {
	padding-left: 20px;
}

#wikiframe img[align=left] {
	padding-right: 20px;
}

#wikiframe .emoji {
	max-width: none;
	vertical-align: text-top;
	background-color: transparent;
}

#wikiframe span.frame {
	display: block;
	overflow: hidden;
}

#wikiframe span.frame>span {
	display: block;
	float: left;
	width: auto;
	padding: 7px;
	margin: 13px 0 0;
	overflow: hidden;
	border: 1px solid #30363d;
}

#wikiframe span.frame span img {
	display: block;
	float: left;
}

#wikiframe span.frame span span {
	display: block;
	padding: 5px 0 0;
	clear: both;
	color: #c9d1d9;
}

#wikiframe span.align-center {
	display: block;
	overflow: hidden;
	clear: both;
}

#wikiframe span.align-center>span {
	display: block;
	margin: 13px auto 0;
	overflow: hidden;
	text-align: center;
}

#wikiframe span.align-center span img {
	margin: 0 auto;
	text-align: center;
}

#wikiframe span.align-right {
	display: block;
	overflow: hidden;
	clear: both;
}

#wikiframe span.align-right>span {
	display: block;
	margin: 13px 0 0;
	overflow: hidden;
	text-align: right;
}

#wikiframe span.align-right span img {
	margin: 0;
	text-align: right;
}

#wikiframe span.float-left {
	display: block;
	float: left;
	margin-right: 13px;
	overflow: hidden;
}

#wikiframe span.float-left span {
	margin: 13px 0 0;
}

#wikiframe span.float-right {
	display: block;
	float: right;
	margin-left: 13px;
	overflow: hidden;
}

#wikiframe span.float-right>span {
	display: block;
	margin: 13px auto 0;
	overflow: hidden;
	text-align: right;
}

#wikiframe code,
#wikiframe tt {
	padding: .2em .4em;
	margin: 0;
	font-size: 85%;
	white-space: break-spaces;
	background-color: rgba(110,118,129,0.4);
	border-radius: 6px;
}

#wikiframe code br,
#wikiframe tt br {
	display: none;
}

#wikiframe del code {
	text-decoration: inherit;
}

#wikiframe samp {
	font-size: 85%;
}

#wikiframe pre code {
	font-size: 100%;
}

#wikiframe pre>code {
	padding: 0;
	margin: 0;
	word-break: normal;
	white-space: pre;
	background: transparent;
	border: 0;
}

#wikiframe .highlight {
	margin-bottom: 16px;
}

#wikiframe .highlight pre {
	margin-bottom: 0;
	word-break: normal;
}

#wikiframe .highlight pre,
#wikiframe pre {
	padding: 16px;
	overflow: auto;
	font-size: 85%;
	line-height: 1.45;
	background-color: #161b22;
	border-radius: 6px;
}

#wikiframe pre code,
#wikiframe pre tt {
	display: inline;
	max-width: auto;
	padding: 0;
	margin: 0;
	overflow: visible;
	line-height: inherit;
	word-wrap: normal;
	background-color: transparent;
	border: 0;
}

#wikiframe .csv-data td,
#wikiframe .csv-data th {
	padding: 5px;
	overflow: hidden;
	font-size: 12px;
	line-height: 1;
	text-align: left;
	white-space: nowrap;
}

#wikiframe .csv-data .blob-num {
	padding: 10px 8px 9px;
	text-align: right;
	background: #0d1117;
	border: 0;
}

#wikiframe .csv-data tr {
	border-top: 0;
}

#wikiframe .csv-data th {
	font-weight: 600;
	background: #161b22;
	border-top: 0;
}

#wikiframe [data-footnote-ref]::before {
	content: "[";
}

#wikiframe [data-footnote-ref]::after {
	content: "]";
}

#wikiframe .footnotes {
	font-size: 12px;
	color: #8b949e;
	border-top: 1px solid #30363d;
}

#wikiframe .footnotes ol {
	padding-left: 16px;
}

#wikiframe .footnotes ol ul {
	display: inline-block;
	padding-left: 16px;
	margin-top: 16px;
}

#wikiframe .footnotes li {
	position: relative;
}

#wikiframe .footnotes li:target::before {
	position: absolute;
	top: -8px;
	right: -8px;
	bottom: -8px;
	left: -24px;
	pointer-events: none;
	content: "";
	border: 2px solid #1f6feb;
	border-radius: 6px;
}

#wikiframe .footnotes li:target {
	color: #c9d1d9;
}

#wikiframe .footnotes .data-footnote-backref g-emoji {
	font-family: monospace;
}

#wikiframe .pl-c {
	color: #8b949e;
}

#wikiframe .pl-c1,
#wikiframe .pl-s .pl-v {
	color: #79c0ff;
}

#wikiframe .pl-e,
#wikiframe .pl-en {
	color: #d2a8ff;
}

#wikiframe .pl-smi,
#wikiframe .pl-s .pl-s1 {
	color: #c9d1d9;
}

#wikiframe .pl-ent {
	color: #7ee787;
}

#wikiframe .pl-k {
	color: #ff7b72;
}

#wikiframe .pl-s,
#wikiframe .pl-pds,
#wikiframe .pl-s .pl-pse .pl-s1,
#wikiframe .pl-sr,
#wikiframe .pl-sr .pl-cce,
#wikiframe .pl-sr .pl-sre,
#wikiframe .pl-sr .pl-sra {
	color: #a5d6ff;
}

#wikiframe .pl-v,
#wikiframe .pl-smw {
	color: #ffa657;
}

#wikiframe .pl-bu {
	color: #f85149;
}

#wikiframe .pl-ii {
	color: #f0f6fc;
	background-color: #8e1519;
}

#wikiframe .pl-c2 {
	color: #f0f6fc;
	background-color: #b62324;
}

#wikiframe .pl-sr .pl-cce {
	font-weight: bold;
	color: #7ee787;
}

#wikiframe .pl-ml {
	color: #f2cc60;
}

#wikiframe .pl-mh,
#wikiframe .pl-mh .pl-en,
#wikiframe .pl-ms {
	font-weight: bold;
	color: #1f6feb;
}

#wikiframe .pl-mi {
	font-style: italic;
	color: #c9d1d9;
}

#wikiframe .pl-mb {
	font-weight: bold;
	color: #c9d1d9;
}

#wikiframe .pl-md {
	color: #ffdcd7;
	background-color: #67060c;
}

#wikiframe .pl-mi1 {
	color: #aff5b4;
	background-color: #033a16;
}

#wikiframe .pl-mc {
	color: #ffdfb6;
	background-color: #5a1e02;
}

#wikiframe .pl-mi2 {
	color: #c9d1d9;
	background-color: #1158c7;
}

#wikiframe .pl-mdr {
	font-weight: bold;
	color: #d2a8ff;
}

#wikiframe .pl-ba {
	color: #8b949e;
}

#wikiframe .pl-sg {
	color: #484f58;
}

#wikiframe .pl-corl {
	text-decoration: underline;
	color: #a5d6ff;
}

#wikiframe g-emoji {
	display: inline-block;
	min-width: 1ch;
	font-family: "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
	font-size: 1em;
	font-style: normal !important;
	font-weight: 400;
	line-height: 1;
	vertical-align: -0.075em;
}

#wikiframe g-emoji img {
	width: 1em;
	height: 1em;
}

#wikiframe .task-list-item {
	list-style-type: none;
}

#wikiframe .task-list-item label {
	font-weight: 400;
}

#wikiframe .task-list-item.enabled label {
	cursor: pointer;
}

#wikiframe .task-list-item+.task-list-item {
	margin-top: 4px;
}

#wikiframe .task-list-item .handle {
	display: none;
}

#wikiframe .task-list-item-checkbox {
	margin: 0 .2em .25em -1.4em;
	vertical-align: middle;
}

#wikiframe .contains-task-list:dir(rtl) .task-list-item-checkbox {
	margin: 0 -1.6em .25em .2em;
}

#wikiframe .contains-task-list {
	position: relative;
}

#wikiframe .contains-task-list:hover .task-list-item-convert-container,
#wikiframe .contains-task-list:focus-within .task-list-item-convert-container {
	display: block;
	width: auto;
	height: 24px;
	overflow: visible;
	clip: auto;
}

#wikiframe ::-webkit-calendar-picker-indicator {
	filter: invert(50%);
}

/*!
	Theme: GitHub Dark
	Description: Dark theme as seen on github.com
	Author: github.com
	Maintainer: @Hirse
	Updated: 2021-05-15
	Outdated base version: https://github.com/primer/github-syntax-dark
	Current colors taken from GitHub's CSS
*/

.hljs {
	color: #c9d1d9;
	background: #0d1117;
}

.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
	/* prettylights-syntax-keyword */
	color: #ff7b72;
}

.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
	/* prettylights-syntax-entity */
	color: #d2a8ff;
}

.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
	/* prettylights-syntax-constant */
	color: #79c0ff;
}

.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
	/* prettylights-syntax-string */
	color: #a5d6ff;
}

.hljs-built_in,
.hljs-symbol {
	/* prettylights-syntax-variable */
	color: #ffa657;
}

.hljs-comment,
.hljs-code,
.hljs-formula {
	/* prettylights-syntax-comment */
	color: #8b949e;
}

.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
	/* prettylights-syntax-entity-tag */
	color: #7ee787;
}

.hljs-subst {
	/* prettylights-syntax-storage-modifier-import */
	color: #c9d1d9;
}

.hljs-section {
	/* prettylights-syntax-markup-heading */
	color: #1f6feb;
	font-weight: bold;
}

.hljs-bullet {
	/* prettylights-syntax-markup-list */
	color: #f2cc60;
}

.hljs-emphasis {
	/* prettylights-syntax-markup-italic */
	color: #c9d1d9;
	font-style: italic;
}

.hljs-strong {
	/* prettylights-syntax-markup-bold */
	color: #c9d1d9;
	font-weight: bold;
}

.hljs-addition {
	/* prettylights-syntax-markup-inserted */
	color: #aff5b4;
	background-color: #033a16;
}

.hljs-deletion {
	/* prettylights-syntax-markup-deleted */
	color: #ffdcd7;
	background-color: #67060c;
}

.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
	/* purposely ignored */
}
\`;

export {myCSS};`, "w");
	ns.write("highlight.min.js", `/** @param {NS} ns */
export async function main(ns) {
}

/*!
  Highlight.js v11.7.0 (git: 82688fad18)
  (c) 2006-2022 undefined and other contributors
  License: BSD-3-Clause
 */
const _window=eval("window");
const _document=eval("document");
var hljs=function(){"use strict";var e={exports:{}};function n(e){
return e instanceof Map?e.clear=e.delete=e.set=()=>{
throw Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=()=>{
throw Error("set is read-only")
}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach((t=>{var a=e[t]
;"object"!=typeof a||Object.isFrozen(a)||n(a)})),e}
e.exports=n,e.exports.default=n;class t{constructor(e){
void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}
ignoreMatch(){this.isMatchIgnored=!0}}function a(e){
return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")
}function i(e,...n){const t=Object.create(null);for(const n in e)t[n]=e[n]
;return n.forEach((e=>{for(const n in e)t[n]=e[n]})),t}
const r=e=>!!e.scope||e.sublanguage&&e.language;class s{constructor(e,n){
this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){
this.buffer+=a(e)}openNode(e){if(!r(e))return;let n=""
;n=e.sublanguage?"language-"+e.language:((e,{prefix:n})=>{if(e.includes(".")){
const t=e.split(".")
;return[\`\${n}\${t.shift()}\`,...t.map(((e,n)=>\`\${e}\${"_".repeat(n+1)}\`))].join(" ")
}return\`\${n}\${e}\`})(e.scope,{prefix:this.classPrefix}),this.span(n)}
closeNode(e){r(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){
this.buffer+=\`<span class="\${e}">\`}}const o=(e={})=>{const n={children:[]}
;return Object.assign(n,e),n};class l{constructor(){
this.rootNode=o(),this.stack=[this.rootNode]}get top(){
return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){
this.top.children.push(e)}openNode(e){const n=o({scope:e})
;this.add(n),this.stack.push(n)}closeNode(){
if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){
for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}
walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){
return"string"==typeof n?e.addText(n):n.children&&(e.openNode(n),
n.children.forEach((n=>this._walk(e,n))),e.closeNode(n)),e}static _collapse(e){
"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{
l._collapse(e)})))}}class c extends l{constructor(e){super(),this.options=e}
addKeyword(e,n){""!==e&&(this.openNode(n),this.addText(e),this.closeNode())}
addText(e){""!==e&&this.add(e)}addSublanguage(e,n){const t=e.root
;t.sublanguage=!0,t.language=n,this.add(t)}toHTML(){
return new s(this,this.options).value()}finalize(){return!0}}function d(e){
return e?"string"==typeof e?e:e.source:null}function g(e){return m("(?=",e,")")}
function u(e){return m("(?:",e,")*")}function b(e){return m("(?:",e,")?")}
function m(...e){return e.map((e=>d(e))).join("")}function p(...e){const n=(e=>{
const n=e[e.length-1]
;return"object"==typeof n&&n.constructor===Object?(e.splice(e.length-1,1),n):{}
})(e);return"("+(n.capture?"":"?:")+e.map((e=>d(e))).join("|")+")"}
function _(e){return RegExp(e.toString()+"|").exec("").length-1}
const h=/\\[(?:[^\\\\\\]]|\\\\.)*\\]|\\(\\??|\\\\([1-9][0-9]*)|\\\\./
;function f(e,{joinWith:n}){let t=0;return e.map((e=>{t+=1;const n=t
;let a=d(e),i="";for(;a.length>0;){const e=h.exec(a);if(!e){i+=a;break}
i+=a.substring(0,e.index),
a=a.substring(e.index+e[0].length),"\\\\"===e[0][0]&&e[1]?i+="\\\\"+(Number(e[1])+n):(i+=e[0],
"("===e[0]&&t++)}return i})).map((e=>\`(\${e})\`)).join(n)}
const E="[a-zA-Z]\\\\w*",y="[a-zA-Z_]\\\\w*",w="\\\\b\\\\d+(\\\\.\\\\d+)?",N="(-?)(\\\\b0[xX][a-fA-F0-9]+|(\\\\b\\\\d+(\\\\.\\\\d*)?|\\\\.\\\\d+)([eE][-+]?\\\\d+)?)",v="\\\\b(0b[01]+)",O={
begin:"\\\\\\\\[\\\\s\\\\S]",relevance:0},k={scope:"string",begin:"'",end:"'",
illegal:"\\\\n",contains:[O]},x={scope:"string",begin:'"',end:'"',illegal:"\\\\n",
contains:[O]},M=(e,n,t={})=>{const a=i({scope:"comment",begin:e,end:n,
contains:[]},t);a.contains.push({scope:"doctag",
begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0})
;const r=p("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/)
;return a.contains.push({begin:m(/[ ]+/,"(",r,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),a
},S=M("//","$"),A=M("/\\\\*","\\\\*/"),C=M("#","$");var T=Object.freeze({
__proto__:null,MATCH_NOTHING_RE:/\\b\\B/,IDENT_RE:E,UNDERSCORE_IDENT_RE:y,
NUMBER_RE:w,C_NUMBER_RE:N,BINARY_NUMBER_RE:v,
RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\\\*|\\\\*=|\\\\+|\\\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\\\?|\\\\[|\\\\{|\\\\(|\\\\^|\\\\^=|\\\\||\\\\|=|\\\\|\\\\||~",
SHEBANG:(e={})=>{const n=/^#![ ]*\\//
;return e.binary&&(e.begin=m(n,/.*\\b/,e.binary,/\\b.*/)),i({scope:"meta",begin:n,
end:/$/,relevance:0,"on:begin":(e,n)=>{0!==e.index&&n.ignoreMatch()}},e)},
BACKSLASH_ESCAPE:O,APOS_STRING_MODE:k,QUOTE_STRING_MODE:x,PHRASAL_WORDS_MODE:{
begin:/\\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\\b/
},COMMENT:M,C_LINE_COMMENT_MODE:S,C_BLOCK_COMMENT_MODE:A,HASH_COMMENT_MODE:C,
NUMBER_MODE:{scope:"number",begin:w,relevance:0},C_NUMBER_MODE:{scope:"number",
begin:N,relevance:0},BINARY_NUMBER_MODE:{scope:"number",begin:v,relevance:0},
REGEXP_MODE:{begin:/(?=\\/[^/\\n]*\\/)/,contains:[{scope:"regexp",begin:/\\//,
end:/\\/[gimuy]*/,illegal:/\\n/,contains:[O,{begin:/\\[/,end:/\\]/,relevance:0,
contains:[O]}]}]},TITLE_MODE:{scope:"title",begin:E,relevance:0},
UNDERSCORE_TITLE_MODE:{scope:"title",begin:y,relevance:0},METHOD_GUARD:{
begin:"\\\\.\\\\s*[a-zA-Z_]\\\\w*",relevance:0},END_SAME_AS_BEGIN:e=>Object.assign(e,{
"on:begin":(e,n)=>{n.data._beginMatch=e[1]},"on:end":(e,n)=>{
n.data._beginMatch!==e[1]&&n.ignoreMatch()}})});function R(e,n){
"."===e.input[e.index-1]&&n.ignoreMatch()}function D(e,n){
void 0!==e.className&&(e.scope=e.className,delete e.className)}function I(e,n){
n&&e.beginKeywords&&(e.begin="\\\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\\\.)(?=\\\\b|\\\\s)",
e.__beforeBegin=R,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,
void 0===e.relevance&&(e.relevance=0))}function L(e,n){
Array.isArray(e.illegal)&&(e.illegal=p(...e.illegal))}function B(e,n){
if(e.match){
if(e.begin||e.end)throw Error("begin & end are not supported with match")
;e.begin=e.match,delete e.match}}function $(e,n){
void 0===e.relevance&&(e.relevance=1)}const z=(e,n)=>{if(!e.beforeMatch)return
;if(e.starts)throw Error("beforeMatch cannot be used with starts")
;const t=Object.assign({},e);Object.keys(e).forEach((n=>{delete e[n]
})),e.keywords=t.keywords,e.begin=m(t.beforeMatch,g(t.begin)),e.starts={
relevance:0,contains:[Object.assign(t,{endsParent:!0})]
},e.relevance=0,delete t.beforeMatch
},F=["of","and","for","in","not","or","if","then","parent","list","value"]
;function U(e,n,t="keyword"){const a=Object.create(null)
;return"string"==typeof e?i(t,e.split(" ")):Array.isArray(e)?i(t,e):Object.keys(e).forEach((t=>{
Object.assign(a,U(e[t],n,t))})),a;function i(e,t){
n&&(t=t.map((e=>e.toLowerCase()))),t.forEach((n=>{const t=n.split("|")
;a[t[0]]=[e,j(t[0],t[1])]}))}}function j(e,n){
return n?Number(n):(e=>F.includes(e.toLowerCase()))(e)?0:1}const P={},K=e=>{
console.error(e)},H=(e,...n)=>{console.log("WARN: "+e,...n)},q=(e,n)=>{
P[\`\${e}/\${n}\`]||(console.log(\`Deprecated as of \${e}. \${n}\`),P[\`\${e}/\${n}\`]=!0)
},Z=Error();function G(e,n,{key:t}){let a=0;const i=e[t],r={},s={}
;for(let e=1;e<=n.length;e++)s[e+a]=i[e],r[e+a]=!0,a+=_(n[e-1])
;e[t]=s,e[t]._emit=r,e[t]._multi=!0}function W(e){(e=>{
e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,
delete e.scope)})(e),"string"==typeof e.beginScope&&(e.beginScope={
_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope
}),(e=>{if(Array.isArray(e.begin)){
if(e.skip||e.excludeBegin||e.returnBegin)throw K("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
Z
;if("object"!=typeof e.beginScope||null===e.beginScope)throw K("beginScope must be object"),
Z;G(e,e.begin,{key:"beginScope"}),e.begin=f(e.begin,{joinWith:""})}})(e),(e=>{
if(Array.isArray(e.end)){
if(e.skip||e.excludeEnd||e.returnEnd)throw K("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
Z
;if("object"!=typeof e.endScope||null===e.endScope)throw K("endScope must be object"),
Z;G(e,e.end,{key:"endScope"}),e.end=f(e.end,{joinWith:""})}})(e)}function Q(e){
function n(n,t){
return RegExp(d(n),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(t?"g":""))
}class t{constructor(){
this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}
addRule(e,n){
n.position=this.position++,this.matchIndexes[this.matchAt]=n,this.regexes.push([n,e]),
this.matchAt+=_(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null)
;const e=this.regexes.map((e=>e[1]));this.matcherRe=n(f(e,{joinWith:"|"
}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex
;const n=this.matcherRe.exec(e);if(!n)return null
;const t=n.findIndex(((e,n)=>n>0&&void 0!==e)),a=this.matchIndexes[t]
;return n.splice(0,t),Object.assign(n,a)}}class a{constructor(){
this.rules=[],this.multiRegexes=[],
this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){
if(this.multiRegexes[e])return this.multiRegexes[e];const n=new t
;return this.rules.slice(e).forEach((([e,t])=>n.addRule(e,t))),
n.compile(),this.multiRegexes[e]=n,n}resumingScanAtSamePosition(){
return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,n){
this.rules.push([e,n]),"begin"===n.type&&this.count++}exec(e){
const n=this.getMatcher(this.regexIndex);n.lastIndex=this.lastIndex
;let t=n.exec(e)
;if(this.resumingScanAtSamePosition())if(t&&t.index===this.lastIndex);else{
const n=this.getMatcher(0);n.lastIndex=this.lastIndex+1,t=n.exec(e)}
return t&&(this.regexIndex+=t.position+1,
this.regexIndex===this.count&&this.considerAll()),t}}
if(e.compilerExtensions||(e.compilerExtensions=[]),
e.contains&&e.contains.includes("self"))throw Error("ERR: contains \`self\` is not supported at the top-level of a language.  See documentation.")
;return e.classNameAliases=i(e.classNameAliases||{}),function t(r,s){const o=r
;if(r.isCompiled)return o
;[D,B,W,z].forEach((e=>e(r,s))),e.compilerExtensions.forEach((e=>e(r,s))),
r.__beforeBegin=null,[I,L,$].forEach((e=>e(r,s))),r.isCompiled=!0;let l=null
;return"object"==typeof r.keywords&&r.keywords.$pattern&&(r.keywords=Object.assign({},r.keywords),
l=r.keywords.$pattern,
delete r.keywords.$pattern),l=l||/\\w+/,r.keywords&&(r.keywords=U(r.keywords,e.case_insensitive)),
o.keywordPatternRe=n(l,!0),
s&&(r.begin||(r.begin=/\\B|\\b/),o.beginRe=n(o.begin),r.end||r.endsWithParent||(r.end=/\\B|\\b/),
r.end&&(o.endRe=n(o.end)),
o.terminatorEnd=d(o.end)||"",r.endsWithParent&&s.terminatorEnd&&(o.terminatorEnd+=(r.end?"|":"")+s.terminatorEnd)),
r.illegal&&(o.illegalRe=n(r.illegal)),
r.contains||(r.contains=[]),r.contains=[].concat(...r.contains.map((e=>(e=>(e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map((n=>i(e,{
variants:null},n)))),e.cachedVariants?e.cachedVariants:X(e)?i(e,{
starts:e.starts?i(e.starts):null
}):Object.isFrozen(e)?i(e):e))("self"===e?r:e)))),r.contains.forEach((e=>{t(e,o)
})),r.starts&&t(r.starts,s),o.matcher=(e=>{const n=new a
;return e.contains.forEach((e=>n.addRule(e.begin,{rule:e,type:"begin"
}))),e.terminatorEnd&&n.addRule(e.terminatorEnd,{type:"end"
}),e.illegal&&n.addRule(e.illegal,{type:"illegal"}),n})(o),o}(e)}function X(e){
return!!e&&(e.endsWithParent||X(e.starts))}class V extends Error{
constructor(e,n){super(e),this.name="HTMLInjectionError",this.html=n}}
const J=a,Y=i,ee=Symbol("nomatch");var ne=(n=>{
const a=Object.create(null),i=Object.create(null),r=[];let s=!0
;const o="Could not find the language '{}', did you forget to load/include a language module?",l={
disableAutodetect:!0,name:"Plain text",contains:[]};let d={
ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,
languageDetectRe:/\\blang(?:uage)?-([\\w-]+)\\b/i,classPrefix:"hljs-",
cssSelector:"pre code",languages:null,__emitter:c};function _(e){
return d.noHighlightRe.test(e)}function h(e,n,t){let a="",i=""
;"object"==typeof n?(a=e,
t=n.ignoreIllegals,i=n.language):(q("10.7.0","highlight(lang, code, ...args) has been deprecated."),
q("10.7.0","Please use highlight(code, options) instead.\\nhttps://github.com/highlightjs/highlight.js/issues/2277"),
i=e,a=n),void 0===t&&(t=!0);const r={code:a,language:i};x("before:highlight",r)
;const s=r.result?r.result:f(r.language,r.code,t)
;return s.code=r.code,x("after:highlight",s),s}function f(e,n,i,r){
const l=Object.create(null);function c(){if(!k.keywords)return void M.addText(S)
;let e=0;k.keywordPatternRe.lastIndex=0;let n=k.keywordPatternRe.exec(S),t=""
;for(;n;){t+=S.substring(e,n.index)
;const i=w.case_insensitive?n[0].toLowerCase():n[0],r=(a=i,k.keywords[a]);if(r){
const[e,a]=r
;if(M.addText(t),t="",l[i]=(l[i]||0)+1,l[i]<=7&&(A+=a),e.startsWith("_"))t+=n[0];else{
const t=w.classNameAliases[e]||e;M.addKeyword(n[0],t)}}else t+=n[0]
;e=k.keywordPatternRe.lastIndex,n=k.keywordPatternRe.exec(S)}var a
;t+=S.substring(e),M.addText(t)}function g(){null!=k.subLanguage?(()=>{
if(""===S)return;let e=null;if("string"==typeof k.subLanguage){
if(!a[k.subLanguage])return void M.addText(S)
;e=f(k.subLanguage,S,!0,x[k.subLanguage]),x[k.subLanguage]=e._top
}else e=E(S,k.subLanguage.length?k.subLanguage:null)
;k.relevance>0&&(A+=e.relevance),M.addSublanguage(e._emitter,e.language)
})():c(),S=""}function u(e,n){let t=1;const a=n.length-1;for(;t<=a;){
if(!e._emit[t]){t++;continue}const a=w.classNameAliases[e[t]]||e[t],i=n[t]
;a?M.addKeyword(i,a):(S=i,c(),S=""),t++}}function b(e,n){
return e.scope&&"string"==typeof e.scope&&M.openNode(w.classNameAliases[e.scope]||e.scope),
e.beginScope&&(e.beginScope._wrap?(M.addKeyword(S,w.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),
S=""):e.beginScope._multi&&(u(e.beginScope,n),S="")),k=Object.create(e,{parent:{
value:k}}),k}function m(e,n,a){let i=((e,n)=>{const t=e&&e.exec(n)
;return t&&0===t.index})(e.endRe,a);if(i){if(e["on:end"]){const a=new t(e)
;e["on:end"](n,a),a.isMatchIgnored&&(i=!1)}if(i){
for(;e.endsParent&&e.parent;)e=e.parent;return e}}
if(e.endsWithParent)return m(e.parent,n,a)}function p(e){
return 0===k.matcher.regexIndex?(S+=e[0],1):(R=!0,0)}function _(e){
const t=e[0],a=n.substring(e.index),i=m(k,e,a);if(!i)return ee;const r=k
;k.endScope&&k.endScope._wrap?(g(),
M.addKeyword(t,k.endScope._wrap)):k.endScope&&k.endScope._multi?(g(),
u(k.endScope,e)):r.skip?S+=t:(r.returnEnd||r.excludeEnd||(S+=t),
g(),r.excludeEnd&&(S=t));do{
k.scope&&M.closeNode(),k.skip||k.subLanguage||(A+=k.relevance),k=k.parent
}while(k!==i.parent);return i.starts&&b(i.starts,e),r.returnEnd?0:t.length}
let h={};function y(a,r){const o=r&&r[0];if(S+=a,null==o)return g(),0
;if("begin"===h.type&&"end"===r.type&&h.index===r.index&&""===o){
if(S+=n.slice(r.index,r.index+1),!s){const n=Error(\`0 width match regex (\${e})\`)
;throw n.languageName=e,n.badRule=h.rule,n}return 1}
if(h=r,"begin"===r.type)return(e=>{
const n=e[0],a=e.rule,i=new t(a),r=[a.__beforeBegin,a["on:begin"]]
;for(const t of r)if(t&&(t(e,i),i.isMatchIgnored))return p(n)
;return a.skip?S+=n:(a.excludeBegin&&(S+=n),
g(),a.returnBegin||a.excludeBegin||(S=n)),b(a,e),a.returnBegin?0:n.length})(r)
;if("illegal"===r.type&&!i){
const e=Error('Illegal lexeme "'+o+'" for mode "'+(k.scope||"<unnamed>")+'"')
;throw e.mode=k,e}if("end"===r.type){const e=_(r);if(e!==ee)return e}
if("illegal"===r.type&&""===o)return 1
;if(T>1e5&&T>3*r.index)throw Error("potential infinite loop, way more iterations than matches")
;return S+=o,o.length}const w=v(e)
;if(!w)throw K(o.replace("{}",e)),Error('Unknown language: "'+e+'"')
;const N=Q(w);let O="",k=r||N;const x={},M=new d.__emitter(d);(()=>{const e=[]
;for(let n=k;n!==w;n=n.parent)n.scope&&e.unshift(n.scope)
;e.forEach((e=>M.openNode(e)))})();let S="",A=0,C=0,T=0,R=!1;try{
for(k.matcher.considerAll();;){
T++,R?R=!1:k.matcher.considerAll(),k.matcher.lastIndex=C
;const e=k.matcher.exec(n);if(!e)break;const t=y(n.substring(C,e.index),e)
;C=e.index+t}
return y(n.substring(C)),M.closeAllNodes(),M.finalize(),O=M.toHTML(),{
language:e,value:O,relevance:A,illegal:!1,_emitter:M,_top:k}}catch(t){
if(t.message&&t.message.includes("Illegal"))return{language:e,value:J(n),
illegal:!0,relevance:0,_illegalBy:{message:t.message,index:C,
context:n.slice(C-100,C+100),mode:t.mode,resultSoFar:O},_emitter:M};if(s)return{
language:e,value:J(n),illegal:!1,relevance:0,errorRaised:t,_emitter:M,_top:k}
;throw t}}function E(e,n){n=n||d.languages||Object.keys(a);const t=(e=>{
const n={value:J(e),illegal:!1,relevance:0,_top:l,_emitter:new d.__emitter(d)}
;return n._emitter.addText(e),n})(e),i=n.filter(v).filter(k).map((n=>f(n,e,!1)))
;i.unshift(t);const r=i.sort(((e,n)=>{
if(e.relevance!==n.relevance)return n.relevance-e.relevance
;if(e.language&&n.language){if(v(e.language).supersetOf===n.language)return 1
;if(v(n.language).supersetOf===e.language)return-1}return 0})),[s,o]=r,c=s
;return c.secondBest=o,c}function y(e){let n=null;const t=(e=>{
let n=e.className+" ";n+=e.parentNode?e.parentNode.className:""
;const t=d.languageDetectRe.exec(n);if(t){const n=v(t[1])
;return n||(H(o.replace("{}",t[1])),
H("Falling back to no-highlight mode for this block.",e)),n?t[1]:"no-highlight"}
return n.split(/\\s+/).find((e=>_(e)||v(e)))})(e);if(_(t))return
;if(x("before:highlightElement",{el:e,language:t
}),e.children.length>0&&(d.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
console.warn("The element with unescaped HTML:"),
console.warn(e)),d.throwUnescapedHTML))throw new V("One of your code blocks includes unescaped HTML.",e.innerHTML)
;n=e;const a=n.textContent,r=t?h(a,{language:t,ignoreIllegals:!0}):E(a)
;e.innerHTML=r.value,((e,n,t)=>{const a=n&&i[n]||t
;e.classList.add("hljs"),e.classList.add("language-"+a)
})(e,t,r.language),e.result={language:r.language,re:r.relevance,
relevance:r.relevance},r.secondBest&&(e.secondBest={
language:r.secondBest.language,relevance:r.secondBest.relevance
}),x("after:highlightElement",{el:e,result:r,text:a})}let w=!1;function N(){
"loading"!==_document.readyState?_document.querySelectorAll(d.cssSelector).forEach(y):w=!0
}function v(e){return e=(e||"").toLowerCase(),a[e]||a[i[e]]}
function O(e,{languageName:n}){"string"==typeof e&&(e=[e]),e.forEach((e=>{
i[e.toLowerCase()]=n}))}function k(e){const n=v(e)
;return n&&!n.disableAutodetect}function x(e,n){const t=e;r.forEach((e=>{
e[t]&&e[t](n)}))}
"undefined"!=typeof _window&&_window.addEventListener&&_window.addEventListener("DOMContentLoaded",(()=>{
w&&N()}),!1),Object.assign(n,{highlight:h,highlightAuto:E,highlightAll:N,
highlightElement:y,
highlightBlock:e=>(q("10.7.0","highlightBlock will be removed entirely in v12.0"),
q("10.7.0","Please use highlightElement now."),y(e)),configure:e=>{d=Y(d,e)},
initHighlighting:()=>{
N(),q("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},
initHighlightingOnLoad:()=>{
N(),q("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
},registerLanguage:(e,t)=>{let i=null;try{i=t(n)}catch(n){
if(K("Language definition for '{}' could not be registered.".replace("{}",e)),
!s)throw n;K(n),i=l}
i.name||(i.name=e),a[e]=i,i.rawDefinition=t.bind(null,n),i.aliases&&O(i.aliases,{
languageName:e})},unregisterLanguage:e=>{delete a[e]
;for(const n of Object.keys(i))i[n]===e&&delete i[n]},
listLanguages:()=>Object.keys(a),getLanguage:v,registerAliases:O,
autoDetection:k,inherit:Y,addPlugin:e=>{(e=>{
e["before:highlightBlock"]&&!e["before:highlightElement"]&&(e["before:highlightElement"]=n=>{
e["before:highlightBlock"](Object.assign({block:n.el},n))
}),e["after:highlightBlock"]&&!e["after:highlightElement"]&&(e["after:highlightElement"]=n=>{
e["after:highlightBlock"](Object.assign({block:n.el},n))})})(e),r.push(e)}
}),n.debugMode=()=>{s=!1},n.safeMode=()=>{s=!0
},n.versionString="11.7.0",n.regex={concat:m,lookahead:g,either:p,optional:b,
anyNumberOfTimes:u};for(const n in T)"object"==typeof T[n]&&e.exports(T[n])
;return Object.assign(n,T),n})({});const te=e=>({IMPORTANT:{scope:"meta",
begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{
scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\\b/},
FUNCTION_DISPATCH:{className:"built_in",begin:/[\\w-]+(?=\\()/},
ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\\[/,end:/\\]/,illegal:"$",
contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{
scope:"number",
begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z][A-Za-z0-9_-]*/}
}),ae=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","p","q","quote","samp","section","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],ie=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"],re=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"],se=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"],oe=["align-content","align-items","align-self","all","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timing-function","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-repeat","background-size","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","content","content-visibility","counter-increment","counter-reset","cue","cue-after","cue-before","cursor","direction","display","empty-cells","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-size","font-size-adjust","font-smoothing","font-stretch","font-style","font-synthesis","font-variant","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","gap","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","inline-size","isolation","justify-content","left","letter-spacing","line-break","line-height","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-wrap","overflow-x","overflow-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page-break-after","page-break-before","page-break-inside","pause","pause-after","pause-before","perspective","perspective-origin","pointer-events","position","quotes","resize","rest","rest-after","rest-before","right","row-gap","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","speak","speak-as","src","tab-size","table-layout","text-align","text-align-all","text-align-last","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-style","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-transform","text-underline-position","top","transform","transform-box","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","unicode-bidi","vertical-align","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","z-index"].reverse(),le=re.concat(se)
;var ce="\\\\.([0-9](_*[0-9])*)",de="[0-9a-fA-F](_*[0-9a-fA-F])*",ge={
className:"number",variants:[{
begin:\`(\\\\b([0-9](_*[0-9])*)((\${ce})|\\\\.)?|(\${ce}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\\\b\`
},{begin:\`\\\\b([0-9](_*[0-9])*)((\${ce})[fFdD]?\\\\b|\\\\.([fFdD]\\\\b)?)\`},{
begin:\`(\${ce})[fFdD]?\\\\b\`},{begin:"\\\\b([0-9](_*[0-9])*)[fFdD]\\\\b"},{
begin:\`\\\\b0[xX]((\${de})\\\\.?|(\${de})?\\\\.(\${de}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\\\b\`
},{begin:"\\\\b(0|[1-9](_*[0-9])*)[lL]?\\\\b"},{begin:\`\\\\b0[xX](\${de})[lL]?\\\\b\`},{
begin:"\\\\b0(_*[0-7])*[lL]?\\\\b"},{begin:"\\\\b0[bB][01](_*[01])*[lL]?\\\\b"}],
relevance:0};function ue(e,n,t){return-1===t?"":e.replace(n,(a=>ue(e,n,t-1)))}
const be="[A-Za-z$_][0-9A-Za-z$_]*",me=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"],pe=["true","false","null","undefined","NaN","Infinity"],_e=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],he=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],fe=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Ee=["arguments","this","super","console","_window","_document","localStorage","module","global"],ye=[].concat(fe,_e,he)
;function we(e){const n=e.regex,t=be,a={begin:/<[A-Za-z0-9\\\\._:-]+/,
end:/\\/[A-Za-z0-9\\\\._:-]+>|\\/>/,isTrulyOpeningTag:(e,n)=>{
const t=e[0].length+e.index,a=e.input[t]
;if("<"===a||","===a)return void n.ignoreMatch();let i
;">"===a&&(((e,{after:n})=>{const t="</"+e[0].slice(1)
;return-1!==e.input.indexOf(t,n)})(e,{after:t})||n.ignoreMatch())
;const r=e.input.substring(t)
;((i=r.match(/^\\s*=/))||(i=r.match(/^\\s+extends\\s+/))&&0===i.index)&&n.ignoreMatch()
}},i={$pattern:be,keyword:me,literal:pe,built_in:ye,"variable.language":Ee
},r="\\\\.([0-9](_?[0-9])*)",s="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",o={
className:"number",variants:[{
begin:\`(\\\\b(\${s})((\${r})|\\\\.)?|(\${r}))[eE][+-]?([0-9](_?[0-9])*)\\\\b\`},{
begin:\`\\\\b(\${s})\\\\b((\${r})\\\\b|\\\\.)?|(\${r})\\\\b\`},{
begin:"\\\\b(0|[1-9](_?[0-9])*)n\\\\b"},{
begin:"\\\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\\\b"},{
begin:"\\\\b0[bB][0-1](_?[0-1])*n?\\\\b"},{begin:"\\\\b0[oO][0-7](_?[0-7])*n?\\\\b"},{
begin:"\\\\b0[0-7]+n?\\\\b"}],relevance:0},l={className:"subst",begin:"\\\\$\\\\{",
end:"\\\\}",keywords:i,contains:[]},c={begin:"html\`",end:"",starts:{end:"\`",
returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,l],subLanguage:"xml"}},d={
begin:"css\`",end:"",starts:{end:"\`",returnEnd:!1,
contains:[e.BACKSLASH_ESCAPE,l],subLanguage:"css"}},g={className:"string",
begin:"\`",end:"\`",contains:[e.BACKSLASH_ESCAPE,l]},u={className:"comment",
variants:[e.COMMENT(/\\/\\*\\*(?!\\/)/,"\\\\*/",{relevance:0,contains:[{
begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",
begin:"@[A-Za-z]+"},{className:"type",begin:"\\\\{",end:"\\\\}",excludeEnd:!0,
excludeBegin:!0,relevance:0},{className:"variable",begin:t+"(?=\\\\s*(-)|$)",
endsParent:!0,relevance:0},{begin:/(?=[^\\n])\\s/,relevance:0}]}]
}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]
},b=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,c,d,g,{match:/\\$\\d+/},o]
;l.contains=b.concat({begin:/\\{/,end:/\\}/,keywords:i,contains:["self"].concat(b)
});const m=[].concat(u,l.contains),p=m.concat([{begin:/\\(/,end:/\\)/,keywords:i,
contains:["self"].concat(m)}]),_={className:"params",begin:/\\(/,end:/\\)/,
excludeBegin:!0,excludeEnd:!0,keywords:i,contains:p},h={variants:[{
match:[/class/,/\\s+/,t,/\\s+/,/extends/,/\\s+/,n.concat(t,"(",n.concat(/\\./,t),")*")],
scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{
match:[/class/,/\\s+/,t],scope:{1:"keyword",3:"title.class"}}]},f={relevance:0,
match:n.either(/\\bJSON/,/\\b[A-Z][a-z]+([A-Z][a-z]*|\\d)*/,/\\b[A-Z]{2,}([A-Z][a-z]+|\\d)+([A-Z][a-z]*)*/,/\\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\\d)*([A-Z][a-z]*)*/),
className:"title.class",keywords:{_:[..._e,...he]}},E={variants:[{
match:[/function/,/\\s+/,t,/(?=\\s*\\()/]},{match:[/function/,/\\s*(?=\\()/]}],
className:{1:"keyword",3:"title.function"},label:"func.def",contains:[_],
illegal:/%/},y={
match:n.concat(/\\b/,(w=[...fe,"super","import"],n.concat("(?!",w.join("|"),")")),t,n.lookahead(/\\(/)),
className:"title.function",relevance:0};var w;const N={
begin:n.concat(/\\./,n.lookahead(n.concat(t,/(?![0-9A-Za-z$_(])/))),end:t,
excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},v={
match:[/get|set/,/\\s+/,t,/(?=\\()/],className:{1:"keyword",3:"title.function"},
contains:[{begin:/\\(\\)/},_]
},O="(\\\\([^()]*(\\\\([^()]*(\\\\([^()]*\\\\)[^()]*)*\\\\)[^()]*)*\\\\)|"+e.UNDERSCORE_IDENT_RE+")\\\\s*=>",k={
match:[/const|var|let/,/\\s+/,t,/\\s*/,/=\\s*/,/(async\\s*)?/,n.lookahead(O)],
keywords:"async",className:{1:"keyword",3:"title.function"},contains:[_]}
;return{name:"Javascript",aliases:["js","jsx","mjs","cjs"],keywords:i,exports:{
PARAMS_CONTAINS:p,CLASS_REFERENCE:f},illegal:/#(?![$_A-z])/,
contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),{
label:"use_strict",className:"meta",relevance:10,
begin:/^\\s*['"]use (strict|asm)['"]/
},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,c,d,g,u,{match:/\\$\\d+/},o,f,{
className:"attr",begin:t+n.lookahead(":"),relevance:0},k,{
begin:"("+e.RE_STARTERS_RE+"|\\\\b(case|return|throw)\\\\b)\\\\s*",
keywords:"return throw case",relevance:0,contains:[u,e.REGEXP_MODE,{
className:"function",begin:O,returnBegin:!0,end:"\\\\s*=>",contains:[{
className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{
className:null,begin:/\\(\\s*\\)/,skip:!0},{begin:/\\(/,end:/\\)/,excludeBegin:!0,
excludeEnd:!0,keywords:i,contains:p}]}]},{begin:/,/,relevance:0},{match:/\\s+/,
relevance:0},{variants:[{begin:"<>",end:"</>"},{
match:/<[A-Za-z0-9\\\\._:-]+\\s*\\/>/},{begin:a.begin,
"on:begin":a.isTrulyOpeningTag,end:a.end}],subLanguage:"xml",contains:[{
begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}]},E,{
beginKeywords:"while if switch catch for"},{
begin:"\\\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\\\([^()]*(\\\\([^()]*(\\\\([^()]*\\\\)[^()]*)*\\\\)[^()]*)*\\\\)\\\\s*\\\\{",
returnBegin:!0,label:"func.def",contains:[_,e.inherit(e.TITLE_MODE,{begin:t,
className:"title.function"})]},{match:/\\.\\.\\./,relevance:0},N,{match:"\\\\$"+t,
relevance:0},{match:[/\\bconstructor(?=\\s*\\()/],className:{1:"title.function"},
contains:[_]},y,{relevance:0,match:/\\b[A-Z][A-Z_0-9]+\\b/,
className:"variable.constant"},h,v,{match:/\\$[(.]/}]}}
const Ne=e=>m(/\\b/,e,/\\w$/.test(e)?/\\b/:/\\B/),ve=["Protocol","Type"].map(Ne),Oe=["init","self"].map(Ne),ke=["Any","Self"],xe=["actor","any","associatedtype","async","await",/as\\?/,/as!/,"as","break","case","catch","class","continue","convenience","default","defer","deinit","didSet","distributed","do","dynamic","else","enum","extension","fallthrough",/fileprivate\\(set\\)/,"fileprivate","final","for","func","get","guard","if","import","indirect","infix",/init\\?/,/init!/,"inout",/internal\\(set\\)/,"internal","in","is","isolated","nonisolated","lazy","let","mutating","nonmutating",/open\\(set\\)/,"open","operator","optional","override","postfix","precedencegroup","prefix",/private\\(set\\)/,"private","protocol",/public\\(set\\)/,"public","repeat","required","rethrows","return","set","some","static","struct","subscript","super","switch","throws","throw",/try\\?/,/try!/,"try","typealias",/unowned\\(safe\\)/,/unowned\\(unsafe\\)/,"unowned","var","weak","where","while","willSet"],Me=["false","nil","true"],Se=["assignment","associativity","higherThan","left","lowerThan","none","right"],Ae=["#colorLiteral","#column","#dsohandle","#else","#elseif","#endif","#error","#file","#fileID","#fileLiteral","#filePath","#function","#if","#imageLiteral","#keyPath","#line","#selector","#sourceLocation","#warn_unqualified_access","#warning"],Ce=["abs","all","any","assert","assertionFailure","debugPrint","dump","fatalError","getVaList","isKnownUniquelyReferenced","max","min","numericCast","pointwiseMax","pointwiseMin","precondition","preconditionFailure","print","readLine","repeatElement","sequence","stride","swap","swift_unboxFromSwiftValueWithType","transcode","type","unsafeBitCast","unsafeDowncast","withExtendedLifetime","withUnsafeMutablePointer","withUnsafePointer","withVaList","withoutActuallyEscaping","zip"],Te=p(/[/=\\-+!*%<>&|^~?]/,/[\\u00A1-\\u00A7]/,/[\\u00A9\\u00AB]/,/[\\u00AC\\u00AE]/,/[\\u00B0\\u00B1]/,/[\\u00B6\\u00BB\\u00BF\\u00D7\\u00F7]/,/[\\u2016-\\u2017]/,/[\\u2020-\\u2027]/,/[\\u2030-\\u203E]/,/[\\u2041-\\u2053]/,/[\\u2055-\\u205E]/,/[\\u2190-\\u23FF]/,/[\\u2500-\\u2775]/,/[\\u2794-\\u2BFF]/,/[\\u2E00-\\u2E7F]/,/[\\u3001-\\u3003]/,/[\\u3008-\\u3020]/,/[\\u3030]/),Re=p(Te,/[\\u0300-\\u036F]/,/[\\u1DC0-\\u1DFF]/,/[\\u20D0-\\u20FF]/,/[\\uFE00-\\uFE0F]/,/[\\uFE20-\\uFE2F]/),De=m(Te,Re,"*"),Ie=p(/[a-zA-Z_]/,/[\\u00A8\\u00AA\\u00AD\\u00AF\\u00B2-\\u00B5\\u00B7-\\u00BA]/,/[\\u00BC-\\u00BE\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u00FF]/,/[\\u0100-\\u02FF\\u0370-\\u167F\\u1681-\\u180D\\u180F-\\u1DBF]/,/[\\u1E00-\\u1FFF]/,/[\\u200B-\\u200D\\u202A-\\u202E\\u203F-\\u2040\\u2054\\u2060-\\u206F]/,/[\\u2070-\\u20CF\\u2100-\\u218F\\u2460-\\u24FF\\u2776-\\u2793]/,/[\\u2C00-\\u2DFF\\u2E80-\\u2FFF]/,/[\\u3004-\\u3007\\u3021-\\u302F\\u3031-\\u303F\\u3040-\\uD7FF]/,/[\\uF900-\\uFD3D\\uFD40-\\uFDCF\\uFDF0-\\uFE1F\\uFE30-\\uFE44]/,/[\\uFE47-\\uFEFE\\uFF00-\\uFFFD]/),Le=p(Ie,/\\d/,/[\\u0300-\\u036F\\u1DC0-\\u1DFF\\u20D0-\\u20FF\\uFE20-\\uFE2F]/),Be=m(Ie,Le,"*"),$e=m(/[A-Z]/,Le,"*"),ze=["autoclosure",m(/convention\\(/,p("swift","block","c"),/\\)/),"discardableResult","dynamicCallable","dynamicMemberLookup","escaping","frozen","GKInspectable","IBAction","IBDesignable","IBInspectable","IBOutlet","IBSegueAction","inlinable","main","nonobjc","NSApplicationMain","NSCopying","NSManaged",m(/objc\\(/,Be,/\\)/),"objc","objcMembers","propertyWrapper","requires_stored_property_inits","resultBuilder","testable","UIApplicationMain","unknown","usableFromInline"],Fe=["iOS","iOSApplicationExtension","macOS","macOSApplicationExtension","macCatalyst","macCatalystApplicationExtension","watchOS","watchOSApplicationExtension","tvOS","tvOSApplicationExtension","swift"]
;var Ue=Object.freeze({__proto__:null,grmr_bash:e=>{const n=e.regex,t={},a={
begin:/\\$\\{/,end:/\\}/,contains:["self",{begin:/:-/,contains:[t]}]}
;Object.assign(t,{className:"variable",variants:[{
begin:n.concat(/\\$[\\w\\d#@][\\w\\d_]*/,"(?![\\\\w\\\\d])(?![$])")},a]});const i={
className:"subst",begin:/\\$\\(/,end:/\\)/,contains:[e.BACKSLASH_ESCAPE]},r={
begin:/<<-?\\s*(?=\\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\\w+)/,
end:/(\\w+)/,className:"string"})]}},s={className:"string",begin:/"/,end:/"/,
contains:[e.BACKSLASH_ESCAPE,t,i]};i.contains.push(s);const o={begin:/\\$?\\(\\(/,
end:/\\)\\)/,contains:[{begin:/\\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]
},l=e.SHEBANG({binary:"(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",relevance:10
}),c={className:"function",begin:/\\w[\\w\\d_]*\\s*\\(\\s*\\)\\s*\\{/,returnBegin:!0,
contains:[e.inherit(e.TITLE_MODE,{begin:/\\w[\\w\\d_]*/})],relevance:0};return{
name:"Bash",aliases:["sh"],keywords:{$pattern:/\\b[a-z][a-z0-9._-]+\\b/,
keyword:["if","then","else","elif","fi","for","while","in","do","done","case","esac","function"],
literal:["true","false"],
built_in:["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset","alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","type","typeset","ulimit","unalias","set","shopt","autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp","chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"]
},contains:[l,e.SHEBANG(),c,o,e.HASH_COMMENT_MODE,r,{match:/(\\/[a-z._-]+)+/},s,{
className:"",begin:/\\\\"/},{className:"string",begin:/'/,end:/'/},t]}},
grmr_c:e=>{const n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\\\\n/}]
}),a="[a-zA-Z_]\\\\w*::",i="(decltype\\\\(auto\\\\)|"+n.optional(a)+"[a-zA-Z_]\\\\w*"+n.optional("<[^<>]+>")+")",r={
className:"type",variants:[{begin:"\\\\b[a-z\\\\d_]*_t\\\\b"},{
match:/\\batomic_[a-z]{3,6}\\b/}]},s={className:"string",variants:[{
begin:'(u8?|U|L)?"',end:'"',illegal:"\\\\n",contains:[e.BACKSLASH_ESCAPE]},{
begin:"(u8?|U|L)?'(\\\\\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\\\S)|.)",
end:"'",illegal:"."},e.END_SAME_AS_BEGIN({
begin:/(?:u8?|U|L)?R"([^()\\\\ ]{0,16})\\(/,end:/\\)([^()\\\\ ]{0,16})"/})]},o={
className:"number",variants:[{begin:"\\\\b(0b[01']+)"},{
begin:"(-?)\\\\b([\\\\d']+(\\\\.[\\\\d']*)?|\\\\.[\\\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
},{
begin:"(-?)(\\\\b0[xX][a-fA-F0-9']+|(\\\\b[\\\\d']+(\\\\.[\\\\d']*)?|\\\\.[\\\\d']+)([eE][-+]?[\\\\d']+)?)"
}],relevance:0},l={className:"meta",begin:/#\\s*[a-z]+\\b/,end:/$/,keywords:{
keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
},contains:[{begin:/\\\\\\n/,relevance:0},e.inherit(s,{className:"string"}),{
className:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},c={
className:"title",begin:n.optional(a)+e.IDENT_RE,relevance:0
},d=n.optional(a)+e.IDENT_RE+"\\\\s*\\\\(",g={
keyword:["asm","auto","break","case","continue","default","do","else","enum","extern","for","fortran","goto","if","inline","register","restrict","return","sizeof","struct","switch","typedef","union","volatile","while","_Alignas","_Alignof","_Atomic","_Generic","_Noreturn","_Static_assert","_Thread_local","alignas","alignof","noreturn","static_assert","thread_local","_Pragma"],
type:["float","double","signed","unsigned","int","short","long","char","void","_Bool","_Complex","_Imaginary","_Decimal32","_Decimal64","_Decimal128","const","static","complex","bool","imaginary"],
literal:"true false NULL",
built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
},u=[l,r,t,e.C_BLOCK_COMMENT_MODE,o,s],b={variants:[{begin:/=/,end:/;/},{
begin:/\\(/,end:/\\)/},{beginKeywords:"new throw return else",end:/;/}],
keywords:g,contains:u.concat([{begin:/\\(/,end:/\\)/,keywords:g,
contains:u.concat(["self"]),relevance:0}]),relevance:0},m={
begin:"("+i+"[\\\\*&\\\\s]+)+"+d,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,
keywords:g,illegal:/[^\\w\\s\\*&:<>.]/,contains:[{begin:"decltype\\\\(auto\\\\)",
keywords:g,relevance:0},{begin:d,returnBegin:!0,contains:[e.inherit(c,{
className:"title.function"})],relevance:0},{relevance:0,match:/,/},{
className:"params",begin:/\\(/,end:/\\)/,keywords:g,relevance:0,
contains:[t,e.C_BLOCK_COMMENT_MODE,s,o,r,{begin:/\\(/,end:/\\)/,keywords:g,
relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,s,o,r]}]
},r,t,e.C_BLOCK_COMMENT_MODE,l]};return{name:"C",aliases:["h"],keywords:g,
disableAutodetect:!0,illegal:"</",contains:[].concat(b,m,u,[l,{
begin:e.IDENT_RE+"::",keywords:g},{className:"class",
beginKeywords:"enum class struct union",end:/[{;:<>=]/,contains:[{
beginKeywords:"final class struct"},e.TITLE_MODE]}]),exports:{preprocessor:l,
strings:s,keywords:g}}},grmr_cpp:e=>{const n=e.regex,t=e.COMMENT("//","$",{
contains:[{begin:/\\\\\\n/}]
}),a="[a-zA-Z_]\\\\w*::",i="(?!struct)(decltype\\\\(auto\\\\)|"+n.optional(a)+"[a-zA-Z_]\\\\w*"+n.optional("<[^<>]+>")+")",r={
className:"type",begin:"\\\\b[a-z\\\\d_]*_t\\\\b"},s={className:"string",variants:[{
begin:'(u8?|U|L)?"',end:'"',illegal:"\\\\n",contains:[e.BACKSLASH_ESCAPE]},{
begin:"(u8?|U|L)?'(\\\\\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\\\S)|.)",
end:"'",illegal:"."},e.END_SAME_AS_BEGIN({
begin:/(?:u8?|U|L)?R"([^()\\\\ ]{0,16})\\(/,end:/\\)([^()\\\\ ]{0,16})"/})]},o={
className:"number",variants:[{begin:"\\\\b(0b[01']+)"},{
begin:"(-?)\\\\b([\\\\d']+(\\\\.[\\\\d']*)?|\\\\.[\\\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
},{
begin:"(-?)(\\\\b0[xX][a-fA-F0-9']+|(\\\\b[\\\\d']+(\\\\.[\\\\d']*)?|\\\\.[\\\\d']+)([eE][-+]?[\\\\d']+)?)"
}],relevance:0},l={className:"meta",begin:/#\\s*[a-z]+\\b/,end:/$/,keywords:{
keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
},contains:[{begin:/\\\\\\n/,relevance:0},e.inherit(s,{className:"string"}),{
className:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},c={
className:"title",begin:n.optional(a)+e.IDENT_RE,relevance:0
},d=n.optional(a)+e.IDENT_RE+"\\\\s*\\\\(",g={
type:["bool","char","char16_t","char32_t","char8_t","double","float","int","long","short","void","wchar_t","unsigned","signed","const","static"],
keyword:["alignas","alignof","and","and_eq","asm","atomic_cancel","atomic_commit","atomic_noexcept","auto","bitand","bitor","break","case","catch","class","co_await","co_return","co_yield","compl","concept","const_cast|10","consteval","constexpr","constinit","continue","decltype","default","delete","do","dynamic_cast|10","else","enum","explicit","export","extern","false","final","for","friend","goto","if","import","inline","module","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or","or_eq","override","private","protected","public","reflexpr","register","reinterpret_cast|10","requires","return","sizeof","static_assert","static_cast|10","struct","switch","synchronized","template","this","thread_local","throw","transaction_safe","transaction_safe_dynamic","true","try","typedef","typeid","typename","union","using","virtual","volatile","while","xor","xor_eq"],
literal:["NULL","false","nullopt","nullptr","true"],built_in:["_Pragma"],
_type_hints:["any","auto_ptr","barrier","binary_semaphore","bitset","complex","condition_variable","condition_variable_any","counting_semaphore","deque","false_type","future","imaginary","initializer_list","istringstream","jthread","latch","lock_guard","multimap","multiset","mutex","optional","ostringstream","packaged_task","pair","promise","priority_queue","queue","recursive_mutex","recursive_timed_mutex","scoped_lock","set","shared_future","shared_lock","shared_mutex","shared_timed_mutex","shared_ptr","stack","string_view","stringstream","timed_mutex","thread","true_type","tuple","unique_lock","unique_ptr","unordered_map","unordered_multimap","unordered_multiset","unordered_set","variant","vector","weak_ptr","wstring","wstring_view"]
},u={className:"function.dispatch",relevance:0,keywords:{
_hint:["abort","abs","acos","apply","as_const","asin","atan","atan2","calloc","ceil","cerr","cin","clog","cos","cosh","cout","declval","endl","exchange","exit","exp","fabs","floor","fmod","forward","fprintf","fputs","free","frexp","fscanf","future","invoke","isalnum","isalpha","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","labs","launder","ldexp","log","log10","make_pair","make_shared","make_shared_for_overwrite","make_tuple","make_unique","malloc","memchr","memcmp","memcpy","memset","modf","move","pow","printf","putchar","puts","realloc","scanf","sin","sinh","snprintf","sprintf","sqrt","sscanf","std","stderr","stdin","stdout","strcat","strchr","strcmp","strcpy","strcspn","strlen","strncat","strncmp","strncpy","strpbrk","strrchr","strspn","strstr","swap","tan","tanh","terminate","to_underlying","tolower","toupper","vfprintf","visit","vprintf","vsprintf"]
},
begin:n.concat(/\\b/,/(?!decltype)/,/(?!if)/,/(?!for)/,/(?!switch)/,/(?!while)/,e.IDENT_RE,n.lookahead(/(<[^<>]+>|)\\s*\\(/))
},b=[u,l,r,t,e.C_BLOCK_COMMENT_MODE,o,s],m={variants:[{begin:/=/,end:/;/},{
begin:/\\(/,end:/\\)/},{beginKeywords:"new throw return else",end:/;/}],
keywords:g,contains:b.concat([{begin:/\\(/,end:/\\)/,keywords:g,
contains:b.concat(["self"]),relevance:0}]),relevance:0},p={className:"function",
begin:"("+i+"[\\\\*&\\\\s]+)+"+d,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,
keywords:g,illegal:/[^\\w\\s\\*&:<>.]/,contains:[{begin:"decltype\\\\(auto\\\\)",
keywords:g,relevance:0},{begin:d,returnBegin:!0,contains:[c],relevance:0},{
begin:/::/,relevance:0},{begin:/:/,endsWithParent:!0,contains:[s,o]},{
relevance:0,match:/,/},{className:"params",begin:/\\(/,end:/\\)/,keywords:g,
relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,s,o,r,{begin:/\\(/,end:/\\)/,
keywords:g,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,s,o,r]}]
},r,t,e.C_BLOCK_COMMENT_MODE,l]};return{name:"C++",
aliases:["cc","c++","h++","hpp","hh","hxx","cxx"],keywords:g,illegal:"</",
classNameAliases:{"function.dispatch":"built_in"},
contains:[].concat(m,p,u,b,[l,{
begin:"\\\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\\\s*<(?!<)",
end:">",keywords:g,contains:["self",r]},{begin:e.IDENT_RE+"::",keywords:g},{
match:[/\\b(?:enum(?:\\s+(?:class|struct))?|class|struct|union)/,/\\s+/,/\\w+/],
className:{1:"keyword",3:"title.class"}}])}},grmr_csharp:e=>{const n={
keyword:["abstract","as","base","break","case","catch","class","const","continue","do","else","event","explicit","extern","finally","fixed","for","foreach","goto","if","implicit","in","interface","internal","is","lock","namespace","new","operator","out","override","params","private","protected","public","readonly","record","ref","return","scoped","sealed","sizeof","stackalloc","static","struct","switch","this","throw","try","typeof","unchecked","unsafe","using","virtual","void","volatile","while"].concat(["add","alias","and","ascending","async","await","by","descending","equals","from","get","global","group","init","into","join","let","nameof","not","notnull","on","or","orderby","partial","remove","select","set","unmanaged","value|0","var","when","where","with","yield"]),
built_in:["bool","byte","char","decimal","delegate","double","dynamic","enum","float","int","long","nint","nuint","object","sbyte","short","string","ulong","uint","ushort"],
literal:["default","false","null","true"]},t=e.inherit(e.TITLE_MODE,{
begin:"[a-zA-Z](\\\\.?\\\\w)*"}),a={className:"number",variants:[{
begin:"\\\\b(0b[01']+)"},{
begin:"(-?)\\\\b([\\\\d']+(\\\\.[\\\\d']*)?|\\\\.[\\\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{
begin:"(-?)(\\\\b0[xX][a-fA-F0-9']+|(\\\\b[\\\\d']+(\\\\.[\\\\d']*)?|\\\\.[\\\\d']+)([eE][-+]?[\\\\d']+)?)"
}],relevance:0},i={className:"string",begin:'@"',end:'"',contains:[{begin:'""'}]
},r=e.inherit(i,{illegal:/\\n/}),s={className:"subst",begin:/\\{/,end:/\\}/,
keywords:n},o=e.inherit(s,{illegal:/\\n/}),l={className:"string",begin:/\\$"/,
end:'"',illegal:/\\n/,contains:[{begin:/\\{\\{/},{begin:/\\}\\}/
},e.BACKSLASH_ESCAPE,o]},c={className:"string",begin:/\\$@"/,end:'"',contains:[{
begin:/\\{\\{/},{begin:/\\}\\}/},{begin:'""'},s]},d=e.inherit(c,{illegal:/\\n/,
contains:[{begin:/\\{\\{/},{begin:/\\}\\}/},{begin:'""'},o]})
;s.contains=[c,l,i,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,a,e.C_BLOCK_COMMENT_MODE],
o.contains=[d,l,r,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,a,e.inherit(e.C_BLOCK_COMMENT_MODE,{
illegal:/\\n/})];const g={variants:[c,l,i,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
},u={begin:"<",end:">",contains:[{beginKeywords:"in out"},t]
},b=e.IDENT_RE+"(<"+e.IDENT_RE+"(\\\\s*,\\\\s*"+e.IDENT_RE+")*>)?(\\\\[\\\\])?",m={
begin:"@"+e.IDENT_RE,relevance:0};return{name:"C#",aliases:["cs","c#"],
keywords:n,illegal:/::/,contains:[e.COMMENT("///","$",{returnBegin:!0,
contains:[{className:"doctag",variants:[{begin:"///",relevance:0},{
begin:"\\x3c!--|--\\x3e"},{begin:"</?",end:">"}]}]
}),e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"meta",begin:"#",
end:"$",keywords:{
keyword:"if else elif endif define undef warning error line region endregion pragma checksum"
}},g,a,{beginKeywords:"class interface",relevance:0,end:/[{;=]/,
illegal:/[^\\s:,]/,contains:[{beginKeywords:"where class"
},t,u,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"namespace",
relevance:0,end:/[{;=]/,illegal:/[^\\s:]/,
contains:[t,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{
beginKeywords:"record",relevance:0,end:/[{;=]/,illegal:/[^\\s:]/,
contains:[t,u,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"meta",
begin:"^\\\\s*\\\\[(?=[\\\\w])",excludeBegin:!0,end:"\\\\]",excludeEnd:!0,contains:[{
className:"string",begin:/"/,end:/"/}]},{
beginKeywords:"new return throw await else",relevance:0},{className:"function",
begin:"("+b+"\\\\s+)+"+e.IDENT_RE+"\\\\s*(<[^=]+>\\\\s*)?\\\\(",returnBegin:!0,
end:/\\s*[{;=]/,excludeEnd:!0,keywords:n,contains:[{
beginKeywords:"public private protected static internal protected abstract async extern override unsafe virtual new sealed partial",
relevance:0},{begin:e.IDENT_RE+"\\\\s*(<[^=]+>\\\\s*)?\\\\(",returnBegin:!0,
contains:[e.TITLE_MODE,u],relevance:0},{match:/\\(\\)/},{className:"params",
begin:/\\(/,end:/\\)/,excludeBegin:!0,excludeEnd:!0,keywords:n,relevance:0,
contains:[g,a,e.C_BLOCK_COMMENT_MODE]
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},m]}},grmr_css:e=>{
const n=e.regex,t=te(e),a=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE];return{
name:"CSS",case_insensitive:!0,illegal:/[=|'\\$]/,keywords:{
keyframePosition:"from to"},classNameAliases:{keyframePosition:"selector-tag"},
contains:[t.BLOCK_COMMENT,{begin:/-(webkit|moz|ms|o)-(?=[a-z])/
},t.CSS_NUMBER_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0
},{className:"selector-class",begin:"\\\\.[a-zA-Z-][a-zA-Z0-9_-]*",relevance:0
},t.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{
begin:":("+re.join("|")+")"},{begin:":(:)?("+se.join("|")+")"}]
},t.CSS_VARIABLE,{className:"attribute",begin:"\\\\b("+oe.join("|")+")\\\\b"},{
begin:/:/,end:/[;}{]/,
contains:[t.BLOCK_COMMENT,t.HEXCOLOR,t.IMPORTANT,t.CSS_NUMBER_MODE,...a,{
begin:/(url|data-uri)\\(/,end:/\\)/,relevance:0,keywords:{built_in:"url data-uri"
},contains:[...a,{className:"string",begin:/[^)]/,endsWithParent:!0,
excludeEnd:!0}]},t.FUNCTION_DISPATCH]},{begin:n.lookahead(/@/),end:"[{;]",
relevance:0,illegal:/:/,contains:[{className:"keyword",begin:/@-?\\w[\\w]*(-\\w+)*/
},{begin:/\\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{
$pattern:/[a-z-]+/,keyword:"and or not only",attribute:ie.join(" ")},contains:[{
begin:/[a-z-]+(?=:)/,className:"attribute"},...a,t.CSS_NUMBER_MODE]}]},{
className:"selector-tag",begin:"\\\\b("+ae.join("|")+")\\\\b"}]}},grmr_diff:e=>{
const n=e.regex;return{name:"Diff",aliases:["patch"],contains:[{
className:"meta",relevance:10,
match:n.either(/^@@ +-\\d+,\\d+ +\\+\\d+,\\d+ +@@/,/^\\*\\*\\* +\\d+,\\d+ +\\*\\*\\*\\*$/,/^--- +\\d+,\\d+ +----$/)
},{className:"comment",variants:[{
begin:n.either(/Index: /,/^index/,/={3,}/,/^-{3}/,/^\\*{3} /,/^\\+{3}/,/^diff --git/),
end:/$/},{match:/^\\*{15}$/}]},{className:"addition",begin:/^\\+/,end:/$/},{
className:"deletion",begin:/^-/,end:/$/},{className:"addition",begin:/^!/,
end:/$/}]}},grmr_go:e=>{const n={
keyword:["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],
type:["bool","byte","complex64","complex128","error","float32","float64","int8","int16","int32","int64","string","uint8","uint16","uint32","uint64","int","uint","uintptr","rune"],
literal:["true","false","iota","nil"],
built_in:["append","cap","close","complex","copy","imag","len","make","new","panic","print","println","real","recover","delete"]
};return{name:"Go",aliases:["golang"],keywords:n,illegal:"</",
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",
variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"\`",end:"\`"}]},{
className:"number",variants:[{begin:e.C_NUMBER_RE+"[i]",relevance:1
},e.C_NUMBER_MODE]},{begin:/:=/},{className:"function",beginKeywords:"func",
end:"\\\\s*(\\\\{|$)",excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",
begin:/\\(/,end:/\\)/,endsParent:!0,keywords:n,illegal:/["']/}]}]}},
grmr_graphql:e=>{const n=e.regex;return{name:"GraphQL",aliases:["gql"],
case_insensitive:!0,disableAutodetect:!1,keywords:{
keyword:["query","mutation","subscription","type","input","schema","directive","interface","union","scalar","fragment","enum","on"],
literal:["true","false","null"]},
contains:[e.HASH_COMMENT_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE,{
scope:"punctuation",match:/[.]{3}/,relevance:0},{scope:"punctuation",
begin:/[\\!\\(\\)\\:\\=\\[\\]\\{\\|\\}]{1}/,relevance:0},{scope:"variable",begin:/\\$/,
end:/\\W/,excludeEnd:!0,relevance:0},{scope:"meta",match:/@\\w+/,excludeEnd:!0},{
scope:"symbol",begin:n.concat(/[_A-Za-z][_0-9A-Za-z]*/,n.lookahead(/\\s*:/)),
relevance:0}],illegal:[/[;<']/,/BEGIN/]}},grmr_ini:e=>{const n=e.regex,t={
className:"number",relevance:0,variants:[{begin:/([+-]+)?[\\d]+_[\\d_]+/},{
begin:e.NUMBER_RE}]},a=e.COMMENT();a.variants=[{begin:/;/,end:/$/},{begin:/#/,
end:/$/}];const i={className:"variable",variants:[{begin:/\\$[\\w\\d"][\\w\\d_]*/},{
begin:/\\$\\{(.*?)\\}/}]},r={className:"literal",
begin:/\\bon|off|true|false|yes|no\\b/},s={className:"string",
contains:[e.BACKSLASH_ESCAPE],variants:[{begin:"'''",end:"'''",relevance:10},{
begin:'"""',end:'"""',relevance:10},{begin:'"',end:'"'},{begin:"'",end:"'"}]
},o={begin:/\\[/,end:/\\]/,contains:[a,r,i,s,t,"self"],relevance:0
},l=n.either(/[A-Za-z0-9_-]+/,/"(\\\\"|[^"])*"/,/'[^']*'/);return{
name:"TOML, also INI",aliases:["toml"],case_insensitive:!0,illegal:/\\S/,
contains:[a,{className:"section",begin:/\\[+/,end:/\\]+/},{
begin:n.concat(l,"(\\\\s*\\\\.\\\\s*",l,")*",n.lookahead(/\\s*=\\s*[^#\\s]/)),
className:"attr",starts:{end:/$/,contains:[a,o,r,i,s,t]}}]}},grmr_java:e=>{
const n=e.regex,t="[\\xc0-\\u02b8a-zA-Z_$][\\xc0-\\u02b8a-zA-Z_$0-9]*",a=t+ue("(?:<"+t+"~~~(?:\\\\s*,\\\\s*"+t+"~~~)*>)?",/~~~/g,2),i={
keyword:["synchronized","abstract","private","var","static","if","const ","for","while","strictfp","finally","protected","import","native","final","void","enum","else","break","transient","catch","instanceof","volatile","case","assert","package","default","public","try","switch","continue","throws","protected","public","private","module","requires","exports","do","sealed","yield","permits"],
literal:["false","true","null"],
type:["char","boolean","long","float","int","byte","short","double"],
built_in:["super","this"]},r={className:"meta",begin:"@"+t,contains:[{
begin:/\\(/,end:/\\)/,contains:["self"]}]},s={className:"params",begin:/\\(/,
end:/\\)/,keywords:i,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE],endsParent:!0}
;return{name:"Java",aliases:["jsp"],keywords:i,illegal:/<\\/|#/,
contains:[e.COMMENT("/\\\\*\\\\*","\\\\*/",{relevance:0,contains:[{begin:/\\w+@/,
relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{
begin:/import java\\.[a-z]+\\./,keywords:"import",relevance:2
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{begin:/"""/,end:/"""/,
className:"string",contains:[e.BACKSLASH_ESCAPE]
},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{
match:[/\\b(?:class|interface|enum|extends|implements|new)/,/\\s+/,t],className:{
1:"keyword",3:"title.class"}},{match:/non-sealed/,scope:"keyword"},{
begin:[n.concat(/(?!else)/,t),/\\s+/,t,/\\s+/,/=(?!=)/],className:{1:"type",
3:"variable",5:"operator"}},{begin:[/record/,/\\s+/,t],className:{1:"keyword",
3:"title.class"},contains:[s,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{
beginKeywords:"new throw return else",relevance:0},{
begin:["(?:"+a+"\\\\s+)",e.UNDERSCORE_IDENT_RE,/\\s*(?=\\()/],className:{
2:"title.function"},keywords:i,contains:[{className:"params",begin:/\\(/,
end:/\\)/,keywords:i,relevance:0,
contains:[r,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,ge,e.C_BLOCK_COMMENT_MODE]
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},ge,r]}},grmr_javascript:we,
grmr_json:e=>{const n=["true","false","null"],t={scope:"literal",
beginKeywords:n.join(" ")};return{name:"JSON",keywords:{literal:n},contains:[{
className:"attr",begin:/"(\\\\.|[^\\\\"\\r\\n])*"(?=\\s*:)/,relevance:1.01},{
match:/[{}[\\],:]/,className:"punctuation",relevance:0
},e.QUOTE_STRING_MODE,t,e.C_NUMBER_MODE,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],
illegal:"\\\\S"}},grmr_kotlin:e=>{const n={
keyword:"abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
built_in:"Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
literal:"true false null"},t={className:"symbol",begin:e.UNDERSCORE_IDENT_RE+"@"
},a={className:"subst",begin:/\\$\\{/,end:/\\}/,contains:[e.C_NUMBER_MODE]},i={
className:"variable",begin:"\\\\$"+e.UNDERSCORE_IDENT_RE},r={className:"string",
variants:[{begin:'"""',end:'"""(?=[^"])',contains:[i,a]},{begin:"'",end:"'",
illegal:/\\n/,contains:[e.BACKSLASH_ESCAPE]},{begin:'"',end:'"',illegal:/\\n/,
contains:[e.BACKSLASH_ESCAPE,i,a]}]};a.contains.push(r);const s={
className:"meta",
begin:"@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\\\s*:(?:\\\\s*"+e.UNDERSCORE_IDENT_RE+")?"
},o={className:"meta",begin:"@"+e.UNDERSCORE_IDENT_RE,contains:[{begin:/\\(/,
end:/\\)/,contains:[e.inherit(r,{className:"string"}),"self"]}]
},l=ge,c=e.COMMENT("/\\\\*","\\\\*/",{contains:[e.C_BLOCK_COMMENT_MODE]}),d={
variants:[{className:"type",begin:e.UNDERSCORE_IDENT_RE},{begin:/\\(/,end:/\\)/,
contains:[]}]},g=d;return g.variants[1].contains=[d],d.variants[1].contains=[g],
{name:"Kotlin",aliases:["kt","kts"],keywords:n,
contains:[e.COMMENT("/\\\\*\\\\*","\\\\*/",{relevance:0,contains:[{className:"doctag",
begin:"@[A-Za-z]+"}]}),e.C_LINE_COMMENT_MODE,c,{className:"keyword",
begin:/\\b(break|continue|return|this)\\b/,starts:{contains:[{className:"symbol",
begin:/@\\w+/}]}},t,s,o,{className:"function",beginKeywords:"fun",end:"[(]|$",
returnBegin:!0,excludeEnd:!0,keywords:n,relevance:5,contains:[{
begin:e.UNDERSCORE_IDENT_RE+"\\\\s*\\\\(",returnBegin:!0,relevance:0,
contains:[e.UNDERSCORE_TITLE_MODE]},{className:"type",begin:/</,end:/>/,
keywords:"reified",relevance:0},{className:"params",begin:/\\(/,end:/\\)/,
endsParent:!0,keywords:n,relevance:0,contains:[{begin:/:/,end:/[=,\\/]/,
endsWithParent:!0,contains:[d,e.C_LINE_COMMENT_MODE,c],relevance:0
},e.C_LINE_COMMENT_MODE,c,s,o,r,e.C_NUMBER_MODE]},c]},{
begin:[/class|interface|trait/,/\\s+/,e.UNDERSCORE_IDENT_RE],beginScope:{
3:"title.class"},keywords:"class interface trait",end:/[:\\{(]|$/,excludeEnd:!0,
illegal:"extends implements",contains:[{
beginKeywords:"public protected internal private constructor"
},e.UNDERSCORE_TITLE_MODE,{className:"type",begin:/</,end:/>/,excludeBegin:!0,
excludeEnd:!0,relevance:0},{className:"type",begin:/[,:]\\s*/,end:/[<\\(,){\\s]|$/,
excludeBegin:!0,returnEnd:!0},s,o]},r,{className:"meta",begin:"^#!/usr/bin/env",
end:"$",illegal:"\\n"},l]}},grmr_less:e=>{
const n=te(e),t=le,a="([\\\\w-]+|@\\\\{[\\\\w-]+\\\\})",i=[],r=[],s=e=>({
className:"string",begin:"~?"+e+".*?"+e}),o=(e,n,t)=>({className:e,begin:n,
relevance:t}),l={$pattern:/[a-z-]+/,keyword:"and or not only",
attribute:ie.join(" ")},c={begin:"\\\\(",end:"\\\\)",contains:r,keywords:l,
relevance:0}
;r.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,s("'"),s('"'),n.CSS_NUMBER_MODE,{
begin:"(url|data-uri)\\\\(",starts:{className:"string",end:"[\\\\)\\\\n]",
excludeEnd:!0}
},n.HEXCOLOR,c,o("variable","@@?[\\\\w-]+",10),o("variable","@\\\\{[\\\\w-]+\\\\}"),o("built_in","~?\`[^\`]*?\`"),{
className:"attribute",begin:"[\\\\w-]+\\\\s*:",end:":",returnBegin:!0,excludeEnd:!0
},n.IMPORTANT,{beginKeywords:"and not"},n.FUNCTION_DISPATCH);const d=r.concat({
begin:/\\{/,end:/\\}/,contains:i}),g={beginKeywords:"when",endsWithParent:!0,
contains:[{beginKeywords:"and not"}].concat(r)},u={begin:a+"\\\\s*:",
returnBegin:!0,end:/[;}]/,relevance:0,contains:[{begin:/-(webkit|moz|ms|o)-/
},n.CSS_VARIABLE,{className:"attribute",begin:"\\\\b("+oe.join("|")+")\\\\b",
end:/(?=:)/,starts:{endsWithParent:!0,illegal:"[<=$]",relevance:0,contains:r}}]
},b={className:"keyword",
begin:"@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|_document|namespace|page|viewport|host)\\\\b",
starts:{end:"[;{}]",keywords:l,returnEnd:!0,contains:r,relevance:0}},m={
className:"variable",variants:[{begin:"@[\\\\w-]+\\\\s*:",relevance:15},{
begin:"@[\\\\w-]+"}],starts:{end:"[;}]",returnEnd:!0,contains:d}},p={variants:[{
begin:"[\\\\.#:&\\\\[>]",end:"[;{}]"},{begin:a,end:/\\{/}],returnBegin:!0,
returnEnd:!0,illegal:"[<='$\\"]",relevance:0,
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,g,o("keyword","all\\\\b"),o("variable","@\\\\{[\\\\w-]+\\\\}"),{
begin:"\\\\b("+ae.join("|")+")\\\\b",className:"selector-tag"
},n.CSS_NUMBER_MODE,o("selector-tag",a,0),o("selector-id","#"+a),o("selector-class","\\\\."+a,0),o("selector-tag","&",0),n.ATTRIBUTE_SELECTOR_MODE,{
className:"selector-pseudo",begin:":("+re.join("|")+")"},{
className:"selector-pseudo",begin:":(:)?("+se.join("|")+")"},{begin:/\\(/,
end:/\\)/,relevance:0,contains:d},{begin:"!important"},n.FUNCTION_DISPATCH]},_={
begin:\`[\\\\w-]+:(:)?(\${t.join("|")})\`,returnBegin:!0,contains:[p]}
;return i.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,b,m,_,u,p,g,n.FUNCTION_DISPATCH),
{name:"Less",case_insensitive:!0,illegal:"[=>'/<($\\"]",contains:i}},
grmr_lua:e=>{const n="\\\\[=*\\\\[",t="\\\\]=*\\\\]",a={begin:n,end:t,contains:["self"]
},i=[e.COMMENT("--(?!\\\\[=*\\\\[)","$"),e.COMMENT("--\\\\[=*\\\\[",t,{contains:[a],
relevance:10})];return{name:"Lua",keywords:{$pattern:e.UNDERSCORE_IDENT_RE,
literal:"true false nil",
keyword:"and break do else elseif end for goto if in local not or repeat return then until while",
built_in:"_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
},contains:i.concat([{className:"function",beginKeywords:"function",end:"\\\\)",
contains:[e.inherit(e.TITLE_MODE,{
begin:"([_a-zA-Z]\\\\w*\\\\.)*([_a-zA-Z]\\\\w*:)?[_a-zA-Z]\\\\w*"}),{className:"params",
begin:"\\\\(",endsWithParent:!0,contains:i}].concat(i)
},e.C_NUMBER_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{className:"string",
begin:n,end:t,contains:[a],relevance:5}])}},grmr_makefile:e=>{const n={
className:"variable",variants:[{begin:"\\\\$\\\\("+e.UNDERSCORE_IDENT_RE+"\\\\)",
contains:[e.BACKSLASH_ESCAPE]},{begin:/\\$[@%<?\\^\\+\\*]/}]},t={className:"string",
begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,n]},a={className:"variable",
begin:/\\$\\([\\w-]+\\s/,end:/\\)/,keywords:{
built_in:"subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
},contains:[n]},i={begin:"^"+e.UNDERSCORE_IDENT_RE+"\\\\s*(?=[:+?]?=)"},r={
className:"section",begin:/^[^\\s]+:/,end:/$/,contains:[n]};return{
name:"Makefile",aliases:["mk","mak","make"],keywords:{$pattern:/[\\w-]+/,
keyword:"define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
},contains:[e.HASH_COMMENT_MODE,n,t,a,i,{className:"meta",begin:/^\\.PHONY:/,
end:/$/,keywords:{$pattern:/[\\.\\w]+/,keyword:".PHONY"}},r]}},grmr_xml:e=>{
const n=e.regex,t=n.concat(/[\\p{L}_]/u,n.optional(/[\\p{L}0-9_.-]*:/u),/[\\p{L}0-9_.-]*/u),a={
className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},i={begin:/\\s/,
contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\\n/}]
},r=e.inherit(i,{begin:/\\(/,end:/\\)/}),s=e.inherit(e.APOS_STRING_MODE,{
className:"string"}),o=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),l={
endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",
begin:/[\\p{L}0-9._:-]+/u,relevance:0},{begin:/=\\s*/,relevance:0,contains:[{
className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[a]},{
begin:/'/,end:/'/,contains:[a]},{begin:/[^\\s"'=<>\`]+/}]}]}]};return{
name:"HTML, XML",
aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],
case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,
end:/>/,relevance:10,contains:[i,o,s,r,{begin:/\\[/,end:/\\]/,contains:[{
className:"meta",begin:/<![a-z]/,end:/>/,contains:[i,r,o,s]}]}]
},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\\[CDATA\\[/,end:/\\]\\]>/,
relevance:10},a,{className:"meta",end:/\\?>/,variants:[{begin:/<\\?xml/,
relevance:10,contains:[o]},{begin:/<\\?[a-z][a-z0-9]+/}]},{className:"tag",
begin:/<style(?=\\s|>)/,end:/>/,keywords:{name:"style"},contains:[l],starts:{
end:/<\\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",
begin:/<script(?=\\s|>)/,end:/>/,keywords:{name:"script"},contains:[l],starts:{
end:/<\\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{
className:"tag",begin:/<>|<\\/>/},{className:"tag",
begin:n.concat(/</,n.lookahead(n.concat(t,n.either(/\\/>/,/>/,/\\s/)))),
end:/\\/?>/,contains:[{className:"name",begin:t,relevance:0,starts:l}]},{
className:"tag",begin:n.concat(/<\\//,n.lookahead(n.concat(t,/>/))),contains:[{
className:"name",begin:t,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}
},grmr_markdown:e=>{const n={begin:/<\\/?[A-Za-z_]/,end:">",subLanguage:"xml",
relevance:0},t={variants:[{begin:/\\[.+?\\]\\[.*?\\]/,relevance:0},{
begin:/\\[.+?\\]\\(((data|javascript|mailto):|(?:http|ftp)s?:\\/\\/).*?\\)/,
relevance:2},{
begin:e.regex.concat(/\\[.+?\\]\\(/,/[A-Za-z][A-Za-z0-9+.-]*/,/:\\/\\/.*?\\)/),
relevance:2},{begin:/\\[.+?\\]\\([./?&#].*?\\)/,relevance:1},{
begin:/\\[.*?\\]\\(.*?\\)/,relevance:0}],returnBegin:!0,contains:[{match:/\\[(?=\\])/
},{className:"string",relevance:0,begin:"\\\\[",end:"\\\\]",excludeBegin:!0,
returnEnd:!0},{className:"link",relevance:0,begin:"\\\\]\\\\(",end:"\\\\)",
excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\\\]\\\\[",
end:"\\\\]",excludeBegin:!0,excludeEnd:!0}]},a={className:"strong",contains:[],
variants:[{begin:/_{2}(?!\\s)/,end:/_{2}/},{begin:/\\*{2}(?!\\s)/,end:/\\*{2}/}]
},i={className:"emphasis",contains:[],variants:[{begin:/\\*(?![*\\s])/,end:/\\*/},{
begin:/_(?![_\\s])/,end:/_/,relevance:0}]},r=e.inherit(a,{contains:[]
}),s=e.inherit(i,{contains:[]});a.contains.push(s),i.contains.push(r)
;let o=[n,t];return[a,i,r,s].forEach((e=>{e.contains=e.contains.concat(o)
})),o=o.concat(a,i),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{
className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:o},{
begin:"(?=^.+?\\\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\\\n",
contains:o}]}]},n,{className:"bullet",begin:"^[ \\t]*([*+-]|(\\\\d+\\\\.))(?=\\\\s+)",
end:"\\\\s+",excludeEnd:!0},a,i,{className:"quote",begin:"^>\\\\s+",contains:o,
end:"$"},{className:"code",variants:[{begin:"(\`{3,})[^\`](.|\\\\n)*?\\\\1\`*[ ]*"},{
begin:"(~{3,})[^~](.|\\\\n)*?\\\\1~*[ ]*"},{begin:"\`\`\`",end:"\`\`\`+[ ]*$"},{
begin:"~~~",end:"~~~+[ ]*$"},{begin:"\`.+?\`"},{begin:"(?=^( {4}|\\\\t))",
contains:[{begin:"^( {4}|\\\\t)",end:"(\\\\n)$"}],relevance:0}]},{
begin:"^[-\\\\*]{3,}",end:"$"},t,{begin:/^\\[[^\\n]+\\]:/,returnBegin:!0,contains:[{
className:"symbol",begin:/\\[/,end:/\\]/,excludeBegin:!0,excludeEnd:!0},{
className:"link",begin:/:\\s*/,end:/$/,excludeBegin:!0}]}]}},grmr_objectivec:e=>{
const n=/[a-zA-Z@][a-zA-Z0-9_]*/,t={$pattern:n,
keyword:["@interface","@class","@protocol","@implementation"]};return{
name:"Objective-C",aliases:["mm","objc","obj-c","obj-c++","objective-c++"],
keywords:{"variable.language":["this","super"],$pattern:n,
keyword:["while","export","sizeof","typedef","const","struct","for","union","volatile","static","mutable","if","do","return","goto","enum","else","break","extern","asm","case","default","register","explicit","typename","switch","continue","inline","readonly","assign","readwrite","self","@synchronized","id","typeof","nonatomic","IBOutlet","IBAction","strong","weak","copy","in","out","inout","bycopy","byref","oneway","__strong","__weak","__block","__autoreleasing","@private","@protected","@public","@try","@property","@end","@throw","@catch","@finally","@autoreleasepool","@synthesize","@dynamic","@selector","@optional","@required","@encode","@package","@import","@defs","@compatibility_alias","__bridge","__bridge_transfer","__bridge_retained","__bridge_retain","__covariant","__contravariant","__kindof","_Nonnull","_Nullable","_Null_unspecified","__FUNCTION__","__PRETTY_FUNCTION__","__attribute__","getter","setter","retain","unsafe_unretained","nonnull","nullable","null_unspecified","null_resettable","class","instancetype","NS_DESIGNATED_INITIALIZER","NS_UNAVAILABLE","NS_REQUIRES_SUPER","NS_RETURNS_INNER_POINTER","NS_INLINE","NS_AVAILABLE","NS_DEPRECATED","NS_ENUM","NS_OPTIONS","NS_SWIFT_UNAVAILABLE","NS_ASSUME_NONNULL_BEGIN","NS_ASSUME_NONNULL_END","NS_REFINED_FOR_SWIFT","NS_SWIFT_NAME","NS_SWIFT_NOTHROW","NS_DURING","NS_HANDLER","NS_ENDHANDLER","NS_VALUERETURN","NS_VOIDRETURN"],
literal:["false","true","FALSE","TRUE","nil","YES","NO","NULL"],
built_in:["dispatch_once_t","dispatch_queue_t","dispatch_sync","dispatch_async","dispatch_once"],
type:["int","float","char","unsigned","signed","short","long","double","wchar_t","unichar","void","bool","BOOL","id|0","_Bool"]
},illegal:"</",contains:[{className:"built_in",
begin:"\\\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\\\w+"
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.C_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{
className:"string",variants:[{begin:'@"',end:'"',illegal:"\\\\n",
contains:[e.BACKSLASH_ESCAPE]}]},{className:"meta",begin:/#\\s*[a-z]+\\b/,end:/$/,
keywords:{
keyword:"if else elif endif define undef warning error line pragma ifdef ifndef include"
},contains:[{begin:/\\\\\\n/,relevance:0},e.inherit(e.QUOTE_STRING_MODE,{
className:"string"}),{className:"string",begin:/<.*?>/,end:/$/,illegal:"\\\\n"
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"class",
begin:"("+t.keyword.join("|")+")\\\\b",end:/(\\{|$)/,excludeEnd:!0,keywords:t,
contains:[e.UNDERSCORE_TITLE_MODE]},{begin:"\\\\."+e.UNDERSCORE_IDENT_RE,
relevance:0}]}},grmr_perl:e=>{const n=e.regex,t=/[dualxmsipngr]{0,12}/,a={
$pattern:/[\\w.]+/,
keyword:"abs accept alarm and atan2 bind binmode bless break caller chdir chmod chomp chop chown chr chroot close closedir connect continue cos crypt dbmclose dbmopen defined delete die do dump each else elsif endgrent endhostent endnetent endprotoent endpwent endservent eof eval exec exists exit exp fcntl fileno flock for foreach fork format formline getc getgrent getgrgid getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr getnetbyname getnetent getpeername getpgrp getpriority getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid getservbyname getservbyport getservent getsockname getsockopt given glob gmtime goto grep gt hex if index int ioctl join keys kill last lc lcfirst length link listen local localtime log lstat lt ma map mkdir msgctl msgget msgrcv msgsnd my ne next no not oct open opendir or ord our pack package pipe pop pos print printf prototype push q|0 qq quotemeta qw qx rand read readdir readline readlink readpipe recv redo ref rename require reset return reverse rewinddir rindex rmdir say scalar seek seekdir select semctl semget semop send setgrent sethostent setnetent setpgrp setpriority setprotoent setpwent setservent setsockopt shift shmctl shmget shmread shmwrite shutdown sin sleep socket socketpair sort splice split sprintf sqrt srand stat state study sub substr symlink syscall sysopen sysread sysseek system syswrite tell telldir tie tied time times tr truncate uc ucfirst umask undef unless unlink unpack unshift untie until use utime values vec wait waitpid wantarray warn when while write x|0 xor y|0"
},i={className:"subst",begin:"[$@]\\\\{",end:"\\\\}",keywords:a},r={begin:/->\\{/,
end:/\\}/},s={variants:[{begin:/\\$\\d/},{
begin:n.concat(/[$%@](\\^\\w\\b|#\\w+(::\\w+)*|\\{\\w+\\}|\\w+(::\\w*)*)/,"(?![A-Za-z])(?![@$%])")
},{begin:/[$%@][^\\s\\w{]/,relevance:0}]
},o=[e.BACKSLASH_ESCAPE,i,s],l=[/!/,/\\//,/\\|/,/\\?/,/'/,/"/,/#/],c=(e,a,i="\\\\1")=>{
const r="\\\\1"===i?i:n.concat(i,a)
;return n.concat(n.concat("(?:",e,")"),a,/(?:\\\\.|[^\\\\\\/])*?/,r,/(?:\\\\.|[^\\\\\\/])*?/,i,t)
},d=(e,a,i)=>n.concat(n.concat("(?:",e,")"),a,/(?:\\\\.|[^\\\\\\/])*?/,i,t),g=[s,e.HASH_COMMENT_MODE,e.COMMENT(/^=\\w/,/=cut/,{
endsWithParent:!0}),r,{className:"string",contains:o,variants:[{
begin:"q[qwxr]?\\\\s*\\\\(",end:"\\\\)",relevance:5},{begin:"q[qwxr]?\\\\s*\\\\[",
end:"\\\\]",relevance:5},{begin:"q[qwxr]?\\\\s*\\\\{",end:"\\\\}",relevance:5},{
begin:"q[qwxr]?\\\\s*\\\\|",end:"\\\\|",relevance:5},{begin:"q[qwxr]?\\\\s*<",end:">",
relevance:5},{begin:"qw\\\\s+q",end:"q",relevance:5},{begin:"'",end:"'",
contains:[e.BACKSLASH_ESCAPE]},{begin:'"',end:'"'},{begin:"\`",end:"\`",
contains:[e.BACKSLASH_ESCAPE]},{begin:/\\{\\w+\\}/,relevance:0},{
begin:"-?\\\\w+\\\\s*=>",relevance:0}]},{className:"number",
begin:"(\\\\b0[0-7_]+)|(\\\\b0x[0-9a-fA-F_]+)|(\\\\b[1-9][0-9_]*(\\\\.[0-9_]+)?)|[0_]\\\\b",
relevance:0},{
begin:"(\\\\/\\\\/|"+e.RE_STARTERS_RE+"|\\\\b(split|return|print|reverse|grep)\\\\b)\\\\s*",
keywords:"split return print reverse grep",relevance:0,
contains:[e.HASH_COMMENT_MODE,{className:"regexp",variants:[{
begin:c("s|tr|y",n.either(...l,{capture:!0}))},{begin:c("s|tr|y","\\\\(","\\\\)")},{
begin:c("s|tr|y","\\\\[","\\\\]")},{begin:c("s|tr|y","\\\\{","\\\\}")}],relevance:2},{
className:"regexp",variants:[{begin:/(m|qr)\\/\\//,relevance:0},{
begin:d("(?:m|qr)?",/\\//,/\\//)},{begin:d("m|qr",n.either(...l,{capture:!0
}),/\\1/)},{begin:d("m|qr",/\\(/,/\\)/)},{begin:d("m|qr",/\\[/,/\\]/)},{
begin:d("m|qr",/\\{/,/\\}/)}]}]},{className:"function",beginKeywords:"sub",
end:"(\\\\s*\\\\(.*?\\\\))?[;{]",excludeEnd:!0,relevance:5,contains:[e.TITLE_MODE]},{
begin:"-\\\\w\\\\b",relevance:0},{begin:"^__DATA__$",end:"^__END__$",
subLanguage:"mojolicious",contains:[{begin:"^@@.*",end:"$",className:"comment"}]
}];return i.contains=g,r.contains=g,{name:"Perl",aliases:["pl","pm"],keywords:a,
contains:g}},grmr_php:e=>{
const n=e.regex,t=/(?![A-Za-z0-9])(?![$])/,a=n.concat(/[a-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*/,t),i=n.concat(/(\\\\?[A-Z][a-z0-9_\\x7f-\\xff]+|\\\\?[A-Z]+(?=[A-Z][a-z0-9_\\x7f-\\xff])){1,}/,t),r={
scope:"variable",match:"\\\\$+"+a},s={scope:"subst",variants:[{begin:/\\$\\w+/},{
begin:/\\{\\$/,end:/\\}/}]},o=e.inherit(e.APOS_STRING_MODE,{illegal:null
}),l="[ \\t\\n]",c={scope:"string",variants:[e.inherit(e.QUOTE_STRING_MODE,{
illegal:null,contains:e.QUOTE_STRING_MODE.contains.concat(s)
}),o,e.END_SAME_AS_BEGIN({begin:/<<<[ \\t]*(\\w+)\\n/,end:/[ \\t]*(\\w+)\\b/,
contains:e.QUOTE_STRING_MODE.contains.concat(s)})]},d={scope:"number",
variants:[{begin:"\\\\b0[bB][01]+(?:_[01]+)*\\\\b"},{
begin:"\\\\b0[oO][0-7]+(?:_[0-7]+)*\\\\b"},{
begin:"\\\\b0[xX][\\\\da-fA-F]+(?:_[\\\\da-fA-F]+)*\\\\b"},{
begin:"(?:\\\\b\\\\d+(?:_\\\\d+)*(\\\\.(?:\\\\d+(?:_\\\\d+)*))?|\\\\B\\\\.\\\\d+)(?:[eE][+-]?\\\\d+)?"
}],relevance:0
},g=["false","null","true"],u=["__CLASS__","__DIR__","__FILE__","__FUNCTION__","__COMPILER_HALT_OFFSET__","__LINE__","__METHOD__","__NAMESPACE__","__TRAIT__","die","echo","exit","include","include_once","print","require","require_once","array","abstract","and","as","binary","bool","boolean","break","callable","case","catch","class","clone","const","continue","declare","default","do","double","else","elseif","empty","enddeclare","endfor","endforeach","endif","endswitch","endwhile","enum","eval","extends","final","finally","float","for","foreach","from","global","goto","if","implements","instanceof","insteadof","int","integer","interface","isset","iterable","list","match|0","mixed","new","never","object","or","private","protected","public","readonly","real","return","string","switch","throw","trait","try","unset","use","var","void","while","xor","yield"],b=["Error|0","AppendIterator","ArgumentCountError","ArithmeticError","ArrayIterator","ArrayObject","AssertionError","BadFunctionCallException","BadMethodCallException","CachingIterator","CallbackFilterIterator","CompileError","Countable","DirectoryIterator","DivisionByZeroError","DomainException","EmptyIterator","ErrorException","Exception","FilesystemIterator","FilterIterator","GlobIterator","InfiniteIterator","InvalidArgumentException","IteratorIterator","LengthException","LimitIterator","LogicException","MultipleIterator","NoRewindIterator","OutOfBoundsException","OutOfRangeException","OuterIterator","OverflowException","ParentIterator","ParseError","RangeException","RecursiveArrayIterator","RecursiveCachingIterator","RecursiveCallbackFilterIterator","RecursiveDirectoryIterator","RecursiveFilterIterator","RecursiveIterator","RecursiveIteratorIterator","RecursiveRegexIterator","RecursiveTreeIterator","RegexIterator","RuntimeException","SeekableIterator","SplDoublyLinkedList","SplFileInfo","SplFileObject","SplFixedArray","SplHeap","SplMaxHeap","SplMinHeap","SplObjectStorage","SplObserver","SplPriorityQueue","SplQueue","SplStack","SplSubject","SplTempFileObject","TypeError","UnderflowException","UnexpectedValueException","UnhandledMatchError","ArrayAccess","BackedEnum","Closure","Fiber","Generator","Iterator","IteratorAggregate","Serializable","Stringable","Throwable","Traversable","UnitEnum","WeakReference","WeakMap","Directory","__PHP_Incomplete_Class","parent","php_user_filter","self","static","stdClass"],m={
keyword:u,literal:(e=>{const n=[];return e.forEach((e=>{
n.push(e),e.toLowerCase()===e?n.push(e.toUpperCase()):n.push(e.toLowerCase())
})),n})(g),built_in:b},p=e=>e.map((e=>e.replace(/\\|\\d+$/,""))),_={variants:[{
match:[/new/,n.concat(l,"+"),n.concat("(?!",p(b).join("\\\\b|"),"\\\\b)"),i],scope:{
1:"keyword",4:"title.class"}}]},h=n.concat(a,"\\\\b(?!\\\\()"),f={variants:[{
match:[n.concat(/::/,n.lookahead(/(?!class\\b)/)),h],scope:{2:"variable.constant"
}},{match:[/::/,/class/],scope:{2:"variable.language"}},{
match:[i,n.concat(/::/,n.lookahead(/(?!class\\b)/)),h],scope:{1:"title.class",
3:"variable.constant"}},{match:[i,n.concat("::",n.lookahead(/(?!class\\b)/))],
scope:{1:"title.class"}},{match:[i,/::/,/class/],scope:{1:"title.class",
3:"variable.language"}}]},E={scope:"attr",
match:n.concat(a,n.lookahead(":"),n.lookahead(/(?!::)/))},y={relevance:0,
begin:/\\(/,end:/\\)/,keywords:m,contains:[E,r,f,e.C_BLOCK_COMMENT_MODE,c,d,_]
},w={relevance:0,
match:[/\\b/,n.concat("(?!fn\\\\b|function\\\\b|",p(u).join("\\\\b|"),"|",p(b).join("\\\\b|"),"\\\\b)"),a,n.concat(l,"*"),n.lookahead(/(?=\\()/)],
scope:{3:"title.function.invoke"},contains:[y]};y.contains.push(w)
;const N=[E,f,e.C_BLOCK_COMMENT_MODE,c,d,_];return{case_insensitive:!1,
keywords:m,contains:[{begin:n.concat(/#\\[\\s*/,i),beginScope:"meta",end:/]/,
endScope:"meta",keywords:{literal:g,keyword:["new","array"]},contains:[{
begin:/\\[/,end:/]/,keywords:{literal:g,keyword:["new","array"]},
contains:["self",...N]},...N,{scope:"meta",match:i}]
},e.HASH_COMMENT_MODE,e.COMMENT("//","$"),e.COMMENT("/\\\\*","\\\\*/",{contains:[{
scope:"doctag",match:"@[A-Za-z]+"}]}),{match:/__halt_compiler\\(\\);/,
keywords:"__halt_compiler",starts:{scope:"comment",end:e.MATCH_NOTHING_RE,
contains:[{match:/\\?>/,scope:"meta",endsParent:!0}]}},{scope:"meta",variants:[{
begin:/<\\?php/,relevance:10},{begin:/<\\?=/},{begin:/<\\?/,relevance:.1},{
begin:/\\?>/}]},{scope:"variable.language",match:/\\$this\\b/},r,w,f,{
match:[/const/,/\\s/,a],scope:{1:"keyword",3:"variable.constant"}},_,{
scope:"function",relevance:0,beginKeywords:"fn function",end:/[;{]/,
excludeEnd:!0,illegal:"[$%\\\\[]",contains:[{beginKeywords:"use"
},e.UNDERSCORE_TITLE_MODE,{begin:"=>",endsParent:!0},{scope:"params",
begin:"\\\\(",end:"\\\\)",excludeBegin:!0,excludeEnd:!0,keywords:m,
contains:["self",r,f,e.C_BLOCK_COMMENT_MODE,c,d]}]},{scope:"class",variants:[{
beginKeywords:"enum",illegal:/[($"]/},{beginKeywords:"class interface trait",
illegal:/[:($"]/}],relevance:0,end:/\\{/,excludeEnd:!0,contains:[{
beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{
beginKeywords:"namespace",relevance:0,end:";",illegal:/[.']/,
contains:[e.inherit(e.UNDERSCORE_TITLE_MODE,{scope:"title.class"})]},{
beginKeywords:"use",relevance:0,end:";",contains:[{
match:/\\b(as|const|function)\\b/,scope:"keyword"},e.UNDERSCORE_TITLE_MODE]},c,d]}
},grmr_php_template:e=>({name:"PHP template",subLanguage:"xml",contains:[{
begin:/<\\?(php|=)?/,end:/\\?>/,subLanguage:"php",contains:[{begin:"/\\\\*",
end:"\\\\*/",skip:!0},{begin:'b"',end:'"',skip:!0},{begin:"b'",end:"'",skip:!0
},e.inherit(e.APOS_STRING_MODE,{illegal:null,className:null,contains:null,
skip:!0}),e.inherit(e.QUOTE_STRING_MODE,{illegal:null,className:null,
contains:null,skip:!0})]}]}),grmr_plaintext:e=>({name:"Plain text",
aliases:["text","txt"],disableAutodetect:!0}),grmr_python:e=>{
const n=e.regex,t=/[\\p{XID_Start}_]\\p{XID_Continue}*/u,a=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],i={
$pattern:/[A-Za-z]\\w+|__\\w+__/,keyword:a,
built_in:["__import__","abs","all","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],
literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],
type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]
},r={className:"meta",begin:/^(>>>|\\.\\.\\.) /},s={className:"subst",begin:/\\{/,
end:/\\}/,keywords:i,illegal:/#/},o={begin:/\\{\\{/,relevance:0},l={
className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,r],relevance:10},{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,
contains:[e.BACKSLASH_ESCAPE,r],relevance:10},{
begin:/([fF][rR]|[rR][fF]|[fF])'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,r,o,s]},{begin:/([fF][rR]|[rR][fF]|[fF])"""/,
end:/"""/,contains:[e.BACKSLASH_ESCAPE,r,o,s]},{begin:/([uU]|[rR])'/,end:/'/,
relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{
begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,
end:/"/},{begin:/([fF][rR]|[rR][fF]|[fF])'/,end:/'/,
contains:[e.BACKSLASH_ESCAPE,o,s]},{begin:/([fF][rR]|[rR][fF]|[fF])"/,end:/"/,
contains:[e.BACKSLASH_ESCAPE,o,s]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
},c="[0-9](_?[0-9])*",d=\`(\\\\b(\${c}))?\\\\.(\${c})|\\\\b(\${c})\\\\.\`,g="\\\\b|"+a.join("|"),u={
className:"number",relevance:0,variants:[{
begin:\`(\\\\b(\${c})|(\${d}))[eE][+-]?(\${c})[jJ]?(?=\${g})\`},{begin:\`(\${d})[jJ]?\`},{
begin:\`\\\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=\${g})\`},{
begin:\`\\\\b0[bB](_?[01])+[lL]?(?=\${g})\`},{begin:\`\\\\b0[oO](_?[0-7])+[lL]?(?=\${g})\`
},{begin:\`\\\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=\${g})\`},{begin:\`\\\\b(\${c})[jJ](?=\${g})\`
}]},b={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:i,
contains:[{begin:/# type:/},{begin:/#/,end:/\\b\\B/,endsWithParent:!0}]},m={
className:"params",variants:[{className:"",begin:/\\(\\s*\\)/,skip:!0},{begin:/\\(/,
end:/\\)/,excludeBegin:!0,excludeEnd:!0,keywords:i,
contains:["self",r,u,l,e.HASH_COMMENT_MODE]}]};return s.contains=[l,u,r],{
name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:i,
illegal:/(<\\/|->|\\?)|=>/,contains:[r,u,{begin:/\\bself\\b/},{beginKeywords:"if",
relevance:0},l,b,e.HASH_COMMENT_MODE,{match:[/\\bdef/,/\\s+/,t],scope:{
1:"keyword",3:"title.function"},contains:[m]},{variants:[{
match:[/\\bclass/,/\\s+/,t,/\\s*/,/\\(\\s*/,t,/\\s*\\)/]},{match:[/\\bclass/,/\\s+/,t]}],
scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{
className:"meta",begin:/^[\\t ]*@/,end:/(?=#)|$/,contains:[u,m,l]}]}},
grmr_python_repl:e=>({aliases:["pycon"],contains:[{className:"meta.prompt",
starts:{end:/ |$/,starts:{end:"$",subLanguage:"python"}},variants:[{
begin:/^>>>(?=[ ]|$)/},{begin:/^\\.\\.\\.(?=[ ]|$)/}]}]}),grmr_r:e=>{
const n=e.regex,t=/(?:(?:[a-zA-Z]|\\.[._a-zA-Z])[._a-zA-Z0-9]*)|\\.(?!\\d)/,a=n.either(/0[xX][0-9a-fA-F]+\\.[0-9a-fA-F]*[pP][+-]?\\d+i?/,/0[xX][0-9a-fA-F]+(?:[pP][+-]?\\d+)?[Li]?/,/(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[eE][+-]?\\d+)?[Li]?/),i=/[=!<>:]=|\\|\\||&&|:::?|<-|<<-|->>|->|\\|>|[-+*\\/?!$&|:<=>@^~]|\\*\\*/,r=n.either(/[()]/,/[{}]/,/\\[\\[/,/[[\\]]/,/\\\\/,/,/)
;return{name:"R",keywords:{$pattern:t,
keyword:"function if in break next repeat else for while",
literal:"NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
built_in:"LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
},contains:[e.COMMENT(/#'/,/$/,{contains:[{scope:"doctag",match:/@examples/,
starts:{end:n.lookahead(n.either(/\\n^#'\\s*(?=@[a-zA-Z]+)/,/\\n^(?!#')/)),
endsParent:!0}},{scope:"doctag",begin:"@param",end:/$/,contains:[{
scope:"variable",variants:[{match:t},{match:/\`(?:\\\\.|[^\`\\\\])+\`/}],endsParent:!0
}]},{scope:"doctag",match:/@[a-zA-Z]+/},{scope:"keyword",match:/\\\\[a-zA-Z]+/}]
}),e.HASH_COMMENT_MODE,{scope:"string",contains:[e.BACKSLASH_ESCAPE],
variants:[e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\\(/,end:/\\)(-*)"/
}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\\{/,end:/\\}(-*)"/
}),e.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\\[/,end:/\\](-*)"/
}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\\(/,end:/\\)(-*)'/
}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\\{/,end:/\\}(-*)'/
}),e.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\\[/,end:/\\](-*)'/}),{begin:'"',end:'"',
relevance:0},{begin:"'",end:"'",relevance:0}]},{relevance:0,variants:[{scope:{
1:"operator",2:"number"},match:[i,a]},{scope:{1:"operator",2:"number"},
match:[/%[^%]*%/,a]},{scope:{1:"punctuation",2:"number"},match:[r,a]},{scope:{
2:"number"},match:[/[^a-zA-Z0-9._]|^/,a]}]},{scope:{3:"operator"},
match:[t,/\\s+/,/<-/,/\\s+/]},{scope:"operator",relevance:0,variants:[{match:i},{
match:/%[^%]*%/}]},{scope:"punctuation",relevance:0,match:r},{begin:"\`",end:"\`",
contains:[{begin:/\\\\./}]}]}},grmr_ruby:e=>{
const n=e.regex,t="([a-zA-Z_]\\\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\\\*\\\\*|[-/+%^&*~\`|]|\\\\[\\\\]=?)",a=n.either(/\\b([A-Z]+[a-z0-9]+)+/,/\\b([A-Z]+[a-z0-9]+)+[A-Z]+/),i=n.concat(a,/(::\\w+)*/),r={
"variable.constant":["__FILE__","__LINE__","__ENCODING__"],
"variable.language":["self","super"],
keyword:["alias","and","begin","BEGIN","break","case","class","defined","do","else","elsif","end","END","ensure","for","if","in","module","next","not","or","redo","require","rescue","retry","return","then","undef","unless","until","when","while","yield","include","extend","prepend","public","private","protected","raise","throw"],
built_in:["proc","lambda","attr_accessor","attr_reader","attr_writer","define_method","private_constant","module_function"],
literal:["true","false","nil"]},s={className:"doctag",begin:"@[A-Za-z]+"},o={
begin:"#<",end:">"},l=[e.COMMENT("#","$",{contains:[s]
}),e.COMMENT("^=begin","^=end",{contains:[s],relevance:10
}),e.COMMENT("^__END__",e.MATCH_NOTHING_RE)],c={className:"subst",begin:/#\\{/,
end:/\\}/,keywords:r},d={className:"string",contains:[e.BACKSLASH_ESCAPE,c],
variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/\`/,end:/\`/},{
begin:/%[qQwWx]?\\(/,end:/\\)/},{begin:/%[qQwWx]?\\[/,end:/\\]/},{
begin:/%[qQwWx]?\\{/,end:/\\}/},{begin:/%[qQwWx]?</,end:/>/},{begin:/%[qQwWx]?\\//,
end:/\\//},{begin:/%[qQwWx]?%/,end:/%/},{begin:/%[qQwWx]?-/,end:/-/},{
begin:/%[qQwWx]?\\|/,end:/\\|/},{begin:/\\B\\?(\\\\\\d{1,3})/},{
begin:/\\B\\?(\\\\x[A-Fa-f0-9]{1,2})/},{begin:/\\B\\?(\\\\u\\{?[A-Fa-f0-9]{1,6}\\}?)/},{
begin:/\\B\\?(\\\\M-\\\\C-|\\\\M-\\\\c|\\\\c\\\\M-|\\\\M-|\\\\C-\\\\M-)[\\x20-\\x7e]/},{
begin:/\\B\\?\\\\(c|C-)[\\x20-\\x7e]/},{begin:/\\B\\?\\\\?\\S/},{
begin:n.concat(/<<[-~]?'?/,n.lookahead(/(\\w+)(?=\\W)[^\\n]*\\n(?:[^\\n]*\\n)*?\\s*\\1\\b/)),
contains:[e.END_SAME_AS_BEGIN({begin:/(\\w+)/,end:/(\\w+)/,
contains:[e.BACKSLASH_ESCAPE,c]})]}]},g="[0-9](_?[0-9])*",u={className:"number",
relevance:0,variants:[{
begin:\`\\\\b([1-9](_?[0-9])*|0)(\\\\.(\${g}))?([eE][+-]?(\${g})|r)?i?\\\\b\`},{
begin:"\\\\b0[dD][0-9](_?[0-9])*r?i?\\\\b"},{begin:"\\\\b0[bB][0-1](_?[0-1])*r?i?\\\\b"
},{begin:"\\\\b0[oO][0-7](_?[0-7])*r?i?\\\\b"},{
begin:"\\\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\\\b"},{
begin:"\\\\b0(_?[0-7])+r?i?\\\\b"}]},b={variants:[{match:/\\(\\)/},{
className:"params",begin:/\\(/,end:/(?=\\))/,excludeBegin:!0,endsParent:!0,
keywords:r}]},m=[d,{variants:[{match:[/class\\s+/,i,/\\s+<\\s+/,i]},{
match:[/\\b(class|module)\\s+/,i]}],scope:{2:"title.class",
4:"title.class.inherited"},keywords:r},{match:[/(include|extend)\\s+/,i],scope:{
2:"title.class"},keywords:r},{relevance:0,match:[i,/\\.new[. (]/],scope:{
1:"title.class"}},{relevance:0,match:/\\b[A-Z][A-Z_0-9]+\\b/,
className:"variable.constant"},{relevance:0,match:a,scope:"title.class"},{
match:[/def/,/\\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[b]},{
begin:e.IDENT_RE+"::"},{className:"symbol",
begin:e.UNDERSCORE_IDENT_RE+"(!|\\\\?)?:",relevance:0},{className:"symbol",
begin:":(?!\\\\s)",contains:[d,{begin:t}],relevance:0},u,{className:"variable",
begin:"(\\\\$\\\\W)|((\\\\$|@@?)(\\\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"},{
className:"params",begin:/\\|/,end:/\\|/,excludeBegin:!0,excludeEnd:!0,
relevance:0,keywords:r},{begin:"("+e.RE_STARTERS_RE+"|unless)\\\\s*",
keywords:"unless",contains:[{className:"regexp",contains:[e.BACKSLASH_ESCAPE,c],
illegal:/\\n/,variants:[{begin:"/",end:"/[a-z]*"},{begin:/%r\\{/,end:/\\}[a-z]*/},{
begin:"%r\\\\(",end:"\\\\)[a-z]*"},{begin:"%r!",end:"![a-z]*"},{begin:"%r\\\\[",
end:"\\\\][a-z]*"}]}].concat(o,l),relevance:0}].concat(o,l)
;c.contains=m,b.contains=m;const p=[{begin:/^\\s*=>/,starts:{end:"$",contains:m}
},{className:"meta.prompt",
begin:"^([>?]>|[\\\\w#]+\\\\(\\\\w+\\\\):\\\\d+:\\\\d+[>*]|(\\\\w+-)?\\\\d+\\\\.\\\\d+\\\\.\\\\d+(p\\\\d+)?[^\\\\d][^>]+>)(?=[ ])",
starts:{end:"$",keywords:r,contains:m}}];return l.unshift(o),{name:"Ruby",
aliases:["rb","gemspec","podspec","thor","irb"],keywords:r,illegal:/\\/\\*/,
contains:[e.SHEBANG({binary:"ruby"})].concat(p).concat(l).concat(m)}},
grmr_rust:e=>{const n=e.regex,t={className:"title.function.invoke",relevance:0,
begin:n.concat(/\\b/,/(?!let\\b)/,e.IDENT_RE,n.lookahead(/\\s*\\(/))
},a="([ui](8|16|32|64|128|size)|f(32|64))?",i=["drop ","Copy","Send","Sized","Sync","Drop","Fn","FnMut","FnOnce","ToOwned","Clone","Debug","PartialEq","PartialOrd","Eq","Ord","AsRef","AsMut","Into","From","Default","Iterator","Extend","IntoIterator","DoubleEndedIterator","ExactSizeIterator","SliceConcatExt","ToString","assert!","assert_eq!","bitflags!","bytes!","cfg!","col!","concat!","concat_idents!","debug_assert!","debug_assert_eq!","env!","panic!","file!","format!","format_args!","include_bytes!","include_str!","line!","local_data_key!","module_path!","option_env!","print!","println!","select!","stringify!","try!","unimplemented!","unreachable!","vec!","write!","writeln!","macro_rules!","assert_ne!","debug_assert_ne!"],r=["i8","i16","i32","i64","i128","isize","u8","u16","u32","u64","u128","usize","f32","f64","str","char","bool","Box","Option","Result","String","Vec"]
;return{name:"Rust",aliases:["rs"],keywords:{$pattern:e.IDENT_RE+"!?",type:r,
keyword:["abstract","as","async","await","become","box","break","const","continue","crate","do","dyn","else","enum","extern","false","final","fn","for","if","impl","in","let","loop","macro","match","mod","move","mut","override","priv","pub","ref","return","self","Self","static","struct","super","trait","true","try","type","typeof","unsafe","unsized","use","virtual","where","while","yield"],
literal:["true","false","Some","None","Ok","Err"],built_in:i},illegal:"</",
contains:[e.C_LINE_COMMENT_MODE,e.COMMENT("/\\\\*","\\\\*/",{contains:["self"]
}),e.inherit(e.QUOTE_STRING_MODE,{begin:/b?"/,illegal:null}),{
className:"string",variants:[{begin:/b?r(#*)"(.|\\n)*?"\\1(?!#)/},{
begin:/b?'\\\\?(x\\w{2}|u\\w{4}|U\\w{8}|.)'/}]},{className:"symbol",
begin:/'[a-zA-Z_][a-zA-Z0-9_]*/},{className:"number",variants:[{
begin:"\\\\b0b([01_]+)"+a},{begin:"\\\\b0o([0-7_]+)"+a},{
begin:"\\\\b0x([A-Fa-f0-9_]+)"+a},{
begin:"\\\\b(\\\\d[\\\\d_]*(\\\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)"+a}],relevance:0},{
begin:[/fn/,/\\s+/,e.UNDERSCORE_IDENT_RE],className:{1:"keyword",
3:"title.function"}},{className:"meta",begin:"#!?\\\\[",end:"\\\\]",contains:[{
className:"string",begin:/"/,end:/"/}]},{
begin:[/let/,/\\s+/,/(?:mut\\s+)?/,e.UNDERSCORE_IDENT_RE],className:{1:"keyword",
3:"keyword",4:"variable"}},{
begin:[/for/,/\\s+/,e.UNDERSCORE_IDENT_RE,/\\s+/,/in/],className:{1:"keyword",
3:"variable",5:"keyword"}},{begin:[/type/,/\\s+/,e.UNDERSCORE_IDENT_RE],
className:{1:"keyword",3:"title.class"}},{
begin:[/(?:trait|enum|struct|union|impl|for)/,/\\s+/,e.UNDERSCORE_IDENT_RE],
className:{1:"keyword",3:"title.class"}},{begin:e.IDENT_RE+"::",keywords:{
keyword:"Self",built_in:i,type:r}},{className:"punctuation",begin:"->"},t]}},
grmr_scss:e=>{const n=te(e),t=se,a=re,i="@[a-z-]+",r={className:"variable",
begin:"(\\\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\\\b",relevance:0};return{name:"SCSS",
case_insensitive:!0,illegal:"[=/|']",
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,n.CSS_NUMBER_MODE,{
className:"selector-id",begin:"#[A-Za-z0-9_-]+",relevance:0},{
className:"selector-class",begin:"\\\\.[A-Za-z0-9_-]+",relevance:0
},n.ATTRIBUTE_SELECTOR_MODE,{className:"selector-tag",
begin:"\\\\b("+ae.join("|")+")\\\\b",relevance:0},{className:"selector-pseudo",
begin:":("+a.join("|")+")"},{className:"selector-pseudo",
begin:":(:)?("+t.join("|")+")"},r,{begin:/\\(/,end:/\\)/,
contains:[n.CSS_NUMBER_MODE]},n.CSS_VARIABLE,{className:"attribute",
begin:"\\\\b("+oe.join("|")+")\\\\b"},{
begin:"\\\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\\\b"
},{begin:/:/,end:/[;}{]/,relevance:0,
contains:[n.BLOCK_COMMENT,r,n.HEXCOLOR,n.CSS_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,n.IMPORTANT,n.FUNCTION_DISPATCH]
},{begin:"@(page|font-face)",keywords:{$pattern:i,keyword:"@page @font-face"}},{
begin:"@",end:"[{;]",returnBegin:!0,keywords:{$pattern:/[a-z-]+/,
keyword:"and or not only",attribute:ie.join(" ")},contains:[{begin:i,
className:"keyword"},{begin:/[a-z-]+(?=:)/,className:"attribute"
},r,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,n.HEXCOLOR,n.CSS_NUMBER_MODE]
},n.FUNCTION_DISPATCH]}},grmr_shell:e=>({name:"Shell Session",
aliases:["console","shellsession"],contains:[{className:"meta.prompt",
begin:/^\\s{0,3}[/~\\w\\d[\\]()@-]*[>%$#][ ]?/,starts:{end:/[^\\\\](?=\\s*$)/,
subLanguage:"bash"}}]}),grmr_sql:e=>{
const n=e.regex,t=e.COMMENT("--","$"),a=["true","false","unknown"],i=["bigint","binary","blob","boolean","char","character","clob","date","dec","decfloat","decimal","float","int","integer","interval","nchar","nclob","national","numeric","real","row","smallint","time","timestamp","varchar","varying","varbinary"],r=["abs","acos","array_agg","asin","atan","avg","cast","ceil","ceiling","coalesce","corr","cos","cosh","count","covar_pop","covar_samp","cume_dist","dense_rank","deref","element","exp","extract","first_value","floor","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","last_value","lead","listagg","ln","log","log10","lower","max","min","mod","nth_value","ntile","nullif","percent_rank","percentile_cont","percentile_disc","position","position_regex","power","rank","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","row_number","sin","sinh","sqrt","stddev_pop","stddev_samp","substring","substring_regex","sum","tan","tanh","translate","translate_regex","treat","trim","trim_array","unnest","upper","value_of","var_pop","var_samp","width_bucket"],s=["create table","insert into","primary key","foreign key","not null","alter table","add constraint","grouping sets","on overflow","character set","respect nulls","ignore nulls","nulls first","nulls last","depth first","breadth first"],o=r,l=["abs","acos","all","allocate","alter","and","any","are","array","array_agg","array_max_cardinality","as","asensitive","asin","asymmetric","at","atan","atomic","authorization","avg","begin","begin_frame","begin_partition","between","bigint","binary","blob","boolean","both","by","call","called","cardinality","cascaded","case","cast","ceil","ceiling","char","char_length","character","character_length","check","classifier","clob","close","coalesce","collate","collect","column","commit","condition","connect","constraint","contains","convert","copy","corr","corresponding","cos","cosh","count","covar_pop","covar_samp","create","cross","cube","cume_dist","current","current_catalog","current_date","current_default_transform_group","current_path","current_role","current_row","current_schema","current_time","current_timestamp","current_path","current_role","current_transform_group_for_type","current_user","cursor","cycle","date","day","deallocate","dec","decimal","decfloat","declare","default","define","delete","dense_rank","deref","describe","deterministic","disconnect","distinct","double","drop","dynamic","each","element","else","empty","end","end_frame","end_partition","end-exec","equals","escape","every","except","exec","execute","exists","exp","external","extract","false","fetch","filter","first_value","float","floor","for","foreign","frame_row","free","from","full","function","fusion","get","global","grant","group","grouping","groups","having","hold","hour","identity","in","indicator","initial","inner","inout","insensitive","insert","int","integer","intersect","intersection","interval","into","is","join","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","language","large","last_value","lateral","lead","leading","left","like","like_regex","listagg","ln","local","localtime","localtimestamp","log","log10","lower","match","match_number","match_recognize","matches","max","member","merge","method","min","minute","mod","modifies","module","month","multiset","national","natural","nchar","nclob","new","no","none","normalize","not","nth_value","ntile","null","nullif","numeric","octet_length","occurrences_regex","of","offset","old","omit","on","one","only","open","or","order","out","outer","over","overlaps","overlay","parameter","partition","pattern","per","percent","percent_rank","percentile_cont","percentile_disc","period","portion","position","position_regex","power","precedes","precision","prepare","primary","procedure","ptf","range","rank","reads","real","recursive","ref","references","referencing","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","release","result","return","returns","revoke","right","rollback","rollup","row","row_number","rows","running","savepoint","scope","scroll","search","second","seek","select","sensitive","session_user","set","show","similar","sin","sinh","skip","smallint","some","specific","specifictype","sql","sqlexception","sqlstate","sqlwarning","sqrt","start","static","stddev_pop","stddev_samp","submultiset","subset","substring","substring_regex","succeeds","sum","symmetric","system","system_time","system_user","table","tablesample","tan","tanh","then","time","timestamp","timezone_hour","timezone_minute","to","trailing","translate","translate_regex","translation","treat","trigger","trim","trim_array","true","truncate","uescape","union","unique","unknown","unnest","update","upper","user","using","value","values","value_of","var_pop","var_samp","varbinary","varchar","varying","versioning","when","whenever","where","width_bucket","_window","with","within","without","year","add","asc","collation","desc","final","first","last","view"].filter((e=>!r.includes(e))),c={
begin:n.concat(/\\b/,n.either(...o),/\\s*\\(/),relevance:0,keywords:{built_in:o}}
;return{name:"SQL",case_insensitive:!0,illegal:/[{}]|<\\//,keywords:{
$pattern:/\\b[\\w\\.]+/,keyword:((e,{exceptions:n,when:t}={})=>{const a=t
;return n=n||[],e.map((e=>e.match(/\\|\\d+$/)||n.includes(e)?e:a(e)?e+"|0":e))
})(l,{when:e=>e.length<3}),literal:a,type:i,
built_in:["current_catalog","current_date","current_default_transform_group","current_path","current_role","current_schema","current_transform_group_for_type","current_user","session_user","system_time","system_user","current_time","localtime","current_timestamp","localtimestamp"]
},contains:[{begin:n.either(...s),relevance:0,keywords:{$pattern:/[\\w\\.]+/,
keyword:l.concat(s),literal:a,type:i}},{className:"type",
begin:n.either("double precision","large object","with timezone","without timezone")
},c,{className:"variable",begin:/@[a-z0-9]+/},{className:"string",variants:[{
begin:/'/,end:/'/,contains:[{begin:/''/}]}]},{begin:/"/,end:/"/,contains:[{
begin:/""/}]},e.C_NUMBER_MODE,e.C_BLOCK_COMMENT_MODE,t,{className:"operator",
begin:/[-+*/=%^~]|&&?|\\|\\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,relevance:0}]}},
grmr_swift:e=>{const n={match:/\\s+/,relevance:0},t=e.COMMENT("/\\\\*","\\\\*/",{
contains:["self"]}),a=[e.C_LINE_COMMENT_MODE,t],i={match:[/\\./,p(...ve,...Oe)],
className:{2:"keyword"}},r={match:m(/\\./,p(...xe)),relevance:0
},s=xe.filter((e=>"string"==typeof e)).concat(["_|0"]),o={variants:[{
className:"keyword",
match:p(...xe.filter((e=>"string"!=typeof e)).concat(ke).map(Ne),...Oe)}]},l={
$pattern:p(/\\b\\w+/,/#\\w+/),keyword:s.concat(Ae),literal:Me},c=[i,r,o],d=[{
match:m(/\\./,p(...Ce)),relevance:0},{className:"built_in",
match:m(/\\b/,p(...Ce),/(?=\\()/)}],u={match:/->/,relevance:0},b=[u,{
className:"operator",relevance:0,variants:[{match:De},{match:\`\\\\.(\\\\.|\${Re})+\`}]
}],_="([0-9a-fA-F]_*)+",h={className:"number",relevance:0,variants:[{
match:"\\\\b(([0-9]_*)+)(\\\\.(([0-9]_*)+))?([eE][+-]?(([0-9]_*)+))?\\\\b"},{
match:\`\\\\b0x(\${_})(\\\\.(\${_}))?([pP][+-]?(([0-9]_*)+))?\\\\b\`},{
match:/\\b0o([0-7]_*)+\\b/},{match:/\\b0b([01]_*)+\\b/}]},f=(e="")=>({
className:"subst",variants:[{match:m(/\\\\/,e,/[0\\\\tnr"']/)},{
match:m(/\\\\/,e,/u\\{[0-9a-fA-F]{1,8}\\}/)}]}),E=(e="")=>({className:"subst",
match:m(/\\\\/,e,/[\\t ]*(?:[\\r\\n]|\\r\\n)/)}),y=(e="")=>({className:"subst",
label:"interpol",begin:m(/\\\\/,e,/\\(/),end:/\\)/}),w=(e="")=>({begin:m(e,/"""/),
end:m(/"""/,e),contains:[f(e),E(e),y(e)]}),N=(e="")=>({begin:m(e,/"/),
end:m(/"/,e),contains:[f(e),y(e)]}),v={className:"string",
variants:[w(),w("#"),w("##"),w("###"),N(),N("#"),N("##"),N("###")]},O={
match:m(/\`/,Be,/\`/)},k=[O,{className:"variable",match:/\\$\\d+/},{
className:"variable",match:\`\\\\$\${Le}+\`}],x=[{match:/(@|#(un)?)available/,
className:"keyword",starts:{contains:[{begin:/\\(/,end:/\\)/,keywords:Fe,
contains:[...b,h,v]}]}},{className:"keyword",match:m(/@/,p(...ze))},{
className:"meta",match:m(/@/,Be)}],M={match:g(/\\b[A-Z]/),relevance:0,contains:[{
className:"type",
match:m(/(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)/,Le,"+")
},{className:"type",match:$e,relevance:0},{match:/[?!]+/,relevance:0},{
match:/\\.\\.\\./,relevance:0},{match:m(/\\s+&\\s+/,g($e)),relevance:0}]},S={
begin:/</,end:/>/,keywords:l,contains:[...a,...c,...x,u,M]};M.contains.push(S)
;const A={begin:/\\(/,end:/\\)/,relevance:0,keywords:l,contains:["self",{
match:m(Be,/\\s*:/),keywords:"_|0",relevance:0
},...a,...c,...d,...b,h,v,...k,...x,M]},C={begin:/</,end:/>/,contains:[...a,M]
},T={begin:/\\(/,end:/\\)/,keywords:l,contains:[{
begin:p(g(m(Be,/\\s*:/)),g(m(Be,/\\s+/,Be,/\\s*:/))),end:/:/,relevance:0,
contains:[{className:"keyword",match:/\\b_\\b/},{className:"params",match:Be}]
},...a,...c,...b,h,v,...x,M,A],endsParent:!0,illegal:/["']/},R={
match:[/func/,/\\s+/,p(O.match,Be,De)],className:{1:"keyword",3:"title.function"
},contains:[C,T,n],illegal:[/\\[/,/%/]},D={
match:[/\\b(?:subscript|init[?!]?)/,/\\s*(?=[<(])/],className:{1:"keyword"},
contains:[C,T,n],illegal:/\\[|%/},I={match:[/operator/,/\\s+/,De],className:{
1:"keyword",3:"title"}},L={begin:[/precedencegroup/,/\\s+/,$e],className:{
1:"keyword",3:"title"},contains:[M],keywords:[...Se,...Me],end:/}/}
;for(const e of v.variants){const n=e.contains.find((e=>"interpol"===e.label))
;n.keywords=l;const t=[...c,...d,...b,h,v,...k];n.contains=[...t,{begin:/\\(/,
end:/\\)/,contains:["self",...t]}]}return{name:"Swift",keywords:l,
contains:[...a,R,D,{beginKeywords:"struct protocol class extension enum actor",
end:"\\\\{",excludeEnd:!0,keywords:l,contains:[e.inherit(e.TITLE_MODE,{
className:"title.class",begin:/[A-Za-z$_][\\u00C0-\\u02B80-9A-Za-z$_]*/}),...c]
},I,L,{beginKeywords:"import",end:/$/,contains:[...a],relevance:0
},...c,...d,...b,h,v,...k,...x,M,A]}},grmr_typescript:e=>{
const n=we(e),t=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],a={
beginKeywords:"namespace",end:/\\{/,excludeEnd:!0,
contains:[n.exports.CLASS_REFERENCE]},i={beginKeywords:"interface",end:/\\{/,
excludeEnd:!0,keywords:{keyword:"interface extends",built_in:t},
contains:[n.exports.CLASS_REFERENCE]},r={$pattern:be,
keyword:me.concat(["type","namespace","interface","public","private","protected","implements","declare","abstract","readonly","enum","override"]),
literal:pe,built_in:ye.concat(t),"variable.language":Ee},s={className:"meta",
begin:"@[A-Za-z$_][0-9A-Za-z$_]*"},o=(e,n,t)=>{
const a=e.contains.findIndex((e=>e.label===n))
;if(-1===a)throw Error("can not find mode to replace");e.contains.splice(a,1,t)}
;return Object.assign(n.keywords,r),
n.exports.PARAMS_CONTAINS.push(s),n.contains=n.contains.concat([s,a,i]),
o(n,"shebang",e.SHEBANG()),o(n,"use_strict",{className:"meta",relevance:10,
begin:/^\\s*['"]use strict['"]/
}),n.contains.find((e=>"func.def"===e.label)).relevance=0,Object.assign(n,{
name:"TypeScript",aliases:["ts","tsx"]}),n},grmr_vbnet:e=>{
const n=e.regex,t=/\\d{1,2}\\/\\d{1,2}\\/\\d{4}/,a=/\\d{4}-\\d{1,2}-\\d{1,2}/,i=/(\\d|1[012])(:\\d+){0,2} *(AM|PM)/,r=/\\d{1,2}(:\\d{1,2}){1,2}/,s={
className:"literal",variants:[{begin:n.concat(/# */,n.either(a,t),/ *#/)},{
begin:n.concat(/# */,r,/ *#/)},{begin:n.concat(/# */,i,/ *#/)},{
begin:n.concat(/# */,n.either(a,t),/ +/,n.either(i,r),/ *#/)}]
},o=e.COMMENT(/'''/,/$/,{contains:[{className:"doctag",begin:/<\\/?/,end:/>/}]
}),l=e.COMMENT(null,/$/,{variants:[{begin:/'/},{begin:/([\\t ]|^)REM(?=\\s)/}]})
;return{name:"Visual Basic .NET",aliases:["vb"],case_insensitive:!0,
classNameAliases:{label:"symbol"},keywords:{
keyword:"addhandler alias aggregate ansi as async assembly auto binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into iterator join key let lib loop me mid module mustinherit mustoverride mybase myclass namespace narrowing new next notinheritable notoverridable of off on operator option optional order overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly yield",
built_in:"addressof and andalso await directcast gettype getxmlnamespace is isfalse isnot istrue like mod nameof new not or orelse trycast typeof xor cbool cbyte cchar cdate cdbl cdec cint clng cobj csbyte cshort csng cstr cuint culng cushort",
type:"boolean byte char date decimal double integer long object sbyte short single string uinteger ulong ushort",
literal:"true false nothing"},
illegal:"//|\\\\{|\\\\}|endif|gosub|variant|wend|^\\\\$ ",contains:[{
className:"string",begin:/"(""|[^/n])"C\\b/},{className:"string",begin:/"/,
end:/"/,illegal:/\\n/,contains:[{begin:/""/}]},s,{className:"number",relevance:0,
variants:[{begin:/\\b\\d[\\d_]*((\\.[\\d_]+(E[+-]?[\\d_]+)?)|(E[+-]?[\\d_]+))[RFD@!#]?/
},{begin:/\\b\\d[\\d_]*((U?[SIL])|[%&])?/},{begin:/&H[\\dA-F_]+((U?[SIL])|[%&])?/},{
begin:/&O[0-7_]+((U?[SIL])|[%&])?/},{begin:/&B[01_]+((U?[SIL])|[%&])?/}]},{
className:"label",begin:/^\\w+:/},o,l,{className:"meta",
begin:/[\\t ]*#(const|disable|else|elseif|enable|end|externalsource|if|region)\\b/,
end:/$/,keywords:{
keyword:"const disable else elseif enable end externalsource if region then"},
contains:[l]}]}},grmr_wasm:e=>{e.regex;const n=e.COMMENT(/\\(;/,/;\\)/)
;return n.contains.push("self"),{name:"WebAssembly",keywords:{$pattern:/[\\w.]+/,
keyword:["anyfunc","block","br","br_if","br_table","call","call_indirect","data","drop","elem","else","end","export","func","global.get","global.set","local.get","local.set","local.tee","get_global","get_local","global","if","import","local","loop","memory","memory.grow","memory.size","module","mut","nop","offset","param","result","return","select","set_global","set_local","start","table","tee_local","then","type","unreachable"]
},contains:[e.COMMENT(/;;/,/$/),n,{match:[/(?:offset|align)/,/\\s*/,/=/],
className:{1:"keyword",3:"operator"}},{className:"variable",begin:/\\$[\\w_]+/},{
match:/(\\((?!;)|\\))+/,className:"punctuation",relevance:0},{
begin:[/(?:func|call|call_indirect)/,/\\s+/,/\\$[^\\s)]+/],className:{1:"keyword",
3:"title.function"}},e.QUOTE_STRING_MODE,{match:/(i32|i64|f32|f64)(?!\\.)/,
className:"type"},{className:"keyword",
match:/\\b(f32|f64|i32|i64)(?:\\.(?:abs|add|and|ceil|clz|const|convert_[su]\\/i(?:32|64)|copysign|ctz|demote\\/f64|div(?:_[su])?|eqz?|extend_[su]\\/i32|floor|ge(?:_[su])?|gt(?:_[su])?|le(?:_[su])?|load(?:(?:8|16|32)_[su])?|lt(?:_[su])?|max|min|mul|nearest|neg?|or|popcnt|promote\\/f32|reinterpret\\/[fi](?:32|64)|rem_[su]|rot[lr]|shl|shr_[su]|store(?:8|16|32)?|sqrt|sub|trunc(?:_[su]\\/f(?:32|64))?|wrap\\/i64|xor))\\b/
},{className:"number",relevance:0,
match:/[+-]?\\b(?:\\d(?:_?\\d)*(?:\\.\\d(?:_?\\d)*)?(?:[eE][+-]?\\d(?:_?\\d)*)?|0x[\\da-fA-F](?:_?[\\da-fA-F])*(?:\\.[\\da-fA-F](?:_?[\\da-fA-D])*)?(?:[pP][+-]?\\d(?:_?\\d)*)?)\\b|\\binf\\b|\\bnan(?::0x[\\da-fA-F](?:_?[\\da-fA-D])*)?\\b/
}]}},grmr_yaml:e=>{
const n="true false yes no null",t="[\\\\w#;/?:@&=+$,.~*'()[\\\\]]+",a={
className:"string",relevance:0,variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/
},{begin:/\\S+/}],contains:[e.BACKSLASH_ESCAPE,{className:"template-variable",
variants:[{begin:/\\{\\{/,end:/\\}\\}/},{begin:/%\\{/,end:/\\}/}]}]},i=e.inherit(a,{
variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/[^\\s,{}[\\]]+/}]}),r={
end:",",endsWithParent:!0,excludeEnd:!0,keywords:n,relevance:0},s={begin:/\\{/,
end:/\\}/,contains:[r],illegal:"\\\\n",relevance:0},o={begin:"\\\\[",end:"\\\\]",
contains:[r],illegal:"\\\\n",relevance:0},l=[{className:"attr",variants:[{
begin:"\\\\w[\\\\w :\\\\/.-]*:(?=[ \\t]|$)"},{begin:'"\\\\w[\\\\w :\\\\/.-]*":(?=[ \\t]|$)'},{
begin:"'\\\\w[\\\\w :\\\\/.-]*':(?=[ \\t]|$)"}]},{className:"meta",begin:"^---\\\\s*$",
relevance:10},{className:"string",
begin:"[\\\\|>]([1-9]?[+-])?[ ]*\\\\n( +)[^ ][^\\\\n]*\\\\n(\\\\2[^\\\\n]+\\\\n?)*"},{
begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,
relevance:0},{className:"type",begin:"!\\\\w+!"+t},{className:"type",
begin:"!<"+t+">"},{className:"type",begin:"!"+t},{className:"type",begin:"!!"+t
},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",
begin:"\\\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",
relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},{
className:"number",
begin:"\\\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\\\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\\\.[0-9]*)?([ \\\\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\\\b"
},{className:"number",begin:e.C_NUMBER_RE+"\\\\b",relevance:0},s,o,a],c=[...l]
;return c.pop(),c.push(i),r.contains=c,{name:"YAML",case_insensitive:!0,
aliases:["yml"],contains:l}}});const je=ne;for(const e of Object.keys(Ue)){
const n=e.replace("grmr_","").replace("_","-");je.registerLanguage(n,Ue[e])}
return je}()
;"object"==typeof exports&&"undefined"!=typeof module&&(module.exports=hljs);
export {hljs};`, "w");
	ns.write("/marked/Hooks.js", `/** @param {NS} ns */
export async function main(ns) {
}

import { defaults } from 'marked/defaults.js';

export class Hooks {
  constructor(options) {
    this.options = options || defaults;
  }

  static passThroughHooks = new Set([
    'preprocess',
    'postprocess'
  ]);

  /**
   * Process markdown before marked
   */
  preprocess(markdown) {
    return markdown;
  }

  /**
   * Process HTML after marked is finished
   */
  postprocess(html) {
    return html;
  }
}`, "w");
	ns.write("/marked/Lexer.js", `/** @param {NS} ns */
export async function main(ns) {
}

import { Tokenizer } from 'marked/Tokenizer.js';
import { defaults } from 'marked/defaults.js';
import { block, inline } from 'marked/rules.js';
import { repeatString } from 'marked/helpers.js';

/**
 * smartypants text replacement
 * @param {string} text
 */
function smartypants(text) {
  return text
    // em-dashes
    .replace(/---/g, '\\u2014')
    // en-dashes
    .replace(/--/g, '\\u2013')
    // opening singles
    .replace(/(^|[-\\u2014/(\\[{"\\s])'/g, '$1\\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\\u2019')
    // opening doubles
    .replace(/(^|[-\\u2014/(\\[{\\u2018\\s])"/g, '$1\\u201c')
    // closing doubles
    .replace(/"/g, '\\u201d')
    // ellipses
    .replace(/\\.{3}/g, '\\u2026');
}

/**
 * mangle email addresses
 * @param {string} text
 */
function mangle(text) {
  let out = '',
    i,
    ch;

  const l = text.length;
  for (i = 0; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
}

/**
 * Block Lexer
 */
export class Lexer {
  constructor(options) {
    this.tokens = [];
    this.tokens.links = Object.create(null);
    this.options = options || defaults;
    this.options.tokenizer = this.options.tokenizer || new Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };

    const rules = {
      block: block.normal,
      inline: inline.normal
    };

    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }

  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }

  /**
   * Static Lex Method
   */
  static lex(src, options) {
    const lexer = new Lexer(options);
    return lexer.lex(src);
  }

  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options) {
    const lexer = new Lexer(options);
    return lexer.inlineTokens(src);
  }

  /**
   * Preprocessing
   */
  lex(src) {
    src = src
      .replace(/\\r\\n|\\r/g, '\\n');

    this.blockTokens(src, this.tokens);

    let next;
    while (next = this.inlineQueue.shift()) {
      this.inlineTokens(next.src, next.tokens);
    }

    return this.tokens;
  }

  /**
   * Lexing
   */
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/\\t/g, '    ').replace(/^ +$/gm, '');
    } else {
      src = src.replace(/^( *)(\\t+)/gm, (_, leading, tabs) => {
        return leading + '    '.repeat(tabs.length);
      });
    }

    let token, lastToken, cutSrc, lastParagraphClipped;

    while (src) {
      if (this.options.extensions
        && this.options.extensions.block
        && this.options.extensions.block.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
        continue;
      }

      // newline
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.raw.length === 1 && tokens.length > 0) {
          // if there's a single \\n as a spacer, it's terminating the last line,
          // so move it there so that we don't get unecessary paragraph tags
          tokens[tokens.length - 1].raw += '\\n';
        } else {
          tokens.push(token);
        }
        continue;
      }

      // code
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        // An indented code block cannot interrupt a paragraph.
        if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
          lastToken.raw += '\\n' + token.raw;
          lastToken.text += '\\n' + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // fences
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // heading
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // hr
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // blockquote
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // list
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // html
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // def
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
          lastToken.raw += '\\n' + token.raw;
          lastToken.text += '\\n' + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }

      // table (gfm)
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // lheading
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // top-level paragraph
      // prevent paragraph consuming extensions by clipping 'src' to extension start
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === 'paragraph') {
          lastToken.raw += '\\n' + token.raw;
          lastToken.text += '\\n' + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = (cutSrc.length !== src.length);
        src = src.substring(token.raw.length);
        continue;
      }

      // text
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === 'text') {
          lastToken.raw += '\\n' + token.raw;
          lastToken.text += '\\n' + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }

    this.state.top = true;
    return tokens;
  }

  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }

  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;

    // String with links masked to avoid interference with em and strong
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;

    // Mask out reflinks
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    // Mask out other blocks
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }

    // Mask out escaped em & strong delimiters
    while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index + match[0].length - 2) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
      this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
    }

    while (src) {
      if (!keepPrevChar) {
        prevChar = '';
      }
      keepPrevChar = false;

      // extensions
      if (this.options.extensions
        && this.options.extensions.inline
        && this.options.extensions.inline.some((extTokenizer) => {
          if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }
          return false;
        })) {
        continue;
      }

      // escape
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // tag
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === 'text' && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // link
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // reflink, nolink
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === 'text' && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      // em & strong
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // code
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // br
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // del (gfm)
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // autolink
      if (token = this.tokenizer.autolink(src, mangle)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // url (gfm)
      if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }

      // text
      // prevent inlineText consuming extensions by clipping 'src' to extension start
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach(function(getStartIndex) {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === 'number' && tempStart >= 0) { startIndex = Math.min(startIndex, tempStart); }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== '_') { // Track prevChar before string of ____ started
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === 'text') {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }

      if (src) {
        const errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }

    return tokens;
  }
}`, "w");
	ns.write("/marked/Parser.js", `/** @param {NS} ns */
export async function main(ns) {
}

import { Renderer } from 'marked/Renderer.js';
import { TextRenderer } from 'marked/TextRenderer.js';
import { Slugger } from 'marked/Slugger.js';
import { defaults } from 'marked/defaults.js';
import {
  unescape
} from 'marked/helpers.js';

/**
 * Parsing & Compiling
 */
export class Parser {
  constructor(options) {
    this.options = options || defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new TextRenderer();
    this.slugger = new Slugger();
  }

  /**
   * Static Parse Method
   */
  static parse(tokens, options) {
    const parser = new Parser(options);
    return parser.parse(tokens);
  }

  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options) {
    const parser = new Parser(options);
    return parser.parseInline(tokens);
  }

  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = '',
      i,
      j,
      k,
      l2,
      l3,
      row,
      cell,
      header,
      body,
      token,
      ordered,
      start,
      loose,
      itemBody,
      item,
      checked,
      task,
      checkbox,
      ret;

    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
          out += ret || '';
          continue;
        }
      }

      switch (token.type) {
        case 'space': {
          continue;
        }
        case 'hr': {
          out += this.renderer.hr();
          continue;
        }
        case 'heading': {
          out += this.renderer.heading(
            this.parseInline(token.tokens),
            token.depth,
            unescape(this.parseInline(token.tokens, this.textRenderer)),
            this.slugger);
          continue;
        }
        case 'code': {
          out += this.renderer.code(token.text,
            token.lang,
            token.escaped);
          continue;
        }
        case 'table': {
          header = '';

          // header
          cell = '';
          l2 = token.header.length;
          for (j = 0; j < l2; j++) {
            cell += this.renderer.tablecell(
              this.parseInline(token.header[j].tokens),
              { header: true, align: token.align[j] }
            );
          }
          header += this.renderer.tablerow(cell);

          body = '';
          l2 = token.rows.length;
          for (j = 0; j < l2; j++) {
            row = token.rows[j];

            cell = '';
            l3 = row.length;
            for (k = 0; k < l3; k++) {
              cell += this.renderer.tablecell(
                this.parseInline(row[k].tokens),
                { header: false, align: token.align[k] }
              );
            }

            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case 'blockquote': {
          body = this.parse(token.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case 'list': {
          ordered = token.ordered;
          start = token.start;
          loose = token.loose;
          l2 = token.items.length;

          body = '';
          for (j = 0; j < l2; j++) {
            item = token.items[j];
            checked = item.checked;
            task = item.task;

            itemBody = '';
            if (item.task) {
              checkbox = this.renderer.checkbox(checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                  item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                    item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: 'text',
                    text: checkbox
                  });
                }
              } else {
                itemBody += checkbox;
              }
            }

            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, checked);
          }

          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case 'html': {
          // TODO parse inline content if parameter markdown=1
          out += this.renderer.html(token.text);
          continue;
        }
        case 'paragraph': {
          out += this.renderer.paragraph(this.parseInline(token.tokens));
          continue;
        }
        case 'text': {
          body = token.tokens ? this.parseInline(token.tokens) : token.text;
          while (i + 1 < l && tokens[i + 1].type === 'text') {
            token = tokens[++i];
            body += '\\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }

        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }

    return out;
  }

  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = '',
      i,
      token,
      ret;

    const l = tokens.length;
    for (i = 0; i < l; i++) {
      token = tokens[i];

      // Run any renderer extensions
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
          out += ret || '';
          continue;
        }
      }

      switch (token.type) {
        case 'escape': {
          out += renderer.text(token.text);
          break;
        }
        case 'html': {
          out += renderer.html(token.text);
          break;
        }
        case 'link': {
          out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
          break;
        }
        case 'image': {
          out += renderer.image(token.href, token.title, token.text);
          break;
        }
        case 'strong': {
          out += renderer.strong(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'em': {
          out += renderer.em(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'codespan': {
          out += renderer.codespan(token.text);
          break;
        }
        case 'br': {
          out += renderer.br();
          break;
        }
        case 'del': {
          out += renderer.del(this.parseInline(token.tokens, renderer));
          break;
        }
        case 'text': {
          out += renderer.text(token.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return;
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
}`, "w");
	ns.write("/marked/Renderer.js", `/** @param {NS} ns */
export async function main(ns) {
}

import { defaults } from 'marked/defaults.js';
import {
  cleanUrl,
  escape
} from 'marked/helpers.js';

/**
 * Renderer
 */
export class Renderer {
  constructor(options) {
    this.options = options || defaults;
  }

  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    code = code.replace(/\\n$/, '') + '\\n';

    if (!lang) {
      return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '</code></pre>\\n';
    }

    return '<pre><code class="'
      + this.options.langPrefix
      + escape(lang)
      + '">'
      + (escaped ? code : escape(code, true))
      + '</code></pre>\\n';
  }

  /**
   * @param {string} quote
   */
  blockquote(quote) {
    return \`<blockquote>\\n\${quote}</blockquote>\\n\`;
  }

  html(html) {
    return html;
  }

  /**
   * @param {string} text
   * @param {string} level
   * @param {string} raw
   * @param {any} slugger
   */
  heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      const id = this.options.headerPrefix + slugger.slug(raw);
      return \`<h\${level} id="\${id}">\${text}</h\${level}>\\n\`;
    }

    // ignore IDs
    return \`<h\${level}>\${text}</h\${level}>\\n\`;
  }

  hr() {
    return this.options.xhtml ? '<hr/>\\n' : '<hr>\\n';
  }

  list(body, ordered, start) {
    const type = ordered ? 'ol' : 'ul',
      startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
    return '<' + type + startatt + '>\\n' + body + '</' + type + '>\\n';
  }

  /**
   * @param {string} text
   */
  listitem(text) {
    return \`<li>\${text}</li>\\n\`;
  }

  checkbox(checked) {
    return '<input '
      + (checked ? 'checked="" ' : '')
      + 'disabled="" type="checkbox"'
      + (this.options.xhtml ? ' /' : '')
      + '> ';
  }

  /**
   * @param {string} text
   */
  paragraph(text) {
    return \`<p>\${text}</p>\\n\`;
  }

  /**
   * @param {string} header
   * @param {string} body
   */
  table(header, body) {
    if (body) body = \`<tbody>\${body}</tbody>\`;

    return '<table>\\n'
      + '<thead>\\n'
      + header
      + '</thead>\\n'
      + body
      + '</table>\\n';
  }

  /**
   * @param {string} content
   */
  tablerow(content) {
    return \`<tr>\\n\${content}</tr>\\n\`;
  }

  tablecell(content, flags) {
    const type = flags.header ? 'th' : 'td';
    const tag = flags.align
      ? \`<\${type} align="\${flags.align}">\`
      : \`<\${type}>\`;
    return tag + content + \`</\${type}>\\n\`;
  }

  /**
   * span level renderer
   * @param {string} text
   */
  strong(text) {
    return \`<strong>\${text}</strong>\`;
  }

  /**
   * @param {string} text
   */
  em(text) {
    return \`<em>\${text}</em>\`;
  }

  /**
   * @param {string} text
   */
  codespan(text) {
    return \`<code>\${text}</code>\`;
  }

  br() {
    return this.options.xhtml ? '<br/>' : '<br>';
  }

  /**
   * @param {string} text
   */
  del(text) {
    return \`<del>\${text}</del>\`;
  }

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
  }

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} text
   */
  image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = \`<img src="\${href}" alt="\${text}"\`;
    if (title) {
      out += \` title="\${title}"\`;
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
  }

  text(text) {
    return text;
  }
}`, "w");
  ns.write("/marked/Slugger.js", `/** @param {NS} ns */
export async function main(ns) {
}

/**
 * Slugger generates header id
 */
export class Slugger {
  constructor() {
    this.seen = {};
  }

  /**
   * @param {string} value
   */
  serialize(value) {
    return value
      .toLowerCase()
      .trim()
      // remove html tags
      .replace(/<[!\\/a-z].*?>/ig, '')
      // remove unwanted chars
      .replace(/[\\u2000-\\u206F\\u2E00-\\u2E7F\\\\'!"#$%&()*+,./:;<=>?@[\\]^\`{|}~]/g, '')
      .replace(/\\s/g, '-');
  }

  /**
   * Finds the next safe (unique) slug to use
   * @param {string} originalSlug
   * @param {boolean} isDryRun
   */
  getNextSafeSlug(originalSlug, isDryRun) {
    let slug = originalSlug;
    let occurenceAccumulator = 0;
    if (this.seen.hasOwnProperty(slug)) {
      occurenceAccumulator = this.seen[originalSlug];
      do {
        occurenceAccumulator++;
        slug = originalSlug + '-' + occurenceAccumulator;
      } while (this.seen.hasOwnProperty(slug));
    }
    if (!isDryRun) {
      this.seen[originalSlug] = occurenceAccumulator;
      this.seen[slug] = 0;
    }
    return slug;
  }

  /**
   * Convert string to unique id
   * @param {object} [options]
   * @param {boolean} [options.dryrun] Generates the next unique slug without
   * updating the internal accumulator.
   */
  slug(value, options = {}) {
    const slug = this.serialize(value);
    return this.getNextSafeSlug(slug, options.dryrun);
  }
}`, "w");
  ns.write("/marked/TextRenderer.js", `/** @param {NS} ns */
export async function main(ns) {
}

/**
 * TextRenderer
 * returns only the textual part of the token
 */
export class TextRenderer {
  // no need for block level renderers
  strong(text) {
    return text;
  }

  em(text) {
    return text;
  }

  codespan(text) {
    return text;
  }

  del(text) {
    return text;
  }

  html(text) {
    return text;
  }

  text(text) {
    return text;
  }

  link(href, title, text) {
    return '' + text;
  }

  image(href, title, text) {
    return '' + text;
  }

  br() {
    return '';
  }
}`, "w");
  ns.write("/marked/Tokenizer.js", `/** @param {NS} ns */
export async function main(ns) {
}

import { defaults } from 'marked/defaults.js';
import {
  rtrim,
  splitCells,
  escape,
  findClosingBracket
} from 'marked/helpers.js';

function outputLink(cap, link, raw, lexer) {
  const href = link.href;
  const title = link.title ? escape(link.title) : null;
  const text = cap[1].replace(/\\\\([\\[\\]])/g, '$1');

  if (cap[0].charAt(0) !== '!') {
    lexer.state.inLink = true;
    const token = {
      type: 'link',
      raw,
      href,
      title,
      text,
      tokens: lexer.inlineTokens(text)
    };
    lexer.state.inLink = false;
    return token;
  }
  return {
    type: 'image',
    raw,
    href,
    title,
    text: escape(text)
  };
}

function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\\s+)(?:\`\`\`)/);

  if (matchIndentToCode === null) {
    return text;
  }

  const indentToCode = matchIndentToCode[1];

  return text
    .split('\\n')
    .map(node => {
      const matchIndentInNode = node.match(/^\\s+/);
      if (matchIndentInNode === null) {
        return node;
      }

      const [indentInNode] = matchIndentInNode;

      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }

      return node;
    })
    .join('\\n');
}

/**
 * Tokenizer
 */
export class Tokenizer {
  constructor(options) {
    this.options = options || defaults;
  }

  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: 'space',
        raw: cap[0]
      };
    }
  }

  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, '');
      return {
        type: 'code',
        raw: cap[0],
        codeBlockStyle: 'indented',
        text: !this.options.pedantic
          ? rtrim(text, '\\n')
          : text
      };
    }
  }

  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || '');

      return {
        type: 'code',
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline._escapes, '$1') : cap[2],
        text
      };
    }
  }

  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();

      // remove trailing #s
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, '#');
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          // CommonMark requires space before trailing #s
          text = trimmed.trim();
        }
      }

      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }

  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: 'hr',
        raw: cap[0]
      };
    }
  }

  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ *>[ \\t]?/gm, '');
      const top = this.lexer.state.top;
      this.lexer.state.top = true;
      const tokens = this.lexer.blockTokens(text);
      this.lexer.state.top = top;
      return {
        type: 'blockquote',
        raw: cap[0],
        tokens,
        text
      };
    }
  }

  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine,
        line, nextLine, rawLine, itemContents, endEarly;

      let bull = cap[1].trim();
      const isordered = bull.length > 1;

      const list = {
        type: 'list',
        raw: '',
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : '',
        loose: false,
        items: []
      };

      bull = isordered ? \`\\\\d{1,9}\\\\\${bull.slice(-1)}\` : \`\\\\\${bull}\`;

      if (this.options.pedantic) {
        bull = isordered ? bull : '[*+-]';
      }

      // Get next list item
      const itemRegex = new RegExp(\`^( {0,3}\${bull})((?:[\\t ][^\\\\n]*)?(?:\\\\n|$))\`);

      // Check if current bullet point can start a new List Item
      while (src) {
        endEarly = false;
        if (!(cap = itemRegex.exec(src))) {
          break;
        }

        if (this.rules.block.hr.test(src)) { // End list if bullet was actually HR (possibly move into itemRegex?)
          break;
        }

        raw = cap[0];
        src = src.substring(raw.length);

        line = cap[2].split('\\n', 1)[0].replace(/^\\t+/, (t) => ' '.repeat(3 * t.length));
        nextLine = src.split('\\n', 1)[0];

        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimLeft();
        } else {
          indent = cap[2].search(/[^ ]/); // Find first non-space char
          indent = indent > 4 ? 1 : indent; // Treat indented code blocks (> 4 spaces) as having only 1 indent
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }

        blankLine = false;

        if (!line && /^ *$/.test(nextLine)) { // Items begin with at most one blank line
          raw += nextLine + '\\n';
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }

        if (!endEarly) {
          const nextBulletRegex = new RegExp(\`^ {0,\${Math.min(3, indent - 1)}}(?:[*+-]|\\\\d{1,9}[.)])((?:[ \\t][^\\\\n]*)?(?:\\\\n|$))\`);
          const hrRegex = new RegExp(\`^ {0,\${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$)\`);
          const fencesBeginRegex = new RegExp(\`^ {0,\${Math.min(3, indent - 1)}}(?:\\\`\\\`\\\`|~~~)\`);
          const headingBeginRegex = new RegExp(\`^ {0,\${Math.min(3, indent - 1)}}#\`);

          // Check if following lines should be included in List Item
          while (src) {
            rawLine = src.split('\\n', 1)[0];
            nextLine = rawLine;

            // Re-align to follow commonmark nesting rules
            if (this.options.pedantic) {
              nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
            }

            // End list item if found code fences
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new heading
            if (headingBeginRegex.test(nextLine)) {
              break;
            }

            // End list item if found start of new bullet
            if (nextBulletRegex.test(nextLine)) {
              break;
            }

            // Horizontal rule found
            if (hrRegex.test(src)) {
              break;
            }

            if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) { // Dedent if possible
              itemContents += '\\n' + nextLine.slice(indent);
            } else {
              // not enough indentation
              if (blankLine) {
                break;
              }

              // paragraph continuation unless last line was a different block level element
              if (line.search(/[^ ]/) >= 4) { // indented code block
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }

              itemContents += '\\n' + nextLine;
            }

            if (!blankLine && !nextLine.trim()) { // Check if current line is blank
              blankLine = true;
            }

            raw += rawLine + '\\n';
            src = src.substring(rawLine.length + 1);
            line = nextLine.slice(indent);
          }
        }

        if (!list.loose) {
          // If the previous item ended with a blank line, the list is loose
          if (endsWithBlankLine) {
            list.loose = true;
          } else if (/\\n *\\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }

        // Check for task list items
        if (this.options.gfm) {
          istask = /^\\[[ xX]\\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== '[ ] ';
            itemContents = itemContents.replace(/^\\[[ xX]\\] +/, '');
          }
        }

        list.items.push({
          type: 'list_item',
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents
        });

        list.raw += raw;
      }

      // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic
      list.items[list.items.length - 1].raw = raw.trimRight();
      list.items[list.items.length - 1].text = itemContents.trimRight();
      list.raw = list.raw.trimRight();

      const l = list.items.length;

      // Item child tokens handled here at end because we needed to have the final item to trim it first
      for (i = 0; i < l; i++) {
        this.lexer.state.top = false;
        list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);

        if (!list.loose) {
          // Check if list should be loose
          const spacers = list.items[i].tokens.filter(t => t.type === 'space');
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some(t => /\\n.*\\n/.test(t.raw));

          list.loose = hasMultipleLineBreaks;
        }
      }

      // Set all items to loose if list is loose
      if (list.loose) {
        for (i = 0; i < l; i++) {
          list.items[i].loose = true;
        }
      }

      return list;
    }
  }

  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: 'html',
        raw: cap[0],
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      };
      if (this.options.sanitize) {
        const text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);
        token.type = 'paragraph';
        token.text = text;
        token.tokens = this.lexer.inline(text);
      }
      return token;
    }
  }

  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag = cap[1].toLowerCase().replace(/\\s+/g, ' ');
      const href = cap[2] ? cap[2].replace(/^<(.*)>$/, '$1').replace(this.rules.inline._escapes, '$1') : '';
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline._escapes, '$1') : cap[3];
      return {
        type: 'def',
        tag,
        raw: cap[0],
        href,
        title
      };
    }
  }

  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (cap) {
      const item = {
        type: 'table',
        header: splitCells(cap[1]).map(c => { return { text: c }; }),
        align: cap[2].replace(/^ *|\\| *$/g, '').split(/ *\\| */),
        rows: cap[3] && cap[3].trim() ? cap[3].replace(/\\n[ \\t]*$/, '').split('\\n') : []
      };

      if (item.header.length === item.align.length) {
        item.raw = cap[0];

        let l = item.align.length;
        let i, j, k, row;
        for (i = 0; i < l; i++) {
          if (/^ *-+: *$/.test(item.align[i])) {
            item.align[i] = 'right';
          } else if (/^ *:-+: *$/.test(item.align[i])) {
            item.align[i] = 'center';
          } else if (/^ *:-+ *$/.test(item.align[i])) {
            item.align[i] = 'left';
          } else {
            item.align[i] = null;
          }
        }

        l = item.rows.length;
        for (i = 0; i < l; i++) {
          item.rows[i] = splitCells(item.rows[i], item.header.length).map(c => { return { text: c }; });
        }

        // parse child tokens inside headers and cells

        // header child tokens
        l = item.header.length;
        for (j = 0; j < l; j++) {
          item.header[j].tokens = this.lexer.inline(item.header[j].text);
        }

        // cell child tokens
        l = item.rows.length;
        for (j = 0; j < l; j++) {
          row = item.rows[j];
          for (k = 0; k < row.length; k++) {
            row[k].tokens = this.lexer.inline(row[k].text);
          }
        }

        return item;
      }
    }
  }

  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: 'heading',
        raw: cap[0],
        depth: cap[2].charAt(0) === '=' ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }

  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === '\\n'
        ? cap[1].slice(0, -1)
        : cap[1];
      return {
        type: 'paragraph',
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }

  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: 'text',
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }

  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: 'escape',
        raw: cap[0],
        text: escape(cap[1])
      };
    }
  }

  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\\/(pre|code|kbd|script)(\\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }

      return {
        type: this.options.sanitize
          ? 'text'
          : 'html',
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        text: this.options.sanitize
          ? (this.options.sanitizer
            ? this.options.sanitizer(cap[0])
            : escape(cap[0]))
          : cap[0]
      };
    }
  }

  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        // commonmark requires matching angle brackets
        if (!(/>$/.test(trimmedUrl))) {
          return;
        }

        // ending angle bracket cannot be escaped
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\\\');
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        // find closing parenthesis
        const lastParenIndex = findClosingBracket(cap[2], '()');
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf('!') === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = '';
        }
      }
      let href = cap[2];
      let title = '';
      if (this.options.pedantic) {
        // split pedantic href and title
        const link = /^([^'"]*[^\\s])\\s+(['"])(.*)\\2/.exec(href);

        if (link) {
          href = link[1];
          title = link[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : '';
      }

      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !(/>$/.test(trimmedUrl))) {
          // pedantic allows starting angle bracket without ending angle bracket
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
        title: title ? title.replace(this.rules.inline._escapes, '$1') : title
      }, cap[0], this.lexer);
    }
  }

  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src))
        || (cap = this.rules.inline.nolink.exec(src))) {
      let link = (cap[2] || cap[1]).replace(/\\s+/g, ' ');
      link = links[link.toLowerCase()];
      if (!link) {
        const text = cap[0].charAt(0);
        return {
          type: 'text',
          raw: text,
          text
        };
      }
      return outputLink(cap, link, cap[0], this.lexer);
    }
  }

  emStrong(src, maskedSrc, prevChar = '') {
    let match = this.rules.inline.emStrong.lDelim.exec(src);
    if (!match) return;

    // _ can't be between two alphanumerics. \\p{L}\\p{N} includes non-english alphabet/numbers as well
    if (match[3] && prevChar.match(/[\\p{L}\\p{N}]/u)) return;

    const nextChar = match[1] || match[2] || '';

    if (!nextChar || (nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar)))) {
      const lLength = match[0].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;

      const endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
      endReg.lastIndex = 0;

      // Clip maskedSrc to same section of string as src (move to lexer?)
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];

        if (!rDelim) continue; // skip single * in __abc*abc__

        rLength = rDelim.length;

        if (match[3] || match[4]) { // found another Left Delim
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) { // either Left or Right Delim
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue; // CommonMark Emphasis Rules 9-10
          }
        }

        delimTotal -= rLength;

        if (delimTotal > 0) continue; // Haven't found enough closing delimiters

        // Remove extra characters. *a*** -> *a*
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);

        const raw = src.slice(0, lLength + match.index + (match[0].length - rDelim.length) + rLength);

        // Create \`em\` if smallest delimiter has odd char count. *a***
        if (Math.min(lLength, rLength) % 2) {
          const text = raw.slice(1, -1);
          return {
            type: 'em',
            raw,
            text,
            tokens: this.lexer.inlineTokens(text)
          };
        }

        // Create 'strong' if smallest delimiter has even char count. **a***
        const text = raw.slice(2, -2);
        return {
          type: 'strong',
          raw,
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }

  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\\n/g, ' ');
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape(text, true);
      return {
        type: 'codespan',
        raw: cap[0],
        text
      };
    }
  }

  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: 'br',
        raw: cap[0]
      };
    }
  }

  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: 'del',
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }

  autolink(src, mangle) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === '@') {
        text = escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
        href = 'mailto:' + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }

      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: 'text',
            raw: text,
            text
          }
        ]
      };
    }
  }

  url(src, mangle) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === '@') {
        text = escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
        href = 'mailto:' + text;
      } else {
        // do extended autolink path validation
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
        } while (prevCapZero !== cap[0]);
        text = escape(cap[0]);
        if (cap[1] === 'www.') {
          href = 'http://' + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: 'link',
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: 'text',
            raw: text,
            text
          }
        ]
      };
    }
  }

  inlineText(src, smartypants) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = this.options.sanitize ? (this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0])) : cap[0];
      } else {
        text = escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
      }
      return {
        type: 'text',
        raw: cap[0],
        text
      };
    }
  }
}`, "w");
  ns.write("/marked/defaults.js", `/** @param {NS} ns */
export async function main(ns) {
}

export function getDefaults() {
  return {
    async: false,
    baseUrl: null,
    breaks: false,
    extensions: null,
    gfm: true,
    headerIds: true,
    headerPrefix: '',
    highlight: null,
    hooks: null,
    langPrefix: 'language-',
    mangle: true,
    pedantic: false,
    renderer: null,
    sanitize: false,
    sanitizer: null,
    silent: false,
    smartypants: false,
    tokenizer: null,
    walkTokens: null,
    xhtml: false
  };
}

export let defaults = getDefaults();

export function changeDefaults(newDefaults) {
  defaults = newDefaults;
}`, "w");
  ns.write("/marked/helpers.js", `/** @param {NS} ns */
export async function main(ns) {
}

/**
 * Helpers
 */
const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, 'g');
const escapeTestNoEncode = /[<>"']|&(?!(#\\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');
const escapeReplacements = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
export function escape(html, encode) {
  if (encode) {
    if (escapeTest.test(html)) {
      return html.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html)) {
      return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }

  return html;
}

const unescapeTest = /&(#(?:\\d+)|(?:#x[0-9A-Fa-f]+)|(?:\\w+));?/ig;

/**
 * @param {string} html
 */
export function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(unescapeTest, (_, n) => {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

const caret = /(^|[^\\[])\\^/g;

/**
 * @param {string | RegExp} regex
 * @param {string} opt
 */
export function edit(regex, opt) {
  regex = typeof regex === 'string' ? regex : regex.source;
  opt = opt || '';
  const obj = {
    replace: (name, val) => {
      val = val.source || val;
      val = val.replace(caret, '$1');
      regex = regex.replace(name, val);
      return obj;
    },
    getRegex: () => {
      return new RegExp(regex, opt);
    }
  };
  return obj;
}

const nonWordAndColonTest = /[^\\w:]/g;
const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

/**
 * @param {boolean} sanitize
 * @param {string} base
 * @param {string} href
 */
export function cleanUrl(sanitize, base, href) {
  if (sanitize) {
    let prot;
    try {
      prot = decodeURIComponent(unescape(href))
        .replace(nonWordAndColonTest, '')
        .toLowerCase();
    } catch (e) {
      return null;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return null;
    }
  }
  if (base && !originIndependentUrl.test(href)) {
    href = resolveUrl(base, href);
  }
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch (e) {
    return null;
  }
  return href;
}

const baseUrls = {};
const justDomain = /^[^:]+:\\/*[^/]*$/;
const protocol = /^([^:]+:)[\\s\\S]*$/;
const domain = /^([^:]+:\\/*[^/]*)[\\s\\S]*$/;

/**
 * @param {string} base
 * @param {string} href
 */
export function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (justDomain.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = rtrim(base, '/', true);
    }
  }
  base = baseUrls[' ' + base];
  const relativeBase = base.indexOf(':') === -1;

  if (href.substring(0, 2) === '//') {
    if (relativeBase) {
      return href;
    }
    return base.replace(protocol, '$1') + href;
  } else if (href.charAt(0) === '/') {
    if (relativeBase) {
      return href;
    }
    return base.replace(domain, '$1') + href;
  } else {
    return base + href;
  }
}

export const noopTest = { exec: function noopTest() {} };

export function splitCells(tableRow, count) {
  // ensure that every cell-delimiting pipe has a space
  // before it to distinguish it from an escaped pipe
  const row = tableRow.replace(/\\|/g, (match, offset, str) => {
      let escaped = false,
        curr = offset;
      while (--curr >= 0 && str[curr] === '\\\\') escaped = !escaped;
      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
    cells = row.split(/ \\|/);
  let i = 0;

  // First/last cell in a row cannot be empty if it has no leading/trailing pipe
  if (!cells[0].trim()) { cells.shift(); }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) { cells.pop(); }

  if (cells.length > count) {
    cells.splice(count);
  } else {
    while (cells.length < count) cells.push('');
  }

  for (; i < cells.length; i++) {
    // leading or trailing whitespace is ignored per the gfm spec
    cells[i] = cells[i].trim().replace(/\\\\\\|/g, '|');
  }
  return cells;
}

/**
 * Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
 * /c*$/ is vulnerable to REDOS.
 *
 * @param {string} str
 * @param {string} c
 * @param {boolean} invert Remove suffix of non-c chars instead. Default falsey.
 */
export function rtrim(str, c, invert) {
  const l = str.length;
  if (l === 0) {
    return '';
  }

  // Length of suffix matching the invert condition.
  let suffLen = 0;

  // Step left until we fail to match the invert condition.
  while (suffLen < l) {
    const currChar = str.charAt(l - suffLen - 1);
    if (currChar === c && !invert) {
      suffLen++;
    } else if (currChar !== c && invert) {
      suffLen++;
    } else {
      break;
    }
  }

  return str.slice(0, l - suffLen);
}

export function findClosingBracket(str, b) {
  if (str.indexOf(b[1]) === -1) {
    return -1;
  }
  const l = str.length;
  let level = 0,
    i = 0;
  for (; i < l; i++) {
    if (str[i] === '\\\\') {
      i++;
    } else if (str[i] === b[0]) {
      level++;
    } else if (str[i] === b[1]) {
      level--;
      if (level < 0) {
        return i;
      }
    }
  }
  return -1;
}

export function checkSanitizeDeprecation(opt) {
  if (opt && opt.sanitize && !opt.silent) {
    console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
  }
}

// copied from https://stackoverflow.com/a/5450113/806777
/**
 * @param {string} pattern
 * @param {number} count
 */
export function repeatString(pattern, count) {
  if (count < 1) {
    return '';
  }
  let result = '';
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
}`, "w");
  ns.write("/marked/marked.js", `/** @param {NS} ns */
export async function main(ns) {
}

import { Lexer } from 'marked/Lexer.js';
import { Parser } from 'marked/Parser.js';
import { Tokenizer } from 'marked/Tokenizer.js';
import { Renderer } from 'marked/Renderer.js';
import { TextRenderer } from 'marked/TextRenderer.js';
import { Slugger } from 'marked/Slugger.js';
import { Hooks } from 'marked/Hooks.js';
import {
  checkSanitizeDeprecation,
  escape
} from 'marked/helpers.js';
import {
  getDefaults,
  changeDefaults,
  defaults
} from 'marked/defaults.js';

function onError(silent, async, callback) {
  return (e) => {
    e.message += '\\nPlease report this to https://github.com/markedjs/marked.';

    if (silent) {
      const msg = '<p>An error occurred:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
      if (async) {
        return Promise.resolve(msg);
      }
      if (callback) {
        callback(null, msg);
        return;
      }
      return msg;
    }

    if (async) {
      return Promise.reject(e);
    }
    if (callback) {
      callback(e);
      return;
    }
    throw e;
  };
}

function parseMarkdown(lexer, parser) {
  return (src, opt, callback) => {
    if (typeof opt === 'function') {
      callback = opt;
      opt = null;
    }

    const origOpt = { ...opt };
    opt = { ...marked.defaults, ...origOpt };
    const throwError = onError(opt.silent, opt.async, callback);

    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      return throwError(new Error('marked(): input parameter is undefined or null'));
    }
    if (typeof src !== 'string') {
      return throwError(new Error('marked(): input parameter is of type '
        + Object.prototype.toString.call(src) + ', string expected'));
    }

    checkSanitizeDeprecation(opt);

    if (opt.hooks) {
      opt.hooks.options = opt;
    }

    if (callback) {
      const highlight = opt.highlight;
      let tokens;

      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        tokens = lexer(src, opt);
      } catch (e) {
        return throwError(e);
      }

      const done = function(err) {
        let out;

        if (!err) {
          try {
            if (opt.walkTokens) {
              marked.walkTokens(tokens, opt.walkTokens);
            }
            out = parser(tokens, opt);
            if (opt.hooks) {
              out = opt.hooks.postprocess(out);
            }
          } catch (e) {
            err = e;
          }
        }

        opt.highlight = highlight;

        return err
          ? throwError(err)
          : callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return done();
      }

      delete opt.highlight;

      if (!tokens.length) return done();

      let pending = 0;
      marked.walkTokens(tokens, function(token) {
        if (token.type === 'code') {
          pending++;
          setTimeout(() => {
            highlight(token.text, token.lang, function(err, code) {
              if (err) {
                return done(err);
              }
              if (code != null && code !== token.text) {
                token.text = code;
                token.escaped = true;
              }

              pending--;
              if (pending === 0) {
                done();
              }
            });
          }, 0);
        }
      });

      if (pending === 0) {
        done();
      }

      return;
    }

    if (opt.async) {
      return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src)
        .then(src => lexer(src, opt))
        .then(tokens => opt.walkTokens ? Promise.all(marked.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens)
        .then(tokens => parser(tokens, opt))
        .then(html => opt.hooks ? opt.hooks.postprocess(html) : html)
        .catch(throwError);
    }

    try {
      if (opt.hooks) {
        src = opt.hooks.preprocess(src);
      }
      const tokens = lexer(src, opt);
      if (opt.walkTokens) {
        marked.walkTokens(tokens, opt.walkTokens);
      }
      let html = parser(tokens, opt);
      if (opt.hooks) {
        html = opt.hooks.postprocess(html);
      }
      return html;
    } catch (e) {
      return throwError(e);
    }
  };
}

/**
 * Marked
 */
export function marked(src, opt, callback) {
  return parseMarkdown(Lexer.lex, Parser.parse)(src, opt, callback);
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  marked.defaults = { ...marked.defaults, ...opt };
  changeDefaults(marked.defaults);
  return marked;
};

marked.getDefaults = getDefaults;

marked.defaults = defaults;

/**
 * Use Extension
 */

marked.use = function(...args) {
  const extensions = marked.defaults.extensions || { renderers: {}, childTokens: {} };

  args.forEach((pack) => {
    // copy options to new object
    const opts = { ...pack };

    // set async to true if it was set to true before
    opts.async = marked.defaults.async || opts.async || false;

    // ==-- Parse "addon" extensions --== //
    if (pack.extensions) {
      pack.extensions.forEach((ext) => {
        if (!ext.name) {
          throw new Error('extension name required');
        }
        if (ext.renderer) { // Renderer extensions
          const prevRenderer = extensions.renderers[ext.name];
          if (prevRenderer) {
            // Replace extension with func to run new extension but fall back if false
            extensions.renderers[ext.name] = function(...args) {
              let ret = ext.renderer.apply(this, args);
              if (ret === false) {
                ret = prevRenderer.apply(this, args);
              }
              return ret;
            };
          } else {
            extensions.renderers[ext.name] = ext.renderer;
          }
        }
        if (ext.tokenizer) { // Tokenizer Extensions
          if (!ext.level || (ext.level !== 'block' && ext.level !== 'inline')) {
            throw new Error("extension level must be 'block' or 'inline'");
          }
          if (extensions[ext.level]) {
            extensions[ext.level].unshift(ext.tokenizer);
          } else {
            extensions[ext.level] = [ext.tokenizer];
          }
          if (ext.start) { // Function to check for start of token
            if (ext.level === 'block') {
              if (extensions.startBlock) {
                extensions.startBlock.push(ext.start);
              } else {
                extensions.startBlock = [ext.start];
              }
            } else if (ext.level === 'inline') {
              if (extensions.startInline) {
                extensions.startInline.push(ext.start);
              } else {
                extensions.startInline = [ext.start];
              }
            }
          }
        }
        if (ext.childTokens) { // Child tokens to be visited by walkTokens
          extensions.childTokens[ext.name] = ext.childTokens;
        }
      });
      opts.extensions = extensions;
    }

    // ==-- Parse "overwrite" extensions --== //
    if (pack.renderer) {
      const renderer = marked.defaults.renderer || new Renderer();
      for (const prop in pack.renderer) {
        const prevRenderer = renderer[prop];
        // Replace renderer with func to run extension, but fall back if false
        renderer[prop] = (...args) => {
          let ret = pack.renderer[prop].apply(renderer, args);
          if (ret === false) {
            ret = prevRenderer.apply(renderer, args);
          }
          return ret;
        };
      }
      opts.renderer = renderer;
    }
    if (pack.tokenizer) {
      const tokenizer = marked.defaults.tokenizer || new Tokenizer();
      for (const prop in pack.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        // Replace tokenizer with func to run extension, but fall back if false
        tokenizer[prop] = (...args) => {
          let ret = pack.tokenizer[prop].apply(tokenizer, args);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }

    // ==-- Parse Hooks extensions --== //
    if (pack.hooks) {
      const hooks = marked.defaults.hooks || new Hooks();
      for (const prop in pack.hooks) {
        const prevHook = hooks[prop];
        if (Hooks.passThroughHooks.has(prop)) {
          hooks[prop] = (arg) => {
            if (marked.defaults.async) {
              return Promise.resolve(pack.hooks[prop].call(hooks, arg)).then(ret => {
                return prevHook.call(hooks, ret);
              });
            }

            const ret = pack.hooks[prop].call(hooks, arg);
            return prevHook.call(hooks, ret);
          };
        } else {
          hooks[prop] = (...args) => {
            let ret = pack.hooks[prop].apply(hooks, args);
            if (ret === false) {
              ret = prevHook.apply(hooks, args);
            }
            return ret;
          };
        }
      }
      opts.hooks = hooks;
    }

    // ==-- Parse WalkTokens extensions --== //
    if (pack.walkTokens) {
      const walkTokens = marked.defaults.walkTokens;
      opts.walkTokens = function(token) {
        let values = [];
        values.push(pack.walkTokens.call(this, token));
        if (walkTokens) {
          values = values.concat(walkTokens.call(this, token));
        }
        return values;
      };
    }

    marked.setOptions(opts);
  });
};

/**
 * Run callback for every token
 */

marked.walkTokens = function(tokens, callback) {
  let values = [];
  for (const token of tokens) {
    values = values.concat(callback.call(marked, token));
    switch (token.type) {
      case 'table': {
        for (const cell of token.header) {
          values = values.concat(marked.walkTokens(cell.tokens, callback));
        }
        for (const row of token.rows) {
          for (const cell of row) {
            values = values.concat(marked.walkTokens(cell.tokens, callback));
          }
        }
        break;
      }
      case 'list': {
        values = values.concat(marked.walkTokens(token.items, callback));
        break;
      }
      default: {
        if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) { // Walk any extensions
          marked.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
            values = values.concat(marked.walkTokens(token[childTokens], callback));
          });
        } else if (token.tokens) {
          values = values.concat(marked.walkTokens(token.tokens, callback));
        }
      }
    }
  }
  return values;
};

/**
 * Parse Inline
 * @param {string} src
 */
marked.parseInline = parseMarkdown(Lexer.lexInline, Parser.parseInline);

/**
 * Expose
 */
marked.Parser = Parser;
marked.parser = Parser.parse;
marked.Renderer = Renderer;
marked.TextRenderer = TextRenderer;
marked.Lexer = Lexer;
marked.lexer = Lexer.lex;
marked.Tokenizer = Tokenizer;
marked.Slugger = Slugger;
marked.Hooks = Hooks;
marked.parse = marked;

export const options = marked.options;
export const setOptions = marked.setOptions;
export const use = marked.use;
export const walkTokens = marked.walkTokens;
export const parseInline = marked.parseInline;
export const parse = marked;
export const parser = Parser.parse;
export const lexer = Lexer.lex;
export { defaults, getDefaults } from 'marked/defaults.js';
export { Lexer } from 'marked/Lexer.js';
export { Parser } from 'marked/Parser.js';
export { Tokenizer } from 'marked/Tokenizer.js';
export { Renderer } from 'marked/Renderer.js';
export { TextRenderer } from 'marked/TextRenderer.js';
export { Slugger } from 'marked/Slugger.js';
export { Hooks } from 'marked/Hooks.js';`, "w");
  ns.write("/marked/rules.js", `/** @param {NS} ns */
export async function main(ns) {
}

import {
  noopTest,
  edit
} from 'marked/helpers.js';

/**
 * Block-Level Grammar
 */
export const block = {
  newline: /^(?: *(?:\\n|$))+/,
  code: /^( {4}[^\\n]+(?:\\n(?: *(?:\\n|$))*)?)+/,
  fences: /^ {0,3}(\`{3,}(?=[^\`\\n]*(?:\\n|$))|~{3,})([^\\n]*)(?:\\n|$)(?:|([\\s\\S]*?)(?:\\n|$))(?: {0,3}\\1[~\`]* *(?=\\n|$)|$)/,
  hr: /^ {0,3}((?:-[\\t ]*){3,}|(?:_[ \\t]*){3,}|(?:\\*[ \\t]*){3,})(?:\\n+|$)/,
  heading: /^ {0,3}(#{1,6})(?=\\s|$)(.*)(?:\\n+|$)/,
  blockquote: /^( {0,3}> ?(paragraph|[^\\n]*)(?:\\n|$))+/,
  list: /^( {0,3}bull)([ \\t][^\\n]+?)?(?:\\n|$)/,
  html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style|textarea)[\\\\s>][\\\\s\\\\S]*?(?:</\\\\1>[^\\\\n]*\\\\n+|$)' // (1)
    + '|comment[^\\\\n]*(\\\\n+|$)' // (2)
    + '|<\\\\?[\\\\s\\\\S]*?(?:\\\\?>\\\\n*|$)' // (3)
    + '|<![A-Z][\\\\s\\\\S]*?(?:>\\\\n*|$)' // (4)
    + '|<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?(?:\\\\]\\\\]>\\\\n*|$)' // (5)
    + '|</?(tag)(?: +|\\\\n|/?>)[\\\\s\\\\S]*?(?:(?:\\\\n *)+\\\\n|$)' // (6)
    + '|<(?!script|pre|style|textarea)([a-z][\\\\w-]*)(?:attribute)*? */?>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n *)+\\\\n|$)' // (7) open tag
    + '|</(?!script|pre|style|textarea)[a-z][\\\\w-]*\\\\s*>(?=[ \\\\t]*(?:\\\\n|$))[\\\\s\\\\S]*?(?:(?:\\\\n *)+\\\\n|$)' // (7) closing tag
    + ')',
  def: /^ {0,3}\\[(label)\\]: *(?:\\n *)?([^<\\s][^\\s]*|<.*?>)(?:(?: +(?:\\n *)?| *\\n *)(title))? *(?:\\n+|$)/,
  table: noopTest,
  lheading: /^((?:.|\\n(?!\\n))+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/,
  // regex template, placeholders will be replaced according to different paragraph
  // interruption rules of commonmark and the original markdown spec:
  _paragraph: /^([^\\n]+(?:\\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\\n)[^\\n]+)*)/,
  text: /^[^\\n]+/
};

block._label = /(?!\\s*\\])(?:\\\\.|[^\\[\\]\\\\])+/;
block._title = /(?:"(?:\\\\"?|[^"\\\\])*"|'[^'\\n]*(?:\\n[^'\\n]+)*\\n?'|\\([^()]*\\))/;
block.def = edit(block.def)
  .replace('label', block._label)
  .replace('title', block._title)
  .getRegex();

block.bullet = /(?:[*+-]|\\d{1,9}[.)])/;
block.listItemStart = edit(/^( *)(bull) */)
  .replace('bull', block.bullet)
  .getRegex();

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\\\n+(?=\\\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\\\* *){3,})(?:\\\\n+|$))')
  .replace('def', '\\\\n+(?=' + block.def.source + ')')
  .getRegex();

block._tag = 'address|article|aside|base|basefont|blockquote|body|caption'
  + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
  + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
  + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
  + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
  + '|track|ul';
block._comment = /<!--(?!-?>)[\\s\\S]*?(?:-->|$)/;
block.html = edit(block.html, 'i')
  .replace('comment', block._comment)
  .replace('tag', block._tag)
  .replace('attribute', / +[a-zA-Z:_][\\w.:-]*(?: *= *"[^"\\n]*"| *= *'[^'\\n]*'| *= *[^\\s"'=<>\`]+)?/)
  .getRegex();

block.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('|table', '')
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();

block.blockquote = edit(block.blockquote)
  .replace('paragraph', block.paragraph)
  .getRegex();

/**
 * Normal Block Grammar
 */

block.normal = { ...block };

/**
 * GFM Block Grammar
 */

block.gfm = {
  ...block.normal,
  table: '^ *([^\\\\n ].*\\\\|.*)\\\\n' // Header
    + ' {0,3}(?:\\\\| *)?(:?-+:? *(?:\\\\| *:?-+:? *)*)(?:\\\\| *)?' // Align
    + '(?:\\\\n((?:(?! *\\\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\\\n|$))*)\\\\n*|$)' // Cells
};

block.gfm.table = edit(block.gfm.table)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('blockquote', ' {0,3}>')
  .replace('code', ' {4}[^\\\\n]')
  .replace('fences', ' {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();

block.gfm.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('table', block.gfm.table) // interrupt paragraphs with table
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:\`{3,}(?=[^\`\\\\n]*\\\\n)|~{3,})[^\\\\n]*\\\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();
/**
 * Pedantic grammar (original John Gruber's loose markdown specification)
 */

block.pedantic = {
  ...block.normal,
  html: edit(
    '^ *(?:comment *(?:\\\\n|\\\\s*$)'
    + '|<(tag)[\\\\s\\\\S]+?</\\\\1> *(?:\\\\n{2,}|\\\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\\'[^\\']*\\'|\\\\s[^\\'"/>\\\\s]*)*?/?> *(?:\\\\n{2,}|\\\\s*$))')
    .replace('comment', block._comment)
    .replace(/tag/g, '(?!(?:'
      + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub'
      + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)'
      + '\\\\b)\\\\w+(?!:|[^\\\\w\\\\s@]*@)\\\\b')
    .getRegex(),
  def: /^ *\\[([^\\]]+)\\]: *<?([^\\s>]+)>?(?: +(["(][^\\n]+[")]))? *(?:\\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\\n+|$)/,
  fences: noopTest, // fences not supported
  lheading: /^(.+?)\\n {0,3}(=+|-+) *(?:\\n+|$)/,
  paragraph: edit(block.normal._paragraph)
    .replace('hr', block.hr)
    .replace('heading', ' *#{1,6} *[^\\n]')
    .replace('lheading', block.lheading)
    .replace('blockquote', ' {0,3}>')
    .replace('|fences', '')
    .replace('|list', '')
    .replace('|html', '')
    .getRegex()
};

/**
 * Inline-Level Grammar
 */
export const inline = {
  escape: /^\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/,
  autolink: /^<(scheme:[^\\s\\x00-\\x1f<>]*|email)>/,
  url: noopTest,
  tag: '^comment'
    + '|^</[a-zA-Z][\\\\w:-]*\\\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\\\w-]*(?:attribute)*?\\\\s*/?>' // open tag
    + '|^<\\\\?[\\\\s\\\\S]*?\\\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\\\s[\\\\s\\\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\\\[CDATA\\\\[[\\\\s\\\\S]*?\\\\]\\\\]>', // CDATA section
  link: /^!?\\[(label)\\]\\(\\s*(href)(?:\\s+(title))?\\s*\\)/,
  reflink: /^!?\\[(label)\\]\\[(ref)\\]/,
  nolink: /^!?\\[(ref)\\](?:\\[\\])?/,
  reflinkSearch: 'reflink|nolink(?!\\\\()',
  emStrong: {
    lDelim: /^(?:\\*+(?:([punct_])|[^\\s*]))|^_+(?:([punct*])|([^\\s_]))/,
    //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
    //          () Skip orphan inside strong                                      () Consume to delim     (1) #***                (2) a***#, a***                             (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
    rDelimAst: /^(?:[^_*\\\\]|\\\\.)*?\\_\\_(?:[^_*\\\\]|\\\\.)*?\\*(?:[^_*\\\\]|\\\\.)*?(?=\\_\\_)|(?:[^*\\\\]|\\\\.)+(?=[^*])|[punct_](\\*+)(?=[\\s]|$)|(?:[^punct*_\\s\\\\]|\\\\.)(\\*+)(?=[punct_\\s]|$)|[punct_\\s](\\*+)(?=[^punct*_\\s])|[\\s](\\*+)(?=[punct_])|[punct_](\\*+)(?=[punct_])|(?:[^punct*_\\s\\\\]|\\\\.)(\\*+)(?=[^punct*_\\s])/,
    rDelimUnd: /^(?:[^_*\\\\]|\\\\.)*?\\*\\*(?:[^_*\\\\]|\\\\.)*?\\_(?:[^_*\\\\]|\\\\.)*?(?=\\*\\*)|(?:[^_\\\\]|\\\\.)+(?=[^_])|[punct*](\\_+)(?=[\\s]|$)|(?:[^punct*_\\s\\\\]|\\\\.)(\\_+)(?=[punct*\\s]|$)|[punct*\\s](\\_+)(?=[^punct*_\\s])|[\\s](\\_+)(?=[punct*])|[punct*](\\_+)(?=[punct*])/ // ^- Not allowed for _
  },
  code: /^(\`+)([^\`]|[^\`][\\s\\S]*?[^\`])\\1(?!\`)/,
  br: /^( {2,}|\\\\)\\n(?!\\s*$)/,
  del: noopTest,
  text: /^(\`+|[^\`])(?:(?= {2,}\\n)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*_]|\\b_|$)|[^ ](?= {2,}\\n)))/,
  punctuation: /^([\\spunctuation])/
};

// list of punctuation marks from CommonMark spec
// without * and _ to handle the different emphasis markers * and _
inline._punctuation = '!"#$%&\\'()+\\\\-.,/:;<=>?@\\\\[\\\\]\`^{|}~';
inline.punctuation = edit(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();

// sequences em should skip over [title](link), \`code\`, <html>
inline.blockSkip = /\\[[^\\]]*?\\]\\([^\\)]*?\\)|\`[^\`]*?\`|<[^>]*?>/g;
// lookbehind is not available on Safari as of version 16
// inline.escapedEmSt = /(?<=(?:^|[^\\\\)(?:\\\\[^])*)\\\\[*_]/g;
inline.escapedEmSt = /(?:^|[^\\\\])(?:\\\\\\\\)*\\\\[*_]/g;

inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex();

inline.emStrong.lDelim = edit(inline.emStrong.lDelim)
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline.emStrong.rDelimAst = edit(inline.emStrong.rDelimAst, 'g')
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline.emStrong.rDelimUnd = edit(inline.emStrong.rDelimUnd, 'g')
  .replace(/punct/g, inline._punctuation)
  .getRegex();

inline._escapes = /\\\\([!"#$%&'()*+,\\-./:;<=>?@\\[\\]\\\\^_\`{|}~])/g;

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline.autolink = edit(inline.autolink)
  .replace('scheme', inline._scheme)
  .replace('email', inline._email)
  .getRegex();

inline._attribute = /\\s+[a-zA-Z:_][\\w.:-]*(?:\\s*=\\s*"[^"]*"|\\s*=\\s*'[^']*'|\\s*=\\s*[^\\s"'=<>\`]+)?/;

inline.tag = edit(inline.tag)
  .replace('comment', inline._comment)
  .replace('attribute', inline._attribute)
  .getRegex();

inline._label = /(?:\\[(?:\\\\.|[^\\[\\]\\\\])*\\]|\\\\.|\`[^\`]*\`|[^\\[\\]\\\\\`])*?/;
inline._href = /<(?:\\\\.|[^\\n<>\\\\])+>|[^\\s\\x00-\\x1f]*/;
inline._title = /"(?:\\\\"?|[^"\\\\])*"|'(?:\\\\'?|[^'\\\\])*'|\\((?:\\\\\\)?|[^)\\\\])*\\)/;

inline.link = edit(inline.link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .replace('title', inline._title)
  .getRegex();

inline.reflink = edit(inline.reflink)
  .replace('label', inline._label)
  .replace('ref', block._label)
  .getRegex();

inline.nolink = edit(inline.nolink)
  .replace('ref', block._label)
  .getRegex();

inline.reflinkSearch = edit(inline.reflinkSearch, 'g')
  .replace('reflink', inline.reflink)
  .replace('nolink', inline.nolink)
  .getRegex();

/**
 * Normal Inline Grammar
 */

inline.normal = { ...inline };

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = {
  ...inline.normal,
  strong: {
    start: /^__|\\*\\*/,
    middle: /^__(?=\\S)([\\s\\S]*?\\S)__(?!_)|^\\*\\*(?=\\S)([\\s\\S]*?\\S)\\*\\*(?!\\*)/,
    endAst: /\\*\\*(?!\\*)/g,
    endUnd: /__(?!_)/g
  },
  em: {
    start: /^_|\\*/,
    middle: /^()\\*(?=\\S)([\\s\\S]*?\\S)\\*(?!\\*)|^_(?=\\S)([\\s\\S]*?\\S)_(?!_)/,
    endAst: /\\*(?!\\*)/g,
    endUnd: /_(?!_)/g
  },
  link: edit(/^!?\\[(label)\\]\\((.*?)\\)/)
    .replace('label', inline._label)
    .getRegex(),
  reflink: edit(/^!?\\[(label)\\]\\s*\\[([^\\]]*)\\]/)
    .replace('label', inline._label)
    .getRegex()
};

/**
 * GFM Inline Grammar
 */

inline.gfm = {
  ...inline.normal,
  escape: edit(inline.escape).replace('])', '~|])').getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\\/\\/|www\\.)(?:[a-zA-Z0-9\\-]+\\.?)+[^\\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\\([^)]*\\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\\s~])([\\s\\S]*?[^\\s~])\\1(?=[^~]|$)/,
  text: /^([\`~]+|[^\`~])(?:(?= {2,}\\n)|(?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)|[\\s\\S]*?(?:(?=[\\\\<!\\[\`*~_]|\\b_|https?:\\/\\/|ftp:\\/\\/|www\\.|$)|[^ ](?= {2,}\\n)|[^a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-](?=[a-zA-Z0-9.!#$%&'*+\\/=?_\`{\\|}~-]+@)))/
};

inline.gfm.url = edit(inline.gfm.url, 'i')
  .replace('email', inline.gfm._extended_email)
  .getRegex();
/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = {
  ...inline.gfm,
  br: edit(inline.br).replace('{2,}', '*').getRegex(),
  text: edit(inline.gfm.text)
    .replace('\\\\b_', '\\\\b_| {2,}\\\\n')
    .replace(/\\{2,\\}/g, '*')
    .getRegex()
};`, "w");
}
