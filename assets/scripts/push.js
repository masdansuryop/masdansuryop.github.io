var webPush = require('web-push')

const vapidKeys = {
  publicKey: 'BBws8JyKhZXQl4-RItR7GBmr_JOR7mxAHy9KmxnsFtc493zZ3mL-te77VKfbNpWyWfxOogbjrUveI1eVzDy3_kk',
  privateKey: '0y_EKa6oYWLLe9LLMJtQ-6hJMFHlM_ckOwETKkilJb8'
}

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

var pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/dOxjNOEBAXQ:APA91bEFk04Ui_V3SpI87DCUk1_ci9lspSuBuF_TttrbSVFG0QvjfK5_vLZoY90TLjDmrsEQ-_gxXLWPlaMRD4MCdVqawJiUfzBSHwLM-56lK42af68HxG1EUvObUksvfDmYLLBN7Toi',
  keys: {
    p256dh: 'BDLMGLqLEb952mryeDvXEaJrpY3i6X3kShhY20PbccKRUBHnJUcQfF+FDIbM0dXwt0uymieZTqN18DHmNyKXrgQ=',
    auth: 'eWMnmo/dwMIzxNMZbQgTCA=='
  }
}

var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!'

var options = {
  gcmAPIKey: '210950075655',
  TTL: 60
}
webPush.sendNotification(
  pushSubscription,
  payload,
  options
)
