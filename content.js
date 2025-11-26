

browser.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request["type"] == 'changeSvgs') {
            //  Retrieve all svgs from the page and send them to the popup script
            const svgs = Array.from(document.querySelectorAll("svg")).map(svg => svg.outerHTML).filter((svg, i, self) => self.indexOf(svg) === i)
            sendResponse({ svgs, metadata: { host: location.host } });
        }
        return true
    }
);