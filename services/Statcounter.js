const Statcounter = () => {
    const development = process.env.NODE_ENV !== "production";
    const settingsUrl = /^\/settings/.test(location.pathname);
    var existingContainer = document.getElementById("statcounter-container");
    if (existingContainer) existingContainer.remove();
    if (development || settingsUrl) return false;

    var container = document.createElement("div");
    var statcounterDiv = document.createElement("div");
    var a = document.createElement("a");
    var statcounterImg = document.createElement("img");
    var noscript = document.createElement("noscript");
    var script = document.createElement("script");
    window.sc_project = 11226028;
    window.sc_invisible = 1;
    window.sc_security = "1bbd0017";

    document.body.appendChild(container);
    container.appendChild(script);
    container.id = "statcounter-container";
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://www.statcounter.com/counter/counter.js";
    script.onload = function() {
        statcounterDiv.classList.add("statcounter");
        statcounterImg.classList.add("statcounter");
        statcounterImg.src = "//c.statcounter.com/11226028/0/1bbd0017/1/";
        statcounterImg.alt = "Web Analytics";
        a.appendChild(statcounterImg);
        statcounterDiv.appendChild(a);
        noscript.appendChild(statcounterDiv);
        container.appendChild(noscript);
    };
}

export default Statcounter;