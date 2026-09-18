# MEMO Instagram SMM Panel — Netlify

Bu paket Netlify Static Hosting + Netlify Function kullanır. SMM API anahtarı tarayıcıya gönderilmez.

## Kurulum
1. ZIP içeriğini çıkartıp GitHub repository olarak yükle veya Netlify'a deploy et.
2. Netlify > Site configuration > Environment variables bölümünde:
   - `SMM_API_URL` = `https://smm.org.tr/api/v2`
   - `SMM_API_KEY` = kendi API anahtarın
3. Deploy/redeploy yap.

Panel Instagram kategorisindeki hizmetleri API'den çeker; bakiye ve sipariş işlemleri serverless function üzerinden sağlayıcıya iletilir. Sipariş geçmişi tarayıcıdaki localStorage'da tutulur.

API anahtarını index.html içine koyma.
