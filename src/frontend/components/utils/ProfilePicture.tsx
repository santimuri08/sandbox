import { animated } from '@react-spring/web';
import { ThemeSprings } from '../../../types/springTypes';

type ProfilePictureProps = {
	userImage: string | null | undefined;
	backupImage: string;
	width?: string;
	height?: string;
	themeSprings: ThemeSprings;
};

export const ProfilePicture = ({
	userImage,
	backupImage,
	width = '2rem',
	height = '2rem',
	themeSprings
}: ProfilePictureProps) => (
	<animated.img
		src={userImage ?? backupImage}
		alt="Profile"
		style={{
			backgroundColor: themeSprings.themeTertiary,
			borderRadius: '50%',
			height: height,
			objectFit: 'cover',
			width: width
		}}
	/>
);
