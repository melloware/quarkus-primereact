import { MenuItem } from 'primereact/menuitem';
import { To } from 'react-router-dom';

export default interface AppMenuItem extends MenuItem {
   to?: To;
   badge?: string;
   badgeStyleClass?: string | undefined;
   items?: AppMenuItem[];
}
