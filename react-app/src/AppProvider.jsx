import { createContext, useContext, useState } from "react";

import App from "./App";

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

export default function AppProvider() {
    const [showForm, setShowForm] = useState(false);

    return (
		<AppContext.Provider value={{ showForm, setShowForm }}>
			<App />
		</AppContext.Provider>
	);
}
