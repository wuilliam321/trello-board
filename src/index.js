import '@babel/polyfill';
import DiscographyProcessor from './lib/discography_processor';

export default async function run() {
  const dp = new DiscographyProcessor();
  const artistName = 'Bob Dylan';
  return await dp.processDiscography(artistName);
}

/**
 * ENTRY POINT
 * This call perform the discography processor
 */
run();
