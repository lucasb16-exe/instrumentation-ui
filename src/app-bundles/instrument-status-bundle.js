import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "instrumentStatus",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "statusSlug",
  getTemplate: "/instruments/:instrumentId/status",
  putTemplate: null,
  postTemplate: "/instruments/:instrumentId/status",
  deleteTemplate: null,
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  urlParamSelectors: ["selectInstrumentsIdByRoute"],
  forceFetchActions: [
    "INSTRUMENT_SAVE_FINISHED",
    "INSTRUMENTSTATUS_SAVE_FINISHED",
  ],
});
