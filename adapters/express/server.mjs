import express from "express";
import * as elmPages from "./elm-pages.mjs";

const app = express();
const port = 3000;

app.use(express.static("dist"));

app.get(/.*/, async (req, res) => {
  try {
    const renderResult = await elmPages.render(reqToElmPagesJson(req));
    const { headers, statusCode, body } = renderResult;
    res.status(statusCode).set(headers);
    if (renderResult.kind === "bytes") {
      res.send(Buffer.from(body));
    } else {
      res.send(body);
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("<body><h1>Error</h1><pre>Unexpected Error</pre></body>");
  }
});

const reqToElmPagesJson = (req) => {
  const url = `${req.protocol}://${req.host}${req.originalUrl}`;
  return {
    method: req.method,
    headers: req.headers,
    rawUrl: url,
    body: req.body,
    multiPartFormData: null,
  };
};

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
