import { animated } from '@react-spring/web';
import { ThemeProps } from '../../../types/springTypes';
import { featureCard } from '../../styles/homeStyles';
import { headingStyle, paragraphStyle } from '../../styles/styles';

export const DatabaseArticle = ({ themeSprings }: ThemeProps) => (
	<animated.article style={featureCard(themeSprings)}>
		<animated.h2 style={headingStyle(themeSprings)}>
			Flexible Database Connections
		</animated.h2>
		<animated.p style={paragraphStyle(themeSprings)}>
			AbsoluteJS supports PostgreSQL, MySQL and SQLite with built in
			database drivers. Use native connections for direct queries or
			choose from our first party adapters for Drizzle or Prisma when you
			want ORM features. Schema or query definitions automatically
			generate models and types to keep your data layer in sync as your
			application grows.
		</animated.p>
	</animated.article>
);
