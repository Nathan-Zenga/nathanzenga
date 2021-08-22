import Head from 'next/head'

const Meta = ({ title, keywords, description, twitter }) => {
  return (
    <Head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/img/icon.png" />
      <title>{title}</title>
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={twitter} />
      <meta name="twitter:creator" content={twitter} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="" />
      <meta property="og:url" content="https://nathanzenga.com/" />
      <meta property="og:title" content="Nathan Zenga - Visual Artist" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="" />

      <link rel="stylesheet" type="text/css" href="/css/defaults.css" />
      <link rel="stylesheet" type="text/css" href="/css/hamburgers.min.css" />
      <link rel="stylesheet" type="text/css" href="/css/main.css" />
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js"></script>
      <script src="/js/main.js"></script>
    </Head>
  )
}

Meta.defaultProps = {
  title: "Nathan Zenga",
  keywords: "Nathan Zenga, Nathan Zengamambu, Nathan, Zenga, Zengamambu, Visual Artist, Visuals, Artist, Digital Art, Digital, Art, Visual, Photography, Design, Photoshop, Videography, Filmmaker, Film, London, United Kingdom, UK, Freelance, Web Design, Web Developer, Web, Developer, Frontend, Backend",
  description: "London-based photographer, developer and visual artist.",
  twitter: "@nathanzenga"
}

export default Meta
