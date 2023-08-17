import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PrimeReactProvider } from 'primereact/api';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';

/**
 * Initialize the Query client
 */
const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root') as HTMLDivElement);
root.render(
	<React.StrictMode>
		<HashRouter>
			<QueryClientProvider client={queryClient}>
				<PrimeReactProvider>
					<App />
				</PrimeReactProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</HashRouter>
	</React.StrictMode>
);
