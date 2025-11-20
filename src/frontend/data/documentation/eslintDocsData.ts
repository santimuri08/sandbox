import * as eslintDocsCode from './eslintDocsCode';

export type EslintDocsSection = {
	title: string;
	description: string;
	beforeCode: string;
	afterCode: string;
	href: string;
};

export const eslintDocsData: EslintDocsSection[] = [
	{
		title: 'absolute/explicit-object-types',
		description:
			'Requires objects to have explicit TypeScript type annotations instead of relying on implicit inference. This is meant for stricter definitions of objects so the type can be reused. Note that `as const` is allowed here because it gives the object a constant shape.',
		beforeCode: eslintDocsCode.explicitObjectTypes.beforeCode,
		afterCode: eslintDocsCode.explicitObjectTypes.afterCode,
		href: '#explicit-object-types'
	},
	{
		title: 'absolute/localize-react-props',
		description:
			"This rule encourages keeping component logic and data as close to where they're used as possible. If a variable is only used as a prop for a single component, it should be defined inside that component rather than being passed down as a prop.",
		beforeCode: eslintDocsCode.localizeReactProps.beforeCode,
		afterCode: eslintDocsCode.localizeReactProps.afterCode,
		href: '#localize-react-props'
	},
	{
		title: 'absolute/max-depth-extended',
		description:
			'This is the exact same rule as max-depth from ESLint except it allows you to break the max-depth if you exit early via a return or throw statement.',
		beforeCode: eslintDocsCode.maxDepthExtended.beforeCode,
		afterCode: eslintDocsCode.maxDepthExtended.afterCode,
		href: '#max-depth-extended'
	},
	{
		title: 'absolute/max-jsxnesting',
		description:
			'Limits JSX nesting depth to improve readability and maintainability. Deeply nested markup should be broken into smaller components.',
		beforeCode: eslintDocsCode.maxJsxNesting.beforeCode,
		afterCode: eslintDocsCode.maxJsxNesting.afterCode,
		href: '#max-jsxnesting'
	},
	{
		title: 'absolute/min-var-length',
		description:
			'Enforces a minimum variable name length, like default: 3. Improves readability and discourages overly short variable names.',
		beforeCode: eslintDocsCode.minVarLength.beforeCode,
		afterCode: eslintDocsCode.minVarLength.afterCode,
		href: '#min-var-length'
	},
	{
		title: 'absolute/no-button-navigation',
		description:
			"This rule prevents using button clicks, or other UI event handlers, to directly manipulate the browser's navigator object. In other words, you shouldn't perform navigation actions like window.location, navigator.pushState, or similar operations inside button event handlers.",
		beforeCode: eslintDocsCode.noButtonNavigation.beforeCode,
		afterCode: eslintDocsCode.noButtonNavigation.afterCode,
		href: '#no-button-navigation'
	},
	{
		title: 'absolute/no-explicit-return-type',
		description:
			"This rule disallows adding explicit return type annotations to functions when TypeScript can already infer the type automatically. TypeScript's type inference system is highly accurate and adapts as your code changes — meaning that explicitly declaring return types in these cases can make your code more rigid and harder to maintain.",
		beforeCode: eslintDocsCode.noExplicitReturnType.beforeCode,
		afterCode: eslintDocsCode.noExplicitReturnType.afterCode,
		href: '#no-explicit-return-type'
	},
	{
		title: 'absolute/no-inline-prop-types',
		description:
			'Enforces the use of named or predefined types for component props, preventing the use of inline type definitions when passing props.',
		beforeCode: eslintDocsCode.noInlinePropTypes.beforeCode,
		afterCode: eslintDocsCode.noInlinePropTypes.afterCode,
		href: '#no-inline-prop-types'
	},
	{
		title: 'absolute/no-multi-style-objects',
		description:
			'Ensures style objects are centralized and reused rather than scattered across the component. Improves maintainability and performance.',
		beforeCode: eslintDocsCode.noMultiStyleObjects.beforeCode,
		afterCode: eslintDocsCode.noMultiStyleObjects.afterCode,
		href: '#no-multi-style-objects'
	},
	{
		title: 'absolute/no-nested-jsx-return',
		description:
			'Prevents nested JSX return statements, which can make code less readable and harder to maintain.',
		beforeCode: eslintDocsCode.noNestedJsxReturn.beforeCode,
		afterCode: eslintDocsCode.noNestedJsxReturn.afterCode,
		href: '#no-nested-jsx-return'
	},
	{
		title: 'absolute/no-or-none-component',
		description:
			'Prevents components that inconsistently return different types, like a component or null. Encourages conditional rendering instead of “Maybe” component patterns.',
		beforeCode: eslintDocsCode.noOrNoneComponent.beforeCode,
		afterCode: eslintDocsCode.noOrNoneComponent.afterCode,
		href: '#no-or-none-component'
	},
	{
		title: 'absolute/no-transition-cssproperties',
		description:
			"This rule prevents using the transition CSS property completely. Using CSS transitions can interfere with React Spring's animation system, causing unexpected or broken animations. All animations and transitions should be handled through React Spring instead of native CSS transitions.",
		beforeCode: eslintDocsCode.noTransitionCssProperties.beforeCode,
		afterCode: eslintDocsCode.noTransitionCssProperties.afterCode,
		href: '#no-transition-cssproperties'
	},
	{
		title: 'absolute/no-unnecessary-div',
		description:
			"This rule removes unnecessary wrapper &lt;div&gt; elements that don't provide meaningful structure or purpose. If a wrapper is only used for styling, that styling should be moved into the child component instead.",
		beforeCode: eslintDocsCode.noUnnecessaryDiv.beforeCode,
		afterCode: eslintDocsCode.noUnnecessaryDiv.afterCode,
		href: '#no-unnecessary-div'
	},
	{
		title: 'absolute/no-unnecessary-key',
		description:
			'Disallows keys where not needed or inappropriate, like static elements. Encourages correct key usage in dynamic lists.',
		beforeCode: eslintDocsCode.noUnnecessaryKey.beforeCode,
		afterCode: eslintDocsCode.noUnnecessaryKey.afterCode,
		href: '#no-unnecessary-key'
	},
	{
		title: 'absolute/no-useless-function',
		description:
			'Prevents trivial wrapper functions that simply call another function without adding logic. Encourages using direct references instead.',
		beforeCode: eslintDocsCode.noUselessFunction.beforeCode,
		afterCode: eslintDocsCode.noUselessFunction.afterCode,
		href: '#no-useless-function'
	},
	{
		title: 'absolute/seperate-style-files',
		description:
			'Requires that style definitions be located in separate files, like .styles.ts or .css. This keeps component logic and styling concerns separated.',
		beforeCode: eslintDocsCode.seperateStyleFiles.beforeCode,
		afterCode: eslintDocsCode.seperateStyleFiles.afterCode,
		href: '#seperate-style-files'
	},
	{
		title: 'absolute/sort-exports',
		description:
			'Enforces alphabetical sorting of exports. Variables are listed before functions for clarity and consistency.',
		beforeCode: eslintDocsCode.sortExports.beforeCode,
		afterCode: eslintDocsCode.sortExports.afterCode,
		href: '#sort-exports'
	},
	{
		title: 'absolute/sort-keys-fixable',
		description:
			'This is just the same as the sort-keys ESLint rule with an addition. While it does enforce consistent key ordering within objects it also provides automatic fixing to sort keys alphabetically, the built in function for --fix rather than manual order changes.',
		beforeCode: eslintDocsCode.sortKeys.beforeCode,
		afterCode: eslintDocsCode.sortKeys.afterCode,
		href: '#sort-keys-fixable'
	}
];
