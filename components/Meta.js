import Head from 'next/head'

const Meta = ({ title, keywords, description, twitter, ogTitle }) => {
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
      <meta name="twitter:image" content="/img/icon.png" />
      <meta property="og:url" content="https://nathanzenga.com/" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/img/icon.png" />
    </Head>
  )
}

Meta.defaultProps = {
  title: "Nathan Zenga",
  ogTitle: "Nathan Zenga - Visual Artist",
  keywords: "Nathan Zenga, Nathan Zengamambu, Nathan, Zenga, Zengamambu, Visual Artist, Visuals, Artist, Digital Art, Digital, Art, Visual, Photography, Design, Photoshop, Videography, Filmmaker, Film, London, United Kingdom, UK, Freelance, Web Design, Web Developer, Web, Developer",
  description: "London-based photographer, developer and visual artist.",
  twitter: "@nathanzenga"
}

export default Meta
