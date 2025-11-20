import { animated } from '@react-spring/web';
import { ProviderOption, providerOptions } from 'citra';
import { Dispatch, SetStateAction } from 'react';
import { ThemeSprings } from '../../../types/springTypes';
import { providerData } from '../../data/providerData';

type ProviderDropdownProps = {
	setCurrentProvider: Dispatch<
		SetStateAction<Lowercase<ProviderOption> | undefined>
	>;
	themeSprings: ThemeSprings;
};

export const ProviderDropdown = ({
	setCurrentProvider,
	themeSprings
}: ProviderDropdownProps) => (
	<animated.select
		defaultValue={-1}
		onChange={(event) => {
			const index = parseInt(event.target.value);

			if (index < 0) {
				setCurrentProvider(undefined);
			} else {
				setCurrentProvider(providerOptions[index]);
			}
		}}
		style={{
			backgroundColor: themeSprings.themeTertiary,
			border: `1px solid ${themeSprings.contrastPrimary}`,
			borderRadius: '4px',
			color: themeSprings.contrastPrimary,
			fontSize: '14px',
			marginBottom: '10px',
			padding: '14px',
			textAlign: 'center',
			width: '100%'
		}}
	>
		<option
			value={-1}
			style={{
				fontWeight: 'bold'
			}}
		>
			Select provider
		</option>
		{providerOptions.map((provider, index) => (
			<option
				key={provider}
				value={index}
				style={{
					textAlign: 'left'
				}}
			>
				{providerData[provider].name}
			</option>
		))}
	</animated.select>
);
