import PrimeReact from 'primereact/api';
import { classNames, DomHandler } from "primereact/utils";
import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { AppMenu } from './AppMenu';
import { AppMenuItem, AppMenuItemClickParams } from "./AppMenuItem";
import CrudPage from './CrudPage';

import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import './assets/layout/layout.scss';
import './App.css';


const App = () => {
    const [layoutMode] = useState('static');
    const [layoutColorMode] = useState('dark')
    const [inputStyle] = useState('outlined');
    const [ripple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(true);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            DomHandler.addClass(document.body, "body-overflow-hidden");
        } else {
            DomHandler.removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location]);

    useEffect(() => {
        document.documentElement.style.fontSize = '14px';
    }, [])

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
    }

    const onToggleMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive((prevState) => !prevState);
            }
        }
        else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMobileTopbarMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onMenuItemClick = (event?: AppMenuItemClickParams) => {
        if (!event?.item) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }
    const isDesktop = () => {
        return window.innerWidth >= 992;
    }

    const menu = [
        {
            label: 'Application',
            items: [
                { label: 'CRUD', icon: 'pi pi-fw pi-home', to: '/' }
            ]
        },
        {
            label: 'Server Docs',
            items: [
                { label: 'Quarkus', icon: 'pi pi-fw pi-server', url: 'https://quarkus.io/', target: '_blank' },
                { label: 'Hibernate/Panache', icon: 'pi pi-fw pi-database', url: 'https://quarkus.io/guides/hibernate-orm-panache', target: '_blank' },
                { label: 'PostgreSQL', icon: 'pi pi-fw pi-database', url: 'https://www.postgresql.org/', target: '_blank' },
                { label: 'Liquibase', icon: 'pi pi-fw pi-database', url: 'https://www.liquibase.com/', target: '_blank' },
                { label: 'OpenAPI', icon: 'pi pi-fw pi-server', url: 'https://www.openapis.org/', target: '_blank' },
                { label: 'Docker', icon: 'pi pi-fw pi-server', url: 'https://www.docker.com/', target: '_blank' },
                { label: 'GraalVM', icon: 'pi pi-fw pi-server', url: 'https://www.graalvm.org/', target: '_blank' }
            ]
        },
        {
            label: 'Client Docs',
            items: [
                { label: 'React JS', icon: 'pi pi-fw pi-globe', url: 'https://reactjs.org/', target: '_blank' },
                { label: 'PrimeReact', icon: 'pi pi-fw pi-globe', url: 'https://primefaces.org/primereact/', target: '_blank' },
                { label: 'TanStack Query', icon: 'pi pi-fw pi-globe', url: 'https://tanstack.com/query/v4/', target: '_blank' },
                { label: 'Orval', icon: 'pi pi-fw pi-globe', url: 'https://orval.dev/', target: '_blank' },
                { label: 'React Hook Form', icon: 'pi pi-fw pi-globe', url: 'https://react-hook-form.com/', target: '_blank' }
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
                    <img src='static/images/quarkus.svg' alt="Quarkus" />
                    <span>Quarkus</span>
                </Link>

                <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={onToggleMenuClick}>
                    <i className="pi pi-bars" />
                </button>

                <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={onMobileTopbarMenuClick}>
                    <i className="pi pi-ellipsis-v" />
                </button>
                <ul className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': mobileTopbarMenuActive })}>
                    <li>
                        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
                            <img src="static/images/react.svg" className="react-logo" alt="React JS" />
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
                    <a href="https://primefaces.org/primereact/" target='_blank' rel="noreferrer">
                        <img src='static/images/primereact.svg' alt="PrimeReact" height="30" className="ml-2" />
                    </a>
                </div>
            </div>

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>

        </div>
    );

}

export default App;
