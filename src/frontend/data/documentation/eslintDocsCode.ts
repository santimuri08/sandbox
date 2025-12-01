type EslintDocsCode = {
	beforeCode: string;
	afterCode: string;
};

export const explicitObjectTypes: EslintDocsCode = {
	beforeCode: `\
export const defaultConfig = {
maxUsers: 10,
name: "app"
};`,
	afterCode: `\
type Config = {
maxUsers: number;
name: string;
};

export const defaultConfig: Config = {
maxUsers: 10,
name: "app"
};`
};

export const localizeReactProps: EslintDocsCode = {
	beforeCode: `\
const x = 5;

<MyComponent value={x} />;`,
	afterCode: `\
const MyComponent = () => {
  const value = 5;
  return <div>{value}</div>;
};`
};

export const maxDepthExtended: EslintDocsCode = {
	beforeCode: `\
if (a) {
    if (b) {
        doThing();
    }
}`,
	afterCode: `\
if (!a) return;
if (!b) return;
doThing();`
};

export const maxJsxNesting: EslintDocsCode = {
	beforeCode: `\
const MyComponent = () => (
	<div>
		<section>
			<article>
				<div>
					<span>
						<strong>Deep text</strong>
					</span>
				</div>
			</article>
		</section>
	</div>
);`,
	afterCode: `\
const DeepText = () => (
	<span><strong>Deep text</strong></span>
);

const MyComponent = () => (
	<div>
		<section>
			<article>
				<div>
					<DeepText />
				</div>
			</article>
		</section>
	</div>
);`
};

export const minVarLength: EslintDocsCode = {
	beforeCode: `const x = fetchData();`,
	afterCode: `const result = fetchData();`
};

export const noButtonNavigation: EslintDocsCode = {
	beforeCode: `\
<button onClick={() => (window.location.href = '/home')}>
    Go Home
</button>`,
	afterCode: `<Button onClick={handleNavigateToHome}>Go Home</Button>`
};

export const noExplicitReturnType: EslintDocsCode = {
	beforeCode: `\
const getUserName = (user: User): string => {
    return user.name;
}`,
	afterCode: `\
const getUserName = (user: User) => {
    return user.name;
}`
};

export const noInlinePropTypes: EslintDocsCode = {
	beforeCode: `\
type Props = {
  style: { marginTop: number };
};

const MyComp = ({ style }: Props) => <div style={style} />;`,
	afterCode: `\
type StyleProps = {
  marginTop: number;
};

type Props = {
  style: StyleProps;
};

const MyComp = ({ style }: Props) => <div style={style} />;`
};

export const noMultiStyleObjects: EslintDocsCode = {
	beforeCode: `\
const styles = {
  redBox: { color: 'red', padding: 4 },
  blueBox: { color: 'blue', margin: 8 },
  greenBox: { color: 'green', border: '1px solid' },
};

<div style={styles.redBox} />
<div style={styles.blueBox} />
<div style={styles.greenBox} />`,
	afterCode: `\
const redBox = { color: 'red', padding: 4 };
const blueBox = { color: 'blue', margin: 8 };
const greenBox = { color: 'green', border: '1px solid' };

<div style={redBox} />
<div style={blueBox} />
<div style={greenBox} />`
};

export const noNestedJsxReturn: EslintDocsCode = {
	beforeCode: `\
const items = ['apple', 'banana', 'cherry'];

const List = () => (
  <div>
    {items.map((item) => (
      <div>
        <h3>{item}</h3>
        <p>Delicious fruit</p>
      </div>
    ))}
  </div>
);`,
	afterCode: `\
const items = ['apple', 'banana', 'cherry'];

const FruitItem = ({ name }: { name: string }) => (
  <div>
    <h3>{name}</h3>
    <p>Delicious fruit</p>
  </div>
);

const List = () => (
  <div>
    {items.map((item) => (
      <FruitItem key={item} name={item} />
    ))}
  </div>
);`
};

export const noOrNoneComponent: EslintDocsCode = {
	beforeCode: `\
const MaybeButton({ enabled }) {
	if (enabled) return <Button />;
	return null;
}`,
	afterCode: `{enabled && <Button />}`
};

export const noTransitionCssProperties: EslintDocsCode = {
	beforeCode: `<div style={{ transition: 'all 0.3s ease' }} />`,
	afterCode: `\
import { animated } from '@react-spring/web';

const Box = () => <animated.div style={{ opacity: 1 }} />;`
};

export const noUnnecessaryDiv: EslintDocsCode = {
	beforeCode: `\
<div>
    <span>Text</span>
</div>`,
	afterCode: `<span>Text</span>`
};

export const noUnnecessaryKey: EslintDocsCode = {
	beforeCode: `<div key="static">Hello</div>`,
	afterCode: `<div>Hello</div>`
};

export const noUselessFunction: EslintDocsCode = {
	beforeCode: `\
function callFoo(...args) {
    return foo(...args);
}`,
	afterCode: `foo();`
};

export const seperateStyleFiles: EslintDocsCode = {
	beforeCode: `\
// Comp.tsx
const styles = {
  big: { fontSize: 20 },
};

export default function Comp() {
  return <div style={styles.big}>x</div>;
}`,
	afterCode: `\
// Comp.styles.ts
export const big = { fontSize: 20 };

// Comp.tsx
import * as styles from './Comp.styles';

export default function Comp() {
  return <div style={styles.big}>x</div>;
};`
};

export const sortExports: EslintDocsCode = {
	beforeCode: `\
export function b() {}
export const a = 1;`,
	afterCode: `\
export const a = 1;
export function b() {}`
};

export const sortKeys: EslintDocsCode = {
	beforeCode: `const obj = { zebra: 1, apple: 2, Beta: 3 };`,
	afterCode: `const obj = { Beta: 3, apple: 2, zebra: 1 };`
};
