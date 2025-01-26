import {
  Box,
  Card,
  Avatar,
  Button,
  Typography,
  CardContent,
  CardActionArea,
} from "@mui/material";

import { differenceInHours } from "date-fns";

import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "react-query";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import CommentIcon from "@mui/icons-material/Comment";
import { styled } from "@mui/material/styles";

const IconOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: -4,
  right: -4,
  backgroundColor: theme.palette.mode === "light" ? "#fff" : "#000",
  borderRadius: "50%",
  padding: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.shadows[2],
}));

async function fetchNotis() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/notis`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

async function putAllNotisRead() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/notis/read`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

async function putNotiRead(notiId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API}/notis/read/${notiId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export default function Notis() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data } = useQuery("notis", fetchNotis);

  const readAllNotis = useMutation(putAllNotisRead, {
    onSuccess: () => {
      queryClient.invalidateQueries("notis");
    },
  });

  // Why does this not work?
  // const readAllNotis = useMutation(putAllNotisRead, {
  //   onMutate: () => {
  //     queryClient.cancelQueries("notis");
  //     queryClient.setQueryData("notis", (old) => {
  //       return old.map((noti) => {
  //         noti.read = true;
  //         return noti;
  //       });
  //     });
  //     queryClient.invalidateQueries(["notis", auth], fetchNotis);
  //   },
  // });

  const readNoti = useMutation(putNotiRead, {
    onSuccess: (notiId) => {
      queryClient.invalidateQueries("notis");
    },
  });

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">Notifications</Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          sx={{ borderRadius: 5 }}
          onClick={() => {
            readAllNotis.mutate();
          }}
        >
          Mark all as read
        </Button>
      </Box>

      {data.map((noti) => {
        return (
          <Card sx={{ mb: 2, opacity: noti?.read ? 0.3 : 1 }} key={noti.id}>
            <CardActionArea
              onClick={() => {
                !noti.read && readNoti.mutate(noti.id);
                console.log("onClick action done.");
                {
                  noti.type === "follow"
                    ? navigate(`/users/${noti.actorId}`)
                    : navigate(`/posts/${noti.postId}`);
                }
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  opacity: 1,
                }}
              >
                <Box sx={{ display: "flex", ml: 3, gap: 2 }}>
                  <Box sx={{ position: "relative" }}>
                    <Avatar />
                    <IconOverlay>
                      {noti.type === "like" ? (
                        <ThumbUpAltIcon
                          sx={{ fontSize: 16, color: "primary.main" }}
                        />
                      ) : (
                        <CommentIcon
                          sx={{ fontSize: 16, color: "primary.main" }}
                        />
                      )}
                    </IconOverlay>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography component="span" sx={{ mr: 1 }}>
                      {noti.actor.name}{" "}
                      {noti.type === "like" && `${noti.type}d your post.`}
                      {noti.type === "comment" &&
                        `${noti.type}ed on your post.`}
                      {noti.type === "follow" && `${noti.type}ed you.`}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        mr: 1,
                        color: "text.secondary",
                      }}
                    >
                      {noti.content}
                    </Typography>
                    <Typography component="span" color="primary">
                      <small>
                        {differenceInHours(new Date(), new Date(noti.created)) <
                        24
                          ? format(new Date(noti.created), "h:mm a")
                          : format(new Date(noti.created), "MMM d")}
                      </small>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}
