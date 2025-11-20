import 'svelte/internal/disclose-version';

Counter[$.FILENAME] = 'example/svelte/components/Counter.js';

import * as $ from 'svelte/internal/client';
import { counter } from '../composables/counter.js';

var root = $.add_locations(
	$.from_html(`<button class="svelte-1b3fpqy"> </button>`),
	Counter[$.FILENAME],
	[[11, 0]]
);

const $$css = {
	hash: 'svelte-1b3fpqy',
	code: '\n	@media (prefers-color-scheme: light) {\n		button.svelte-1b3fpqy {\n			background-color: #ffffff;\n		}\n	}\n\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ291bnRlci5zdmVsdGUiLCJzb3VyY2VzIjpbIkNvdW50ZXIuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQgbGFuZz1cInRzXCI+XG5cdHR5cGUgQ291bnRlclByb3BzID0ge1xuXHRcdGluaXRpYWxDb3VudDogbnVtYmVyO1xuXHR9O1xuXG5cdGxldCB7IGluaXRpYWxDb3VudCB9OiBDb3VudGVyUHJvcHMgPSAkcHJvcHMoKTtcblx0aW1wb3J0IHsgY291bnRlciB9IGZyb20gJy4uL2NvbXBvc2FibGVzL2NvdW50ZXIuc3ZlbHRlJztcblx0Y29uc3QgeyBnZXRDb3VudCwgaW5jcmVtZW50IH0gPSBjb3VudGVyKGluaXRpYWxDb3VudCk7XG48L3NjcmlwdD5cblxuPGJ1dHRvbiBvbmNsaWNrPXtpbmNyZW1lbnR9PmNvdW50IGlzIHtnZXRDb3VudCgpfTwvYnV0dG9uPlxuXG48c3R5bGU+XG5cdEBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGxpZ2h0KSB7XG5cdFx0YnV0dG9uIHtcblx0XHRcdGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG5cdFx0fVxuXHR9XG48L3N0eWxlPlxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFhQSxDQUFDLHFDQUFxQztBQUN0QyxFQUFFLHFCQUFNLENBQUM7QUFDVCxHQUFHLHlCQUF5QjtBQUM1QjtBQUNBOyJ9 */'
};

export default function Counter($$anchor, $$props) {
	$.check_target(new.target);
	$.push($$props, true, Counter);
	$.append_styles($$anchor, $$css);

	const { getCount, increment } = counter($$props.initialCount);
	var button = root();

	button.__click = function (...$$args) {
		$.apply(() => increment, this, $$args, Counter, [11, 17]);
	};

	var text = $.child(button);

	$.reset(button);
	$.template_effect(
		($0) => $.set_text(text, `count is ${$0 ?? ''}`),
		[getCount]
	);
	$.append($$anchor, button);

	return $.pop({ ...$.legacy_api() });
}

$.delegate(['click']);
