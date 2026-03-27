// ═══════════════════════════════════════════
// MEGHA HOUSE — GEO-LOCK SYSTEM
// Change coordinates to YOUR school's GPS!
// ═══════════════════════════════════════════

// ⚠️ GET YOUR EXACT COORDINATES FROM GOOGLE MAPS
// Right-click on your playground → "What's here?"
const SCHOOL_LAT = 6.926289;    // ← REPLACE WITH YOUR EXACT LAT
const SCHOOL_LNG = 81.350763;    // ← REPLACE WITH YOUR EXACT LNG
const ALLOWED_RADIUS_METERS = 999999; // 100 meters radius

// Calculate distance between two GPS points (Haversine formula)
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Main geo-lock check — call this on your AR page
function checkGeoLock(onAllowed, onDenied, onError) {
  if (!navigator.geolocation) {
    onError("GPS not supported on this device.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position) {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const distance = getDistance(
        userLat, userLng,
        SCHOOL_LAT, SCHOOL_LNG
      );

      console.log("Distance from school: " + distance.toFixed(1) + "m");

      if (distance <= ALLOWED_RADIUS_METERS) {
        onAllowed(distance); // ✅ User is at school!
      } else {
        onDenied(distance);  // ❌ User is too far away
      }
    },
    function(error) {
      onError("Location permission denied. Please allow GPS access.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}