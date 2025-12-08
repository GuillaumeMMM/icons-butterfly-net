
import { optimize } from './svgo.browser.js';

const downloadButton = document.getElementById('download')

document.addEventListener("DOMContentLoaded", async () => {
    setTimeout(async () => {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });

        browser.tabs.sendMessage(tabs[0].id, { type: "changeSvgs" })
            .then(response => {
                console.log("Response:", response);
                computeSvgs(response)
            }).catch(err => console.error("Messaging error:", err));
        //  Make sure that content.js is loaded at this point
    }, 100)
});

function computeSvgs(response) {
    //  Filter and clean icon svgs
    const svgs = response.svgs.map(svg => optimize(svg).data).filter(Boolean).filter(svg => ['path', 'circle', 'rect', 'ellipse', 'polygon', 'polyline'].some(tag => svg.includes(tag))).filter(svg => !svg.includes('logo')).map(DOMPurify.sanitize)

    const count = document.getElementById('count')
    count.textContent = svgs.length

    const svgsElements = []

    const list = document.getElementById('list')

    for (const svg of svgs) {
        const listItem = document.createElement('li')
        listItem.innerHTML = svg
        list.appendChild(listItem)
        svgsElements.push(listItem.querySelector('svg'))
    }

    downloadButton.addEventListener('click', () => {
        //  Save svgs one by one
        svgs.forEach((svgStr, i) => {
            var blob = new Blob([svgStr], { type: "text/plain" });

            const fileName = `${(response.metadata?.host || '').split('.').join('')}_${Array.from(svgsElements[i]?.classList || []).join('-').split(' ').join('-')}_${i}.svg`

            browser.downloads.download({ url: URL.createObjectURL(blob), filename: fileName })
        })

    })
}