import fs from "fs"
import { program } from "commander"
import dotenv from 'dotenv'
import { imageUploader } from "./src/imageUploader.js"

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

program
  .option("-from, --from <id>", "id from", "0")
  .option("-to, --to <id>", "id to", "2999")
  .option("-ids, --ids [ids...]", "ids")
  .option("-size, --size <size>", "image size", "s1600")
  .option("-delay, --delay <delay>", "delay", "0")
  .parse(process.argv)

const options = program.opts()
const fromId = parseInt(options.from)
const toId = parseInt(options.to)
const thumbnailSize = options.size
const delay = parseInt(options.delay)
console.log(options)

const ENDPOINT = "http://localhost:8080"
const SIZE = {
  // 800 x 800
  s800: {
    w: 800 / 2,
    h: 800 / 2
  },
  // 1600 x 1600
  s1600: {
    w: 1600 / 2,
    h: 1600 / 2
  },
  // 900 x 1600
  s16_9: {
    w: 900 / 2,
    h: 1600 / 2
  },
  s4k: {
    w: 2160 / 2,
    h: 3840 / 2
  },
}
const BASE_OUTPUT_DIR = "output"

let outputDir = ""
let windowSize

const generateNumberArray = (from, to) => {
  if (from > to) {
    throw new Error(`from: ${from} is greater than to: ${to}.`)
  }
  const size = to - from + 1
  return [...Array(size)].map((_, i) => from + i)
}

const getWindowSize = () => {
  switch (thumbnailSize) {
    case "s800":
      return SIZE.s800
    case "s1600":
      return SIZE.s1600
    case "s16_9":
      return SIZE.s16_9
    case "s4k":
      return SIZE.s4k
  }
  return SIZE.s1600
}

const createOutputDirIfNeeded = () => {
  outputDir = `${BASE_OUTPUT_DIR}/${windowSize.w * 2}_${windowSize.h * 2}`
  // Create directory first if it doesn't exist.
  if (!fs.existsSync(BASE_OUTPUT_DIR)){
    fs.mkdirSync(BASE_OUTPUT_DIR)
  }
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir)
  }
}

const startGeneration = (ids) => {
  (async() => {
    windowSize = getWindowSize()
    const startDate = new Date()

    createOutputDirIfNeeded()

    for await (const id of ids) {
      try {
        await imageUploader.upload(ENDPOINT, id, outputDir, windowSize, delay)
        console.log(id)
      } catch (e) {
        console.log("error...")
        console.log(e)
      }
    }

    console.log(`start: ${startDate}\ncomplete: ${new Date()}`)
  })()
}

if (options.ids && options.ids.length > 0) {
  const ids = options.ids.map((id) => parseInt(id))
  startGeneration(ids)
} else {
  const ids = generateNumberArray(fromId, toId)
  startGeneration(ids)
}