import { XMLParser } from 'fast-xml-parser'
import { parserConfig } from '../../../common/config.js'

// NOTE: stopNodes removed to use native fast-xml-parser entity/CDATA handling.
// This is an experimental branch for performance comparison only.
// The native approach handles entities and CDATA at parse time rather than
// in utility functions, but requires removing stopNodes.

export const parser = new XMLParser({
  ...parserConfig,
})
