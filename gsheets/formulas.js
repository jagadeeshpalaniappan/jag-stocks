/****************** UTILS: ******************/

function _get(object, path, defval = null) {
  if (typeof path === "string") path = path.split(".");
  return path.reduce((xs, x) => (xs && xs[x] ? xs[x] : defval), object);
}

function GET(srcJson, path) {
  if (!srcJson) return null;
  const obj = JSON.parse(srcJson);
  Logger.log("GET: obj:", obj);
  return _get(obj, path, (defval = null));
}

function GETSTR(srcJson, path) {
  if (!srcJson || srcJson.length === 0) return null;
  return JSON.stringify(GET(srcJson, path));
}

function REMOVELASTCHAR(str) {
  return str.slice(0, str.length - 1);
}

function JSONSTR(values) {
  return JSON.stringify(values);
}

/****************** GET: YAHOO FIN DATA ******************/

function _parseYahooFinPage(html) {
  const start = "root.App.main = ";
  const end = "}}};";
  const res = html.match(new RegExp(start + "(.*)" + end));
  //   Logger.log(res[0]);
  if (!res) return null;

  const jsonStr = res[0].slice(start.length, res[0].length - 1);
  const yAppMain = JSON.parse(jsonStr);
  if (!yAppMain) return null;
  // Logger.log(Object.keys(yAppMain));
  return yAppMain.context.dispatcher.stores.QuoteSummaryStore;
}

function GETYAHOOFIN(stockId) {
  var url = "https://finance.yahoo.com/quote/" + stockId;
  var html = UrlFetchApp.fetch(url).getContentText();
  const QuoteSummaryStore = _parseYahooFinPage(html);
  if (QuoteSummaryStore) {
    Logger.log(QuoteSummaryStore);
    const { summaryDetail, financialData } = QuoteSummaryStore;
    return JSON.stringify({ summaryDetail, financialData });
  }
  throw "ERR";
}
