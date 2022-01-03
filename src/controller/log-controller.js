let isDebug = false

export function setDebug(state) {
  isDebug = state
}
class LogController {
  info(msg, ...args) {
    console.log(
      `%c[?] ${msg}`,
      'background: #2B96E9; color: #ffffff; border-radius: 8px; font-size: 14px; padding: 2px 4px; font-weight: 500',
      ...args
    )
  }
  debug(msg, ...args) {
    if (isDebug)
      console.log(
        `%c XFX %c ${msg}`,
        'background: #BC3C5A; color: #ffffff; border-radius: 8px 0 8px 0; font-size: 14px; padding: 2px 4px; font-weight: 600; margin-right: 4px;',
        'background: #585858; color: #ffffff; border-radius: 6px; font-size: 14px; padding: 2px 4px; font-weight: 400',
        ...args
      )
  }
}
const Logger = new LogController()
export { Logger }
