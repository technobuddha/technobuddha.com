import { type CamelCasedPropertiesDeep } from 'type-fest';

import { type AuthenticationAPI } from '#api/authentication';
import { type MusicAPI } from '#api/music';

export type Account = CamelCasedPropertiesDeep<AuthenticationAPI.Account>;
export type PasswordStrength = CamelCasedPropertiesDeep<AuthenticationAPI.PasswordStrength>;

export type Track = CamelCasedPropertiesDeep<MusicAPI.Track>;
export type Album = CamelCasedPropertiesDeep<MusicAPI.Album>;
export type Artist = CamelCasedPropertiesDeep<MusicAPI.Artist>;
export type Genre = CamelCasedPropertiesDeep<MusicAPI.Genre>;
