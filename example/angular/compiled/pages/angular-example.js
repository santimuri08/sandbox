import { Component, Input } from '@angular/core';
import * as i0 from '@angular/core';
// import { CounterButton } from '../components/counter-button';
export class AngularExample {
	static {
		this.ɵfac = function AngularExample_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || AngularExample)();
		};
	}
	static {
		this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({
			consts: [
				['href', '/'],
				['href', '/react'],
				['href', '/svelte'],
				['href', '/vue'],
				['href', '/angular'],
				['href', '/htmx'],
				['href', 'https://absolutejs.com', 'target', '_blank'],
				[
					'src',
					'assets/png/absolutejs-temp.png',
					'alt',
					'AbsoluteJS Logo',
					1,
					'logo'
				],
				['href', 'https://angular.dev', 'target', '_blank'],
				[
					'src',
					'assets/svg/angular.svg',
					'alt',
					'Angular Logo',
					1,
					'logo',
					'angular'
				],
				[2, 'color', '#777'],
				[2, 'margin-top', '2rem'],
				[2, 'margin-top', '2rem', 'font-size', '1rem', 'color', '#777']
			],
			decls: 35,
			encapsulation: 2,
			inputs: { initialCount: 'initialCount' },
			selectors: [['app-root']],
			type: AngularExample,
			vars: 0,
			template: function AngularExample_Template(rf, ctx) {
				if (rf & 1) {
					i0.ɵɵdomElementStart(0, 'header')(1, 'p');
					i0.ɵɵtext(2, 'AbsoluteJS');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(3, 'nav')(4, 'a', 0);
					i0.ɵɵtext(5, 'HTML');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(6, 'a', 1);
					i0.ɵɵtext(7, 'React');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(8, 'a', 2);
					i0.ɵɵtext(9, 'Svelte');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(10, 'a', 3);
					i0.ɵɵtext(11, 'Vue');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(12, 'a', 4);
					i0.ɵɵtext(13, 'Angular');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(14, 'a', 5);
					i0.ɵɵtext(15, 'HTMX');
					i0.ɵɵdomElementEnd()()();
					i0.ɵɵdomElementStart(16, 'main')(17, 'nav')(18, 'a', 6);
					i0.ɵɵdomElement(19, 'img', 7);
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(20, 'a', 8);
					i0.ɵɵdomElement(21, 'img', 9);
					i0.ɵɵdomElementEnd()();
					i0.ɵɵdomElementStart(22, 'h1');
					i0.ɵɵtext(23, 'AbsoluteJS + Angular');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(24, 'p');
					i0.ɵɵtext(25, ' Edit ');
					i0.ɵɵdomElementStart(26, 'code');
					i0.ɵɵtext(27, 'example/angular/pages/angular-example.html');
					i0.ɵɵdomElementEnd();
					i0.ɵɵtext(28, ', save, and rebuild to update the page. ');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(29, 'p', 10);
					i0.ɵɵtext(30, '( Hot Module Reloading is coming soon )');
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(31, 'p', 11);
					i0.ɵɵtext(
						32,
						' Explore the other pages to see how AbsoluteJS seamlessly unifies multiple frameworks on a single server. '
					);
					i0.ɵɵdomElementEnd();
					i0.ɵɵdomElementStart(33, 'p', 12);
					i0.ɵɵtext(
						34,
						' Click on the AbsoluteJS and Angular logos to learn more. '
					);
					i0.ɵɵdomElementEnd()();
				}
			}
		});
	}
}
(() => {
	(typeof ngDevMode === 'undefined' || ngDevMode) &&
		i0.ɵsetClassMetadata(
			AngularExample,
			[
				{
					args: [
						{
							selector: 'app-root',
							standalone: true,
							template:
								'<header>\n\t<p>AbsoluteJS</p>\n\t<nav>\n\t\t<a href="/">HTML</a>\n\t\t<a href="/react">React</a>\n\t\t<a href="/svelte">Svelte</a>\n\t\t<a href="/vue">Vue</a>\n\t\t<a href="/angular">Angular</a>\n\t\t<a href="/htmx">HTMX</a>\n\t</nav>\n</header>\n\n<main>\n\t<nav>\n\t\t<a href="https://absolutejs.com" target="_blank">\n\t\t\t<img\n\t\t\t\tclass="logo"\n\t\t\t\tsrc="assets/png/absolutejs-temp.png"\n\t\t\t\talt="AbsoluteJS Logo"\n\t\t\t/>\n\t\t</a>\n\t\t<a href="https://angular.dev" target="_blank">\n\t\t\t<img\n\t\t\t\tclass="logo angular"\n\t\t\t\tsrc="assets/svg/angular.svg"\n\t\t\t\talt="Angular Logo"\n\t\t\t/>\n\t\t</a>\n\t</nav>\n\n\t<h1>AbsoluteJS + Angular</h1>\n\n\t<!-- <app-counter-button></app-counter-button> -->\n\n\t<p>\n\t\tEdit <code>example/angular/pages/angular-example.html</code>, save, and\n\t\trebuild to update the page.\n\t</p>\n\t<p style="color: #777">( Hot Module Reloading is coming soon )</p>\n\t<p style="margin-top: 2rem">\n\t\tExplore the other pages to see how AbsoluteJS seamlessly unifies\n\t\tmultiple frameworks on a single server.\n\t</p>\n\t<p style="margin-top: 2rem; font-size: 1rem; color: #777">\n\t\tClick on the AbsoluteJS and Angular logos to learn more.\n\t</p>\n</main>\n'
						}
					],
					type: Component
				}
			],
			null,
			{
				initialCount: [
					{
						args: [{ required: true }],
						type: Input
					}
				]
			}
		);
})();
(() => {
	(typeof ngDevMode === 'undefined' || ngDevMode) &&
		i0.ɵsetClassDebugInfo(AngularExample, {
			className: 'AngularExample',
			filePath: 'example/angular/pages/angular-example.ts',
			lineNumber: 10
		});
})();

export default AngularExample;
