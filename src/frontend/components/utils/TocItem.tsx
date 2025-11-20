import { animated } from '@react-spring/web';
import { ThemeSprings } from '../../../types/springTypes';
import { tocLinkStyle } from '../../styles/docsStyles';
import { TocItem } from './TableOfContents';

type TocListItemProps = {
	item: TocItem;
	themeSprings: ThemeSprings;
};

export const TocListItem = ({ item, themeSprings }: TocListItemProps) => (
	<li>
		<animated.a href={item.href} style={tocLinkStyle(themeSprings)}>
			{item.label}
		</animated.a>
	</li>
);
