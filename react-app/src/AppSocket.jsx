import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useApp } from "./AppProvider";
import { useQueryClient } from "react-query";

export default function AppSocket() {
  const { auth } = useApp();
  const queryClient = useQueryClient();
  const { readyState, sendJsonMessage, lastJsonMessage } = useWebSocket(
    import.meta.env.VITE_WS
  );

  useEffect(() => {
    if (auth && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        token: localStorage.getItem("token"),
      });

      console.log("WS: Connection ready & token sent.");
    }
  }, [auth, readyState]);

  useEffect(() => {
    console.log("WS: new message received.");
    if (lastJsonMessage && lastJsonMessage.event) {
      console.log(lastJsonMessage.event);
      queryClient.invalidateQueries(lastJsonMessage.event);
    }
  }, [lastJsonMessage]);
}
