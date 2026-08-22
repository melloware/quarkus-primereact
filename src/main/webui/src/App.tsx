import { all as locales } from 'primelocale';
import { useMountEffect } from '@mantle-ui/react/hooks';
import { classNames, DomHandler } from '@mantle-ui/react/utils';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { AppMenu } from './AppMenu';
import { AppMenuItem, AppMenuItemClickParams } from './AppMenuItem';
import CrudPage from './CrudPage';

import '@mantle-ui/flex/mantleflex.css';
import '@mantle-ui/icons/mantleicons.css';
import { addLocale, locale, LocaleOptions } from '@mantle-ui/react/api';
import '@mantle-ui/react/resources/themes/lara-dark-blue/theme.css';
import './App.css';
import './assets/layout/layout.scss';

const App = () => {
	const [layoutMode] = useState('static');
	const [layoutColorMode] = useState('dark');
	const [inputStyle] = useState('outlined');
	const [ripple] = useState(true);
	const [staticMenuInactive, setStaticMenuInactive] = useState(true);
	const [overlayMenuActive, setOverlayMenuActive] = useState(false);
	const [mobileMenuActive, setMobileMenuActive] = useState(false);
	const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
	const location = useLocation();

	let menuClick = false;
	let mobileTopbarMenuClick = false;

	useEffect(() => {
		if (mobileMenuActive) {
			DomHandler.addClass(document.body, 'body-overflow-hidden');
		} else {
			DomHandler.removeClass(document.body, 'body-overflow-hidden');
		}
	}, [mobileMenuActive]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	useMountEffect(() => {
		document.documentElement.style.fontSize = '14px';

		// Determine the browser's locale
		const browserLocale = navigator.languages?.[0] || navigator.language;

		// Find the appropriate locale file based on the browser's locale
		const selectedLocale = getClosestLocale(browserLocale);
		addLocale(browserLocale, selectedLocale);
		locale(browserLocale);
	});

	const getClosestLocale = (browserLocale: string): LocaleOptions => {
		// First, try to find an exact match
		const normalizedLocale = browserLocale.toLowerCase();
		if (normalizedLocale in locales) {
			return locales[normalizedLocale as keyof typeof locales];
		}

		// If no exact match, try to find a match for the language part
		const languagePart = browserLocale.split('-')[0];
		if (languagePart in locales) {
			return locales[languagePart as keyof typeof locales];
		}

		// If still no match, return English as default
		return locales.en;
	};

	const onWrapperClick = (_event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (!menuClick) {
			setOverlayMenuActive(false);
			setMobileMenuActive(false);
		}

		if (!mobileTopbarMenuClick) {
			setMobileTopbarMenuActive(false);
		}

		mobileTopbarMenuClick = false;
		menuClick = false;
	};

	const onToggleMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		menuClick = true;

		if (isDesktop()) {
			if (layoutMode === 'overlay') {
				if (mobileMenuActive === true) {
					setOverlayMenuActive(true);
				}

				setOverlayMenuActive((prevState) => !prevState);
				setMobileMenuActive(false);
			} else if (layoutMode === 'static') {
				setStaticMenuInactive((prevState) => !prevState);
			}
		} else {
			setMobileMenuActive((prevState) => !prevState);
		}

		event.preventDefault();
	};

	const onSidebarClick = () => {
		menuClick = true;
	};

	const onMobileTopbarMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		mobileTopbarMenuClick = true;

		setMobileTopbarMenuActive((prevState) => !prevState);
		event.preventDefault();
	};

	const onMenuItemClick = (event?: AppMenuItemClickParams) => {
		if (!event?.item) {
			setOverlayMenuActive(false);
			setMobileMenuActive(false);
		}
	};
	const isDesktop = () => {
		return window.innerWidth >= 992;
	};

	const menu = [
		{
			label: 'Application',
			items: [{ label: 'CRUD', icon: 'mi mi-fw mi-home', to: '/' }]
		},
		{
			label: 'Server Docs',
			items: [
				{ label: 'Quarkus', icon: 'mi mi-fw mi-wifi', url: 'https://quarkus.io/', target: '_blank' },
				{ label: 'Quinoa', icon: 'mi mi-fw mi-wifi', url: 'https://quarkiverse.github.io/quarkiverse-docs/quarkus-quinoa', target: '_blank' },
				{ label: 'REST Problem', icon: 'mi mi-fw mi-wifi', url: 'https://github.com/quarkiverse/quarkus-resteasy-problem', target: '_blank' },
				{ label: 'Hibernate/Panache', icon: 'mi mi-fw mi-database', url: 'https://quarkus.io/guides/hibernate-orm-panache', target: '_blank' },
				{ label: 'PostgreSQL', icon: 'mi mi-fw mi-database', url: 'https://www.postgresql.org/', target: '_blank' },
				{ label: 'Liquibase', icon: 'mi mi-fw mi-database', url: 'https://www.liquibase.com/', target: '_blank' },
				{ label: 'OpenAPI', icon: 'mi mi-fw mi-tag', url: 'https://www.openapis.org/', target: '_blank' },
				{ label: 'WebSockets Next', icon: 'mi mi-fw mi-wave-pulse', url: 'https://quarkus.io/guides/websockets-next-tutorial', target: '_blank' }
			]
		},
		{
			label: 'Client Docs',
			items: [
				{ label: 'React', icon: 'mi mi-fw mi-globe', url: 'https://reactjs.org/', target: '_blank' },
				{ label: 'React WebSocket', icon: 'mi mi-fw mi-wave-pulse', url: 'https://github.com/robtaussig/react-use-websocket', target: '_blank' },
				{ label: 'MantleUI', icon: 'mi mi-fw mi-prime', url: 'https://mantle-ui.github.io/mantle-ui/', target: '_blank' },
				{ label: 'TanStack Form', icon: 'mi mi-fw mi-verified', url: 'https://tanstack.com/form/latest', target: '_blank' },
				{ label: 'TanStack Query', icon: 'mi mi-fw mi-tag', url: 'https://tanstack.com/query/latest', target: '_blank' },
				{ label: 'Orval', icon: 'mi mi-fw mi-tag', url: 'https://orval.dev/', target: '_blank' },
				{ label: 'Zod', icon: 'mi mi-fw mi-verified', url: 'https://zod.dev/', target: '_blank' }
			]
		}
	] as AppMenuItem[];

	const wrapperClass = classNames('layout-wrapper', {
		'layout-overlay': layoutMode === 'overlay',
		'layout-static': layoutMode === 'static',
		'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
		'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
		'layout-mobile-sidebar-active': mobileMenuActive,
		'p-input-filled': inputStyle === 'filled',
		'p-ripple-disabled': ripple === false,
		'layout-theme-light': layoutColorMode === 'light'
	});

	return (
		<div className={wrapperClass} onClick={onWrapperClick}>
			<div className="layout-topbar">
				<Link to="/" className="layout-topbar-logo">
					<img src="static/images/quarkus.svg" alt="Quarkus" height="35" width="35" />
					<span>Quarkus</span>
				</Link>

				<button type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onToggleMenuClick} aria-label="Appliction Menu">
					<i className="mi mi-bars" />
				</button>

				<button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={onMobileTopbarMenuClick}>
					<i className="mi mi-ellipsis-v" />
				</button>
				<ul className={classNames('layout-topbar-menu lg:flex origin-top', { 'layout-topbar-menu-mobile-active': mobileTopbarMenuActive })}>
					<li>
						<a href="https://reactjs.org" target="_blank" rel="noreferrer">
							<img src="static/images/react.svg" className="react-logo" alt="React" height="84" width="89" />
						</a>
					</li>
				</ul>
			</div>

			<div className="layout-sidebar" onClick={onSidebarClick}>
				<AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
			</div>

			<div className="layout-main-container">
				<div className="layout-main">
					<Routes>
						<Route path="/" element={<CrudPage />} />
					</Routes>
				</div>

				<div className="layout-footer">
					Powered by
					<a href="https://primefaces.org/primereact/" target="_blank" rel="noreferrer">
						<img src="static/images/primereact.svg" alt="PrimeReact" height="30" width="118" className="ml-2" />
					</a>
				</div>
			</div>

			<CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
				<div className="layout-mask p-component-overlay"></div>
			</CSSTransition>
		</div>
	);
};

export default App;
