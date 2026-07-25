import type { MenuItem } from '@mantle-ui/react/menuitem';
import { To } from 'react-router-dom';

export interface AppMenuItemClickParams {
	originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>;
	item: AppMenuItem;
	index: number;
}

export interface AppMenuItem extends MenuItem {
	to?: To;
	badge?: string;
	badgeStyleClass?: string | undefined;
	items?: AppMenuItem[];
}
