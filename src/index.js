import '@babel/polyfill';
import DiscographyProcessor from "./lib/discography_processor";

export default async function run() {
  const dp = new DiscographyProcessor();
  await dp.processDiscography();
}

run();