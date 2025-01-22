import {
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

// 1. User inputs data, onChange is triggered
// 2. onChange sets searchTerm
// 3. if searchTerm is not blank, url should be dynamically changed using setSearchParams -> including search query with the searchTerm
// 4. as searchParams is changed,

// User will give searchTerm
// searchTerm should be given to the url for query
// if query is changed, data should be fetched
// fetched data should be displayed on the UI

const searchUsers = async (query) => {
  if (!query) return [];
  const res = await fetch(`${import.meta.env.VITE_API}/search?q=${query}`);
  if (!res.ok) throw new Error("Failed to search user");

  return res.json();
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);

  const { data: users = [], isLoading } = useQuery(
    ["users", query],
    () => searchUsers(query),
    {
      enabled: !!query,
    }
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        setSearchParams({ q: searchTerm.trim() });
      }
      return () => clearTimeout(delayDebounceFn);
    }, 300);
  }, [searchTerm, setSearchParams]);

  return (
    <>
      <TextField
        value={searchTerm}
        fullWidth
        autoFocus
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {users ? (
        <Box>
          <List>
            {users.map((user) => {
              return (
                <ListItem key={user.id}>
                  <ListItemText>
                    <Typography>{user.name}</Typography>
                    <Typography>{user.username}</Typography>
                  </ListItemText>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ) : (
        isLoading && <Typography>Loading users ...</Typography>
      )}
    </>
  );
}
