import Document, { Head, Main, NextScript } from 'next/document';
import { get } from '../helpers/i18n';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const ext = /iPhone|iPad/.test(ctx.req.headers['user-agent']) ? 'png' : 'webp';

    return { ...initialProps, headers: ctx.req.headers, ext };
  }

  render() {
    const { headers, ext } = this.props;

    const i18n = get({ headers });

    return (
      <html lang={i18n.lang}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="description" content="monomi" />
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#A0D8EF" />
          <meta property="og:site_name" content="monomi" />
          <meta property="og:image" content={`/static/images/favicon.${ext}`} />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content="monomi" />
          <meta property="og:description" content="monomi" />
          <meta property="og:card" content="summary" />
          <meta property="og:creator" content="koiki" />
          <meta property="og:image:width" content="300" />
          <meta property="og:image:height" content="300" />
          <link rel="manifest" href="/static/manifest.json" />
          <link rel="icon" href={`/static/images/favicon.${ext}`} />
          <link rel="apple-touch-icon" href={`/static/images/favicon.${ext}`} />
          <script src="/static/js/analytics.js" />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://fonts.googleapis.com/css?family=Ubuntu:300,400&display=swap"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css"
          />
          <link rel="stylesheet" type="text/css" href="/static/css/normalize.css" />
          <link rel="stylesheet" type="text/css" href="/static/css/react-big-calendar.css" />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__i18n={resource: ${JSON.stringify(
                i18n.resource
              )}, lang: ${JSON.stringify(i18n.lang)}}`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
