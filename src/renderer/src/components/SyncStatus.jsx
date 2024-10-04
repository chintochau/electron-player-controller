import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const SyncStatus = ({ ip }) => {
  const [deviceData, setDeviceData] = useState(null);
  const [status, setStatus] = useState(null);

  const fetchSyncStatus = async () => {
    console.log("fetching sync status", ip);
    
    // const res = await fetch("/api/sync-status", {
    //   method: "POST",
    //   body: JSON.stringify({ ip }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const response = await res.json();

    // setDeviceData(response);
  };


  useEffect(() => {
    fetchSyncStatus();
    const interval = setInterval(() => {
      fetchSyncStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [ip]);

  if (!deviceData) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mx-4">
      <div className="flex items-center space-x-1">
        {deviceData.icon && (
          <img
            src={`http://${ip}:11000${deviceData.icon}`}
            alt={deviceData.name}
            className="h-8 w-8 bg-zinc-800 p-1 rounded-sm mx-1"
          />
        )}
        <p>{deviceData.status}</p>
        <p>{deviceData.status === "upgrade" && `: ${deviceData.version}`}</p>
      </div>
    </div>
  );
};

export default SyncStatus;
