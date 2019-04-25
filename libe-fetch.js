module.exports = libeFetch

function libeFetch () {
  const cookies = parseCookies()
  const lblb_tracking = cookies.lblb_tracking
  const lblb_posting = cookies.lblb_posting || window.lblb_posting
  if (cookies.lblb_posting) window.lblb_posting = lblb_posting
  const url = arguments[0]
  const options = arguments[1] || { body: JSON.stringify({}) }
  const strBody = options.body || JSON.stringify({})
  try {
    JSON.parse(strBody)
  } catch (e) {
    throw new Error('Body must be a parsable JSON string')
  }
  const body = JSON.parse(strBody)
  body._credentials = { lblb_tracking, lblb_posting, tut: 'tut' }
  const newOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: JSON.stringify(body)
  }
  return new Promise((resolve, reject) => {
    window.fetch(url, newOptions).then(res => {
      const { ok, status, statusText } = res
      if (ok) return res.json()
      throw new Error(`Error: ${status} – ${statusText}`)
    }).then(json => {
      const { data, err, _credentials } = json
      if (_credentials) {
        document.cookie = `lblb_tracking=${_credentials.lblb_tracking};`
        document.cookie = `lblb_posting=${_credentials.lblb_posting};`
        window.lblb_posting = _credentials.lblb_posting
      }
      resolve(json)
    }).catch(err => {
      reject(err)
    })
  })
}
