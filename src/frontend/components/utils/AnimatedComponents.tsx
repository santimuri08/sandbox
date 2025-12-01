import { animated } from '@react-spring/web';
import { AiOutlineMoon } from 'react-icons/ai';
import { FaChevronDown } from 'react-icons/fa';
import { IoSunny } from 'react-icons/io5';
import { ProfilePicture } from './ProfilePicture';

export const AnimatedFaChevronDown = animated(FaChevronDown);
export const AnimatedProfilePicture = animated(ProfilePicture);
export const AnimatedMoon = animated(AiOutlineMoon);
export const AnimatedSun = animated(IoSunny);
