import { animated } from '@react-spring/web';
import { Navbar } from '../components/navbar/Navbar';
import { Head } from '../components/page/Head';
import { PlaygroundHero } from '../components/playground/PlaygroundHero';
import { PlaygroundForm } from '../components/playground/PlaygroundForm';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { ThemeMode, useTheme } from '../hooks/useTheme';
import { htmlDefault, bodyDefault, mainDefault } from '../styles/styles';

type PlaygroundProps = {
	theme: ThemeMode | undefined;
};

export const Playground = ({ theme }: PlaygroundProps) => {
	const { user, handleSignOut } = useAuthStatus();
	const [themeSprings, setTheme] = useTheme(theme);

	return (
		<html lang="en" style={htmlDefault}>
			<Head title="AbsoluteJS Playground" />
			<animated.body style={bodyDefault(themeSprings)}>
				<Navbar
					themeSprings={themeSprings}
					user={user}
					handleSignOut={handleSignOut}
					setTheme={setTheme}
				/>
				<main style={mainDefault()}>
					<PlaygroundHero themeSprings={themeSprings} />
					<PlaygroundForm themeSprings={themeSprings} />
				</main>
			</animated.body>
		</html>
	);
};
