import { animated, to } from '@react-spring/web';
import { useRef, useEffect } from 'react';
import { SetTheme, ThemeSprings } from '../../../types/springTypes';
import { AnimatedMoon, AnimatedSun } from '../utils/AnimatedComponents';

type ThemeButtonProps = {
	setTheme: SetTheme;
	themeSprings: ThemeSprings;
};

export const ThemeButton = ({ themeSprings, setTheme }: ThemeButtonProps) => {
	const detailsRef = useRef<HTMLDetailsElement>(null);

	useEffect(() => {
		const onClickOutside = (event: MouseEvent) => {
			const det = detailsRef.current;
			if (!det?.open) return;
			const tgt = event.target;
			if (!(tgt instanceof Node)) return;
			if (!det.contains(tgt)) det.open = false;
		};
		document.addEventListener('mousedown', onClickOutside);

		return () => document.removeEventListener('mousedown', onClickOutside);
	}, []);

	const selectTheme = (option: 'system' | 'light' | 'dark') => {
		setTheme(option);
		if (detailsRef.current) detailsRef.current.open = false;
	};

	const selected = themeSprings.theme.to((t) => {
		const sel = t.startsWith('system') ? 'system' : t;

		return sel;
	});

	return (
		<animated.details
			ref={detailsRef}
			style={{
				display: 'inline-block',
				margin: 'auto',
				position: 'relative'
			}}
		>
			<animated.summary
				style={{
					alignItems: 'center',
					backgroundColor: themeSprings.themeTertiary,
					border: 'none',
					borderRadius: '50%',
					color: themeSprings.contrastPrimary,
					cursor: 'pointer',
					display: 'flex',
					height: '2.5rem',
					justifyContent: 'center',
					listStyle: 'none',
					margin: 0,
					padding: 0,
					position: 'relative',
					width: '2.5rem'
				}}
			>
				<AnimatedMoon
					style={{
						height: 24,
						opacity: themeSprings.theme.to((t) =>
							t.endsWith('dark') ? 1 : 0
						),
						position: 'absolute',
						width: 24
					}}
				/>
				<AnimatedSun
					style={{
						height: 24,
						opacity: themeSprings.theme.to((t) =>
							t.endsWith('dark') ? 0 : 1
						),
						position: 'absolute',
						width: 24
					}}
				/>
			</animated.summary>

			<animated.ul
				style={{
					backgroundColor: themeSprings.themeTertiary,
					borderRadius: '0.25rem',
					boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
					listStyle: 'none',
					margin: 0,
					minWidth: '6rem',
					padding: '0.5rem',
					position: 'absolute',
					right: 0,
					top: '3.5rem'
				}}
			>
				{(['system', 'light', 'dark'] as const).map((opt) => {
					const background = to(
						[selected, themeSprings.themePrimary],
						(sel, bkg) => (sel === opt ? bkg : 'transparent')
					);
					const color = to(
						[
							selected,
							themeSprings.contrastPrimary,
							themeSprings.contrastSecondary
						],
						(sel, tertiary, contrast) =>
							sel === opt ? tertiary : contrast
					);

					return (
						<animated.li
							key={opt}
							onClick={() => selectTheme(opt)}
							style={{
								background,
								borderRadius: '0.25rem',
								color,
								cursor: 'pointer',
								padding: '0.25rem 0.5rem'
							}}
						>
							{opt.charAt(0).toUpperCase() + opt.slice(1)}
						</animated.li>
					);
				})}
			</animated.ul>
		</animated.details>
	);
};
