import 'svelte/internal/disclose-version';

SvelteExample[$.FILENAME] = 'example/svelte/pages/SvelteExample.js';

import * as $ from 'svelte/internal/client';
import Counter from '../components/Counter.js';

var root_1 = $.add_locations(
	$.from_html(
		`<meta charset="utf-8"/> <meta name="description" content="AbsoluteJS Svelte Example"/> <meta name="viewport" content="width=device-width, initial-scale=1"/> <link rel="icon" href="/assets/ico/favicon.ico"/> <link rel="preconnect" href="https://fonts.googleapis.com"/> <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/> <link rel="stylesheet"/> <link rel="stylesheet" type="text/css"/>`,
		1
	),
	SvelteExample[$.FILENAME],
	[
		[13, 1],
		[15, 1],
		[16, 1],
		[17, 1],
		[18, 1],
		[19, 1],
		[24, 1],
		[28, 1]
	]
);

var root = $.add_locations(
	$.from_html(
		`<header class="svelte-1tvw78m"><a href="/" class="svelte-1tvw78m">AbsoluteJS</a> <details class="svelte-1tvw78m"><summary class="svelte-1tvw78m">Pages</summary> <nav class="svelte-1tvw78m"><a href="/html" class="svelte-1tvw78m">HTML</a> <a href="/react" class="svelte-1tvw78m">React</a> <a href="/htmx" class="svelte-1tvw78m">HTMX</a> <a href="/svelte" class="svelte-1tvw78m">Svelte</a> <a href="/vue" class="svelte-1tvw78m">Vue</a> <a href="/angular" class="svelte-1tvw78m">Angular</a></nav></details></header> <main><nav class="svelte-1tvw78m"><a href="https://absolutejs.com" target="_blank"><img class="logo svelte-1tvw78m" src="/assets/png/absolutejs-temp.png" alt="AbsoluteJS Logo"/></a> <a href="https://svelte.dev" target="_blank"><img class="logo svelte svelte-1tvw78m" src="/assets/svg/svelte-logo.svg" alt="Svelte Logo"/></a></nav> <h1 class="svelte-1tvw78m">AbsoluteJS + Svelte</h1> <!> <p>Edit <code>example/svelte/pages/SvelteExample.svelte</code> then save and
		refresh to update the page.</p> <p style="color: #777">( Hot Module Reloading is coming soon )</p> <p style="margin-top: 2rem;">Explore the other pages to see how AbsoluteJS seamlessly unifies
		multiple frameworks on a single server.</p> <p style="color: #777; font-size: 1rem; margin-top: 2rem;">Click on the AbsoluteJS and Svelte logos to learn more.</p></main>`,
		1
	),
	SvelteExample[$.FILENAME],
	[
		[
			31,
			0,

			[
				[32, 1],

				[
					33,
					1,

					[
						[38, 2],

						[
							39,
							2,
							[
								[40, 3],
								[41, 3],
								[42, 3],
								[43, 3],
								[44, 3],
								[45, 3]
							]
						]
					]
				]
			]
		],

		[
			50,
			0,

			[
				[
					51,
					1,
					[
						[52, 2, [[53, 3]]],
						[59, 2, [[60, 3]]]
					]
				],
				[67, 1],
				[69, 1, [[70, 7]]],
				[73, 1],
				[74, 1],
				[78, 1]
			]
		]
	]
);

const $$css = {
	hash: 'svelte-1tvw78m',
	code: "\n	header.svelte-1tvw78m {\n		align-items: center;\n		background-color: #1a1a1a;\n		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n		display: flex;\n		justify-content: space-between;\n		padding: 2rem;\n		text-align: center;\n	}\n\n	header.svelte-1tvw78m a:where(.svelte-1tvw78m) {\n		position: relative;\n		color: #5fbeeb;\n		text-decoration: none;\n	}\n\n	header.svelte-1tvw78m a:where(.svelte-1tvw78m)::after {\n		content: '';\n		position: absolute;\n		left: 0;\n		bottom: 0;\n		width: 100%;\n		height: 2px;\n		background: linear-gradient(\n			90deg,\n			#5fbeeb 0%,\n			#35d5a2 50%,\n			#ff4b91 100%\n		);\n		transform: scaleX(0);\n		transform-origin: left;\n		transition: transform 0.25s ease-in-out;\n	}\n\n	header.svelte-1tvw78m a:where(.svelte-1tvw78m):hover::after {\n		transform: scaleX(1);\n	}\n\n	h1.svelte-1tvw78m {\n		font-size: 2.5rem;\n		margin-top: 2rem;\n	}\n\n	.logo.svelte-1tvw78m {\n		height: 8rem;\n		width: 8rem;\n		will-change: filter;\n		transition: filter 300ms;\n	}\n\n	.logo.svelte-1tvw78m:hover {\n		filter: drop-shadow(0 0 2rem #5fbeeb);\n	}\n\n	.logo.svelte.svelte-1tvw78m:hover {\n		filter: drop-shadow(0 0 2rem #ff3e00);\n	}\n\n	nav.svelte-1tvw78m {\n		display: flex;\n		gap: 4rem;\n		justify-content: center;\n	}\n\n	header.svelte-1tvw78m details:where(.svelte-1tvw78m) {\n		position: relative;\n	}\n\n	header.svelte-1tvw78m details:where(.svelte-1tvw78m) summary:where(.svelte-1tvw78m) {\n		list-style: none;\n		appearance: none;\n		-webkit-appearance: none;\n		cursor: pointer;\n		user-select: none;\n		color: #5fbeeb;\n		font-size: 1.5rem;\n		font-weight: 500;\n		padding: 0.5rem 1rem;\n	}\n\n	header.svelte-1tvw78m summary:where(.svelte-1tvw78m)::after {\n		content: '▼';\n		display: inline-block;\n		margin-left: 0.5rem;\n		font-size: 0.75rem;\n		transition: transform 0.3s ease;\n	}\n\n	header.svelte-1tvw78m details[open]:where(.svelte-1tvw78m) summary:where(.svelte-1tvw78m)::after {\n		transform: rotate(180deg);\n	}\n\n	header.svelte-1tvw78m details:where(.svelte-1tvw78m) nav:where(.svelte-1tvw78m) {\n		position: absolute;\n		top: 100%;\n		right: -0.5rem;\n		display: flex;\n		flex-direction: column;\n		gap: 0.75rem;\n		background: rgba(185, 185, 185, 0.1);\n		backdrop-filter: blur(4px);\n		border: 1px solid #5fbeeb;\n		border-radius: 1rem;\n		padding: 1rem 1.5rem;\n		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n		opacity: 0;\n		transform: translateY(-8px);\n		pointer-events: none;\n		transition:\n			opacity 0.3s ease,\n			transform 0.3s ease;\n		z-index: 1000;\n	}\n\n	header.svelte-1tvw78m details[open]:where(.svelte-1tvw78m) nav:where(.svelte-1tvw78m) {\n		opacity: 1;\n		transform: translateY(0);\n		pointer-events: auto;\n	}\n\n	header.svelte-1tvw78m details:where(.svelte-1tvw78m) nav:where(.svelte-1tvw78m) a:where(.svelte-1tvw78m) {\n		font-size: 1.1rem;\n		padding: 0.25rem 0;\n		white-space: nowrap;\n	}\n\n	@media (prefers-color-scheme: light) {\n		header.svelte-1tvw78m {\n			background-color: #ffffff;\n		}\n	}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ZlbHRlRXhhbXBsZS5zdmVsdGUiLCJzb3VyY2VzIjpbIlN2ZWx0ZUV4YW1wbGUuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5cdHR5cGUgU3ZlbHRlRXhhbXBsZVByb3BzID0ge1xuXHRcdGluaXRpYWxDb3VudDogbnVtYmVyO1xuXHRcdGNzc1BhdGg6IHN0cmluZztcblx0fTtcblx0aW1wb3J0IENvdW50ZXIgZnJvbSAnLi4vY29tcG9uZW50cy9Db3VudGVyLnN2ZWx0ZSc7XG5cblx0bGV0IHsgaW5pdGlhbENvdW50LCBjc3NQYXRoIH06IFN2ZWx0ZUV4YW1wbGVQcm9wcyA9ICRwcm9wcygpO1xuXHRsZXQgaXNPcGVuID0gJHN0YXRlKGZhbHNlKTtcbjwvc2NyaXB0PlxuXG48c3ZlbHRlOmhlYWQ+XG5cdDxtZXRhIGNoYXJzZXQ9XCJ1dGYtOFwiIC8+XG5cdDx0aXRsZT5BYnNvbHV0ZUpTICsgU3ZlbHRlPC90aXRsZT5cblx0PG1ldGEgbmFtZT1cImRlc2NyaXB0aW9uXCIgY29udGVudD1cIkFic29sdXRlSlMgU3ZlbHRlIEV4YW1wbGVcIiAvPlxuXHQ8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTFcIiAvPlxuXHQ8bGluayByZWw9XCJpY29uXCIgaHJlZj1cIi9hc3NldHMvaWNvL2Zhdmljb24uaWNvXCIgLz5cblx0PGxpbmsgcmVsPVwicHJlY29ubmVjdFwiIGhyZWY9XCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tXCIgLz5cblx0PGxpbmtcblx0XHRyZWw9XCJwcmVjb25uZWN0XCJcblx0XHRocmVmPVwiaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbVwiXG5cdFx0Y3Jvc3NPcmlnaW49XCJhbm9ueW1vdXNcIlxuXHQvPlxuXHQ8bGlua1xuXHRcdGhyZWY9e2BodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVBvcHBpbnM6d2dodEAxMDAuLjkwMCZkaXNwbGF5PXN3YXBgfVxuXHRcdHJlbD1cInN0eWxlc2hlZXRcIlxuXHQvPlxuXHQ8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj17Y3NzUGF0aH0gdHlwZT1cInRleHQvY3NzXCIgLz5cbjwvc3ZlbHRlOmhlYWQ+XG5cbjxoZWFkZXI+XG5cdDxhIGhyZWY9XCIvXCI+QWJzb2x1dGVKUzwvYT5cblx0PGRldGFpbHNcblx0XHRvcGVuPXtpc09wZW59XG5cdFx0b25wb2ludGVyZW50ZXI9eygpID0+IChpc09wZW4gPSB0cnVlKX1cblx0XHRvbnBvaW50ZXJsZWF2ZT17KCkgPT4gKGlzT3BlbiA9IGZhbHNlKX1cblx0PlxuXHRcdDxzdW1tYXJ5PlBhZ2VzPC9zdW1tYXJ5PlxuXHRcdDxuYXY+XG5cdFx0XHQ8YSBocmVmPVwiL2h0bWxcIj5IVE1MPC9hPlxuXHRcdFx0PGEgaHJlZj1cIi9yZWFjdFwiPlJlYWN0PC9hPlxuXHRcdFx0PGEgaHJlZj1cIi9odG14XCI+SFRNWDwvYT5cblx0XHRcdDxhIGhyZWY9XCIvc3ZlbHRlXCI+U3ZlbHRlPC9hPlxuXHRcdFx0PGEgaHJlZj1cIi92dWVcIj5WdWU8L2E+XG5cdFx0XHQ8YSBocmVmPVwiL2FuZ3VsYXJcIj5Bbmd1bGFyPC9hPlxuXHRcdDwvbmF2PlxuXHQ8L2RldGFpbHM+XG48L2hlYWRlcj5cblxuPG1haW4+XG5cdDxuYXY+XG5cdFx0PGEgaHJlZj1cImh0dHBzOi8vYWJzb2x1dGVqcy5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIj5cblx0XHRcdDxpbWdcblx0XHRcdFx0Y2xhc3M9XCJsb2dvXCJcblx0XHRcdFx0c3JjPVwiL2Fzc2V0cy9wbmcvYWJzb2x1dGVqcy10ZW1wLnBuZ1wiXG5cdFx0XHRcdGFsdD1cIkFic29sdXRlSlMgTG9nb1wiXG5cdFx0XHQvPlxuXHRcdDwvYT5cblx0XHQ8YSBocmVmPVwiaHR0cHM6Ly9zdmVsdGUuZGV2XCIgdGFyZ2V0PVwiX2JsYW5rXCI+XG5cdFx0XHQ8aW1nXG5cdFx0XHRcdGNsYXNzPVwibG9nbyBzdmVsdGVcIlxuXHRcdFx0XHRzcmM9XCIvYXNzZXRzL3N2Zy9zdmVsdGUtbG9nby5zdmdcIlxuXHRcdFx0XHRhbHQ9XCJTdmVsdGUgTG9nb1wiXG5cdFx0XHQvPlxuXHRcdDwvYT5cblx0PC9uYXY+XG5cdDxoMT5BYnNvbHV0ZUpTICsgU3ZlbHRlPC9oMT5cblx0PENvdW50ZXIge2luaXRpYWxDb3VudH0gLz5cblx0PHA+XG5cdFx0RWRpdCA8Y29kZT5leGFtcGxlL3N2ZWx0ZS9wYWdlcy9TdmVsdGVFeGFtcGxlLnN2ZWx0ZTwvY29kZT4gdGhlbiBzYXZlIGFuZFxuXHRcdHJlZnJlc2ggdG8gdXBkYXRlIHRoZSBwYWdlLlxuXHQ8L3A+XG5cdDxwIHN0eWxlPVwiY29sb3I6ICM3NzdcIj4oIEhvdCBNb2R1bGUgUmVsb2FkaW5nIGlzIGNvbWluZyBzb29uICk8L3A+XG5cdDxwIHN0eWxlPVwibWFyZ2luLXRvcDogMnJlbTtcIj5cblx0XHRFeHBsb3JlIHRoZSBvdGhlciBwYWdlcyB0byBzZWUgaG93IEFic29sdXRlSlMgc2VhbWxlc3NseSB1bmlmaWVzXG5cdFx0bXVsdGlwbGUgZnJhbWV3b3JrcyBvbiBhIHNpbmdsZSBzZXJ2ZXIuXG5cdDwvcD5cblx0PHAgc3R5bGU9XCJjb2xvcjogIzc3NzsgZm9udC1zaXplOiAxcmVtOyBtYXJnaW4tdG9wOiAycmVtO1wiPlxuXHRcdENsaWNrIG9uIHRoZSBBYnNvbHV0ZUpTIGFuZCBTdmVsdGUgbG9nb3MgdG8gbGVhcm4gbW9yZS5cblx0PC9wPlxuPC9tYWluPlxuXG48c3R5bGU+XG5cdGhlYWRlciB7XG5cdFx0YWxpZ24taXRlbXM6IGNlbnRlcjtcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjMWExYTFhO1xuXHRcdGJveC1zaGFkb3c6IDAgMnB4IDRweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0XHRqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG5cdFx0cGFkZGluZzogMnJlbTtcblx0XHR0ZXh0LWFsaWduOiBjZW50ZXI7XG5cdH1cblxuXHRoZWFkZXIgYSB7XG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdGNvbG9yOiAjNWZiZWViO1xuXHRcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcblx0fVxuXG5cdGhlYWRlciBhOjphZnRlciB7XG5cdFx0Y29udGVudDogJyc7XG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdGxlZnQ6IDA7XG5cdFx0Ym90dG9tOiAwO1xuXHRcdHdpZHRoOiAxMDAlO1xuXHRcdGhlaWdodDogMnB4O1xuXHRcdGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudChcblx0XHRcdDkwZGVnLFxuXHRcdFx0IzVmYmVlYiAwJSxcblx0XHRcdCMzNWQ1YTIgNTAlLFxuXHRcdFx0I2ZmNGI5MSAxMDAlXG5cdFx0KTtcblx0XHR0cmFuc2Zvcm06IHNjYWxlWCgwKTtcblx0XHR0cmFuc2Zvcm0tb3JpZ2luOiBsZWZ0O1xuXHRcdHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjI1cyBlYXNlLWluLW91dDtcblx0fVxuXG5cdGhlYWRlciBhOmhvdmVyOjphZnRlciB7XG5cdFx0dHJhbnNmb3JtOiBzY2FsZVgoMSk7XG5cdH1cblxuXHRoMSB7XG5cdFx0Zm9udC1zaXplOiAyLjVyZW07XG5cdFx0bWFyZ2luLXRvcDogMnJlbTtcblx0fVxuXG5cdC5sb2dvIHtcblx0XHRoZWlnaHQ6IDhyZW07XG5cdFx0d2lkdGg6IDhyZW07XG5cdFx0d2lsbC1jaGFuZ2U6IGZpbHRlcjtcblx0XHR0cmFuc2l0aW9uOiBmaWx0ZXIgMzAwbXM7XG5cdH1cblxuXHQubG9nbzpob3ZlciB7XG5cdFx0ZmlsdGVyOiBkcm9wLXNoYWRvdygwIDAgMnJlbSAjNWZiZWViKTtcblx0fVxuXG5cdC5sb2dvLnN2ZWx0ZTpob3ZlciB7XG5cdFx0ZmlsdGVyOiBkcm9wLXNoYWRvdygwIDAgMnJlbSAjZmYzZTAwKTtcblx0fVxuXG5cdG5hdiB7XG5cdFx0ZGlzcGxheTogZmxleDtcblx0XHRnYXA6IDRyZW07XG5cdFx0anVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cdH1cblxuXHRoZWFkZXIgZGV0YWlscyB7XG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHR9XG5cblx0aGVhZGVyIGRldGFpbHMgc3VtbWFyeSB7XG5cdFx0bGlzdC1zdHlsZTogbm9uZTtcblx0XHRhcHBlYXJhbmNlOiBub25lO1xuXHRcdC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcblx0XHRjdXJzb3I6IHBvaW50ZXI7XG5cdFx0dXNlci1zZWxlY3Q6IG5vbmU7XG5cdFx0Y29sb3I6ICM1ZmJlZWI7XG5cdFx0Zm9udC1zaXplOiAxLjVyZW07XG5cdFx0Zm9udC13ZWlnaHQ6IDUwMDtcblx0XHRwYWRkaW5nOiAwLjVyZW0gMXJlbTtcblx0fVxuXG5cdGhlYWRlciBzdW1tYXJ5OjphZnRlciB7XG5cdFx0Y29udGVudDogJ+KWvCc7XG5cdFx0ZGlzcGxheTogaW5saW5lLWJsb2NrO1xuXHRcdG1hcmdpbi1sZWZ0OiAwLjVyZW07XG5cdFx0Zm9udC1zaXplOiAwLjc1cmVtO1xuXHRcdHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7XG5cdH1cblxuXHRoZWFkZXIgZGV0YWlsc1tvcGVuXSBzdW1tYXJ5OjphZnRlciB7XG5cdFx0dHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTtcblx0fVxuXG5cdGhlYWRlciBkZXRhaWxzIG5hdiB7XG5cdFx0cG9zaXRpb246IGFic29sdXRlO1xuXHRcdHRvcDogMTAwJTtcblx0XHRyaWdodDogLTAuNXJlbTtcblx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cdFx0Z2FwOiAwLjc1cmVtO1xuXHRcdGJhY2tncm91bmQ6IHJnYmEoMTg1LCAxODUsIDE4NSwgMC4xKTtcblx0XHRiYWNrZHJvcC1maWx0ZXI6IGJsdXIoNHB4KTtcblx0XHRib3JkZXI6IDFweCBzb2xpZCAjNWZiZWViO1xuXHRcdGJvcmRlci1yYWRpdXM6IDFyZW07XG5cdFx0cGFkZGluZzogMXJlbSAxLjVyZW07XG5cdFx0Ym94LXNoYWRvdzogMCA0cHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMjUpO1xuXHRcdG9wYWNpdHk6IDA7XG5cdFx0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKC04cHgpO1xuXHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXHRcdHRyYW5zaXRpb246XG5cdFx0XHRvcGFjaXR5IDAuM3MgZWFzZSxcblx0XHRcdHRyYW5zZm9ybSAwLjNzIGVhc2U7XG5cdFx0ei1pbmRleDogMTAwMDtcblx0fVxuXG5cdGhlYWRlciBkZXRhaWxzW29wZW5dIG5hdiB7XG5cdFx0b3BhY2l0eTogMTtcblx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG5cdFx0cG9pbnRlci1ldmVudHM6IGF1dG87XG5cdH1cblxuXHRoZWFkZXIgZGV0YWlscyBuYXYgYSB7XG5cdFx0Zm9udC1zaXplOiAxLjFyZW07XG5cdFx0cGFkZGluZzogMC4yNXJlbSAwO1xuXHRcdHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cdH1cblxuXHRAbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBsaWdodCkge1xuXHRcdGhlYWRlciB7XG5cdFx0XHRiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xuXHRcdH1cblx0fVxuPC9zdHlsZT5cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBbUZBLENBQUMscUJBQU0sQ0FBQztBQUNSLEVBQUUsbUJBQW1CO0FBQ3JCLEVBQUUseUJBQXlCO0FBQzNCLEVBQUUsd0NBQXdDO0FBQzFDLEVBQUUsYUFBYTtBQUNmLEVBQUUsOEJBQThCO0FBQ2hDLEVBQUUsYUFBYTtBQUNmLEVBQUUsa0JBQWtCO0FBQ3BCOztBQUVBLENBQUMscUJBQU0sQ0FBQyx3QkFBQyxDQUFDO0FBQ1YsRUFBRSxrQkFBa0I7QUFDcEIsRUFBRSxjQUFjO0FBQ2hCLEVBQUUscUJBQXFCO0FBQ3ZCOztBQUVBLENBQUMscUJBQU0sQ0FBQyx3QkFBQyxPQUFPLENBQUM7QUFDakIsRUFBRSxXQUFXO0FBQ2IsRUFBRSxrQkFBa0I7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 */"
};

export default function SvelteExample($$anchor, $$props) {
	$.check_target(new.target);
	$.push($$props, true, SvelteExample);
	$.append_styles($$anchor, $$css);

	let isOpen = $.tag($.state(false), 'isOpen');
	var fragment_1 = root();

	$.head(($$anchor) => {
		var fragment = root_1();

		$.document.title = 'AbsoluteJS + Svelte';

		var link = $.sibling($.first_child(fragment), 12);

		$.set_attribute(
			link,
			'href',
			`https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap`
		);

		var link_1 = $.sibling(link, 2);

		$.template_effect(() =>
			$.set_attribute(link_1, 'href', $$props.cssPath)
		);
		$.append($$anchor, fragment);
	});

	var header = $.first_child(fragment_1);
	var details = $.sibling($.child(header), 2);

	$.reset(header);

	var main = $.sibling(header, 2);
	var node = $.sibling($.child(main), 4);

	$.add_svelte_meta(
		() =>
			Counter(node, {
				get initialCount() {
					return $$props.initialCount;
				}
			}),
		'component',
		SvelteExample,
		68,
		1,
		{ componentTag: 'Counter' }
	);

	$.next(8);
	$.reset(main);
	$.template_effect(() => (details.open = $.get(isOpen)));
	$.event('pointerenter', details, () => $.set(isOpen, true));
	$.event('pointerleave', details, () => $.set(isOpen, false));
	$.append($$anchor, fragment_1);

	return $.pop({ ...$.legacy_api() });
}
