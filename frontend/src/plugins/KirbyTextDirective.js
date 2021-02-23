const origin = import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : window.location.origin
const EVENT_TYPE = 'click'
let router

/**
 * Handle absolute links inside dynamically added HTML with Vue Router
 *
 * @param {Event} event The event taking place in the DOM
 */
function navigate (event) {
  const link = event.target.closest('a')
  if (
    link &&
    link.href.startsWith(origin) &&
    link.target !== '_blank' &&
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  ) {
    event.preventDefault()
    router.push({ path: link.href.substring(origin.length) })
  }
}

export default {
  install: (app, options) => {
    app.directive('kirbytext', {
      mounted (el, binding) {
        router = binding.instance.$router
        el.addEventListener(EVENT_TYPE, navigate)
      },

      beforeUnmount (el) {
        el.removeEventListener(EVENT_TYPE, navigate)
      }
    })
  }
}
