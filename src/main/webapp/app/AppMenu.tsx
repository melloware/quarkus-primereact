/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from 'primereact/badge';
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import React, { KeyboardEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import SidebarMenuItem from './SidebarMenuItem';

const AppSubmenu = (props: {
    root?: boolean; parentMenuItemActive?: boolean;
    onRootMenuitemClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: SidebarMenuItem, index: number) => void;
    onMenuItemClick?: (event?: { originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>; item: SidebarMenuItem; }) => void;
    menuMode?: string;
    mobileMenuActive?: boolean;
    items?: SidebarMenuItem[] | undefined;
    className?: string,
    role?: string
}) => {

    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const onMenuItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: SidebarMenuItem, index: number) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        if (index === activeIndex)
            setActiveIndex(null);
        else
            setActiveIndex(index);

        if (props.onMenuItemClick) {
            props.onMenuItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

    const onKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
        if (event.code === 'Enter' || event.code === 'Space') {
            event.preventDefault();
            event.currentTarget.click();
        }
    }

    const renderLinkContent = (item: SidebarMenuItem) => {
        const submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
        const badge = item.badge && <Badge value={item.badge} />

        return (
            <React.Fragment>
                <i className={item.icon}></i>
                <span>{item.label}</span>
                {submenuIcon}
                {badge}
                <Ripple />
            </React.Fragment>
        );
    }

    const renderLink = (item: SidebarMenuItem, i: number) => {
        const content = renderLinkContent(item);

        if (item.to) {
            return (
                <NavLink className={({ isActive }) => {
                    const linkClasses = ["p-ripple"];
                    if (isActive) linkClasses.push("router-link-active router-link-exact-active");
                    return linkClasses.join(" "); // returns "registerButton" or "registerButton active
                }} to={item.to} onClick={(e) => onMenuItemClick(e, item, i)} target={item.target}>
                    {content}
                </NavLink>
            )
        }
        else {
            return (
                <a tabIndex={0} aria-label={item.label} onKeyDown={onKeyDown} role="menuitem" href={item.url} className="p-ripple" onClick={(e) => onMenuItemClick(e, item, i)} target={item.target}>
                    {content}
                </a>
            );
        }
    }

    const items = props.items && props.items.map((item, i) => {
        const active = activeIndex === i;
        const styleClass = classNames(item.badgeStyleClass, { 'layout-menuitem-category': props.root, 'active-menuitem': active && !item.to });

        if (props.root) {
            return (
                <li className={styleClass} key={i} role="none">
                    {props.root === true && <React.Fragment>
                        <div className="layout-menuitem-root-text" aria-label={item.label}>{item.label}</div>
                        <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                    </React.Fragment>}
                </li>
            );
        }
        else {
            return (
                <li className={styleClass} key={i} role="none">
                    {renderLink(item, i)}
                    <CSSTransition classNames="layout-submenu-wrapper" timeout={{ enter: 1000, exit: 450 }} in={active} unmountOnExit>
                        <AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
                    </CSSTransition>
                </li>
            );
        }
    });

    return items ? <ul className={props.className} role="menu">{items}</ul> : null;
}

export const AppMenu = (props: { model: SidebarMenuItem[] | undefined; onMenuItemClick: ((event?: { originalEvent: React.MouseEvent<HTMLAnchorElement, MouseEvent>; item: SidebarMenuItem; }) => void) | undefined; }) => {

    return (
        <div className="layout-menu-container">
            <AppSubmenu items={props.model} className="layout-menu" onMenuItemClick={props.onMenuItemClick} root={true} role="menu" />
        </div>
    );
}
