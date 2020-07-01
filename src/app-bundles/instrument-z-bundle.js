import createRestBundle from "./create-rest-bundle";

export default createRestBundle({
  name: "instrumentZ",
  uid: "id",
  prefetch: true,
  staleAfter: 10000,
  persist: false,
  routeParam: "zSlug",
  getTemplate: "/instruments/:instrumentId/zreference",
  putTemplate: "",
  postTemplate: "/instruments/:item.instrument_id/zreference",
  deleteTemplate: "",
  fetchActions: ["URL_UPDATED", "AUTH_LOGGED_IN"],
  urlParamSelectors: ["selectInstrumentsIdByRoute"],
  forceFetchActions: ["INSTRUMENT_SAVE_FINISHED", "INSTRUMENTZ_SAVE_FINISHED"],
});
