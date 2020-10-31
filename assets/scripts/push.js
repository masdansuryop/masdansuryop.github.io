var webPush = require('web-push')

const vapidKeys = {
  publicKey: 'BFaI7FlKkf63PW8Mb85DFmUKuz8Mc35ymoNa9_t4gKF2GMOuuwatmsWimo71i1smzGeOQ-IERnl_CXIy82U4V-AyWOCapiTfSX4YUaMJrR9Rec',
  privateKey: 'Bxy_b1sluTL9a0HbcLY1hHuuH4NIY2sePrVMWkYcIgM'
}

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

var pushSubscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/d0_9V63vNaA:APA91bG6u2US_mtDgHAdFje7Beujcw38WWasd4_ixMedGBU4mmUpF80V2XPMlmqyie5zpTX_8SRGZhzuAlAZEI9uhvBkD7cTHzkrPgK1hHHfP3EzMGVkCrIV2FxGT9VEErblvGhr-RAT',
  keys: {
    p256dh: 'BBJOfFEiyhPSJHytqeo8QJ02DM5s07s5V5grXjV6v7k9mboPDicrEX5F06Y8/3H7uYhfRUJT3TORmhTuKx/XzpA=',
    auth: 'HxvQbZGKFnleEr94FCDDMg=='
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
