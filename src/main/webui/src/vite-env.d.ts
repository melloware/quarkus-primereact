/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_REACT_APP_API_SERVER: string;
	readonly VITE_REACT_APP_VERSION: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
