const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: {
      width: 760,
      height: 440
    }
  });

  const page = await browser.newPage();

  await page.goto('file://' + __dirname + '/2014_vs_2024_vida_virtual.html');

  await new Promise(r => setTimeout(r, 1000));

  const FPS = 60;
  const DURATION = 22;
  const totalFrames = FPS * DURATION;

  for (let i = 0; i < totalFrames; i++) {

    await page.evaluate((frame) => {
      window.frame = frame;
      if (typeof draw === "function") draw();
    }, i);

    await page.screenshot({
      path: `frames/frame_${String(i).padStart(5,'0')}.png`
    });

    console.log(`Frame ${i+1}/${totalFrames}`);
  }

  await browser.close();
})();