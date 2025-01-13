import { Box, Tabs, Tab } from "@mui/material";
import { useSearchParams } from "react-router";

import Form from "../components/Form";
import Posts from "../components/Posts";
import { useApp } from "../AppProvider";

export default function Home() {
    const { auth, showForm } = useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "latest";

    const handleTabChange = (event, newValue) => {
        setSearchParams({ tab: newValue });
    };

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                <Tabs 
                    value={tab} 
                    onChange={handleTabChange}
                    variant="fullWidth"
                >
                    <Tab 
                        label="Latest" 
                        value="latest"
                    />
                    <Tab 
                        label="Following" 
                        value="following"
                        disabled={!auth}
                    />
                </Tabs>
            </Box>

            {auth && showForm && <Form />}
            <Posts type={tab} />
        </>
    );
}
