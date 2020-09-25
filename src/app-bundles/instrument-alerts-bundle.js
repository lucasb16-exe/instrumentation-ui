import createRestBundle from "./create-rest-bundle";
import { createSelector } from "redux-bundler";

export default createRestBundle({
  name: "alerts",
  uid: "id",
  prefetch: false,
  staleAfter: 10000,
  persist: false,
  routeParam: "id",
  getTemplate: "/projects/:projectId/instruments/:instrumentId/alert_config", // "/:" disables any accidental trigger of a fetch
  putTemplate:
    "/:/projects/:projectId/instruments/:instrumentId/alert_config/:item.id",
  postTemplate: "/projects/:projectId/instruments/:instrumentId/alert_config",
  deleteTemplate: "/:",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN", "INSTRUMENTS_FETCH_FINISHED"],
  urlParamSelectors: ["selectProjectsIdByRoute", "selectInstrumentsIdByRoute"],
  addons: {
    selectAlertsByInstrumentId: createSelector(
      "selectAlertsItems",
      (alerts) => {
        if (!alerts || !alerts.length) return {};
        const out = {};
        alerts.forEach((a) => {
          if (!out.hasOwnProperty(a.instrument_id)) out[a.instrument_id] = [];
          out[a.instrument_id].push(a);
        });
        return out;
      }
    ),
    selectAlertsByRouteByInstrumentId: createSelector(
      "selectInstrumentsByRoute",
      "selectAlertsByInstrumentId",
      (instruments, alertsByInstrumentId) => {
        if (
          !instruments ||
          !alertsByInstrumentId.hasOwnProperty(instruments.id)
        )
          return [];
        return alertsByInstrumentId[instruments.id];
      }
    ),
  },
});
