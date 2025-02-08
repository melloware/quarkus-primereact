import locale_ar_tn from 'primelocale/ar-tn.json';
import locale_ar from 'primelocale/ar.json';
import locale_bg from 'primelocale/bg.json';
import locale_ca from 'primelocale/ca.json';
import locale_ckb from 'primelocale/ckb.json';
import locale_cs from 'primelocale/cs.json';
import locale_da from 'primelocale/da.json';
import locale_de_at from 'primelocale/de-at.json';
import locale_de_ch from 'primelocale/de-ch.json';
import locale_de from 'primelocale/de.json';
import locale_el from 'primelocale/el.json';
import locale_en_au from 'primelocale/en-au.json';
import locale_en_gb from 'primelocale/en-gb.json';
import locale_en from 'primelocale/en.json';
import locale_es from 'primelocale/es.json';
import locale_fa from 'primelocale/fa.json';
import locale_fi from 'primelocale/fi.json';
import locale_fr from 'primelocale/fr.json';
import locale_he from 'primelocale/he.json';
import locale_hi from 'primelocale/hi.json';
import locale_hr from 'primelocale/hr.json';
import locale_hu from 'primelocale/hu.json';
import locale_id from 'primelocale/id.json';
import locale_it from 'primelocale/it.json';
import locale_ja from 'primelocale/ja.json';
import locale_kk from 'primelocale/kk.json';
import locale_km from 'primelocale/km.json';
import locale_ko from 'primelocale/ko.json';
import locale_ku from 'primelocale/ku.json';
import locale_ky from 'primelocale/ky.json';
import locale_lv from 'primelocale/lv.json';
import locale_ms from 'primelocale/ms.json';
import locale_nb_no from 'primelocale/nb-no.json';
import locale_nl from 'primelocale/nl.json';
import locale_pl from 'primelocale/pl.json';
import locale_pt_br from 'primelocale/pt-br.json';
import locale_pt from 'primelocale/pt.json';
import locale_ro from 'primelocale/ro.json';
import locale_ru from 'primelocale/ru.json';
import locale_sk from 'primelocale/sk.json';
import locale_sl from 'primelocale/sl.json';
import locale_sr_rs from 'primelocale/sr-rs.json';
import locale_sv from 'primelocale/sv.json';
import locale_th from 'primelocale/th.json';
import locale_tr from 'primelocale/tr.json';
import locale_uk from 'primelocale/uk.json';
import locale_uz from 'primelocale/uz.json';
import locale_vi from 'primelocale/vi.json';
import locale_zh_CN from 'primelocale/zh-CN.json';
import locale_zh_TW from 'primelocale/zh-TW.json';
import { useMountEffect } from 'primereact/hooks';
import { classNames, DomHandler } from 'primereact/utils';
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { AppMenu } from './AppMenu';
import { AppMenuItem, AppMenuItemClickParams } from './AppMenuItem';
import CrudPage from './CrudPage';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import { addLocale, locale, LocaleOptions } from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-dark-blue/theme.css';
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

	const localeMap = new Map<string, LocaleOptions>([
		['ar-tn', locale_ar_tn['ar-tn']],
		['ar', locale_ar['ar']],
		['bg', locale_bg['bg']],
		['ca', locale_ca['ca']],
		['ckb', locale_ckb['ckb']],
		['cs', locale_cs['cs']],
		['da', locale_da['da']],
		['de-at', locale_de_at['de-at']],
		['de-ch', locale_de_ch['de-ch']],
		['de', locale_de['de']],
		['el', locale_el['el']],
		['en-au', locale_en_au['en-au']],
		['en-gb', locale_en_gb['en-gb']],
		['en', locale_en['en']],
		['es', locale_es['es']],
		['fa', locale_fa['fa']],
		['fi', locale_fi['fi']],
		['fr', locale_fr['fr']],
		['he', locale_he['he']],
		['hi', locale_hi['hi']],
		['hr', locale_hr['hr']],
		['hu', locale_hu['hu']],
		['id', locale_id['id']],
		['it', locale_it['it']],
		['ja', locale_ja['ja']],
		['kk', locale_kk['kk']],
		['km', locale_km['km']],
		['ko', locale_ko['ko']],
		['ku', locale_ku['ku']],
		['ky', locale_ky['ky']],
		['lv', locale_lv['lv']],
		['ms', locale_ms['ms']],
		['nb-no', locale_nb_no['nb-no']],
		['nl', locale_nl['nl']],
		['pl', locale_pl['pl']],
		['pt-br', locale_pt_br['pt-br']],
		['pt', locale_pt['pt']],
		['ro', locale_ro['ro']],
		['ru', locale_ru['ru']],
		['sk', locale_sk['sk']],
		['sl', locale_sl['sl']],
		['sr-rs', locale_sr_rs['sr-rs']],
		['sv', locale_sv['sv']],
		['th', locale_th['th']],
		['tr', locale_tr['tr']],
		['uk', locale_uk['uk']],
		['uz', locale_uz['uz']],
		['vi', locale_vi['vi']],
		['zh-cn', locale_zh_CN['zh-CN']],
		['zh-tw', locale_zh_TW['zh-TW']]
	]);

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
		let closest: LocaleOptions | undefined;
		// First, try to find an exact match
		if (localeMap.has(browserLocale.toLowerCase())) {
			closest = localeMap.get(browserLocale.toLowerCase());
			if (closest) {
				return closest;
			}
		}

		// If no exact match, try to find a match for the language part
		const languagePart = browserLocale.split('-')[0];
		for (const [key, value] of localeMap.entries()) {
			if (key === languagePart) {
				return value;
			}
		}

		// If still no match, return English as default
		return localeMap.get('en')!;
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
			items: [{ label: 'CRUD', icon: 'pi pi-fw pi-home', to: '/' }]
		},
		{
			label: 'Server Docs',
			items: [
				{ label: 'Quarkus', icon: 'pi pi-fw pi-wifi', url: 'https://quarkus.io/', target: '_blank' },
				{ label: 'Quinoa', icon: 'pi pi-fw pi-wifi', url: 'https://quarkiverse.github.io/quarkiverse-docs/quarkus-quinoa', target: '_blank' },
				{ label: 'Hibernate/Panache', icon: 'pi pi-fw pi-database', url: 'https://quarkus.io/guides/hibernate-orm-panache', target: '_blank' },
				{ label: 'PostgreSQL', icon: 'pi pi-fw pi-database', url: 'https://www.postgresql.org/', target: '_blank' },
				{ label: 'Liquibase', icon: 'pi pi-fw pi-database', url: 'https://www.liquibase.com/', target: '_blank' },
				{ label: 'OpenAPI', icon: 'pi pi-fw pi-tag', url: 'https://www.openapis.org/', target: '_blank' },
				{ label: 'WebSockets Next', icon: 'pi pi-fw pi-wave-pulse', url: 'https://quarkus.io/guides/websockets-next-tutorial', target: '_blank' }
			]
		},
		{
			label: 'Client Docs',
			items: [
				{ label: 'React', icon: 'pi pi-fw pi-globe', url: 'https://reactjs.org/', target: '_blank' },
				{ label: 'React Hook Form', icon: 'pi pi-fw pi-verified', url: 'https://react-hook-form.com/', target: '_blank' },
				{ label: 'React WebSocket', icon: 'pi pi-fw pi-wave-pulse', url: 'https://github.com/robtaussig/react-use-websocket', target: '_blank' },
				{ label: 'PrimeReact', icon: 'pi pi-fw pi-prime', url: 'https://primefaces.org/primereact/', target: '_blank' },
				{ label: 'TanStack Query', icon: 'pi pi-fw pi-tag', url: 'https://tanstack.com/query/v4/', target: '_blank' },
				{ label: 'Orval', icon: 'pi pi-fw pi-tag', url: 'https://orval.dev/', target: '_blank' }
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
					<i className="pi pi-bars" />
				</button>

				<button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={onMobileTopbarMenuClick}>
					<i className="pi pi-ellipsis-v" />
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
