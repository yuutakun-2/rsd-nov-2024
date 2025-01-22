import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "react-query";

const searchUsers = async (query) => {
  if (!query) return [];
  const res = await fetch(`${import.meta.env.VITE_API}/search`);
  if (!res.ok) throw new Error("Failed to search users");

  return res.json();
};

export default function test() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  query = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(query);

  const { data: users = [], isLoading } = useQuery(
    ["users", query],
    () => searchUsers(query),
    {
      enabled: !!query,
    }
  );

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autofocus
        />
      </Box>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : query ? (
        <List>
          {users.map((user) => (
            <ListItem
              key={user.id}
              button
              onClick={() => navigate(`/users/${user.id}`)}
            >
              <ListItemAvatar>
                <Avatar>{user.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={`@${user.username}`}
              />
            </ListItem>
          ))}
          {users.length === 0 && (
            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 2 }}
            >
              No users found
            </Typography>
          )}
        </List>
      ) : (
        <Typography color="text.secondary" textAlign="center" sx={{ mt: 2 }}>
          Enter a search term to find users
        </Typography>
      )}
    </Container>
  );
}
