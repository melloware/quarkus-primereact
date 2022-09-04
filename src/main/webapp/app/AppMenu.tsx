/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from 'primereact/badge';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import React, { KeyboardEvent, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { AppMenuItem, AppMenuItemClickParams } from './AppMenuItem';

const AppSubmenu = (props: {
	root?: boolean;
	parentMenuItemActive?: boolean;
	onRootMenuitemClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, item: AppMenuItem, index: number) => void;
	onMenuItemClick?: (event?: AppMenuItemClickParams) => void;
	menuMode?: string;
	mobileMenuActive?: boolean;
	items?: AppMenuItem[] | undefined;
	className?: string;
	role?: string;
}) => {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const onMenuItemClick = (event: AppMenuItemClickParams) => {
		//avoid processing disabled items
		if (event.item.disabled) {
			event.originalEvent.preventDefault();
			return true;
		}

		//execute command
		if (event.item.command) {
			event.item.command({ originalEvent: event.originalEvent, item: event.item });
		}

		if (event.index === activeIndex) setActiveIndex(null);
		else setActiveIndex(event.index);

		if (props.onMenuItemClick) {
			props.onMenuItemClick({
				originalEvent: event.originalEvent,
				item: event.item,
				index: event.index
			});
		}
	};

	const onKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
		if (event.code === 'Enter' || event.code === 'Space') {
			event.preventDefault();
			event.currentTarget.click();
		}
	};

	const renderLinkContent = (item: AppMenuItem) => {
		const submenuIcon = item.items && <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>;
		const badge = item.badge && <Badge value={item.badge} />;

		return (
			<React.Fragment>
				<i className={item.icon}></i>
				<span>{item.label}</span>
				{submenuIcon}
				{badge}
				<Ripple />
			</React.Fragment>
		);
	};

	const renderLink = (item: AppMenuItem, i: number) => {
		const content = renderLinkContent(item);

		if (item.to) {
			return (
				<NavLink
					className={({ isActive }) => {
						const linkClasses = ['p-ripple'];
						if (isActive) linkClasses.push('router-link-active router-link-exact-active');
						return linkClasses.join(' '); // returns "registerButton" or "registerButton active
					}}
					to={item.to}
					onClick={(e) => onMenuItemClick({ originalEvent: e, item, index: i })}
					target={item.target}
				>
					{content}
				</NavLink>
			);
		} else {
			return (
				<a
					tabIndex={0}
					aria-label={item.label}
					onKeyDown={onKeyDown}
					role="menuitem"
					href={item.url}
					className="p-ripple"
					onClick={(e) => onMenuItemClick({ originalEvent: e, item, index: i })}
					target={item.target}
				>
					{content}
				</a>
			);
		}
	};

	const items =
		props.items &&
		props.items.map((item, i) => {
			const active = activeIndex === i;
			const styleClass = classNames(item.badgeStyleClass, { 'layout-menuitem-category': props.root, 'active-menuitem': active && !item.to });

			if (props.root) {
				return (
					<li className={styleClass} key={i} role="none">
						{props.root === true && (
							<React.Fragment>
								<div className="layout-menuitem-root-text" aria-label={item.label}>
									{item.label}
								</div>
								<AppSubmenu items={item.items} onMenuItemClick={props.onMenuItemClick} />
							</React.Fragment>
						)}
					</li>
				);
			} else {
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

	return items ? (
		<ul className={props.className} role="menu">
			{items}
		</ul>
	) : null;
};

export const AppMenu = (props: { model: AppMenuItem[] | undefined; onMenuItemClick: ((event?: AppMenuItemClickParams) => void) | undefined }) => {
	return (
		<div className="layout-menu-container">
			<AppSubmenu items={props.model} className="layout-menu" onMenuItemClick={props.onMenuItemClick} root={true} role="menu" />
		</div>
	);
};
