/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from "react";
import { connect } from "redux-bundler-react";
import Map from "../../app-components/classMap";
import DomainSelect from "../../app-components/domain-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DeleteButton = connect(
  "doInstrumentsDelete",
  "doModalClose",
  "doUpdateUrlWithHomepage",
  "selectRouteParams",
  ({
    doInstrumentsDelete,
    doModalClose,
    doUpdateUrlWithHomepage,
    routeParams,
    item,
  }) => {
    const [isConfirming, setIsConfirming] = useState(false);

    const handleDelete = () => {
      setIsConfirming(false);
      doInstrumentsDelete(
        item,
        () => {
          doModalClose();
          if (routeParams.hasOwnProperty("instrumentSlug"))
            doUpdateUrlWithHomepage("/manager");
        },
        true
      );
    };

    return (
      <>
        {isConfirming ? (
          <>
            <button
              title="Confirm"
              className="button is-danger"
              onClick={handleDelete}
            >
              Confirm
            </button>
            <button
              title="Cancel"
              className="button is-secondary"
              onClick={() => {
                setIsConfirming(false);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            title="Remove from Group"
            onClick={() => {
              setIsConfirming(true);
            }}
            className="button is-danger"
          >
            Delete
          </button>
        )}
      </>
    );
  }
);

export default connect(
  "doModalClose",
  "doInstrumentsSave",
  "doInstrumentDrawUpdateLoc",
  "doInstrumentDrawOnMapClose",
  "doProjSetDisplayProjection",
  "doProjTransformFromLonLat",
  "doProjTransformToLonLat",
  "doInstrumentGroupInstrumentsSave",
  "doInstrumentStatusSave",
  "doInstrumentZSave",
  "selectInstrumentDrawLon",
  "selectInstrumentDrawLat",
  "selectInstrumentDrawReady",
  "selectProjDisplayProjection",
  "selectProjOptions",
  "selectProjectsByRoute",
  ({
    doModalClose,
    doInstrumentsSave,
    doInstrumentDrawUpdateLoc,
    doInstrumentDrawOnMapClose,
    doProjSetDisplayProjection,
    doProjTransformFromLonLat,
    doProjTransformToLonLat,
    doInstrumentGroupInstrumentsSave,
    doInstrumentStatusSave,
    doInstrumentZSave,
    item,
    addToGroup,
    instrumentDrawLat,
    instrumentDrawLon,
    instrumentDrawReady,
    projDisplayProjection,
    projOptions,
    projectsByRoute: project,
  }) => {
    const [name, setName] = useState((item && item.name) || "");
    const [type_id, setTypeId] = useState((item && item.type_id) || "");
    const [station, setStation] = useState((item && item.station) || "");
    const [offset, setOffset] = useState((item && item.offset) || "");
    const [project_id] = useState((item && item.project_id) || project.id);

    const [status_id, setStatusId] = useState((item && item.status_id) || "");
    const [status_time, setStatusTime] = useState(new Date());

    const [zreference, setZreference] = useState(
      (item && item.zreference) || ""
    );
    const [zreference_time, setZreferenceTime] = useState(new Date());
    const [zreference_datum_id, setZreferenceDatum] = useState(
      (item && item.zreference_datum_id) || ""
    );

    const projected =
      instrumentDrawLon && instrumentDrawLat
        ? doProjTransformFromLonLat(
            [instrumentDrawLon, instrumentDrawLat],
            projOptions[projDisplayProjection]
          )
        : ["", ""];

    const [x, setX] = useState(projected[0]);
    const [y, setY] = useState(projected[1]);

    useEffect(() => {
      if (!instrumentDrawReady || !item || !item.geometry) return undefined;
      const geom = item.geometry;
      const itemLon = geom.coordinates[0];
      const itemLat = geom.coordinates[1];
      doInstrumentDrawUpdateLoc({ lat: itemLat, lon: itemLon });
      return doInstrumentDrawOnMapClose;
    }, [
      instrumentDrawReady,
      doInstrumentDrawUpdateLoc,
      doInstrumentDrawOnMapClose,
      item,
    ]);

    useEffect(() => {
      if (instrumentDrawLat && instrumentDrawLon) {
        const projected = doProjTransformFromLonLat(
          [instrumentDrawLon, instrumentDrawLat],
          projOptions[projDisplayProjection]
        );
        setX(projected[0]);
        setY(projected[1]);
      }
    }, [
      instrumentDrawLat,
      instrumentDrawLon,
      doProjTransformFromLonLat,
      projOptions,
      projDisplayProjection,
    ]);

    // look to see if status should be updated
    const statusHasChanged = status_id !== item.status_id;

    // look to see if zreference should be updated
    const zHasChanged = zreference !== item.zreference;

    const handleSave = (e) => {
      e.preventDefault();
      if (x && y) {
        const lonLat = doProjTransformToLonLat(
          [Number(x), Number(y)],
          projOptions[projDisplayProjection]
        );

        // There's some nasty '', null, and NaN checking going on here for
        // number types, not sure if there's a better way to do this,
        // this is because '' and null both evaluate to 0 in Number()... so that's fun
        // It works for now, it's fast and works.
        // console.log(
        //   `${station}, ${Number(station)}, ${station === null}, ${
        //     station === null || station === ""
        //   }`
        // );
        doInstrumentsSave(
          Object.assign({}, item, {
            name,
            project_id,
            type_id,
            station:
              station === null || station === ""
                ? null
                : isNaN(Number(station))
                ? null
                : Number(station),
            offset:
              offset === null || offset === ""
                ? null
                : isNaN(Number(offset))
                ? null
                : Number(offset),
            geometry: {
              type: "Point",
              coordinates: [lonLat[0], lonLat[1]],
            },
          }),
          (updatedItem) => {
            if (statusHasChanged) {
              doInstrumentStatusSave({
                instrument_id: item.id,
                status_id: status_id,
                time: status_time,
              });
            }
            if (zHasChanged) {
              doInstrumentZSave({
                instrument_id: item.id,
                zreference: zreference,
                zreference_datum_id: zreference_datum_id,
                time: zreference_time,
              });
            }
            if (addToGroup) {
              doInstrumentGroupInstrumentsSave(
                updatedItem,
                doModalClose,
                true,
                true
              );
            } else {
              doModalClose();
            }
          },
          true
        );
      }
    };

    const currentProj = projOptions[projDisplayProjection];
    const units = currentProj.getUnits();

    const handleLocUpdate = () => {
      if (x && y) {
        const lonLat = doProjTransformToLonLat(
          [Number(x), Number(y)],
          currentProj
        );
        doInstrumentDrawUpdateLoc({ lon: lonLat[0], lat: lonLat[1] });
      }
    };

    const handleSetDisplayProjection = (e) => {
      doProjSetDisplayProjection(e.target.value);
    };

    return (
      <div className="modal-card" style={{ overflowY: "auto" }}>
        <form id="instrument-form" onSubmit={handleSave}>
          <header className="modal-card-head">
            <p className="modal-card-title">Edit Instrument</p>
            <button
              type="button"
              onClick={doModalClose}
              className="delete"
            ></button>
          </header>
          <section className="modal-card-body">
            <div className="mb-3">
              <Map
                mapKey="inst-edit"
                height={300}
                options={{ center: [-80.79, 26.94], zoom: 9 }}
              />
            </div>
            <div className="field">
              <label className="label">Name</label>
              <p className="control">
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  className="input"
                  type="text"
                  placeholder="Name"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Type</label>
              <p className="control">
                <DomainSelect
                  value={type_id}
                  onChange={(e) => {
                    setTypeId(e.target.value);
                  }}
                  domain="instrument_type"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Status</label>
              <DomainSelect
                value={status_id}
                onChange={(e) => {
                  setStatusId(e.target.value);
                }}
                domain="status"
              />
            </div>
            {statusHasChanged ? (
              <div className="field">
                <label className="label">Status current as of</label>
                <div className="control">
                  <DatePicker
                    className="input"
                    selected={status_time}
                    onChange={(val) => {
                      setStatusTime(val);
                    }}
                  />
                </div>
              </div>
            ) : null}
            <div className="field">
              <label className="label">Station</label>
              <p className="control">
                <input
                  value={station}
                  onChange={(e) => {
                    setStation(e.target.value);
                  }}
                  className="input"
                  type="number"
                  placeholder="Station"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Offset</label>
              <p className="control">
                <input
                  value={offset}
                  onChange={(e) => {
                    setOffset(e.target.value);
                  }}
                  className="input"
                  type="number"
                  placeholder="Offset"
                />
              </p>
              <p className="help">
                Offset should be positive on land side, negative on water side
              </p>
            </div>
            <div className="field">
              <label className="label">Z-Reference Elevation</label>
              <p className="control">
                <input
                  value={zreference}
                  onChange={(e) => {
                    setZreference(Number(e.target.value));
                  }}
                  className="input"
                  type="number"
                  placeholder="Z-Reference"
                />
              </p>
            </div>
            {zHasChanged ? (
              <>
                <div className="field">
                  <label className="label">Z Reference current as of</label>
                  <div className="control">
                    <DatePicker
                      className="input"
                      selected={zreference_time}
                      onChange={(val) => {
                        setZreferenceTime(val);
                      }}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label">Z Reference Datum</label>
                  <div className="control">
                    <DomainSelect
                      value={zreference_datum_id}
                      onChange={(e) => {
                        setZreferenceDatum(e.target.value);
                      }}
                      domain="zreference_datum"
                    />
                  </div>
                </div>
              </>
            ) : null}
            <div className="field">
              <label className="label">
                <span style={{ float: "right" }}>
                  Use Projection:
                  <select
                    onChange={handleSetDisplayProjection}
                    value={projDisplayProjection}
                    className="ml-2"
                  >
                    {Object.keys(projOptions).map((key, i) => {
                      return (
                        <option key={i} value={key}>
                          {key}
                        </option>
                      );
                    })}
                  </select>
                </span>
                {`${
                  units === "degrees" ? "Longitude" : "X coordinate"
                } in ${units}`}
              </label>
              <p className="control">
                <input
                  data-key="x"
                  value={x}
                  onChange={(e) => {
                    setX(e.target.value);
                  }}
                  onBlur={handleLocUpdate}
                  className="input"
                  type="number"
                  placeholder={`${
                    units === "degrees" ? "Longitude" : "X coordinate"
                  } in ${units}`}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">{`${
                units === "degrees" ? "Latitude" : "Y coordinate"
              } in ${units}`}</label>
              <p className="control">
                <input
                  data-key="y"
                  value={y}
                  onChange={(e) => {
                    setY(e.target.value);
                  }}
                  onBlur={handleLocUpdate}
                  className="input"
                  type="number"
                  placeholder={`${
                    units === "degrees" ? "Latitude" : "Y coordinate"
                  } in ${units}`}
                />
              </p>
            </div>
          </section>
          <footer
            className="modal-card-foot"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <button type="submit" className="button is-primary">
                Save changes
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  doModalClose();
                }}
                className="button"
              >
                Cancel
              </button>
            </div>
            <div>
              <DeleteButton item={item} />
            </div>
          </footer>
        </form>
      </div>
    );
  }
);
