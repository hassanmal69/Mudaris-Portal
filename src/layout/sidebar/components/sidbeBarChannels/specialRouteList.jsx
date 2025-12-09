import React from "react";
import SpecialRouteItem from "./specialRouteItem";

const SPECIAL_ROUTES = ["announcements", "lecturesLink", "videospresentations"];

const SpecialRoutesList = React.memo(({ specialRoute }) => {
  console.log("SpecialRoutesList rendered");

  return (
    <>
      {SPECIAL_ROUTES.map((route) => (
        <SpecialRouteItem
          key={route}
          route={route}
          isActive={specialRoute === route}
        />
      ))}
    </>
  );
});

SpecialRoutesList.displayName = "SpecialRoutesList";

export default SpecialRoutesList;
