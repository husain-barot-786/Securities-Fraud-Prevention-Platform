import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export function useAlertNotifications(fetchAlertsFn, fetchVerifsFn, pollInterval = 10000) {
  const seenAlerts = useRef(new Set());
  const seenVerifs = useRef(new Set());
  const firstLoad = useRef(true);

  useEffect(() => {
    let timerId;

    const fetchData = async () => {
      try {
        const alerts = await fetchAlertsFn();
        const verifications = await fetchVerifsFn();

        if (firstLoad.current) {
          alerts.forEach((a) => seenAlerts.current.add(a.id));
          verifications.forEach((v) => seenVerifs.current.add(`${v.user_id}|${v.status}|${v.timestamp}`));
          firstLoad.current = false;
        } else {
          alerts.forEach((a) => {
            if (!seenAlerts.current.has(a.id)) {
              toast.info(`New Alert: ${a.alert_type}${a.message ? ` - ${a.message}` : ""}`, { position: "top-right", autoClose: 4000 });
              seenAlerts.current.add(a.id);
            }
          });
          verifications.forEach((v) => {
            const key = `${v.user_id}|${v.status}|${v.timestamp}`;
            if (!seenVerifs.current.has(key)) {
              toast.success(`New Verification: User ${v.username} status ${v.status}`, { position: "top-right", autoClose: 4000 });
              seenVerifs.current.add(key);
            }
          });
        }
      } catch (e) {
        toast.error("Failed to load alerts and verifications.");
        console.error(e);
      }
    };

    fetchData();
    timerId = setInterval(fetchData, pollInterval);

    return () => clearInterval(timerId);
  }, [fetchAlertsFn, fetchVerifsFn, pollInterval]);
}
