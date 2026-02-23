/**
 * Type declarations for jquery.Thailand.js
 * https://github.com/earthchie/jquery.Thailand.js
 */

interface ThailandData {
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
}

interface ThailandOptions {
  database: string;
  $district: JQuery;
  $amphoe: JQuery;
  $province: JQuery;
  $zipcode: JQuery;
  onDataFill?: (data: ThailandData) => void;
  onLoad?: () => void;
}

interface JQueryStatic {
  Thailand: (options: ThailandOptions) => void;
}

// Extend Window interface to include jQuery
interface Window {
  jQuery: JQueryStatic & ((selector: string) => JQuery);
  $: JQueryStatic & ((selector: string) => JQuery);
}
