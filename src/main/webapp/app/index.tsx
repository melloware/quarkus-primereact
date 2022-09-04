import React from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
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
				<App />
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</HashRouter>
	</React.StrictMode>
);
