import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export default function useSocket(): [WebSocket | undefined, boolean] {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMUs4UkRKNzZSVlI5ODVQWERFRUhEQjZLMiIsImlhdCI6MTc2MTc1NjEzNH0.I09spByG_CcyxQP2wipUrh9QhdApUqmBOQq4TOOOadc`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return [socket, loading];
}
