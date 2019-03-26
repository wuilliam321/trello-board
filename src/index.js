import '@babel/polyfill';
import DiscographyProcessor from "./lib/discography_processor";

export default async function run() {
  const dp = new DiscographyProcessor();
  const artistName = 'Bob Dylan';
  await dp.processDiscography(artistName);
}

run();
