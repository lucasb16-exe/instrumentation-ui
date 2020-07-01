import React, { useState } from "react";

export default () => {
  const [show, setShow] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setShow(!show);
        }}
        className={`button is-primary ${show ? "is-active" : ""}`}
      >
        <i className="ms ms-information"></i>
      </button>
      {show ? (
        <div className="card">
          <div className="card-content">
            <p className="mb-2">
              Select Instruments on the map to include their data in the
              charting tools at the right.
            </p>
            <p className="mb-2">
              Individual instruments may be selected by clicking on them, you
              may select multiple by holding down the shift key and clicking
              multiple instruments.
            </p>
            <p className="mb-2">
              Clicking on the instrument group polygons will select all
              instruments in that group, hold shift while selecting groups to
              add instruments from multiple groups to the active selection.
            </p>
            <p className="mb-2">
              Use the select by box tool <i className="ms ms-select-box"></i> to
              select instruments by drawing a box on the map. Note that the
              normal pan/zoom interactions are disabled while in select-by-box
              mode.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};
