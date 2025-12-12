import { XMLParser } from 'fast-xml-parser'
import { parserConfig } from '../../../common/config.js'

// NOTE: stopNodes removed to use native fast-xml-parser entity/CDATA handling.
// This is an experimental branch for performance comparison only.

export const parser = new XMLParser({
  ...parserConfig,
})
