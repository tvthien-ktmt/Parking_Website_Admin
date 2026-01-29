import { useEffect, useRef, useCallback, useState } from "react";
import { io } from "socket.io-client";
import { WS_URL, WS_EVENTS, STORAGE_KEYS } from "@/utils/constants";

/**
 * Custom hook for WebSocket connection
 * @param {function} onSessionUpdate - Callback when session is updated
 * @param {function} onPaymentReceived - Callback when payment is received
 * @returns {object} WebSocket state and methods
 */
export const useWebSocket = (onSessionUpdate, onPaymentReceived) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log("WebSocket already connected");
      return;
    }

    try {
      // Get auth token
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      // Create socket connection
      socketRef.current = io(WS_URL, {
        auth: {
          token,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      // Connection event handlers
      socketRef.current.on(WS_EVENTS.CONNECT, () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setError(null);
      });

      socketRef.current.on(WS_EVENTS.DISCONNECT, (reason) => {
        console.log("WebSocket disconnected:", reason);
        setIsConnected(false);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
        setError(err.message);
        setIsConnected(false);
      });

      // Session event handlers
      socketRef.current.on(WS_EVENTS.SESSION_CREATED, (data) => {
        console.log("Session created:", data);
        if (onSessionUpdate) {
          onSessionUpdate(data);
        }
      });

      socketRef.current.on(WS_EVENTS.SESSION_UPDATED, (data) => {
        console.log("Session updated:", data);
        if (onSessionUpdate) {
          onSessionUpdate(data);
        }
      });

      socketRef.current.on(WS_EVENTS.SESSION_DELETED, (data) => {
        console.log("Session deleted:", data);
        if (onSessionUpdate) {
          onSessionUpdate(data);
        }
      });

      // Payment event handlers
      socketRef.current.on(WS_EVENTS.PAYMENT_RECEIVED, (data) => {
        console.log("Payment received:", data);
        if (onPaymentReceived) {
          onPaymentReceived(data);
        }
        if (onSessionUpdate) {
          onSessionUpdate(data);
        }
      });

      socketRef.current.on(WS_EVENTS.DEBT_ADDED, (data) => {
        console.log("Debt added:", data);
        if (onSessionUpdate) {
          onSessionUpdate(data);
        }
      });
    } catch (err) {
      console.error("WebSocket connection error:", err);
      setError(err.message);
    }
  }, [onSessionUpdate, onPaymentReceived]);

  /**
   * Disconnect from WebSocket server
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  /**
   * Emit event to server
   */
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("WebSocket not connected, cannot emit event:", event);
    }
  }, []);

  /**
   * Subscribe to custom event
   */
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  /**
   * Unsubscribe from custom event
   */
  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  /**
   * Connect on mount, disconnect on unmount
   */
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
  };
};

export default useWebSocket;
