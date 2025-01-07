import {
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Container,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useApp } from "../AppProvider";
import { blue } from "@mui/material/colors";

export default function Comment({ comment }) {
  const { auth } = useApp();
  return (
    <Box>
      <Card
        sx={{
          mb: 2,
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <Avatar sx={{ width: 32, height: 32, background: blue[500] }} />
            <Typography sx={{ fontWeight: "bold" }}>
              {comment.user.name}
            </Typography>
          </Box>
          {/* Test this later */}
          {auth &&
            auth.id ===
              comment.userId(
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              )}
        </Box>
        <Typography>{comment.content}</Typography>
      </Card>
    </Box>
  );
}
