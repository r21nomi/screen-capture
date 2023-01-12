import puppeteer from 'puppeteer'

export const imageUploader = {
  upload: async (url, id, outputDir, size, delay) => {
    console.log(`uploading ${id}...`)

    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--use-gl=egl',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox'
      ]
    })
    const page = await browser.newPage()
    await page.setViewport({width: size.w, height: size.h});
    await page.goto(`${url}`, {
      "timeout": 180 * 1000,
      "waitUntil" : "networkidle0"
    })
    const imagePath = `${outputDir}/${id}.png`
    await page.waitForTimeout(delay)
    await page.screenshot({path: imagePath, fullPage: true})

    await browser.close()

    return imagePath
  }
}