import { useEffect } from 'react';

export function WakeLock() {
  useEffect(() => {
    async function wakeLockRequest() {
      try {
        await navigator.wakeLock.request("screen");
      } catch (err) {
        // The Wake Lock request has failed - usually system related, such as battery.
        console.log(err)
      }
    }
    wakeLockRequest()
  }, [])

  return <div></div>
}