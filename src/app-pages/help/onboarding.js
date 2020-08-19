import React, { useState } from "react";
import { connect } from "redux-bundler-react";

const csvSampleProjects = [
  ["Project Name"],
  ["My Sample Project Name 1"],
  ["My Sample Project Name 2"],
];

const csvSampleInstruments = [
  [
    "Project",
    "Name",
    "Status",
    "Type",
    "Longitude",
    "Latitude",
    "ZReference",
    "Station",
    "Offset",
  ],
  [
    "My Sample Project Name 1",
    "My Example Piezometer 1A",
    "active",
    "Piezometer",
    -80.77,
    26.7,
    10.5,
    "100",
    "50",
  ],
  [
    "My Sample Project Name 1",
    "Piezometer at North Spillway Pool Side",
    "active",
    "Piezometer",
    -82.15,
    27.0,
    300.25,
    "100",
    "50",
  ],
];

const csvSampleTimeseries = [["Coming Soon..."]];

const csvSampleTimeseriesMeasurements = [["Coming Soon..."]];

const DownloadCSVButton = ({ csvContent, filename }) => {
  // Used as a reference:
  // https://code-maven.com/create-and-download-csv-with-javascript
  const handleClick = (e) => {
    var csv = "";
    csvContent.forEach((row) => {
      csv += `${row.join(",")}\n`;
    });
    const blob = new Blob([csv], { type: "application/text" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <button onClick={handleClick} className="btn btn-sm btn-outline-info">
      Download Template .CSV
    </button>
  );
};

export default connect(
  "selectDomainsItemsByGroup",
  ({ domainsItemsByGroup }) => {
    // NotesXYZ are additional information to be included with each tab
    const NotesInstruments = ({ props }) => (
      <div>
        <p className="text-info">Optional Fields:</p>
        <ul>
          <li key={1}>Station</li>
          <li key={2}>Offset</li>
        </ul>
        <p className="text-info">Type can be one of the following:</p>
        <ul>
          {domainsItemsByGroup.instrument_type.map((t, idx) => (
            <li key={idx}>{t.value}</li>
          ))}
        </ul>
        <p className="text-info">Status can be one of the following:</p>
        <ul>
          {domainsItemsByGroup.status.map((t, idx) => (
            <li key={idx}>{t.value}</li>
          ))}
        </ul>
      </div>
    );
    const NotesProjects = ({ props }) => <></>;
    const NotesTimeseries = ({ props }) => <></>;
    const NotesTimeseriesMeasurements = ({ props }) => <></>;

    const tabs = [
      {
        title: "Projects",
        csvdata: csvSampleProjects,
        notes: <NotesProjects />,
      },
      {
        title: "Instruments",
        csvdata: csvSampleInstruments,
        notes: <NotesInstruments />,
      },
      {
        title: "Timeseries",
        csvdata: csvSampleTimeseries,
        notes: <NotesTimeseries />,
      },
      {
        title: "Timeseries Measurements",
        csvdata: csvSampleTimeseriesMeasurements,
        notes: <NotesTimeseriesMeasurements />,
      },
    ];

    const [tab, setTab] = useState(0);

    const Tab = ({ i, name }) => (
      <li className={`nav-item pointer`}>
        <span
          className={`nav-link${tab === i ? " active" : ""}`}
          onClick={() => setTab(i)}
        >
          {name}
        </span>
      </li>
    );

    const CSV = ({ arr }) => (
      <pre>
        {arr.map((row, idx) => (
          <p className="m-0" key={idx}>
            {row.join(",")}
          </p>
        ))}
      </pre>
    );

    return (
      <div className="card">
        <div className="card-body">
          <p>
            <strong className="pr-3">Q:</strong>I want to try the site with my
            own projects. How should I organize my dataset for upload?
          </p>
          <p className="text-muted">
            Glad you asked! The site supports .csv uploads of Instruments at
            this time. Uploaders for Projects, Timeseries, and Timeseries
            measurements are coming in the next few weeks. To get organized,
            start with <span className="has-text-weight-bold">projects</span>{" "}
            and <span className="has-text-weight-bold">instruments</span>.
            Create a separate .csv file for each. You can download the template
            .csv files below and modify them with your own data.
          </p>
          <p></p>
          <ul class="nav nav-tabs">
            {tabs.map((t, idx) => (
              <Tab key={idx} i={idx} name={t.title} />
            ))}
          </ul>
          <section className="mt-3">
            <div className="float-right">
              <DownloadCSVButton
                csvContent={tabs[tab].csvdata}
                filename={`${tabs[tab].title}.csv`}
              />
            </div>
            <CSV arr={tabs[tab].csvdata} />
          </section>
          <section className="section has-background-">
            {tabs[tab].notes}
          </section>
        </div>
      </div>
    );
  }
);
