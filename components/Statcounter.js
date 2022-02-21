import Script from 'next/script';

const Statcounter = () => {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
    <Script id="statcounter-config" strategy="afterInteractive">
      {`var sc_project=11226028, sc_invisible=1, sc_security="1bbd0017";`}
    </Script>
    <Script id="statcounter-script" strategy="afterInteractive" src="https://www.statcounter.com/counter/counter.js" async />
    <noscript id="statcounter-noscript">
      <div className="statcounter">
        <a title="Web Analytics" href="https://statcounter.com/" target="_blank">
          <img className="statcounter" src="https://c.statcounter.com/11226028/0/1bbd0017/1/" alt="Web Analytics" referrerPolicy="no-referrer-when-downgrade" />
        </a>
      </div>
    </noscript>
    </>
  );
}

export default Statcounter;
