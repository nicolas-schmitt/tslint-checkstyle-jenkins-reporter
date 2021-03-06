'use strict'

const defaults = require('lodash.defaults')
const escape = require('lodash.escape')

const DefaultPosition = {
  position: 0,
  lineAndCharacter: {
    character: 0,
    line: 0,
  },
}

class Formatter {
  constructor(settings) {
    this.settings = defaults(settings, {
      severity: 'error',
    })
  }

  formatStream(files) {
    const xml = files.map(file => file.xml).join('')

    return `<?xml version="1.0" encoding="utf-8"?>\n<checkstyle version="4.3">${xml}\n</checkstyle>`
  }

  formatFile(fileName, failures) {
    const result = failures.map(failure => this.formatError(failure))
    result.unshift(`\n<file name="${fileName}">`)
    result.push('\n</file>')

    return result.join('')
  }

  formatError(failure) {
    const start = failure.startPosition || DefaultPosition
    const line = start.lineAndCharacter.line + 1
    const column = start.lineAndCharacter.character + 1
    const message = escape(failure.failure)
    const severity = failure.ruleSeverity || this.settings.severity
    const ruleName = failure.ruleName

    return `\n<error line="${line}" column="${column}" severity="${severity}" message="${message}" source="${ruleName}"/>`
  }
}

module.exports = Formatter
