/**
 * TODO(developer): Uncomment this variable and replace with your
 *   Google Analytics 4 property ID before running the sample.
 */

// Imports the Google Analytics Data API client library.
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const analyticsDataClient = new BetaAnalyticsDataClient();

const propertyId = `${process.env.GA4_PROPERTY_ID}`;

// Runs a report which includes total, maximum and minimum values
// for each metric.
export async function runReportWithAggregations(from, to) {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dimensions: [
      {
        name: "country",
      },
    ],
    metrics: [
      {
        name: "sessions",
      },
    ],
    dateRanges: [
      {
        startDate: from,
        endDate: to,
      },
    ],
    metricAggregations: ["TOTAL", "MAXIMUM", "MINIMUM"],
  });
  return printRunReportResponse(response);
}

// Prints results of a runReport call.
function printRunReportResponse(response) {
  //[START analyticsdata_print_run_report_response_header]
  // console.log(`${response.rowCount} rows received`);
  // response.dimensionHeaders.forEach((dimensionHeader) => {
  //   console.log(`Dimension header name: ${dimensionHeader.name}`);
  // });
  // response.metricHeaders.forEach((metricHeader) => {
  //   console.log(
  //     `Metric header name: ${metricHeader.name} (${metricHeader.type})`,
  //   );
  // });
  //[END analyticsdata_print_run_report_response_header]

  // [START analyticsdata_print_run_report_response_rows]
  // console.log("Report result:");

  let cumulativeTotalCount = 0;
  response.rows.forEach((row) => {
    // console.log(
    //   `${row.dimensionValues[0].value}, ${row.metricValues[0].value}`,
    // );
    cumulativeTotalCount =
      cumulativeTotalCount + parseInt(row.metricValues[0].value);
  });
  return cumulativeTotalCount;
  // [END analyticsdata_print_run_report_response_rows]
}
