import { createContext, useContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

import { QueryClientProvider, QueryClient } from "react-query";

import AppRouter from "./AppRouter";

const AppContext = createContext();
const queryClient = new QueryClient();

export function useApp() {
	return useContext(AppContext);
}

export default function AppProvider() {
	const [showForm, setShowForm] = useState(false);
	const [showDrawer, setShowDrawer] = useState(false);
	const [mode, setMode] = useState("dark");
	const [auth, setAuth] = useState(false);

	const theme = useMemo(() => {
		return createTheme({
			palette: {
				mode,
			}
		});
	}, [mode]);

	return (
		<AppContext.Provider
			value={{
				showDrawer,
				setShowDrawer,
				showForm,
				setShowForm,
				mode,
				setMode,
				auth,
				setAuth,
			}}>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<AppRouter />
					<CssBaseline />
				</ThemeProvider>
			</QueryClientProvider>
		</AppContext.Provider>
	);
}
