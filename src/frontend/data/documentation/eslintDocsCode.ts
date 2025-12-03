type EslintDocsCode = {
	beforeCode: string;
	afterCode: string;
};

export const explicitObjectTypes: EslintDocsCode = {
	afterCode: `\
type Config = {
maxUsers: number;
name: string;
};

export const defaultConfig: Config = {
maxUsers: 10,
name: "app"
};`, beforeCode: `\
export const defaultConfig = {
maxUsers: 10,
name: "app"
};`
};

export const localizeReactProps: EslintDocsCode = {
	afterCode: `\
const MyComponent = () => {
  const value = 5;
  return <div>{value}</div>;
};`, beforeCode: `\
const x = 5;

<MyComponent value={x} />;`
};

export const maxDepthExtended: EslintDocsCode = {
	afterCode: `\
if (!a) return;
if (!b) return;
doThing();`, beforeCode: `\
if (a) {
    if (b) {
        doThing();
    }
}`
};

export const maxJsxNesting: EslintDocsCode = {
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
);`, beforeCode: `\
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
);`
};

export const minVarLength: EslintDocsCode = {
	afterCode: `const result = fetchData();`, beforeCode: `const x = fetchData();`
};

export const noButtonNavigation: EslintDocsCode = {
	afterCode: `<Button onClick={handleNavigateToHome}>Go Home</Button>`, beforeCode: `\
<button onClick={() => (window.location.href = '/home')}>
    Go Home
</button>`
};

export const noExplicitReturnType: EslintDocsCode = {
	afterCode: `\
const getUserName = (user: User) => {
    return user.name;
}`, beforeCode: `\
const getUserName = (user: User): string => {
    return user.name;
}`
};

export const noInlinePropTypes: EslintDocsCode = {
	afterCode: `\
type StyleProps = {
  marginTop: number;
};

type Props = {
  style: StyleProps;
};

const MyComp = ({ style }: Props) => <div style={style} />;`, beforeCode: `\
type Props = {
  style: { marginTop: number };
};

const MyComp = ({ style }: Props) => <div style={style} />;`
};

export const noMultiStyleObjects: EslintDocsCode = {
	afterCode: `\
const redBox = { color: 'red', padding: 4 };
const blueBox = { color: 'blue', margin: 8 };
const greenBox = { color: 'green', border: '1px solid' };

<div style={redBox} />
<div style={blueBox} />
<div style={greenBox} />`, beforeCode: `\
const styles = {
  redBox: { color: 'red', padding: 4 },
  blueBox: { color: 'blue', margin: 8 },
  greenBox: { color: 'green', border: '1px solid' },
};

<div style={styles.redBox} />
<div style={styles.blueBox} />
<div style={styles.greenBox} />`
};

export const noNestedJsxReturn: EslintDocsCode = {
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
);`, beforeCode: `\
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
);`
};

export const noOrNoneComponent: EslintDocsCode = {
	afterCode: `{enabled && <Button />}`, beforeCode: `\
const MaybeButton({ enabled }) {
	if (enabled) return <Button />;
	return null;
}`
};

export const noTransitionCssProperties: EslintDocsCode = {
	afterCode: `\
import { animated } from '@react-spring/web';

const Box = () => <animated.div style={{ opacity: 1 }} />;`, beforeCode: `<div style={{ transition: 'all 0.3s ease' }} />`
};

export const noUnnecessaryDiv: EslintDocsCode = {
	afterCode: `<span>Text</span>`, beforeCode: `\
<div>
    <span>Text</span>
</div>`
};

export const noUnnecessaryKey: EslintDocsCode = {
	afterCode: `<div>Hello</div>`, beforeCode: `<div key="static">Hello</div>`
};

export const noUselessFunction: EslintDocsCode = {
	afterCode: `foo();`, beforeCode: `\
function callFoo(...args) {
    return foo(...args);
}`
};

export const seperateStyleFiles: EslintDocsCode = {
	afterCode: `\
// Comp.styles.ts
export const big = { fontSize: 20 };

// Comp.tsx
import * as styles from './Comp.styles';

export default function Comp() {
  return <div style={styles.big}>x</div>;
};`, beforeCode: `\
// Comp.tsx
const styles = {
  big: { fontSize: 20 },
};

export default function Comp() {
  return <div style={styles.big}>x</div>;
}`
};

export const sortExports: EslintDocsCode = {
	afterCode: `\
export const a = 1;
export function b() {}`, beforeCode: `\
export function b() {}
export const a = 1;`
};

export const sortKeys: EslintDocsCode = {
	afterCode: `const obj = { Beta: 3, apple: 2, zebra: 1 };`, beforeCode: `const obj = { zebra: 1, apple: 2, Beta: 3 };`
};
